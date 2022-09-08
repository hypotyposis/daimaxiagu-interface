import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { CODERUNNER_API_BASE } from '@/utils/config';

export type GameStatus =
  | 'COMPILE FAILURE'
  | 'RUNTIME ERROR'
  | 'RUNTIME TERMINATED'
  | 'GAME NOT PASS'
  | 'GAME PASS';

export interface CodeSubmission {
  id: number;
  authorId: number;
  authorName: string;
  collectionId: string;
  collectionName: string;
  levelId: string;
  levelName: string;
  CPUTimeCost: number;
  realTimeCost: number;
  language: string;
  memoryCost: number;
  status: GameStatus;
  submitDate: string;
  sourceCode: string;
  gameResult: number;
}

interface StateProps {
  codeSubmissionList: Array<CodeSubmission>;
}

const initialState: StateProps = {
  codeSubmissionList: [],
};

// First, create the thunk
export const fetchCodeSubmissions = createAsyncThunk(
  'codeSubmission/fetchCodeSubmissions',
  async () => {
    const response = await axios({
      url: `${CODERUNNER_API_BASE}/code_submissions`,
      method: 'GET',
    }).then(response => response.data);
    return response;
  },
);

export const fetchCodeSubmissionsByUsername = createAsyncThunk(
  'codeSubmission/fetchCodeSubmissionsByUsername',
  async (username: string) => {
    const response = await axios({
      url: `${CODERUNNER_API_BASE}/code_submissions`,
      params: { username },
      method: 'GET',
    }).then(response => response.data);
    return response;
  },
);

export interface ISubmittionMessage {
  author_id: number;
  author_name: string;
  collection_id: string;
  collection_name: string;
  cpu_time_cost: number;
  game_result: number;
  id: number;
  language: string;
  level_id: string;
  level_name: string;
  memory_cost: number;
  real_time_cost: number;
  source_code: string;
  status: string;
  submit_date: string;
  uuid: string;
}

export const codeSubmissionSlice = createSlice({
  name: 'codeSubmissionSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCodeSubmissions.fulfilled, (state, action) => {
      state.codeSubmissionList = action.payload.message.map(
        (data: ISubmittionMessage): CodeSubmission => {
          return {
            id: data.id,
            authorId: data.author_id,
            authorName: data.author_name,
            collectionId: data.collection_id,
            collectionName: data.collection_name,
            levelId: data.level_id,
            levelName: data.level_name,
            language: data.language,
            CPUTimeCost: data.cpu_time_cost,
            realTimeCost: data.real_time_cost,
            memoryCost: data.memory_cost,
            status: (data.status === 'RUNTIME COMPLETE'
              ? { 0: 'GAME PASS', 1: 'GAME NOT PASS' }[data.game_result] ??
                data.status
              : data.status) as GameStatus,
            submitDate: data.submit_date,
            sourceCode: data.source_code,
            gameResult: data.game_result
          };
        },
      );
    });
    builder.addCase(
      fetchCodeSubmissionsByUsername.fulfilled,
      (state, action) => {
        state.codeSubmissionList = action.payload.message.map(
          (data: ISubmittionMessage): CodeSubmission => {
            return {
              id: data.id,
              authorId: data.author_id,
              authorName: data.author_name,
              collectionId: data.collection_id,
              collectionName: data.collection_name,
              levelId: data.level_id,
              levelName: data.level_name,
              language: data.language,
              CPUTimeCost: data.cpu_time_cost,
              realTimeCost: data.real_time_cost,
              memoryCost: data.memory_cost,
              status: (data.status === 'RUNTIME COMPLETE'
                ? { 0: 'GAME PASS', 1: 'GAME NOT PASS' }[data.game_result] ??
                  data.status
                : data.status) as GameStatus,
              submitDate: data.submit_date,
              sourceCode: data.source_code,
              gameResult: data.game_result
            };
          },
        );
      },
    );
  },
});

export default codeSubmissionSlice.reducer;
