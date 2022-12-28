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
  state: SnapState,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    const _network = getNetwork(network.chainId, state);
    if (_network) {
      if (JSON.stringify(_network) === JSON.stringify(network)) {
        console.log(
          `upsertNetwork: same network and hence skip calling snap state update: ${JSON.stringify(
            _network,
          )}`,
        );
        return;
      }
      _network.name = network.name;
    } else {
      if (!state) {
        // eslint-disable-next-line no-param-reassign
        state = {};
      }

      state[network.chainId] = network;
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getNetwork(chainId: number, state: SnapState) {
  return state[chainId];
}

export function getNetworks(state: SnapState) {
  return state;
}

export async function upsertAccount(
  account: BlsAccount,
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    assertNetwork(chainId, state);

    const _account = getAccount(account.address, chainId, state);
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
      if (!state[chainId].accounts) {
        state[chainId].accounts = [];
      }
      state[chainId].accounts?.push(account);
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getAccount(
  address: string,
  chainId: number,
  state: SnapState,
): BlsAccount | undefined {
  return (state[chainId]?.accounts || []).find(
    (acc) => acc.address.toLowerCase() === address.toLowerCase(),
  );
}

export function getAccounts(
  chainId: number,
  state: SnapState,
): BlsAccount[] | undefined {
  return state[chainId]?.accounts;
}

export async function upsertErc20Token(
  erc20Token: Erc20Token,
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    assertNetwork(chainId, state);

    const _erc20Token = getErc20Token(erc20Token.address, chainId, state);
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
      if (!state[chainId].erc20Tokens) {
        state[chainId].erc20Tokens = [];
      }
      state[chainId].erc20Tokens?.push(erc20Token);
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getErc20Token(
  tokenAddress: string,
  chainId: number,
  state: SnapState,
): Erc20Token | undefined {
  return state[chainId]?.erc20Tokens?.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
  );
}

export function getErc20Tokens(
  chainId: number,
  state: SnapState,
): Erc20Token[] | undefined {
  return state[chainId]?.erc20Tokens;
}

export async function upsertOperation(
  operation: Operation,
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    assertNetwork(chainId, state);

    if (!state[chainId]?.operations) {
      state[chainId].operations = [];
    }

    state[chainId].operations?.push(operation);

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getOperations(
  chainId: number,
  state: SnapState,
): Operation[] | undefined {
  return state[chainId]?.operations;
}

export async function cleanOperations(
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    assertNetwork(chainId, state);

    state[chainId].operations = [];

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export async function upsertBundle(
  bundle: Bundle,
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  return mutex.runExclusive(async () => {
    if (!state) {
      // eslint-disable-next-line require-atomic-updates, no-param-reassign
      state = await wallet.request({
        method: 'snap_manageState',
        params: ['get'],
      });
    }

    assertNetwork(chainId, state);

    if (!state[chainId]?.bundles) {
      state[chainId].bundles = [];
    }

    let exists = false;
    state[chainId].bundles = state[chainId].bundles?.map((b) => {
      if (b.bundleHash === bundle.bundleHash) {
        exists = true;
        return bundle;
      }
      return b;
    });

    if (!exists) {
      state[chainId].bundles?.push(bundle);
    }

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export async function getBundles(
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
): Promise<Bundle[] | undefined> {
  const pendingBundles = (state[chainId]?.bundles || []).filter(
    (b) => !b.blockNumber,
  );
  for (const bundle of pendingBundles) {
    await checkBundleStatus(bundle, chainId, wallet, mutex, state);
  }

  return state[chainId]?.bundles;
}

export async function checkBundleStatus(
  bundle: Bundle,
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  const aggregator = new Aggregator(ARBITRUM_GOERLI_NETWORK.aggregator);
  const receipt = await aggregator.lookupReceipt(bundle.bundleHash);

  console.log('BUNDLE STATUS', bundle.bundleHash, receipt);
  if (receipt) {
    if ('submitError' in receipt) {
      bundle.error = receipt.submitError;
    } else {
      bundle.transactionIndex = receipt.transactionIndex;
      bundle.blockHash = receipt.blockHash;
      bundle.blockNumber = receipt.blockNumber;
    }
    await upsertBundle(bundle, chainId, wallet, mutex, state);
  }
}

function assertNetwork(chainId: number, state: SnapState) {
  if (!state[chainId]) {
    throw new Error(
      `can't find the network in snap state with chainId: ${chainId}`,
    );
  }
}
