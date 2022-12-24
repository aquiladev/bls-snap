/* eslint-disable jsdoc/require-jsdoc */
import { Mutex } from 'async-mutex';
import { Aggregator } from 'bls-wallet-clients';
import {
  BlsAccount,
  Erc20Token,
  Network,
  Operation,
  SnapState,
  Bundle,
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

    const _network = getNetwork(state, network.chainId);
    // eslint-disable-next-line no-negated-condition
    if (!_network) {
      if (!state.networks) {
        state.networks = [];
      }

      state.networks.push(network);
    } else {
      if (JSON.stringify(_network) === JSON.stringify(network)) {
        console.log(
          `upsertNetwork: same network and hence skip calling snap state update: ${JSON.stringify(
            _network,
          )}`,
        );
        return;
      }
      _network.name = network.name;
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

export function getNetworkByChainId(
  state: Partial<SnapState>,
  targerChainId?: number,
) {
  const chainId = targerChainId || ARBITRUM_GOERLI_NETWORK.chainId;
  const network = getNetwork(state, chainId);
  if (!network) {
    throw new Error(
      `can't find the network in snap state with chainId: ${chainId}`,
    );
  }

  console.log(
    `getNetworkByChainId: From ${targerChainId}:\n${JSON.stringify(network)}`,
  );
  return network;
}

export function getAccount(
  state: Partial<SnapState>,
  address: string,
  chainId: number,
) {
  return state.accounts?.find(
    (acc) =>
      acc.address.toLowerCase() === address.toLowerCase() &&
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
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    const _account = getAccount(state, account.address, account.chainId);
    if (_account) {
      if (JSON.stringify(_account) === JSON.stringify(account)) {
        console.log(
          `upsertAccount: same account and hence skip calling snap state update: ${JSON.stringify(
            _account,
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
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    const _erc20Token = getErc20Token(
      state,
      erc20Token.address,
      erc20Token.chainId,
    );
    if (_erc20Token) {
      if (JSON.stringify(_erc20Token) === JSON.stringify(erc20Token)) {
        console.log(
          `upsertErc20Token: same Erc20 token and hence skip calling snap state update: ${JSON.stringify(
            _erc20Token,
          )}`,
        );
        return;
      }
      _erc20Token.name = erc20Token.name;
      _erc20Token.symbol = erc20Token.symbol;
      _erc20Token.decimals = erc20Token.decimals;
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

export async function upsertOperation(
  op: Operation,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
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
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
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

export async function upsertBundle(
  bundle: Bundle,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    if (!state.bundles) {
      state.bundles = [];
    }

    let exists = false;
    state.bundles = state.bundles.map((t) => {
      if (t.bundleHash === bundle.bundleHash) {
        exists = true;
        return bundle;
      }
      return t;
    });

    if (!exists) {
      state.bundles.push(bundle);
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export async function getBundles(
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
): Promise<Bundle[]> {
  // eslint-disable-next-line array-callback-return
  const pendingBundles = (state.bundles || []).filter((t) => !t.blockNumber);
  for (const bundle of pendingBundles) {
    await checkBundleStatus(bundle, wallet, mutex, state);
  }

  return state.bundles || [];
}

async function checkBundleStatus(
  bundle: Bundle,
  wallet: any,
  mutex: Mutex,
  state: Partial<SnapState>,
) {
  const aggregator = new Aggregator(ARBITRUM_GOERLI_NETWORK.aggregator);
  const receipt = await aggregator.lookupReceipt(bundle.bundleHash);

  console.log('BUNDLE STATUS', bundle.bundleHash, receipt);
  if (receipt) {
    const _bundle: Bundle = {
      bundleHash: bundle.bundleHash,
      chainId: bundle.chainId,
    };
    if ('submitError' in receipt) {
      _bundle.error = receipt.submitError;
    } else {
      _bundle.transactionIndex = receipt.transactionIndex;
      _bundle.blockHash = receipt.blockHash;
      _bundle.blockNumber = receipt.blockNumber;
    }
    await upsertBundle(_bundle, wallet, mutex, state);
  }
}
