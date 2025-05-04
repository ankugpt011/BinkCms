// src/store/reducer/StoryUpdateSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  refreshCount: 0,
  lastUpdatedStoryId: null,
  lastAction: null, // 'PRIVATE' or 'PUBLISHED'
};

const StoryUpdateSlice = createSlice({
  name: 'storyUpdate',
  initialState,
  reducers: {
    triggerStoryRefresh: (state, action) => {
      console.log('')
      state.refreshCount += 1;
      state.lastUpdatedStoryId = action.payload.id;
      state.lastAction = action.payload.action;
    },
    resetStoryUpdate: (state) => {
      return initialState;
    },
  },
});

export const { triggerStoryRefresh, resetStoryUpdate } = StoryUpdateSlice.actions;
export default StoryUpdateSlice.reducer;