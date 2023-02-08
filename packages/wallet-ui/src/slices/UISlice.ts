import { createSlice } from '@reduxjs/toolkit';

export type UIState = {
  loader: {
    isLoading: boolean;
    loadingMessage: string;
  };
  newAccountDetailsInfoModal: {
    visible: boolean;
  };
};

const initialState: UIState = {
  loader: {
    isLoading: false,
    loadingMessage: '',
  },
  newAccountDetailsInfoModal: {
    visible: false,
  },
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
    showNewAccountDetailsInfoModal: (state) => {
      state.newAccountDetailsInfoModal.visible = true;
    },
    hideNewAccountDetailsInfoModal: (state) => {
      state.newAccountDetailsInfoModal.visible = false;
    },
  },
});

export const {
  enableLoadingWithMessage,
  disableLoading,
  showNewAccountDetailsInfoModal,
  hideNewAccountDetailsInfoModal,
} = networkSlice.actions;

export default networkSlice.reducer;
