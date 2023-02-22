import { createSlice } from '@reduxjs/toolkit';

export type UIState = {
  loader: {
    isLoading: boolean;
    loadingMessage: string;
  };
  infoModalVisible: boolean;
  addTokenModalVisible: boolean;
};

const initialState: UIState = {
  loader: {
    isLoading: false,
    loadingMessage: '',
  },
  infoModalVisible: false,
  addTokenModalVisible: false,
};

export const networkSlice = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    enableLoadingWithMessage: (state, action) => {
      state.loader.isLoading = true;
      state.loader.loadingMessage = action.payload;
    },
    disableLoading: (state) => {
      state.loader.isLoading = false;
      state.loader.loadingMessage = '';
    },
    setInfoModalVisible: (state, action) => {
      state.infoModalVisible = action.payload;
    },
    setAddTokenModalVisible: (state, action) => {
      state.addTokenModalVisible = action.payload;
    },
  },
});

export const {
  enableLoadingWithMessage,
  disableLoading,
  setInfoModalVisible,
  setAddTokenModalVisible,
} = networkSlice.actions;

export default networkSlice.reducer;
