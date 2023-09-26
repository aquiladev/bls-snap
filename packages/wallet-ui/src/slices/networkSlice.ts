import { createSlice } from '@reduxjs/toolkit';
import { Network } from '../types';

type NetworkState = {
  items: Network[];
  activeNetwork: number;
};

const initialState: NetworkState = {
  items: [],
  activeNetwork: 0,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworks: (state, action) => {
      state.items = action.payload;
    },
    setActiveNetwork: (state, action) => {
      state.activeNetwork = action.payload;
    },
    resetNetwork: () => {
      return {
        ...initialState,
      };
    },
  },
});

export const { setNetworks, setActiveNetwork, resetNetwork } =
  networkSlice.actions;

export default networkSlice.reducer;
