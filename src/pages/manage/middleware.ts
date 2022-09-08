import AgoraRTC, {
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCClient,
} from 'agora-rtc-sdk-ng';
import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { once } from 'lodash';

import { registerActionProxy } from '@/utils/redux/middlewares/proxyMiddleware';
import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { agoraSlice, AgoraSliceActions } from '@/utils/redux/agora/slice';
import { getRTCOptions } from '@/utils/api/agora';
import { devMode } from '@/utils/config';

let studentAudioTrackMap: Record<string, IRemoteAudioTrack> = {};
let studentShareScreenTrackMap: Record<string, IRemoteVideoTrack> = {};
let teacherShareScreenTrack: ILocalVideoTrack | undefined;
export const getStudentAudioTrack = (studentId: number) =>
  studentAudioTrackMap[studentId];
export const getTeacherShareScreenTrack = () => teacherShareScreenTrack;
export const getStudentShareScreenTrack = (studentId: number) =>
  studentShareScreenTrackMap[studentId];

export const init = once(() => {
  AgoraRTC.setLogLevel(devMode ? 0 : 3);
  /* ---------- 语音频道 ---------- */
  let localMicrophoneAudioTrack: IMicrophoneAudioTrack | undefined;
  const getAudioClient = once(
    (api: MiddlewareAPI<Dispatch<AnyAction>, any>): IAgoraRTCClient => {
      const audioClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      // 订阅远程语音用户的音频流
      audioClient.on('user-published', async (user, mediaType) => {
        if (audioClient.uid !== `${user.uid}` && user.uid !== '') {
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
      if (!localMicrophoneAudioTrack) {
        localMicrophoneAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localMicrophoneAudioTrack.on('track-ended', async () => {
          localMicrophoneAudioTrack =
            await AgoraRTC.createMicrophoneAudioTrack();
        });
      }
      await localMicrophoneAudioTrack.setMuted(
        api.getState().agora.microphoneMute,
      );
      await audioClient.publish(localMicrophoneAudioTrack);
    } else {
      localMicrophoneAudioTrack?.close();
      localMicrophoneAudioTrack = undefined;
    }
  });

  /* ---------- 学生屏幕频道 ---------- */
  const getStudentScreenClient = once(
    (api: MiddlewareAPI<Dispatch<AnyAction>, any>): IAgoraRTCClient => {
      const studentScreenClient = AgoraRTC.createClient({
        mode: 'live',
        codec: 'vp8',
      });
      studentScreenClient.setClientRole('audience');
      studentScreenClient.on('user-published', async (user, mediaType) => {
        if (mediaType === 'video' && user.hasVideo) {
          await studentScreenClient.subscribe(user, mediaType);
          studentShareScreenTrackMap[user.uid] = user.videoTrack!;
          api.dispatch(AgoraSliceActions.putStudentScreen(user.uid));
        }
      });
      studentScreenClient.on('user-unpublished', user => {
        delete studentShareScreenTrackMap[user.uid];
        api.dispatch(AgoraSliceActions.removeStudentScreen(user.uid));
      });
      return studentScreenClient;
    },
  );
  // 切换学生屏幕频道
  registerActionProxy(
    agoraSlice,
    'setStudentScreenChannelId',
    async (action, api) => {
      const newStudentScreenChannelId = action.payload;
      if (api.getState().agora.studentScreenChannelId === action.payload) {
        return;
      }
      getStudentScreenClient(api).leave();
      studentShareScreenTrackMap = {};
      api.dispatch(AgoraSliceActions.clearStudentScreenMap(undefined));
      if (newStudentScreenChannelId !== '') {
        const { appId, channel, token, uid } = await getRTCOptions(
          newStudentScreenChannelId,
          api.getState().user.userId,
        );
        const studentScreenClient = getStudentScreenClient(api);
        await studentScreenClient.join(appId, channel, token, uid);
      }
    },
  );

  /* ---------- 教师屏幕频道 ---------- */
  const getTeacherScreenClient = once((): IAgoraRTCClient => {
    const teacherScreenClient = AgoraRTC.createClient({
      mode: 'live',
      codec: 'vp8',
    });
    teacherScreenClient.setClientRole('host');
    return teacherScreenClient;
  });
  let teacherScreenTrack: ILocalVideoTrack | undefined;
  const stopSharingScreen = async (
    api: MiddlewareAPI<Dispatch<AnyAction>, any>,
  ) => {
    if (teacherScreenTrack) {
      await getTeacherScreenClient().unpublish(teacherScreenTrack);
      teacherScreenTrack?.close();
      teacherScreenTrack = undefined;
      teacherShareScreenTrack = undefined;
      api.dispatch(colyseusClientSlice.actions.teacherFinishShareScreen());
    }
  };
  const startSharingScreen = async (
    api: MiddlewareAPI<Dispatch<AnyAction>, any>,
  ) => {
    if (!teacherScreenTrack) {
      teacherScreenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: '1080p_2',
          optimizationMode: 'detail',
        },
        'disable',
      );
      teacherShareScreenTrack = teacherScreenTrack;
      teacherScreenTrack.on('track-ended', () => {
        api.dispatch(AgoraSliceActions.stopSharingScreen(undefined));
      });
    }
    await getTeacherScreenClient().publish(teacherScreenTrack);
    api.dispatch(colyseusClientSlice.actions.teacherStartShareScreen());
  };
  registerActionProxy(
    agoraSlice,
    'setTeacherScreenChannelId',
    async (action, api) => {
      const newTeacherScreenChannelId: string = action.payload;
      if (api.getState().agora.teacherScreenChannelId === action.payload) {
        return;
      }
      await stopSharingScreen(api);
      getTeacherScreenClient().leave();
      if (newTeacherScreenChannelId !== '') {
        const { appId, channel, token, uid } = await getRTCOptions(
          newTeacherScreenChannelId,
          api.getState().user.userId,
        );
        const teacherScreenClient = getTeacherScreenClient();
        await teacherScreenClient.join(appId, channel, token, uid);
        if (api.getState().classroom.teacherIsSharingScreen) {
          api.dispatch(AgoraSliceActions.startSharingScreen(undefined));
        }
      }
    },
  );
  registerActionProxy(
    agoraSlice,
    'startSharingScreen',
    async (_action, api) => {
      if (api.getState().classroom.teacherIsSharingScreen === false) {
        await startSharingScreen(api);
      }
    },
  );
  registerActionProxy(agoraSlice, 'stopSharingScreen', async (_action, api) => {
    await stopSharingScreen(api);
  });
});
