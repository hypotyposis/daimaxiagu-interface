import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import ApiIcon from '@mui/icons-material/Api';
import Typography from '@mui/material/Typography';

export default React.memo<{ style?: SxProps }>(({ style = {} }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      userSelect: 'none',
      cursor: 'pointer',
      ...style,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ApiIcon sx={{ marginRight: 1 }} />
      <Typography
        variant="h6"
        noWrap
        component="a"
        sx={{
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        代码峡谷
      </Typography>
    </Box>
    <Box
      sx={{
        fontSize: '12px',
        lineHeight: '8px',
        '-webkit-transform': 'scale(0.85)',
      }}
    >
      学编程，我要在峡谷玩!
    </Box>
  </Box>
));
