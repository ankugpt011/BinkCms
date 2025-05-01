// src/redux/slices/MetaDataSlice.js

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  locations: [],
  tags: [],
  config: [],
};

const MetaDataSlice = createSlice({
  name: 'metaData',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setLocations(state, action) {
      state.locations = action.payload;
    },
    setTags(state, action) {
      state.tags = action.payload;
    },
    setConfigs(state, action) {
      state.config = action.payload;
    },
  },
});

export const {setCategories, setLocations, setTags, setConfigs} =
  MetaDataSlice.actions;

export default MetaDataSlice.reducer;
