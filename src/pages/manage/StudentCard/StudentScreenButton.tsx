import React from 'react';
import IconButton from '@mui/material/IconButton';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';

import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export default React.memo(({ studentId }: { studentId: number }) => {
  const dispatch = useAppDispatch();
  const shouldShareScreen = useSelector(
    state => state.classroom.studentShareScreenMap[studentId] === true,
  );
  const isSharingScreen = useSelector(
    state => state.agora.studentScreenMap[studentId] === true,
  );
  const askStudentToShareScreen = React.useCallback(() => {
    dispatch(
      colyseusClientSlice.actions.askStudentToShareScreen({
        uid: studentId,
      }),
    );
  }, [dispatch, studentId]);
  const cancelStudentShareScreen = React.useCallback(() => {
    dispatch(
      colyseusClientSlice.actions.cancelStudentShareScreen({
        uid: studentId,
      }),
    );
  }, [dispatch, studentId]);

  if (shouldShareScreen) {
    if (isSharingScreen) {
      return (
        <IconButton
          onClick={() => {
            cancelStudentShareScreen();
          }}
        >
          <ScreenShareIcon sx={{ fontSize: '16px' }} color="error" />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          onClick={() => {
            cancelStudentShareScreen();
          }}
        >
          <ScreenShareIcon sx={{ fontSize: '16px' }} color="warning" />
        </IconButton>
      );
    }
  } else {
    return (
      <IconButton
        onClick={() => {
          askStudentToShareScreen();
        }}
      >
        <StopScreenShareIcon sx={{ fontSize: '16px' }} color={'grey' as any} />
      </IconButton>
    );
  }
});
