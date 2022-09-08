import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { cloneDeep, sortedUniq } from 'lodash';

import { SubProblemType } from '@/types/data.d';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

const AnswerOptionNameMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface IOptionButton {
  optionName: string;
  content: string;
  trueAnswer: boolean;
  selected?: boolean;
  onClick?: () => void;
  subMode?: boolean;
}

const OptionButton = React.memo<IOptionButton>(
  ({
    optionName,
    content,
    selected = false,
    onClick,
    trueAnswer,
    subMode = false,
  }) => {
    const questionResultMode = useSelector(
      state => state.gameLevel.questionResultMode,
    );

    const variant = React.useMemo<'contained' | 'outlined'>(() => {
      if (questionResultMode) {
        return trueAnswer || selected ? 'contained' : 'outlined';
      } else {
        return selected ? 'contained' : 'outlined';
      }
    }, [selected, questionResultMode, trueAnswer]);

    const color = React.useMemo<'error' | 'info' | 'success'>(() => {
      if (questionResultMode) {
        if (trueAnswer) {
          return 'success';
        } else if (selected) {
          return 'error';
        }
      }
      return 'info';
    }, [selected, questionResultMode, trueAnswer]);

    const filter = React.useMemo<string>(
      () =>
        variant === 'outlined' && color === 'info' ? 'grayscale(1)' : 'none',
      [variant, color],
    );

    const borderRight = React.useMemo<string>(
      () =>
        variant === 'contained' && color !== 'error'
          ? '#0003 1px solid'
          : '#FFF3 1px solid',
      [variant, color],
    );

    return (
      <Button
        onClick={() => {
          if (questionResultMode) {
            return;
          }
          onClick?.();
        }}
        color={color}
        variant={variant}
        sx={{
          textTransform: 'none',
          filter,
          margin: subMode ? '4px 20px' : '10px 20px',
          display: 'flex',
          padding: subMode ? '8px 16px' : '16px 16px',
        }}
      >
        <Box
          sx={{
            borderRight,
            paddingRight: '12px',
            marginRight: '12px',
            fontSize: '16px',
          }}
        >
          {optionName}
        </Box>
        <MarkdownBlock
          style={{
            flexGrow: 1,
            display: 'flex',
            textAlign: 'left',
            '& code': {
              lineBreak: 'anywhere',
            },
          }}
          text={content}
        />
      </Button>
    );
  },
);

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const questionId = useSelector(state => state.gameLevel.currentQuestionId!);
  const questionIds = useSelector(state => state.gameLevel.questionIds);
  const questionDatas = useSelector(state => state.gameLevel.questionDatas);
  const questionIndex = useSelector(
    state => state.gameLevel.currentQuestionIndex,
  );
  const subProblem = useSelector(
    state =>
      state.gameLevel.currentQuestionData?.subProblems?.[questionIndex[1]],
  );
  const questionAnswer = useSelector(
    state =>
      state.gameLevel.questionAnswers[state.gameLevel.currentQuestionId!] ?? [],
  );
  const currentQuestionAnswer = useSelector(
    state =>
      state.gameLevel.questionAnswers[state.gameLevel.currentQuestionId!]?.[
        questionIndex[1]
      ] ?? [],
  );
  const questionScores = useSelector(
    state =>
      state.gameLevel.questionScores?.[state.gameLevel.currentQuestionId!] ??
      [],
  );
  const subProblemMode = React.useMemo(
    () => (questionDatas?.[questionId]?.subProblems?.length ?? 0) > 1,
    [questionDatas, questionId],
  );

  const next = React.useCallback(() => {
    if (questionIds === undefined || questionDatas === undefined) {
      return undefined;
    }
    const currentId = questionIds[questionIndex[0]];
    const newIndex: [number, number] = [questionIndex[0], questionIndex[1] + 1];
    if (questionDatas[currentId].subProblems.length <= newIndex[1]) {
      newIndex[0]++;
      newIndex[1] = 0;
    }
    if (newIndex[0] < questionIds.length) {
      dispatch(GameLevelSliceActions.setCurrentQuestionIndex(newIndex));
    }
    return undefined;
  }, [questionIds, questionDatas, questionIndex]);

  const onSelected = React.useCallback(
    (index: number) => {
      const answer = cloneDeep(questionAnswer);
      const subQuestionIndex = questionIndex[1];
      for (let i = answer.length; i <= subQuestionIndex; i++) {
        answer.push([]);
      }
      switch (subProblem?.type) {
        case SubProblemType.Single: {
          if (answer[subQuestionIndex].length === 0) {
            next();
          }
          answer[subQuestionIndex] = [index];
          break;
        }
        default: {
          if (answer[subQuestionIndex].includes(index)) {
            answer[subQuestionIndex] = answer[subQuestionIndex].filter(
              i => i !== index,
            );
          } else {
            answer[subQuestionIndex].push(index);
            answer[subQuestionIndex] = sortedUniq(answer[subQuestionIndex]);
          }
        }
      }
      const answerMap: Record<string, number[][]> = {};
      answerMap[questionId] = answer;
      dispatch(
        GameLevelSliceActions.setQuestionAnswers({
          answers: answerMap,
        }),
      );
    },
    [questionAnswer, questionIndex, subProblem, next],
  );

  if (subProblem === undefined) {
    return <></>;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {subProblem.explanationVideo ? (
        <Box sx={{ padding: '20px 20px 0 20px', opacity: 0.75 }}>
          <Chip color="warning" size="small" label="视频讲解" />
        </Box>
      ) : (
        <></>
      )}
      <MarkdownBlock
        text={`${subProblem.content} **(${
          questionScores?.[questionIndex[1]] ?? 0
        }分)**`}
        usePrism
        style={{
          padding: subProblemMode
            ? '10px 20px 4px 20px'
            : '30px 20px 20px 20px',
        }}
      />
      {subProblem.options.map((_option, _index) => {
        const index = subProblem.optionMapRevert[_index];
        const option = subProblem.options[index];
        return (
          <OptionButton
            key={`${index}/${option[0]}`}
            optionName={AnswerOptionNameMap[_index]}
            content={option[0]}
            selected={currentQuestionAnswer.includes(index)}
            onClick={() => onSelected(index)}
            trueAnswer={Boolean(option[1])}
            subMode={subProblemMode}
          />
        );
      })}
    </Box>
  );
});
