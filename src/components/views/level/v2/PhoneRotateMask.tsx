import React from 'react';
import Box from '@mui/material/Box';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';

export default React.memo(() => (
  <Box
    id="rotate-tipbox"
    style={{
      position: 'fixed',
      zIndex: 100000,
      backdropFilter: 'blur(10px)',
      backgroundColor: '#000c',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
  >
    <ScreenRotationIcon sx={{ fontSize: '80px' }} />
    <Box
      style={{
        fontSize: '20px',
        marginTop: '20px',
        fontWeight: '900',
      }}
    >
      屏幕横过来，效果会更好哦
    </Box>
  </Box>
));
