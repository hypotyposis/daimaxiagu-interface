import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from '@reduxjs/toolkit';

export interface StudentIdSourceCodePair {
  studentId: number;
  sourceCode: string;
}

export interface UserIdUsernamePair {
  userId: number;
  username: string;
}

interface ClassroomProps {
  studentList: number[]; // 保存Colyseus Server传来的学生列表
  teacherList: number[]; // 保存Colyseus Server传来的老师列表
  activeStudentList: number[]; // 保存老师在前端选中查看的学生列表
  studentSourceCodeMap: Record<number, { code: string; language: string }>;
  studentAudioChatMap: Record<number, boolean>; // 保存在语音聊天频道中的学生列表
  studentShareScreenMap: Record<number, boolean>; // 保存在分享屏幕的学生列表
  teacherIsSharingScreen: boolean; // 老师是否在共享屏幕
  userIdUsernameMap: Record<number, string>;
  studentMicrophoneMuteList: Record<number, boolean>;
}

const initialState: ClassroomProps = {
  studentList: [],
  teacherList: [],
  activeStudentList: [],
  studentSourceCodeMap: {},
  studentAudioChatMap: {},
  studentShareScreenMap: {},
  teacherIsSharingScreen: false,
  userIdUsernameMap: {},
  studentMicrophoneMuteList: {},
};

export const classroomSlice = createSlice<
  ClassroomProps,
  SliceCaseReducers<ClassroomProps>
>({
  name: 'classroomSlice',
  initialState,
  reducers: {
    addToStudentList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      state.studentList.push(action.payload);
    },
    removeFromStudentList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      const index = state.studentList.indexOf(action.payload);
      if (index >= 0) {
        state.studentList.splice(index, 1);
      }
    },
    addToTeacherList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      state.teacherList.push(action.payload);
    },
    removeFromTeacherList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      const index = state.teacherList.indexOf(action.payload);
      if (index >= 0) {
        state.teacherList.splice(index, 1);
      }
    },
    addToActiveStudentList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      state.activeStudentList.push(action.payload);
    },
    removeFromActiveStudentList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      const index = state.activeStudentList.indexOf(action.payload);
      if (index >= 0) {
        state.activeStudentList.splice(index, 1);
      }
    },
    addToStudentInAudioChat: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      state.studentAudioChatMap[action.payload] = true;
    },
    removeFromStudentInAudioChat: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      delete state.studentAudioChatMap[action.payload];
    },
    addToStudentShareScreen: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      state.studentShareScreenMap[action.payload] = true;
    },
    removeFromStudentShareScreen: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      delete state.studentShareScreenMap[action.payload];
    },
    addToStudentSourceCodeMap: (
      state: ClassroomProps,
      action: PayloadAction<StudentIdSourceCodePair>,
    ) => {
      state.studentSourceCodeMap[action.payload.studentId] = {
        code: action.payload.sourceCode,
        language: 'cpp',
      };
    },
    updateStudentSourceCodeMap: (
      state: ClassroomProps,
      action: PayloadAction<StudentIdSourceCodePair>,
    ) => {
      state.studentSourceCodeMap[action.payload.studentId] = {
        code: action.payload.sourceCode,
        language: 'cpp',
      };
    },
    removeFromStudentSourceCodeMap: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      delete state.studentSourceCodeMap[action.payload];
    },
    updateTeacherIsSharingScreen: (
      state: ClassroomProps,
      action: PayloadAction<boolean>,
    ) => {
      state.teacherIsSharingScreen = action.payload;
    },
    addToUserIdUsername: (
      state: ClassroomProps,
      action: PayloadAction<UserIdUsernamePair>,
    ) => {
      state.userIdUsernameMap[action.payload.userId] = action.payload.username;
    },
    removeFromUserIdUsernameMap: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      delete state.userIdUsernameMap[action.payload];
    },
    addToStudentMicrophoneMuteList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      state.studentMicrophoneMuteList[action.payload] = true;
    },
    removeFromStudentMicrophoneMuteList: (
      state: ClassroomProps,
      action: PayloadAction<number>,
    ) => {
      delete state.studentMicrophoneMuteList[action.payload];
    },
  },
});

export const {
  addToStudentList,
  removeFromStudentList,
  addToTeacherList,
  removeFromTeacherList,
  addToActiveStudentList,
  removeFromActiveStudentList,
  addToStudentSourceCodeMap,
} = classroomSlice.actions;

export default classroomSlice.reducer;
