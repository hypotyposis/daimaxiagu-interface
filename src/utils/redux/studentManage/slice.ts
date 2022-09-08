import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { STUDENT_MANAGER_API_BASE } from '@/utils/config';

interface Class {
  id: number;
  name: string;
  students: Array<StudentProps>;
}

export interface StudentProps {
  id: number;
  username?: string;
  realname?: string;
}

interface StateProps {
  classList: Array<Class>;
  StudentRealnameMap: Record<number, string>;
}

const initialState: StateProps = {
  classList: [],
  StudentRealnameMap: {},
};

interface fetchClassesParams {
  id?: number;
  name?: string;
  students?: number;
}

interface addClassParams {
  name: string;
  students?: Array<number>;
}

interface modifyClassParams {
  id: number;
  name?: string;
  set_students?: Array<number>;
  add_students?: Array<number>;
  remove_students?: Array<number>;
}

interface setStudentRealnameParams {
  id: number;
  realname: string;
}

export const fetchStudentRealname = createAsyncThunk(
  'studentManage/fetchStudentRealname',
  async () => {
    const response = await axios({
      url: `${STUDENT_MANAGER_API_BASE}/v1/list_students_having_realname`,
      method: 'GET',
    }).then(response => response.data);
    return response;
  },
);

export const setStudentRealname = createAsyncThunk(
  'studentManage/setStudentRealname',
  async (args: setStudentRealnameParams) => {
    const response = axios({
      url: `${STUDENT_MANAGER_API_BASE}/v1/set_realname`,
      method: 'POST',
      data: args,
    }).then(response => response.data);
    return response;
  },
);

export const fetchClasses = createAsyncThunk(
  'studentManage/fetchClasses',
  async (args: fetchClassesParams) => {
    const response = await axios({
      url: `${STUDENT_MANAGER_API_BASE}/v1/class`,
      method: 'GET',
      params: args,
    }).then(response => response.data);
    return response;
  },
);

export const addClass = createAsyncThunk(
  'studentManage/addClass',
  async (args: addClassParams) => {
    const response = await axios({
      url: `${STUDENT_MANAGER_API_BASE}/v1/class`,
      method: 'POST',
      data: args,
    }).then(response => response.data);
    return response;
  },
);

export const modifyClass = createAsyncThunk(
  'studentManage/modifyClass',
  async (args: modifyClassParams) => {
    const response = await axios({
      url: `${STUDENT_MANAGER_API_BASE}/v1/class/${args.id}`,
      method: 'PUT',
      data: args,
    }).then(response => response.data);
    return response;
  },
);

export const studentManageSlice = createSlice({
  name: 'studentManageSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchClasses.fulfilled, (state, action) => {
      state.classList = action.payload.classes.map((data: Class) => {
        return {
          id: data.id,
          name: data.name,
          students: data.students,
        };
      });
    });
    builder.addCase(fetchStudentRealname.fulfilled, (state, action) => {
      action.payload.students.map((student: StudentProps) => {
        state.StudentRealnameMap[student.id] = student.realname!;
      });
    });
    builder.addCase(setStudentRealname.fulfilled, (state, action) => {
      return;
    });
  },
});

export default studentManageSlice.reducer;
