import { createSlice } from '@reduxjs/toolkit';
import { Operation, Bundle } from 'bls-snap/src/types/snapState';
import { ethers } from 'ethers';
import { Account, Erc20TokenBalance } from '../types';

export type WalletState = {
  connected: boolean;
  isLoading: boolean;
  forceReconnect: boolean;
  accounts: Account[];
  erc20TokenBalances: Erc20TokenBalance[];
  erc20TokenBalanceSelected: Erc20TokenBalance;
  operations: Operation[];
  bundles: Bundle[];
};

const initialState: WalletState = {
  connected: false,
  isLoading: false,
  forceReconnect: false,
  accounts: [],
  erc20TokenBalances: [],
  erc20TokenBalanceSelected: {} as Erc20TokenBalance,
  operations: [],
  bundles: [],
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
    setAccounts: (state, { payload }) => {
      if (Array.isArray(payload)) {
        state.accounts = payload.map((account) => account);
      } else {
        state.accounts.push(payload);
      }
    },
    resetWallet: () => {
      return {
        ...initialState,
        forceReconnect: true,
      };
    },
    setErc20TokenBalances: (state, { payload }) => {
      state.erc20TokenBalances = payload;
    },
    setErc20TokenBalanceSelected: (state, { payload }) => {
      state.erc20TokenBalanceSelected = payload;
    },
    upsertErc20TokenBalance: (state, { payload }) => {
      // only update erc20TokenBalances if same chainId as selected token
      if (state.erc20TokenBalanceSelected.chainId === payload.chainId) {
        const foundIndex = state.erc20TokenBalances.findIndex(
          (token) =>
            ethers.BigNumber.from(token.address).eq(
              ethers.BigNumber.from(payload.address),
            ) &&
            ethers.BigNumber.from(token.chainId).eq(
              ethers.BigNumber.from(payload.chainId),
            ),
        );
        if (foundIndex < 0) {
          state.erc20TokenBalances.push(payload);
        } else {
          state.erc20TokenBalances[foundIndex].amount = payload.amount;
          state.erc20TokenBalances[foundIndex].usdPrice = payload.usdPrice;

          if (
            state.erc20TokenBalanceSelected.address ===
              state.erc20TokenBalances[foundIndex].address &&
            state.erc20TokenBalanceSelected.chainId ===
              state.erc20TokenBalances[foundIndex].chainId
          ) {
            state.erc20TokenBalanceSelected.amount =
              state.erc20TokenBalances[foundIndex].amount;

            state.erc20TokenBalanceSelected.usdPrice =
              state.erc20TokenBalances[foundIndex].usdPrice;
          }
        }
      }
    },
    addOperation: (state, { payload }) => {
      state.operations = [...state.operations, payload];
    },
    cleanOperations: (state) => {
      state.operations = [];
    },
    setBundles: (state, { payload }) => {
      state.bundles = payload;
    },
    addBundle: (state, { payload }) => {
      state.bundles = [...state.bundles, payload];
    },
  },
});

export const {
  setWalletConnection,
  setForceReconnect,
  setAccounts,
  resetWallet,
  setErc20TokenBalances,
  setErc20TokenBalanceSelected,
  upsertErc20TokenBalance,
  addOperation,
  cleanOperations,
  setBundles,
  addBundle,
} = walletSlice.actions;

export default walletSlice.reducer;
