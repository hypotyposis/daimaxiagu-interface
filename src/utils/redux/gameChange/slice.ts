import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Change {
  change: string;
  id: string;
}

interface ChangeListProps {
  array: Array<Change>;
}

const initialState: ChangeListProps = {
  array: [],
};

export const changeListSlice = createSlice({
  name: 'changeList',
  initialState,
  reducers: {
    push: (state: ChangeListProps, action: PayloadAction<Change>) => {
      state.array.push(action.payload);
    },
    pop: (state: ChangeListProps) => {
      state.array.pop();
    },
    clear: (state: ChangeListProps) => {
      state.array = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { push, pop } = changeListSlice.actions;

export default changeListSlice.reducer;
