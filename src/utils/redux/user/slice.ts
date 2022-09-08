import { v4 } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@/types/auth.d';

interface UserState {
  username: string | undefined;
  userId: number | undefined;
  userRole: UserRole;
  deviceUID: string;
  jwt: string | undefined;
}

const initialState: UserState = {
  username: undefined,
  userId: undefined,
  userRole: UserRole.ANONYMOUS,
  deviceUID: v4(),
  jwt: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setJWT: (state, action: PayloadAction<string | undefined>) => {
      state.jwt = action.payload;
    },
    setUserInfo: (
      state,
      action: PayloadAction<{
        username: string;
        userId: number;
        userRole: UserRole;
      }>,
    ) => {
      state.userRole = action.payload.userRole;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    touchDeviceUID: state => {
      if (state.deviceUID === undefined) {
        state.deviceUID = v4();
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setJWT, setUserInfo, touchDeviceUID } = userSlice.actions;

export default userSlice.reducer;
