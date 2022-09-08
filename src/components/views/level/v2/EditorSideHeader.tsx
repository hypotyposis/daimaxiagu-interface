import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { SidebarTopPad } from '@/components/views/collection/Sidebar/SidebarContainer';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';

export interface IEditorSideHeaderProps {
  hasNextLevel?: boolean;
  hasLastLevel?: boolean;
  onNextLevel?: () => void;
  onLastLevel?: () => void;
}

export default React.memo<IEditorSideHeaderProps>(
  ({
    hasLastLevel = false,
    hasNextLevel = false,
    onNextLevel,
    onLastLevel,
  }) => {
    const currentLanguage = useSelector(
      state => state.gameLevel.currentLanguage,
    );
    const allowedLanguages = useSelector(
      state => state.gameLevel.levelData!.supportedLanguages,
    );
    const levelTitle = useSelector(state => state.gameLevel.levelData!.title);
    const gameState = useSelector(state => state.gameLevel.gameState);
    const dispatch = useAppDispatch();

    const languageItems = React.useMemo(
      () =>
        allowedLanguages.map(language => {
          return (
            <MenuItem value={language} key={language}>
              {{
                cpp: 'C++',
                python: 'Python3',
                scratch: 'Scratch',
                go: 'Go',
              }[language] ?? '未知'}
            </MenuItem>
          );
        }),
      [allowedLanguages],
    );

    return (
      <SidebarTopPad sx={{ flexShrink: 0, borderBottom: '1px solid #fff2' }}>
        <Box>
          <FormControl variant="standard">
            <Select
              id="language-select"
              value={currentLanguage}
              label="编程语言"
              onChange={(event: SelectChangeEvent) => {
                dispatch(
                  GameLevelSliceActions.setCurrentLanguage(event.target.value),
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
          }}
        >
          <IconButton
            disabled={gameState === 'Loading' || !hasLastLevel}
            color="info"
            onClick={onLastLevel}
          >
            <ChevronLeftIcon />
          </IconButton>
          {levelTitle}
          <IconButton
            disabled={gameState === 'Loading' || !hasNextLevel}
            color="info"
            onClick={onNextLevel}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton disabled color="info">
            <AddIcon />
          </IconButton>
          <IconButton disabled color="info">
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </SidebarTopPad>
    );
  },
);
