import { NetworkConfig } from 'bls-wallet-clients';

export type SnapState = Record<number, Network>;

export type Network = {
  name: string;
  chainId: number;
  rpcUrl: string;
  aggregator: string;
  config: NetworkConfig;

  accounts?: BlsAccount[];
  erc20Tokens?: Erc20Token[];
  actions?: Action[];
  bundles?: Bundle[];
};

export type BlsAccount = {
  address: string;
  publicKey: string;
  privateKey: string;
  derivationPath: string;
  addressIndex: number;
};

export type Account = {
  address: string;
};

export type Erc20Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isInternal: boolean;
};

export type Action = {
  id: string;
  value: number;
  senderAddress: string;
  contractAddress: string;
  encodedFunction: string;
};

export type Bundle = {
  senderAddress: string;
  actions: Action[];
  bundleHash: string;
  error?: string;
  transactionHash?: string;
  transactionIndex?: number;
  blockHash?: string;
  blockNumber?: number;
};
