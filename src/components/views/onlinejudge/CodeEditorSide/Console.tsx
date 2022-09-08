import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import ConsoleResult from './ConsoleResult';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const problem = useSelector(state => state.gameLevel.ojProblem);
  const consoleVisible = useSelector(state => state.gameLevel.ojShowConsole);
  const consoleResult = useSelector(state => state.gameLevel.ojConsoleResult);
  const inputText = useSelector(state => state.gameLevel.ojConsoleInput ?? '');

  React.useEffect(() => {
    if (consoleResult) {
      setTabIndex(0);
    }
  }, [inputText]);

  React.useEffect(() => {
    if (consoleResult) {
      setTabIndex(1);
    }
  }, [consoleResult]);

  React.useEffect(() => {
    if (problem) {
      dispatch(
        GameLevelSliceActions.setOJConsoleInput(problem.samples[0]?.input),
      );
    }
    dispatch(GameLevelSliceActions.toggleOJConsoleVisible(false));
  }, [problem]);

  if (!consoleVisible) {
    return <></>;
  }

  return (
    <Box
      sx={{
        width: '100%',
        background: '#0005',
        maxHeight: '80%',
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_event, value) => {
            setTabIndex(value);
          }}
          aria-label="basic tabs example"
          sx={{ flexGrow: 1 }}
        >
          <Tab label="测试用例" />
          <Tab label="代码测试结果" />
        </Tabs>
        <Tooltip title="收起控制台" placement="top">
          <IconButton
            onClick={() => {
              dispatch(GameLevelSliceActions.toggleOJConsoleVisible(false));
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          width: '100%',
          overflowY: 'auto',
          height: '100%',
        }}
      >
        {tabIndex === 0 ? (
          <TextField
            variant="outlined"
            multiline
            placeholder="在这里输入测试用例"
            rows={5}
            size="small"
            fullWidth
            value={inputText}
            onChange={event =>
              dispatch(
                GameLevelSliceActions.setOJConsoleInput(event.target.value),
              )
            }
            sx={{
              padding: '10px',
              fontSize: '12px',
            }}
          />
        ) : (
          <></>
        )}
        {tabIndex === 1 ? <ConsoleResult /> : <></>}
      </Box>
    </Box>
  );
});
