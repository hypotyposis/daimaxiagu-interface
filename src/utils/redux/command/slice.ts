import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommandListProps {
  array: Array<string>;
}

const initialState: CommandListProps = {
  array: [],
};

export const commandListSlice = createSlice({
  name: 'commandList',
  initialState,
  reducers: {
    push: (state: CommandListProps, action: PayloadAction<string>) => {
      state.array.push(action.payload);
    },
    pop: (state: CommandListProps) => {
      state.array.pop();
    },
    clear: (state: CommandListProps) => {
      state.array = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { push, pop } = commandListSlice.actions;

export default commandListSlice.reducer;
