import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoomProps {
  id: string;
  sessionId: string;
}

const initialState: RoomProps = {
  id: '',
  sessionId: '',
};

export const roomSlice = createSlice({
  name: 'multiplayerRoom',
  initialState,
  reducers: {
    set: (state: RoomProps, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setSessionId: (state: RoomProps, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    clear: (state: RoomProps) => {
      state.id = '';
      state.sessionId = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { set, clear } = roomSlice.actions;

export default roomSlice.reducer;
