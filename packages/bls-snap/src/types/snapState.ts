import { NetworkConfig } from 'bls-wallet-clients';

export type SnapState = {
  networks: Network[];
  accounts: BlsAccount[];
  erc20Tokens: Erc20Token[];
  ops: Operation[];
  bundles: Bundle[];
};

export type Network = {
  name: string;
  chainId: number;
  rpcUrl: string;
  aggregator: string;
  config: NetworkConfig;
};

export type BlsAccount = {
  address: string;
  privateKey: string;
  chainId: number;
};

export type Erc20Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
};

export type Operation = {
  ethValue: number;
  contractAddress: string;
  encodedFunction: string;
};

export type Bundle = {
  bundleHash: string;
  chainId: number;
  error?: string;
  transactionIndex?: number;
  blockHash?: string;
  blockNumber?: number;
};
