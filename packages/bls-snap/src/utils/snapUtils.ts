/* eslint-disable jsdoc/require-jsdoc */
import { Mutex } from 'async-mutex';
import { Aggregator } from 'bls-wallet-clients';
import {
  BlsAccount,
  Erc20Token,
  Network,
  Operation,
  SnapState,
  Transaction,
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

export function getNetwork(state: Partial<SnapState>, chainId: number) {
  return state.networks?.find((network) => network.chainId === chainId);
}

export function getNetworks(state: Partial<SnapState>) {
  return state.networks;
}

export function getNetworkFromChainId(
  state: Partial<SnapState>,
  targerChainId: number | undefined,
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
  chainId: number,
) {
  return state.erc20Tokens?.find(
    (token) =>
      token.address.toLowerCase() === tokenAddress.toLowerCase() &&
      token.chainId === chainId,
  );
}

export function getErc20Tokens(state: Partial<SnapState>, chainId: number) {
  return state.erc20Tokens?.filter((token) => token.chainId === chainId);
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
  chainId: number,
) {
  return state.accounts?.find(
    (acc) =>
      acc.address.toLowerCase() === accountAddress.toLowerCase() &&
      acc.chainId === chainId,
  );
}

export function getAccounts(state: Partial<SnapState>, chainId: number) {
  return state.accounts?.filter((acc) => acc.chainId === chainId);
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

export async function cleanOperations(
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

    // eslint-disable-next-line require-atomic-updates
    state.ops = [];

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getOperations(state: Partial<SnapState>): Operation[] {
  return state.ops || [];
}

export async function upsertTransaction(
  tx: Transaction,
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

    if (!state.transactions) {
      state.transactions = [];
    }

    let exists = false;
    state.transactions = state.transactions.map((t) => {
      if (t.txHash === tx.txHash) {
        exists = true;
        return tx;
      }
      return t;
    });

    if (!exists) {
      state.transactions.push(tx);
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export async function getTransactions(
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
): Promise<Transaction[]> {
  // eslint-disable-next-line array-callback-return
  const pendingTxs = (state.transactions || []).filter((t) => !t.blockNumber);
  for (const tx of pendingTxs) {
    await checkTxStatus(tx, wallet, mutex, state);
  }

  return state.transactions || [];
}

async function checkTxStatus(
  tx: Transaction,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  const aggregator = new Aggregator(ARBITRUM_GOERLI_NETWORK.aggregator);
  const maybeReceipt = await aggregator.lookupReceipt(tx.txHash);

  console.log('TX STATUS', tx.txHash, maybeReceipt);
  if (maybeReceipt) {
    await upsertTransaction(
      {
        txHash: tx.txHash,
        chainId: tx.chainId,
        transactionIndex: maybeReceipt.transactionIndex,
        blockHash: maybeReceipt.blockHash,
        blockNumber: maybeReceipt.blockNumber,
      },
      wallet,
      mutex,
      state,
    );
  }
}
