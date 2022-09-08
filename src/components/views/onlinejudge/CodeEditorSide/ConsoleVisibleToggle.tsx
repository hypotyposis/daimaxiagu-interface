import React from 'react';
import Button from '@mui/material/Button';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const consoleVisible = useSelector(state => state.gameLevel.ojShowConsole);

  if (consoleVisible) {
    return (
      <Button
        endIcon={<ArrowDropUpIcon />}
        onClick={() => {
          dispatch(GameLevelSliceActions.toggleOJConsoleVisible(false));
        }}
      >
        控制台
      </Button>
    );
  } else {
    return (
      <Button
        endIcon={<ArrowDropDownIcon />}
        onClick={() => {
          dispatch(GameLevelSliceActions.toggleOJConsoleVisible(true));
        }}
      >
        控制台
      </Button>
    );
  }
});
