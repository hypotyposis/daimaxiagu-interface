import React from 'react';
import IconButton from '@mui/material/IconButton';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';

import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export default React.memo(({ studentId }: { studentId: number }) => {
  const dispatch = useAppDispatch();
  const onAudioChannel = useSelector(
    state => state.classroom.studentAudioChatMap[studentId] === true,
  );
  const inviteStudentToAudioChat = React.useCallback(() => {
    dispatch(
      colyseusClientSlice.actions.inviteStudentToAudioChat({
        uid: studentId,
      }),
    );
  }, [dispatch, studentId]);

  const kickStudentOffAudioChat = React.useCallback(() => {
    dispatch(
      colyseusClientSlice.actions.kickStudentOffAudioChat({
        uid: studentId,
      }),
    );
  }, [dispatch, studentId]);

  if (onAudioChannel) {
    return (
      <IconButton onClick={() => kickStudentOffAudioChat()}>
        <CallIcon sx={{ fontSize: '16px' }} color="success" />
      </IconButton>
    );
  } else {
    return (
      <IconButton onClick={() => inviteStudentToAudioChat()}>
        <CallEndIcon sx={{ fontSize: '16px' }} color={'grey' as any} />
      </IconButton>
    );
  }
});
