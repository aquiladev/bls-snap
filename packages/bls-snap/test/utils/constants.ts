import * as bls from 'bls-wallet-clients';
import { BundleReceipt } from 'bls-wallet-clients/dist/src/Aggregator';
import { BigNumber } from 'ethers';
import {
  BlsAccount,
  Bundle,
  Erc20Token,
  Network,
  Action,
} from '../../src/types/snapState';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DUMMY1_ADDRESS = '0x0000000000000000000000000000000000000001';
export const DUMMY2_ADDRESS = '0x0000000000000000000000000000000000000002';

export const TEST_CHAIN_ID_ZERO = 111;
export const TEST_CHAIN_ID_ONE = 222;
export const TEST_CHAIN_ID_UNKNOWN = 999;

export const TEST_NETWORK_ZERO: Network = {
  name: 'Testnet0',
  chainId: TEST_CHAIN_ID_ZERO,
  rpcUrl: 'https://testnet0-rpc.com',
  aggregator: 'https://testnet0-aggregator.com',
  config: {
    addresses: {
      verificationGateway: ZERO_ADDRESS,
    },
  } as bls.NetworkConfig,
};

export const TEST_NETWORK_ONE: Network = {
  name: 'Testnet1',
  chainId: TEST_CHAIN_ID_ONE,
  rpcUrl: 'https://testnet1-rpc.com',
  aggregator: 'https://testnet1-aggregator.com',
  config: {
    addresses: {
      verificationGateway: ZERO_ADDRESS,
    },
  } as bls.NetworkConfig,
};

export const PRIVATE_KEY_ZERO: {
  privateKey: string;
  derivationPath: any;
  addressIndex: number;
} = {
  privateKey:
    '0x0001020304050607080910111213141516171819202122232425262728293031',
  derivationPath: `m / bip32:0' / bip32:0' / bip32:0' / bip32:0'`,
  addressIndex: 0,
};

export const ACCOUNT_ZERO: BlsAccount = {
  address: '0xCCb80EE6f58cC9e87C8032BD908C59F475CCc435',
  publicKey:
    '0x188600fb097ab6b8558c03d2f51d28888925b0dc03221684cbc535cce965f5e31c111ba1d2d3f7f6bf2318128a1622b6064012236a0bd43fddc14733791134bd032bd517a7a5b4cd72b892418a57008f6809a3206b2b22c0e987241bf7b13bdb03f98163f6d4609455f12d20857a8137ab99861c7abac67c93cdd1fe76215b53',
  ...PRIVATE_KEY_ZERO,
};

export const BLS_ACCOUNT_ZERO: bls.BlsWalletWrapper = {
  address: ACCOUNT_ZERO.address,
  privateKey: ACCOUNT_ZERO.privateKey,
  PublicKeyStr: () => ACCOUNT_ZERO.publicKey,
  Nonce: () => Promise.resolve(BigNumber.from(0)),
  sign: (_: bls.Operation) => {
    return {} as bls.Bundle;
  },
} as bls.BlsWalletWrapper;

export const ERC20_TOKEN_ZERO: Erc20Token = {
  address: DUMMY1_ADDRESS,
  name: 'TestToken0',
  symbol: 'TT0',
  decimals: 18,
  isInternal: false,
};

export const ERC20_TOKEN_ONE: Erc20Token = {
  address: DUMMY2_ADDRESS,
  name: 'TestToken1',
  symbol: 'TT1',
  decimals: 18,
  isInternal: true,
};

export const ACTION_ZERO: Action = {
  id: 'id_0',
  value: 0,
  contractAddress: ERC20_TOKEN_ZERO.address,
  senderAddress: ACCOUNT_ZERO.address,
  encodedFunction: '0x',
  createdAt: 0,
};

export const ACTION_ONE: Action = {
  id: 'id_1',
  value: 0,
  contractAddress: ERC20_TOKEN_ONE.address,
  senderAddress: ACCOUNT_ZERO.address,
  encodedFunction: '0x',
  createdAt: 1,
};

export const BUNDLE_HASH_ZERO = '0x1234';

export const BUNDLE_ZERO: Bundle = {
  bundleHash: BUNDLE_HASH_ZERO,
  senderAddress: ACCOUNT_ZERO.address,
  nonce: 0,
  actions: [ACTION_ZERO],
};

export const BUNDLE_RECEIPT_ZERO: BundleReceipt = {
  transactionIndex: 1,
  transactionHash: '0x1234',
  bundleHash: BUNDLE_HASH_ZERO,
  blockHash: '0x1234',
  blockNumber: 1,
};

export const AGGREGATOR_MOCK: bls.Aggregator = {
  add: (_: bls.Bundle) => Promise.resolve({ hash: BUNDLE_HASH_ZERO }),
} as bls.Aggregator;
