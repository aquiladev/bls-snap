import { createSlice } from '@reduxjs/toolkit';

export type UIState = {
  loader: {
    isLoading: boolean;
    loadingMessage: string;
  };
  infoModalVisible: boolean;
};

const initialState: UIState = {
  loader: {
    isLoading: false,
    loadingMessage: '',
  },
  infoModalVisible: false,
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
  },
});

export const { enableLoadingWithMessage, disableLoading, setInfoModalVisible } =
  networkSlice.actions;

export default networkSlice.reducer;
