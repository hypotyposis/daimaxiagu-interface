import React from 'react';
import Box from '@mui/material/Box';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';

export default React.memo<{
  onPlay?: () => void;
  onPause?: () => void;
}>(({ onPlay, onPause }) => {
  const [pause, setPause] = React.useState<boolean>(false);
  return (
    <Box
      sx={{
        zIndex: 1,
        position: 'absolute',
        display: 'flex',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backdropFilter: pause ? 'brightness(0.65) blur(5px)' : 'none',
        transition: 'backdrop-filter 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      }}
      onClick={() => {
        if (pause) {
          onPlay?.();
        } else {
          onPause?.();
        }
        setPause(!pause);
      }}
    >
      {pause ? (
        <PauseRoundedIcon sx={{ fontSize: '100px', opacity: 0.65 }} />
      ) : (
        <></>
      )}
    </Box>
  );
});
