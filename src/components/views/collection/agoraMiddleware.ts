import AgoraRTC, {
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  ILocalVideoTrack,
  IAgoraRTCClient,
} from 'agora-rtc-sdk-ng';
import { once } from 'lodash';
import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { registerActionProxy } from '@/utils/redux/middlewares/proxyMiddleware';
import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { agoraSlice, AgoraSliceActions } from '@/utils/redux/agora/slice';
import { getRTCOptions } from '@/utils/api/agora';
import { classroomSlice } from '@/utils/redux/classroom/slice';
import { devMode } from '@/utils/config';

let studentAudioTrackMap: Record<string, IRemoteAudioTrack> = {};
export const getStudentAudioTrack = (studentId: number) =>
  studentAudioTrackMap[studentId];
let teacherShareScreenTrack: IRemoteVideoTrack | undefined;
export const getTeacherShareScreenTrack = () => teacherShareScreenTrack;
let studentShareScreenTrack: ILocalVideoTrack | undefined;
export const getStudentShareScreenTrack = () => studentShareScreenTrack;

export const initAgora = once(() => {
  AgoraRTC.setLogLevel(devMode ? 0 : 3);
  /* ---------- 语音频道 ---------- */
  const getAudioClient = once(
    (api: MiddlewareAPI<Dispatch<AnyAction>, any>): IAgoraRTCClient => {
      const audioClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      // 订阅远程语音用户的音频流
      audioClient.on('user-published', async (user, mediaType) => {
        if (audioClient.uid !== user.uid && user.uid !== '') {
          if (mediaType === 'audio' && user.hasAudio) {
            await audioClient.subscribe(user, mediaType);
            studentAudioTrackMap[user.uid] = user.audioTrack!;
            user.audioTrack!.play();
            api.dispatch(AgoraSliceActions.putStudentAudio(user.uid));
          }
        }
      });
      // 当用户闭麦时，取消订阅音频流
      audioClient.on('user-unpublished', async user => {
        await audioClient.unsubscribe(user);
        delete studentAudioTrackMap[user.uid];
        api.dispatch(AgoraSliceActions.removeStudentAudio(user.uid));
      });
      return audioClient;
    },
  );
  let localMicrophoneAudioTrack: IMicrophoneAudioTrack | undefined;
  const createLocalMicrophoneAudioTrack = async (
    api: MiddlewareAPI<Dispatch<AnyAction>, any>,
  ) => {
    if (!localMicrophoneAudioTrack) {
      while (true) {
        try {
          localMicrophoneAudioTrack =
            await AgoraRTC.createMicrophoneAudioTrack();
          break;
        } catch (err) {
          continue;
        }
      }
      localMicrophoneAudioTrack.on('track-ended', async () => {
        localMicrophoneAudioTrack?.close();
        if (
          api.getState().classroom.studentAudioChatMap[
            api.getState().user.userId
          ]
        ) {
          createLocalMicrophoneAudioTrack(api);
        }
      });
    }
    await localMicrophoneAudioTrack.setMuted(
      api.getState().agora.microphoneMute,
    );
    await getAudioClient(api).publish(localMicrophoneAudioTrack);
    return localMicrophoneAudioTrack;
  };
  // 本机麦克风静音
  registerActionProxy(agoraSlice, 'muteMicrophone', async () => {
    await localMicrophoneAudioTrack?.setMuted?.(true);
  });
  // 本机麦克风取消静音
  registerActionProxy(agoraSlice, 'unmuteMicrophone', async () => {
    await localMicrophoneAudioTrack?.setMuted?.(false);
  });
  // 切换语音频道
  registerActionProxy(agoraSlice, 'setAudioChannelId', async (action, api) => {
    const newAudioChannelId = action.payload;
    if (api.getState().agora.audioChannelId === action.payload) {
      return;
    }
    getAudioClient(api).leave();
    studentAudioTrackMap = {};
    api.dispatch(AgoraSliceActions.clearStudentAudioMap(undefined));
    if (newAudioChannelId !== '') {
      const { appId, channel, token, uid } = await getRTCOptions(
        newAudioChannelId,
        api.getState().user.userId,
      );
      const audioClient = getAudioClient(api);
      await audioClient.join(appId, channel, token, uid);
      createLocalMicrophoneAudioTrack(api);
    } else {
      localMicrophoneAudioTrack?.close();
      localMicrophoneAudioTrack = undefined;
    }
  });

  /* ---------- 学生屏幕频道 ---------- */
  const getStudentScreenClient = once((): IAgoraRTCClient => {
    const studentScreenClient = AgoraRTC.createClient({
      mode: 'live',
      codec: 'vp8',
    });
    studentScreenClient.setClientRole('host');
    return studentScreenClient;
  });
  let studentScreenTrack: ILocalVideoTrack | undefined;
  const stopSharingScreen = async (
    api: MiddlewareAPI<Dispatch<AnyAction>, any>,
  ) => {
    if (studentScreenTrack) {
      await getStudentScreenClient().unpublish(studentScreenTrack);
      studentScreenTrack?.close();
      studentScreenTrack = undefined;
      studentShareScreenTrack = undefined;
      api.dispatch(
        classroomSlice.actions.removeFromStudentShareScreen(
          api.getState().user.userId,
        ),
      );
    }
  };
  const startSharingScreen = async (
    api: MiddlewareAPI<Dispatch<AnyAction>, any>,
  ) => {
    if (!studentScreenTrack) {
      while (true) {
        try {
          studentScreenTrack = await AgoraRTC.createScreenVideoTrack(
            {
              encoderConfig: '1080p_2',
              optimizationMode: 'detail',
            },
            'disable',
          );
          break;
        } catch (err) {
          continue;
        }
      }
      studentShareScreenTrack = studentScreenTrack;
      studentScreenTrack.on('track-ended', () => {
        studentScreenTrack?.close();
        if (
          api.getState().classroom.studentShareScreenMap[
            api.getState().user.userId
          ]
        ) {
          startSharingScreen(api);
        }
      });
    }
    await getStudentScreenClient().publish(studentScreenTrack);
    api.dispatch(colyseusClientSlice.actions.teacherStartShareScreen());
    api.dispatch(
      classroomSlice.actions.addToStudentShareScreen(
        api.getState().user.userId,
      ),
    );
  };
  // 切换学生屏幕频道
  registerActionProxy(
    agoraSlice,
    'setStudentScreenChannelId',
    async (action, api) => {
      const newStudentScreenChannelId = action.payload;
      if (api.getState().agora.studentScreenChannelId === action.payload) {
        return;
      }
      api.dispatch(AgoraSliceActions.stopSharingScreen(undefined));
      getStudentScreenClient().leave();
      if (newStudentScreenChannelId !== '') {
        const { appId, channel, token, uid } = await getRTCOptions(
          newStudentScreenChannelId,
          api.getState().user.userId,
        );
        const studentScreenClient = getStudentScreenClient();
        await studentScreenClient.join(appId, channel, token, uid);
      }
    },
  );
  registerActionProxy(
    agoraSlice,
    'startSharingScreen',
    async (_action, api) => {
      await startSharingScreen(api);
    },
  );
  registerActionProxy(agoraSlice, 'stopSharingScreen', async (_action, api) => {
    await stopSharingScreen(api);
  });

  /* ---------- 教师屏幕频道 ---------- */
  const getTeacherScreenClient = once(
    (api: MiddlewareAPI<Dispatch<AnyAction>, any>): IAgoraRTCClient => {
      const teacherScreenClient = AgoraRTC.createClient({
        mode: 'live',
        codec: 'vp8',
      });
      teacherScreenClient.setClientRole('audience');
      teacherScreenClient.on('user-published', async (user, mediaType) => {
        if (mediaType === 'video' && user.hasVideo) {
          await teacherScreenClient.subscribe(user, mediaType);
          teacherShareScreenTrack = user.videoTrack!;
          api.dispatch(AgoraSliceActions.setTeacherSharingScreen(true));
        }
      });
      teacherScreenClient.on('user-unpublished', () => {
        teacherShareScreenTrack = undefined;
        api.dispatch(AgoraSliceActions.setTeacherSharingScreen(false));
      });
      return teacherScreenClient;
    },
  );
  registerActionProxy(
    agoraSlice,
    'setTeacherScreenChannelId',
    async (action, api) => {
      const newTeacherScreenChannelId = action.payload;
      if (api.getState().agora.teacherScreenChannelId === action.payload) {
        return;
      }
      api.dispatch(AgoraSliceActions.setTeacherSharingScreen(false));
      getTeacherScreenClient(api).leave();
      if (newTeacherScreenChannelId !== '') {
        const { appId, channel, token, uid } = await getRTCOptions(
          newTeacherScreenChannelId,
          api.getState().user.userId,
        );
        const teacherScreenClient = getTeacherScreenClient(api);
        await teacherScreenClient.join(appId, channel, token, uid);
      }
    },
  );
});
