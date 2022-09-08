import React from 'react';
import { initGame } from './gameMiddleware';
import { initAgora } from './agoraMiddleware';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { AgoraSliceActions } from '@/utils/redux/agora/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const userId = useSelector(state => state.user.userId);
  const username = useSelector(state => state.user.username);
  const inAudioChannel = useSelector(state =>
    userId ? state.classroom.studentAudioChatMap[userId] === true : false,
  );
  const inScreenChannel = useSelector(state =>
    userId ? state.classroom.studentShareScreenMap[userId] === true : false,
  );
  const studentMute = useSelector(state =>
    userId ? state.classroom.studentMicrophoneMuteList[userId] === true : false,
  );

  React.useEffect(() => {
    initGame();
    if (username && userId) {
      initAgora();
      dispatch(
        colyseusClientSlice.actions.startConnecting({
          uid: userId,
          username,
          role: 'student',
        }),
      );
    }
    return () => {
      dispatch(AgoraSliceActions.muteMicrophone(undefined));
      dispatch(colyseusClientSlice.actions.disconnect());
      dispatch(AgoraSliceActions.setStudentScreenChannelId(''));
      dispatch(AgoraSliceActions.setTeacherScreenChannelId(''));
      dispatch(AgoraSliceActions.setAudioChannelId(''));
    };
  }, []);

  React.useEffect(() => {
    if (inAudioChannel) {
      dispatch(AgoraSliceActions.setAudioChannelId('audio'));
      dispatch(AgoraSliceActions.setTeacherScreenChannelId('teacher-host'));
      dispatch(AgoraSliceActions.setStudentScreenChannelId('student-host'));
    } else {
      dispatch(AgoraSliceActions.setAudioChannelId(''));
      dispatch(AgoraSliceActions.setTeacherScreenChannelId(''));
      dispatch(AgoraSliceActions.setStudentScreenChannelId(''));
    }
  }, [inAudioChannel]);

  React.useEffect(() => {
    if (inScreenChannel) {
      dispatch(AgoraSliceActions.startSharingScreen(undefined));
    } else {
      dispatch(AgoraSliceActions.stopSharingScreen(undefined));
    }
  }, [inScreenChannel]);

  React.useEffect(() => {
    if (studentMute) {
      dispatch(AgoraSliceActions.muteMicrophone(undefined));
    } else {
      dispatch(AgoraSliceActions.unmuteMicrophone(undefined));
    }
  }, [studentMute]);

  return <></>;
});
