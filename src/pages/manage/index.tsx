import React from 'react';
import Box from '@mui/material/Box';
import { Resizable } from 're-resizable';

import StudentList from './StudentList';
import CodeMonitor from './CodeMonitor';
import TeacherRTCController from './TeacherRTCController';
import { init } from './middleware';

import UserGateKeeper from '@/components/auth/UserGateKeeper';
import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const userId = useSelector(state => state.user.userId);
  const username = useSelector(state => state.user.username);
  // 教师登录
  React.useEffect(() => {
    init();
    dispatch(
      colyseusClientSlice.actions.startConnecting({
        uid: userId!,
        username: username!,
        role: 'teacher',
      }),
    );
    return () => {
      dispatch(colyseusClientSlice.actions.disconnect());
    };
  }, []);

  return (
    <UserGateKeeper admin goBack>
      <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
        <Resizable
          defaultSize={{ width: '300px', height: '100%' }}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          minWidth="210px"
          maxWidth="60%"
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            backgroundColor: '#282c3433',
            position: 'relative',
          }}
          handleClasses={{
            right: 'editor-side-resize-bar',
          }}
          onResize={() => {
            window.dispatchEvent(new Event('resize'));
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '40px',
              flexShrink: 0,
              backgroundColor: '#0008',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 800,
            }}
          >
            管理系统(内测版)
          </Box>
          <StudentList />
          <TeacherRTCController />
        </Resizable>
        <Box sx={{ height: '100%', flexGrow: 1 }}>
          <CodeMonitor />
        </Box>
      </Box>
    </UserGateKeeper>
  );
});
