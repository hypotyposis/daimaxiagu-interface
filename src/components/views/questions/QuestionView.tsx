import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

import { init } from './middleware';
import AnswerCard from './AnswerCard';
import QuestionFooter from './QuestionFooter';
import QuestionsHeader from './QuestionsHeader';
import QuestionContent from './QuestionContent';
import QuestionExplanation from './QuestionExplanation';
import QuestionSummaryModel from './QuestionSummaryModel';

import { IQuestionInfo } from '@/types/data';
import { IQuestionInfoJson } from '@/types/json';
import LoadingMask from '@/components/LoadingMask';
import { getQuestionData } from '@/utils/api/getData';
import { parseQuestion } from '@/utils/parser/question';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export interface IQuestionView {
  title?: string;
  questionId: string | string[];
  questionScores?: Record<string, number[]>;
  hasNextItem?: boolean;
  hasLastItem?: boolean;
  onNextItem?: () => void;
  onLastItem?: () => void;
  onPassItem?: () => void;
  setTitle?: (title: string) => unknown;
  style?: SxProps;
  debugQuestion?: IQuestionInfoJson;
  wxMode?: boolean;
}

export default React.memo<IQuestionView>(
  ({
    title,
    questionId,
    questionScores = {},
    onNextItem,
    onPassItem,
    setTitle,
    style = {},
    debugQuestion,
    wxMode = false,
  }) => {
    const dispatch = useAppDispatch();
    const questionDatas = useSelector(state => state.gameLevel.questionDatas);
    const [errorStr, setErrorStr] = React.useState<string | undefined>('');

    React.useEffect(() => {
      init();
      return () => {
        dispatch(
          GameLevelSliceActions.setQuestions({
            questionIds: undefined,
            questionDatas: undefined,
            questionScores: undefined,
          }),
        );
      };
    }, []);

    const getQuestions = React.useCallback(() => {
      setErrorStr('');
      const questionIds =
        typeof questionId === 'string' ? [questionId] : questionId;
      const requests: Promise<[string, IQuestionInfo | string]>[] =
        questionIds.map(
          id =>
            new Promise<[string, IQuestionInfo | string]>(resolve => {
              getQuestionData(
                id,
                questionInfo => resolve([id, questionInfo]),
                error => resolve([id, error]),
              );
            }),
        );
      Promise.all(requests).then(results => {
        const questionDatas: Record<string, IQuestionInfo> = {};
        const len = results.length;
        for (let i = 0; i < len; i++) {
          const result = results[i];
          if (typeof result[1] === 'string') {
            dispatch(
              GameLevelSliceActions.setQuestions({
                questionIds: undefined,
                questionDatas: undefined,
                questionScores: undefined,
              }),
            );
            setTitle?.('出错啦');
            setErrorStr(result[1]);
            return;
          }
          questionDatas[result[0]] = result[1];
        }
        setTitle?.(`${title ?? '客观题测试'} - 代码峡谷编程`);
        setErrorStr(undefined);
        dispatch(
          GameLevelSliceActions.setQuestions({
            questionIds,
            questionDatas,
            questionScores,
          }),
        );
      });
    }, [questionId, questionScores]);

    React.useEffect(() => {
      if (debugQuestion) {
        setErrorStr('');
        const result = parseQuestion(debugQuestion);
        if (typeof result === 'string') {
          setErrorStr(result);
        } else {
          setErrorStr(undefined);
          dispatch(
            GameLevelSliceActions.setQuestions({
              questionIds: ['debug'],
              questionDatas: { debug: result },
              questionScores: {},
            }),
          );
        }
      } else if (questionId) {
        getQuestions();
      } else {
        setErrorStr(undefined);
      }
    }, [questionId, debugQuestion]);

    const maskContent = React.useMemo(() => {
      if (errorStr === undefined) {
        return <></>;
      } else if (errorStr === '') {
        return <h1>加载中...</h1>;
      } else {
        return (
          <>
            <h1>出错啦</h1>
            <p style={{ color: '#f44336' }}>{`Message: ${errorStr}`}</p>
            <br />
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => getQuestions()}
              size="large"
            >
              点击刷新
            </Button>
          </>
        );
      }
    }, [errorStr]);

    return (
      <LoadingMask
        show={errorStr !== undefined}
        loadingIcon={errorStr === ''}
        content={maskContent}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {questionDatas ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              position: 'relative',
              width: '100%',
              height: '100%',
              background: wxMode ? '#121212' : 'rgb(40, 44, 52)',
              ...style,
            }}
          >
            <AnswerCard />
            <QuestionsHeader backButton={wxMode} />
            <QuestionContent />
            <QuestionFooter />
            <QuestionExplanation />
            <QuestionSummaryModel
              onNextItem={onNextItem}
              onPassItem={onPassItem}
              title={title}
            />
          </Box>
        ) : (
          <></>
        )}
      </LoadingMask>
    );
  },
);
