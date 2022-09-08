import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { useSelector } from '@/utils/redux/hooks';
import { SidebarTopPad } from '@/components/views/collection/Sidebar/SidebarContainer';

export interface IDescriptionSideHeaderProps {
  hasNextLevel?: boolean;
  hasLastLevel?: boolean;
  onNextLevel?: () => void;
  onLastLevel?: () => void;
}

export default React.memo<IDescriptionSideHeaderProps>(
  ({
    hasLastLevel = false,
    hasNextLevel = false,
    onNextLevel,
    onLastLevel,
  }) => {
    const problem = useSelector(state => state.gameLevel.ojProblem!);
    return (
      <SidebarTopPad sx={{ flexShrink: 0, borderBottom: '1px solid #fff2' }}>
        <Box />
        <Box
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            flexGrow: 1,
            width: 0,
          }}
        >
          <IconButton
            disabled={!hasLastLevel}
            color="info"
            onClick={onLastLevel}
          >
            <ChevronLeftIcon />
          </IconButton>
          {problem.title}
          <IconButton
            disabled={!hasNextLevel}
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
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </SidebarTopPad>
    );
  },
);
