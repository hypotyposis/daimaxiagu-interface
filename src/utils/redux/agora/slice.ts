import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { createProxyReducers } from '../middlewares/proxyMiddleware';

export interface AgoraState {
  audioChannelId: string;
  microphoneMute: boolean;
  studentAudioMap: Record<string, boolean>;
  studentScreenChannelId: string;
  studentScreenMap: Record<string, boolean>;
  teacherScreenChannelId: string;
  teacherIsSharingScreen: boolean;
  iAmSharingScreen: boolean;
}

const initialState: AgoraState = {
  audioChannelId: '',
  microphoneMute: true,
  studentAudioMap: {},
  studentScreenChannelId: '',
  studentScreenMap: {},
  teacherScreenChannelId: '',
  teacherIsSharingScreen: false,
  iAmSharingScreen: false,
};

export const agoraSlice = createSlice<
  AgoraState,
  SliceCaseReducers<AgoraState>
>({
  name: 'agoraSlice',
  initialState,
  reducers: {
    setTeacherSharingScreen: (state, action) => {
      state.teacherIsSharingScreen = action.payload;
    },
    putStudentAudio: (state, action) => {
      state.studentAudioMap[action.payload] = true;
    },
    removeStudentAudio: (state, action) => {
      delete state.studentAudioMap[action.payload];
    },
    clearStudentAudioMap: state => {
      state.studentAudioMap = {};
    },
    putStudentScreen: (state, action) => {
      state.studentScreenMap[action.payload] = true;
    },
    removeStudentScreen: (state, action) => {
      delete state.studentScreenMap[action.payload];
    },
    clearStudentScreenMap: state => {
      state.studentScreenMap = {};
    },
    ...createProxyReducers({
      muteMicrophone: state => {
        state.microphoneMute = true;
      },
      unmuteMicrophone: state => {
        state.microphoneMute = false;
      },
      setAudioChannelId: (state, action) => {
        state.audioChannelId = action.payload;
      },
      setStudentScreenChannelId: (state, action) => {
        state.studentScreenChannelId = action.payload;
      },
      setTeacherScreenChannelId: (state, action) => {
        state.teacherScreenChannelId = action.payload;
      },
      startSharingScreen: state => {
        state.iAmSharingScreen = true;
      },
      stopSharingScreen: state => {
        state.iAmSharingScreen = false;
      },
    }),
  },
});

export const AgoraSliceActions = {
  muteMicrophone: agoraSlice.actions.muteMicrophone,
  unmuteMicrophone: agoraSlice.actions.unmuteMicrophone,
  setAudioChannelId: agoraSlice.actions.setAudioChannelId,
  setStudentScreenChannelId: agoraSlice.actions.setStudentScreenChannelId,
  putStudentAudio: agoraSlice.actions.putStudentAudio,
  removeStudentAudio: agoraSlice.actions.removeStudentAudio,
  clearStudentAudioMap: agoraSlice.actions.clearStudentAudioMap,
  putStudentScreen: agoraSlice.actions.putStudentScreen,
  removeStudentScreen: agoraSlice.actions.removeStudentScreen,
  clearStudentScreenMap: agoraSlice.actions.clearStudentScreenMap,
  setTeacherScreenChannelId: agoraSlice.actions.setTeacherScreenChannelId,
  startSharingScreen: agoraSlice.actions.startSharingScreen,
  stopSharingScreen: agoraSlice.actions.stopSharingScreen,
  setTeacherSharingScreen: agoraSlice.actions.setTeacherSharingScreen,
};
