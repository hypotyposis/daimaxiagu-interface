import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { SidebarTopPad } from '@/components/views/collection/Sidebar/SidebarContainer';

export default React.memo<{ backButton?: boolean }>(
  ({ backButton = false }) => {
    const dispatch = useAppDispatch();
    const questionIndex = useSelector(
      state => state.gameLevel.currentQuestionIndex,
    );
    const questionResultMode = useSelector(
      state => state.gameLevel.questionResultMode,
    );
    const questionBoardVisible = useSelector(
      state => state.gameLevel.questionBoardVisible,
    );
    const questionDatas = useSelector(state => state.gameLevel.questionDatas);
    const questionIds = useSelector(state => state.gameLevel.questionIds);
    const questionNumber = React.useMemo(() => {
      if (questionDatas === undefined || questionIds === undefined) {
        return 0;
      }
      let number = 0;
      const len = questionIds.length;
      for (let i = 0; i < len; i++) {
        const questionData = questionDatas[questionIds[i]];
        number += questionData.subProblems.length;
      }
      return number;
    }, [questionDatas, questionIds]);
    const questionCurrent = React.useMemo(() => {
      if (questionDatas === undefined || questionIds === undefined) {
        return 0;
      }
      let number = 1;
      for (let i = 0; i < questionIndex[0]; i++) {
        const questionData = questionDatas[questionIds[i]];
        number += questionData.subProblems.length;
      }
      number += questionIndex[1];
      return number;
    }, [questionIndex, questionIds]);

    const questionStartTimestamp = useSelector(
      state => state.gameLevel.questionStartTimestamp,
    );
    const questionEndTimestamp = useSelector(
      state => state.gameLevel.questionEndTimestamp,
    );
    const [counter, setCounter] = React.useState('0:00');

    React.useEffect(() => {
      if (questionResultMode) {
        return () => {
          return undefined;
        };
      }
      const timer = setInterval(() => {
        const seconds =
          (questionEndTimestamp ??
            new Date().getTime() - questionStartTimestamp) / 1000;
        const secondsPart = Math.floor(seconds % 60);
        setCounter(
          `${Math.floor(seconds / 60)}:${
            secondsPart < 10 ? '0' : ''
          }${secondsPart}`,
        );
      }, 50);
      return () => {
        clearInterval(timer);
      };
    }, [questionStartTimestamp, questionResultMode, questionEndTimestamp]);

    return (
      <SidebarTopPad
        sx={{
          borderBottom: '1px solid #fff2',
          paddingLeft: backButton ? 0 : undefined,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            opacity: 0.85,
            fontSize: '18px',
            fontWeight: 750,
          }}
        >
          {backButton ? (
            <IconButton
              onClick={() => {
                history.back();
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          ) : (
            <></>
          )}
          <AccessTimeIcon sx={{ marginRight: '6px', opacity: 0.5 }} />
          {counter}
        </Box>
        <Box
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            flexGrow: 1,
            maxWidth: '50%',
            position: 'relative',
            height: '100%',
          }}
        >
          <LinearProgress
            variant="determinate"
            value={(questionCurrent / questionNumber) * 100}
            sx={{
              width: '100%',
              height: '75%',
              borderRadius: '5px',
              background: '#48657CAA',
              border: '#4a789a 1px solid',
              '& > .MuiLinearProgress-bar': {
                background:
                  'linear-gradient(243deg, #0090ec 40%, #0fccda 100%)',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 'auto',
              left: 'auto',
            }}
          >
            {questionCurrent}/{questionNumber}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tooltip title="答题卡" placement="bottom">
            <IconButton
              color={questionBoardVisible ? 'info' : undefined}
              onClick={() => {
                dispatch(GameLevelSliceActions.setQuestionBoardVisible(true));
              }}
            >
              <AppRegistrationIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="更多功能" placement="bottom">
            <IconButton disabled>
              <MoreHorizIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </SidebarTopPad>
    );
  },
);
