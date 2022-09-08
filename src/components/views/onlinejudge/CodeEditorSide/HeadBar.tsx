import React from 'react';
import { intersection } from 'lodash';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Select from '@mui/material/Select';

import { getOJDefaultCode } from '../middleware';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { SidebarTopPad } from '@/components/views/collection/Sidebar/SidebarContainer';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const problem = useSelector(state => state.gameLevel.ojProblem!);
  const currentLanguage = useSelector(
    state => state.gameLevel.ojCurrentLanguage,
  );
  const languageItems = React.useMemo(
    () =>
      intersection(problem.languages, ['C++', 'Python3', 'Java']).map(
        language => {
          return (
            <MenuItem value={language} key={language}>
              {language}
            </MenuItem>
          );
        },
      ),
    [problem.languages],
  );
  return (
    <SidebarTopPad sx={{ flexShrink: 0, borderBottom: '1px solid #fff2' }}>
      <FormControl variant="standard">
        <Select
          id="language-select"
          value={currentLanguage}
          label="编程语言"
          onChange={event => {
            dispatch(
              GameLevelSliceActions.setOJCurrentLanguage(event.target.value),
            );
          }}
          sx={{
            '&:before': {
              borderBottom: 'none !important',
            },
            '&>div#language-select': {
              paddingLeft: '8px',
              minWidth: '65px',
            },
          }}
        >
          {languageItems}
        </Select>
      </FormControl>
      <Button
        onClick={async () => {
          dispatch(
            GameLevelSliceActions.setOJCode(getOJDefaultCode(currentLanguage)),
          );
        }}
        startIcon={<RestartAltIcon />}
      >
        重置代码
      </Button>
    </SidebarTopPad>
  );
});
