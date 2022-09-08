import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Resizable } from 're-resizable';

import SubProblemView from './SubProblemView';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const content = useSelector(
    state => state.gameLevel.currentQuestionData?.content,
  );
  const subProblems = useSelector(
    state => state.gameLevel.currentQuestionData?.subProblems,
  );
  const questionIndex = useSelector(
    state => state.gameLevel.currentQuestionIndex,
  );
  const questionScores = useSelector(
    state =>
      state.gameLevel.questionScores?.[
        state.gameLevel.currentQuestionId ?? ''
      ] ?? [],
  );
  const totalScore = React.useMemo(
    () => questionScores.reduce((total, value) => total + value, 0),
    [questionScores],
  );

  if (subProblems === undefined || subProblems.length === 0) {
    return <></>;
  }

  if (subProblems.length === 1) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          height: 0,
          overflow: 'auto',
        }}
      >
        <SubProblemView />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#0005',
      }}
    >
      <Resizable
        defaultSize={{ width: '100%', height: '50%' }}
        enable={{ bottom: true }}
        minHeight="25px"
        maxHeight={`${window.innerHeight - 110}px`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          position: 'relative',
          overflow: 'hidden',
        }}
        handleComponent={{
          bottom: (
            <Box
              sx={{
                position: 'absolute',
                top: '-20px',
                width: '100%',
                height: '30px',
                bgcolor: 'background.paper',
                borderRadius: '10px 10px 0 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#FFF1',
                borderStyle: 'solid',
                borderWidth: '1px 1px 0 1px',
                boxShadow: '#0004 0 0 10px',
                '&:hover > div, &:active > div': {
                  background: '#94bbdb',
                  width: '80px',
                },
              }}
            >
              <Box
                sx={{
                  height: '6px',
                  width: '45px',
                  background: '#FFF3',
                  borderRadius: '3px',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                }}
              />
            </Box>
          ),
        }}
        onResize={() => {
          window.dispatchEvent(new Event('resize'));
        }}
      >
        <MarkdownBlock
          text={`${content ?? ''} **(${totalScore}分)**`}
          usePrism
          style={{
            padding: '20px 20px 40px 20px',
            overflow: 'auto',
          }}
        />
      </Resizable>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={questionIndex[1]}
        onChange={(_event, newValue) => {
          dispatch(
            GameLevelSliceActions.setCurrentQuestionIndex([
              questionIndex[0],
              newValue,
            ]),
          );
        }}
        sx={{
          '& .MuiTabs-scrollButtons.Mui-disabled': {
            opacity: 0.2,
          },
          borderColor: '#FFF1',
          borderStyle: 'solid',
          borderWidth: '0 1px 0 1px',
          bgcolor: 'background.paper',
        }}
      >
        {subProblems.map((subProblem, index) => (
          <Tab
            label={`第${index + 1}题`}
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}/${subProblem.content}`}
          />
        ))}
      </Tabs>
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderColor: '#FFF1',
          borderStyle: 'solid',
          borderWidth: '0 1px 0 1px',
        }}
      >
        <SubProblemView />
      </Box>
    </Box>
  );
});
