/* eslint-disable jsdoc/require-jsdoc */
import deepEqual from 'deep-equal';
import { Mutex } from 'async-mutex';
import { utils } from 'ethers';
import {
  BlsAccount,
  Erc20Token,
  Network,
  Action,
  SnapState,
  Bundle,
} from '../types/snapState';
import { AddErc20TokenRequestParams } from '../types/snapApi';
import { getPrivateKey } from './crypto';
import { getBundleReceipt } from './blsUtils';
import * as config from './config';

export const DEFAULT_DECIMALS = 18;
export const MAX_TOKEN_NAME_LENGTH = 64;
export const MAX_TOKEN_SYMBOL_LENGTH = 16;

function hasOnlyAsciiChars(value: string) {
  // eslint-disable-next-line require-unicode-regexp
  return /^[ -~]+$/.test(value);
}

function isValidAscii(value: string, maxLength: number) {
  return (
    hasOnlyAsciiChars(value) &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

export function validateAddErc20TokenParams(
  params: AddErc20TokenRequestParams,
) {
  if (!utils.isAddress(params.tokenAddress)) {
    throw new Error(
      `The given token address is invalid: ${params.tokenAddress}`,
    );
  }

  const network = config.getNetwork(params.chainId);
  if (!network) {
    throw new Error(`ChainId not supported: ${params.chainId}`);
  }

  if (!isValidAscii(params.tokenName, MAX_TOKEN_NAME_LENGTH)) {
    throw new Error(
      `The given token name is invalid, needs to be in ASCII chars, not all spaces, and has length larger than ${MAX_TOKEN_NAME_LENGTH}: ${params.tokenName}`,
    );
  }

  if (!isValidAscii(params.tokenSymbol, MAX_TOKEN_SYMBOL_LENGTH)) {
    throw new Error(
      `The given token symbol is invalid, needs to be in ASCII chars, not all spaces, and has length larger than ${MAX_TOKEN_SYMBOL_LENGTH}: ${params.tokenSymbol}`,
    );
  }
}

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
      if (deepEqual(_network, network)) {
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
      if (deepEqual(_account, account)) {
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

export async function addTestToken(
  network: Network,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  if (!network?.config?.addresses?.testToken) {
    return;
  }

  const token: Erc20Token = {
    address: network.config.addresses.testToken,
    name: 'AnyToken',
    symbol: 'TOK',
    decimals: 18,
    isInternal: true,
  };
  await upsertErc20Token(token, network.chainId, wallet, mutex, state);
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
      if (deepEqual(_erc20Token, erc20Token)) {
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

export async function deleteErc20Token(
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

    state[chainId].erc20Tokens = state[chainId].erc20Tokens.filter((t) => {
      return t.address !== erc20Token.address;
    });

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

export async function insertAction(
  action: Action,
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

    if (!state[chainId]?.actions) {
      state[chainId].actions = [];
    }

    // insert
    state[chainId].actions?.push(action);

    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  });
}

export function getActions(
  senderAddress: string,
  chainId: number,
  state: SnapState,
): Action[] | undefined {
  return state[chainId]?.actions?.filter(
    (action) =>
      action.senderAddress.toLowerCase() === senderAddress.toLowerCase(),
  );
}

export async function removeActions(
  actions: Action[],
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

    state[chainId].actions = state[chainId].actions?.filter((action) => {
      return !actions.find((a) => a.id === action.id);
    });

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

export function getBundles(
  senderAddress: string,
  chainId: number,
  state: SnapState,
): Bundle[] | undefined {
  return state[chainId]?.bundles?.filter(
    (bundle) =>
      bundle.senderAddress.toLowerCase() === senderAddress.toLowerCase(),
  );
}

export async function getBundle(
  bundleHash: string,
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
): Promise<Bundle> {
  const bundle = state[chainId]?.bundles?.find(
    (bundle) => bundle.bundleHash === bundleHash,
  );
  if (!bundle) {
    throw new Error(`Bundle not found ${bundleHash}`);
  }

  if (!bundle?.blockNumber) {
    await updateBundleStatus(bundle, chainId, wallet, mutex, state);
  }

  return bundle;
}

export async function updateBundleStatus(
  bundle: Bundle,
  chainId: number,
  wallet: any,
  mutex: Mutex,
  state: SnapState,
) {
  const network = config.getNetwork(chainId);
  const receipt = await getBundleReceipt(network, bundle.bundleHash);

  console.log('BUNDLE STATUS', bundle.bundleHash, receipt);
  if (receipt) {
    if ('submitError' in receipt) {
      bundle.error = receipt.submitError;
    } else {
      bundle.transactionIndex = receipt.transactionIndex;
      bundle.transactionHash = receipt.transactionHash;
      bundle.blockHash = receipt.blockHash;
      bundle.blockNumber = receipt.blockNumber;
    }
    await upsertBundle(bundle, chainId, wallet, mutex, state);
  }
}

export const getValidNumber = (
  obj,
  defaultValue: number,
  minVal: number = Number.MIN_SAFE_INTEGER,
  maxVal: number = Number.MAX_SAFE_INTEGER,
) => {
  const toNum = Number(obj);
  return obj === '' || isNaN(toNum) || toNum > maxVal || toNum < minVal
    ? defaultValue
    : toNum;
};

export const getNextAddressIndex = (
  chainId: number,
  state: SnapState,
  derivationPath: string,
) => {
  const accounts = (getAccounts(chainId, state) || []).filter(
    (acc) => acc.derivationPath === derivationPath && acc.addressIndex >= 0,
  );
  console.log(
    `getNextAddressIndex:\nAccount found from state:\n${JSON.stringify(
      accounts,
    )}`,
  );
  return accounts.length;
};

export const getKeysFromAddressIndex = async (
  keyDeriver,
  chainId: number,
  state: SnapState,
  index: number = undefined,
) => {
  let addressIndex = index;
  if (isNaN(addressIndex) || addressIndex < 0) {
    addressIndex = getNextAddressIndex(chainId, state, keyDeriver.path);
    console.log(`getKeysFromAddressIndex: addressIndex found: ${addressIndex}`);
  }

  return getPrivateKey(keyDeriver, addressIndex);
};

function assertNetwork(chainId: number, state: SnapState) {
  if (!state[chainId]) {
    throw new Error(
      `can't find the network in snap state with chainId: ${chainId}`,
    );
  }
}
