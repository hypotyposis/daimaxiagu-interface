import React from 'react';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export default React.memo(({ studentId }: { studentId: number }) => {
  const dispatch = useAppDispatch();
  const studentShouldMute = useSelector(
    state => state.classroom.studentMicrophoneMuteList[studentId] === true,
  );
  const studentMute = useSelector(
    state => state.agora.studentAudioMap[studentId] !== true,
  );
  const muteStudentAudioChat = React.useCallback(() => {
    dispatch(
      colyseusClientSlice.actions.muteStudentAudioChat({
        uid: studentId,
      }),
    );
  }, [dispatch, studentId]);

  const unmuteStudentAudioChat = React.useCallback(() => {
    dispatch(
      colyseusClientSlice.actions.unmuteStudentAudioChat({
        uid: studentId,
      }),
    );
  }, [dispatch, studentId]);

  if (studentShouldMute) {
    if (studentMute) {
      return (
        <IconButton
          onClick={() => {
            unmuteStudentAudioChat();
          }}
        >
          <MicOffIcon sx={{ fontSize: '16px' }} color={'grey' as any} />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          onClick={() => {
            muteStudentAudioChat();
          }}
        >
          <MicIcon sx={{ fontSize: '16px' }} color="warning" />
        </IconButton>
      );
    }
  } else {
    return (
      <IconButton
        onClick={() => {
          muteStudentAudioChat();
        }}
      >
        <MicIcon sx={{ fontSize: '16px' }} color="error" />
      </IconButton>
    );
  }
});
