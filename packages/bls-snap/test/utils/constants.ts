import {
  BlsWalletWrapper,
  NetworkConfig,
  Bundle as BlsBundle,
  Operation as BlsOperation,
  Aggregator,
} from 'bls-wallet-clients';
import { BigNumber } from 'ethers';
import {
  BlsAccount,
  Bundle,
  Erc20Token,
  Network,
  Operation,
} from '../../src/types/snapState';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const TEST_CHAIN_ID_ZERO = 111;

export const TEST_NETWORK_ZERO: Network = {
  name: 'Testnet',
  chainId: TEST_CHAIN_ID_ZERO,
  rpcUrl: 'https://testnet-rpc.com',
  aggregator: 'https://testnet-aggregator.com',
  config: {
    addresses: {
      verificationGateway: ZERO_ADDRESS,
    },
  } as NetworkConfig,
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

export const BLS_ACCOUNT_ZERO: BlsWalletWrapper = {
  address: ACCOUNT_ZERO.address,
  privateKey: ACCOUNT_ZERO.privateKey,
  PublicKeyStr: () => ACCOUNT_ZERO.publicKey,
  Nonce: () => Promise.resolve(BigNumber.from(0)),
  sign: (_: BlsOperation) => {
    return {} as BlsBundle;
  },
} as BlsWalletWrapper;

export const ERC20_TOKEN_ZERO: Erc20Token = {
  address: ZERO_ADDRESS,
  name: 'TestToken',
  symbol: 'TT',
  decimals: 18,
};

export const OPERATION_ZERO: Operation = {
  id: 'id_0',
  value: 0,
  contractAddress: ERC20_TOKEN_ZERO.address,
  senderAddress: ACCOUNT_ZERO.address,
  encodedFunction: '0x',
};

export const BUNDLE_HASH_ZERO = '0x1234';

export const BUNDLE_ZERO: Bundle = {
  bundleHash: BUNDLE_HASH_ZERO,
  senderAddress: ACCOUNT_ZERO.address,
  operations: [OPERATION_ZERO],
};

export const AGGREGATOR_MOCK: Aggregator = {
  add: (_: BlsBundle) => Promise.resolve({ hash: BUNDLE_HASH_ZERO }),
} as Aggregator;
