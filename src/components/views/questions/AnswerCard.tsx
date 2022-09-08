import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import QuestionFabs from './QuestionFabs';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const questionBoardVisible = useSelector(
    state => state.gameLevel.questionBoardVisible,
  );
  const questionIds = useSelector(state => state.gameLevel.questionIds);
  const questionDatas = useSelector(state => state.gameLevel.questionDatas);
  const questionAnswers = useSelector(state => state.gameLevel.questionAnswers);
  const questionResultMode = useSelector(
    state => state.gameLevel.questionResultMode,
  );

  const [submitConfirmText, setSubmitConfirmText] = React.useState<
    string | undefined
  >();

  return (
    <Drawer
      anchor="bottom"
      open={questionBoardVisible}
      onClose={() =>
        dispatch(GameLevelSliceActions.setQuestionBoardVisible(false))
      }
      sx={{
        '& > .MuiPaper-root': {
          borderRadius: '5px 5px 0 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80%',
          bgcolor: '#000',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '10px',
        }}
      >
        <Box
          sx={{
            fontSize: '16px',
            fontWeight: 800,
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          答题卡
        </Box>
        <IconButton
          onClick={() =>
            dispatch(GameLevelSliceActions.setQuestionBoardVisible(false))
          }
          sx={{
            position: 'absolute',
            right: '10px',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <QuestionFabs
        onClick={index => {
          dispatch(GameLevelSliceActions.setCurrentQuestionIndex(index));
        }}
      />
      <Box
        sx={{
          width: '100%',
          padding: '15px',
        }}
      >
        <Button
          variant="contained"
          color="info"
          sx={{
            flexGrow: 1,
            width: '100%',
          }}
          disabled={questionResultMode}
          onClick={() => {
            if (questionIds === undefined || questionDatas === undefined) {
              return;
            }
            let notFinished = false;
            const len = questionIds.length;
            for (let i = 0; i < len; i++) {
              const questionId = questionIds[i];
              const questionData = questionDatas[questionId];
              const questionAnswer = questionAnswers[questionId] ?? [];
              let answeredCount = 0;
              // eslint-disable-next-line @typescript-eslint/prefer-for-of
              for (let j = 0; j < questionAnswer.length; j++) {
                if (questionAnswer[j].length > 0) {
                  answeredCount++;
                }
              }
              if (answeredCount < questionData.subProblems.length) {
                notFinished = true;
                break;
              }
            }
            setSubmitConfirmText(
              notFinished
                ? '答题卡上还有一些没有作答的题目哦, 最好再检查一下吧!'
                : '提交之后不能再修改答案, 确认提交答案吗? (所有题目均已作答)',
            );
          }}
        >
          提交
        </Button>
      </Box>
      <Dialog
        open={submitConfirmText !== undefined}
        onClose={() => {
          setSubmitConfirmText(undefined);
        }}
      >
        <DialogTitle>确定要提交吗?</DialogTitle>
        <DialogContent>
          <DialogContentText>{submitConfirmText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSubmitConfirmText(undefined);
            }}
          >
            再想想
          </Button>
          <Button
            onClick={() => {
              setSubmitConfirmText(undefined);
              dispatch(GameLevelSliceActions.setQuestionResultMode(true));
            }}
            autoFocus
          >
            提交!
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
});
