import React from 'react';
import Box from '@mui/material/Box';
import { useSelector } from '@/utils/redux/hooks';
import VideoTrackView from '@/components/VideoTrackView';
import { getTeacherShareScreenTrack } from '@/components/views/collection/agoraMiddleware';

export default React.memo(() => {
  // const iAmSharingScreen = useSelector(state => state.agora.iAmSharingScreen);
  const teacherIsSharingScreen = useSelector(
    state => state.agora.teacherIsSharingScreen,
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        // border: iAmSharingScreen ? '#d80b2d 3px solid' : 'none',
      }}
    >
      {teacherIsSharingScreen ? (
        <>
          <VideoTrackView
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
            }}
            track={getTeacherShareScreenTrack()!}
            videoConfig={{
              fit: 'contain',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: '30px',
              bottom: '30px',
              fontSize: '40px',
              color: 'white',
              opacity: 0.35,
              userSelect: 'none',
              fontWeight: 900,
            }}
          >
            老师正在共享屏幕
          </Box>
        </>
      ) : (
        <></>
      )}
      {/* {iAmSharingScreen ? (
        <Box
          sx={{
            position: 'absolute',
            top: '0',
            background: '#d80b2d',
            padding: '5px 15px',
          }}
        >
          🎬 正在共享屏幕
        </Box>
      ) : (
        <></>
      )} */}
    </Box>
  );
});
