/* eslint-disable jsdoc/require-jsdoc */
import { Mutex } from 'async-mutex';
import {
  BlsAccount,
  Erc20Token,
  Network,
  Operation,
  SnapState,
} from '../types/snapState';
import { ARBITRUM_GOERLI_NETWORK } from './constants';

export async function upsertNetwork(
  network: Network,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  console.log('NET', network);
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    const storedNetwork = getNetwork(state, network.chainId);
    // eslint-disable-next-line no-negated-condition
    if (!storedNetwork) {
      if (!state.networks) {
        state.networks = [];
      }

      state.networks.push(network);
    } else {
      if (JSON.stringify(storedNetwork) === JSON.stringify(network)) {
        console.log(
          `upsertNetwork: same network and hence skip calling snap state update: ${JSON.stringify(
            storedNetwork,
          )}`,
        );
        return;
      }
      storedNetwork.name = network.name;
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getNetwork(state: Partial<SnapState>, chainId: string) {
  return state.networks?.find(
    (network) => Number(network.chainId) === Number(chainId),
  );
}

export function getNetworks(state: Partial<SnapState>) {
  return state.networks;
}

export function getNetworkFromChainId(
  state: Partial<SnapState>,
  targerChainId: string | undefined,
) {
  const chainId = targerChainId || ARBITRUM_GOERLI_NETWORK.chainId;
  const network = getNetwork(state, chainId);
  if (!network) {
    throw new Error(
      `can't find the network in snap state with chainId: ${chainId}`,
    );
  }

  console.log(
    `getNetworkFromChainId: From ${targerChainId}:\n${JSON.stringify(network)}`,
  );
  return network;
}

export function getErc20Token(
  state: Partial<SnapState>,
  tokenAddress: string,
  chainId: string,
) {
  return state.erc20Tokens?.find(
    (token) =>
      token.address.toLowerCase() === tokenAddress.toLowerCase() &&
      Number(token.chainId) === Number(chainId),
  );
}

export function getErc20Tokens(state: Partial<SnapState>, chainId: string) {
  return state.erc20Tokens?.filter(
    (token) => Number(token.chainId) === Number(chainId),
  );
}

export async function upsertErc20Token(
  erc20Token: Erc20Token,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    const storedErc20Token = getErc20Token(
      state,
      erc20Token.address,
      erc20Token.chainId,
    );
    if (storedErc20Token) {
      if (JSON.stringify(storedErc20Token) === JSON.stringify(erc20Token)) {
        console.log(
          `upsertErc20Token: same Erc20 token and hence skip calling snap state update: ${JSON.stringify(
            storedErc20Token,
          )}`,
        );
        return;
      }
      storedErc20Token.name = erc20Token.name;
      storedErc20Token.symbol = erc20Token.symbol;
      storedErc20Token.decimals = erc20Token.decimals;
    } else {
      if (!state.erc20Tokens) {
        state.erc20Tokens = [];
      }
      state.erc20Tokens.push(erc20Token);
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getAccount(
  state: Partial<SnapState>,
  accountAddress: string,
  chainId: string,
) {
  return state.accounts?.find(
    (acc) =>
      acc.address.toLowerCase() === accountAddress.toLowerCase() &&
      Number(acc.chainId) === Number(chainId),
  );
}

export function getAccounts(state: Partial<SnapState>, chainId: string) {
  return state.accounts?.filter(
    (acc) => Number(acc.chainId) === Number(chainId),
  );
}

export async function upsertAccount(
  account: BlsAccount,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    const storedAccount = getAccount(state, account.address, account.chainId);
    if (storedAccount) {
      if (JSON.stringify(storedAccount) === JSON.stringify(account)) {
        console.log(
          `upsertAccount: same account and hence skip calling snap state update: ${JSON.stringify(
            storedAccount,
          )}`,
        );
        return;
      }
    } else {
      if (!state.accounts) {
        state.accounts = [];
      }

      state.accounts.push(account);
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export async function upsertOperation(
  op: Operation,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    if (!state.ops) {
      state.ops = [];
    }

    state.ops.push(op);

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}
