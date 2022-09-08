import React from 'react';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const problem = useSelector(state => state.gameLevel.ojProblem!);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const consoleVisible = useSelector(state => state.gameLevel.ojShowConsole);

  const languageItems = React.useMemo(
    () =>
      problem.samples
        .filter(sample => sample.input.trim() !== '')
        .map((sample, index) => {
          return (
            <MenuItem
              value={sample.input}
              key={sample.input}
              onClick={() => {
                dispatch(GameLevelSliceActions.setOJConsoleInput(sample.input));
                setShowMenu(false);
                setAnchorEl(null);
              }}
              sx={{
                fontSize: '14px',
              }}
            >
              样例 {index + 1}{' '}
              <code style={{ marginLeft: '15px', opacity: 0.5 }}>
                {sample.input.substring(0, 10)}
              </code>
            </MenuItem>
          );
        }),
    [problem.languages],
  );

  if (!consoleVisible || languageItems.length === 0) {
    return <></>;
  }

  return (
    <>
      <Button
        endIcon={<ArrowDropUpIcon />}
        onClick={event => {
          setShowMenu(true);
          setAnchorEl(event.currentTarget);
        }}
      >
        填入样例
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={showMenu && consoleVisible}
        onClose={() => {
          setShowMenu(false);
          setAnchorEl(null);
        }}
      >
        {languageItems}
      </Menu>
    </>
  );
});
