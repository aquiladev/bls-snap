import { createSlice } from '@reduxjs/toolkit';

export type WalletState = {
  connected: boolean;
  isLoading: boolean;
  forceReconnect: boolean;
};

const initialState: WalletState = {
  connected: false,
  isLoading: false,
  forceReconnect: false,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletConnection: (state, { payload }) => {
      state.connected = payload;
    },
    setForceReconnect: (state, { payload }) => {
      state.forceReconnect = payload;
    },
    resetWallet: () => {
      return {
        ...initialState,
        forceReconnect: true,
      };
    },
  },
});

export const { setWalletConnection, setForceReconnect, resetWallet } =
  walletSlice.actions;

export default walletSlice.reducer;
