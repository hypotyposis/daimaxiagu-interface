import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConnectInfo {
  uid: number;
  username: string;
  role: string;
}

export interface ConnectionState {
  isConnected: boolean;
  isEstablishingConnection: boolean;
}

const initialState: ConnectionState = {
  isConnected: false,
  isEstablishingConnection: false,
};

export const colyseusClientSlice = createSlice({
  name: 'colyseusClient',
  initialState,
  reducers: {
    startConnecting: (
      state: ConnectionState,
      action: PayloadAction<ConnectInfo>,
    ) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state: ConnectionState) => {
      state.isConnected = true;
      state.isEstablishingConnection = false;
    },
    sendMessage: (state: ConnectionState, action: PayloadAction<any>) => {},
    activateStudent: (state: ConnectionState, action: PayloadAction<any>) => {},
    inviteStudentToAudioChat: (
      state: ConnectionState,
      action: PayloadAction<any>,
    ) => {},
    kickStudentOffAudioChat: (
      state: ConnectionState,
      action: PayloadAction<any>,
    ) => {},
    askStudentToShareScreen: (
      state: ConnectionState,
      action: PayloadAction<any>,
    ) => {},
    cancelStudentShareScreen: (
      state: ConnectionState,
      action: PayloadAction<any>,
    ) => {},
    disconnect: (state: ConnectionState) => {
      state.isConnected = false;
    },
    teacherStartShareScreen: (state: ConnectionState) => {},
    teacherFinishShareScreen: (state: ConnectionState) => {},
    muteStudentAudioChat: (
      state: ConnectionState,
      action: PayloadAction<any>,
    ) => {},
    unmuteStudentAudioChat: (
      state: ConnectionState,
      action: PayloadAction<any>,
    ) => {},
  },
});

export const {
  startConnecting,
  connectionEstablished,
  sendMessage,
  activateStudent,
  inviteStudentToAudioChat,
  kickStudentOffAudioChat,
  askStudentToShareScreen,
  cancelStudentShareScreen,
  disconnect,
  teacherStartShareScreen,
  teacherFinishShareScreen,
  muteStudentAudioChat,
  unmuteStudentAudioChat,
} = colyseusClientSlice.actions;

export default colyseusClientSlice.reducer;
