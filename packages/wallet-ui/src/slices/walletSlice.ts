import { createSlice } from '@reduxjs/toolkit';
import { Operation, Bundle } from 'bls-snap/src/types/snapState';
import { BigNumber } from 'ethers';
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
      state.accounts = Array.isArray(payload) ? payload : [payload];
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
      // TODO: currently there is no chainId in the payload,
      // so we need to update it in order to support new structure
      if (state.erc20TokenBalanceSelected.chainId === payload.chainId) {
        const foundIndex = state.erc20TokenBalances.findIndex(
          (token) =>
            BigNumber.from(token.address).eq(BigNumber.from(payload.address)) &&
            token.chainId === payload.chainId,
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
    setOperations: (state, { payload }) => {
      state.operations = (payload || []).reverse();
    },
    addOperation: (state, { payload }) => {
      state.operations = [payload, ...state.operations];
    },
    removeOperations: (state, { payload }) => {
      const _operations = Array(payload).flat();
      state.operations = state.operations.filter((o) => {
        return !_operations.find((op) => op.id === o.id);
      });
    },
    setBundles: (state, { payload }) => {
      state.bundles = (payload || []).reverse();
    },
    addBundle: (state, { payload }) => {
      state.bundles = [payload, ...state.bundles];
    },
    updateBundle: (state, { payload }) => {
      state.bundles = state.bundles.map((bundle) => {
        if (bundle.bundleHash === payload.bundleHash) {
          return { ...bundle, ...payload };
        }
        return bundle;
      });
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
  setOperations,
  addOperation,
  removeOperations,
  setBundles,
  addBundle,
  updateBundle,
} = walletSlice.actions;

export default walletSlice.reducer;
