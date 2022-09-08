import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SchoolIcon from '@mui/icons-material/School';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { SidebarTopPad } from '@/components/views/collection/Sidebar/SidebarContainer';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const currentQuestionIndex = useSelector(
    state => state.gameLevel.currentQuestionIndex,
  );
  const questionDatas = useSelector(state => state.gameLevel.questionDatas);
  const questionIds = useSelector(state => state.gameLevel.questionIds);
  const currentQuestionExplanation = useSelector(
    state => state.gameLevel.currentQuestionExplanation,
  );
  const questionResultMode = useSelector(
    state => state.gameLevel.questionResultMode,
  );

  const next = React.useMemo<[number, number] | undefined>(() => {
    if (questionIds === undefined || questionDatas === undefined) {
      return undefined;
    }
    const currentId = questionIds[currentQuestionIndex[0]];
    const newIndex: [number, number] = [
      currentQuestionIndex[0],
      currentQuestionIndex[1] + 1,
    ];
    if (questionDatas[currentId].subProblems.length <= newIndex[1]) {
      newIndex[0]++;
      newIndex[1] = 0;
    }
    if (newIndex[0] >= questionIds.length) {
      return undefined;
    } else {
      return newIndex;
    }
  }, [currentQuestionIndex, questionDatas, questionIds]);
  const last = React.useMemo(() => {
    if (questionIds === undefined || questionDatas === undefined) {
      return undefined;
    }
    const newIndex: [number, number] = [
      currentQuestionIndex[0],
      currentQuestionIndex[1] - 1,
    ];
    if (newIndex[1] < 0) {
      if (newIndex[0] <= 0) {
        return undefined;
      }
      newIndex[0]--;
      newIndex[1] =
        questionDatas[questionIds[newIndex[0]]].subProblems.length - 1;
    }
    return newIndex;
  }, [currentQuestionIndex, questionDatas, questionIds]);

  return (
    <SidebarTopPad
      sx={{ borderTop: '1px solid #fff2', minHeight: '60px' }}
      looseHeight
      className="safe-buttom-box"
    >
      <Tooltip title="解析" placement="top">
        <IconButton
          color={currentQuestionExplanation ? 'info' : undefined}
          onClick={() => {
            if (currentQuestionExplanation) {
              dispatch(
                GameLevelSliceActions.setCurrentQuestionExplanation(undefined),
              );
            } else if (questionIds) {
              dispatch(
                GameLevelSliceActions.setCurrentQuestionExplanation(
                  currentQuestionIndex,
                ),
              );
            }
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SchoolIcon />
          <Box
            sx={{
              fontSize: '6rpx',
              opacity: 0.75,
              transform: 'scale(0.4)',
              lineHeight: 0.75,
            }}
          >
            解析
          </Box>
        </IconButton>
      </Tooltip>
      {last ? (
        <Button
          variant="contained"
          // color="info"
          sx={{
            marginLeft: '10px',
            bgcolor: '#0190ec',
          }}
          onClick={() => {
            dispatch(GameLevelSliceActions.setCurrentQuestionIndex(last));
          }}
        >
          上一题
        </Button>
      ) : (
        <></>
      )}
      {questionResultMode ? (
        <Button
          color="info"
          variant="contained"
          sx={{
            flexGrow: 1,
            marginLeft: '10px',
          }}
          onClick={() => {
            dispatch(GameLevelSliceActions.setQuestionSummaryVisible(true));
          }}
        >
          查看结果
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{
            flexGrow: 1,
            marginLeft: '10px',
            bgcolor: '#0190ec',
          }}
          onClick={() => {
            if (questionIds === undefined || questionDatas === undefined) {
              return;
            }
            if (next === undefined) {
              dispatch(GameLevelSliceActions.setQuestionBoardVisible(true));
            } else {
              dispatch(GameLevelSliceActions.setCurrentQuestionIndex(next));
            }
          }}
        >
          {next === undefined ? '提交' : '下一题'}
        </Button>
      )}
    </SidebarTopPad>
  );
});
