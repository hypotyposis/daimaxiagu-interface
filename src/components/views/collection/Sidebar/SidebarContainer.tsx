import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, Theme, CSSObject, useTheme } from '@mui/material/styles';

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: '50px',
});

export const SidebarTopPad = React.memo<{
  looseHeight?: boolean;
  children: any;
  sx?: SxProps;
  className?: string;
}>(({ looseHeight, children, sx = {}, className }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        height: '45px !important',
        minHeight: looseHeight ? '45px' : '45px !important',
        ...sx,
      }}
      className={className}
    >
      {children}
    </Box>
  );
});

export const SidebarContainer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export const SidebarIconButton = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'focusRipple',
})(({ focusRipple }) => ({
  padding: '14px 8px',
  borderRadius: 0,
  width: '100%',
  ...(focusRipple
    ? {
        background: 'rgba(107, 178, 255, 14%)',
        transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        boxShadow: '2px 0 0 white inset',
      }
    : {}),
}));
