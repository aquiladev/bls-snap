import { createSlice } from '@reduxjs/toolkit';

type UIState = {
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

const uiSlice = createSlice({
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
} = uiSlice.actions;

export default uiSlice.reducer;
