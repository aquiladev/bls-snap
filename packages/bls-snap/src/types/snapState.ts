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
  operations?: Operation[];
  bundles?: Bundle[];
};

export type BlsAccount = {
  address: string;
  publicKey: string;
  privateKey: string;
  derivationPath: string;
  addressIndex: number;
};

export type Erc20Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type Operation = {
  id: string;
  value: number;
  senderAddress: string;
  contractAddress: string;
  encodedFunction: string;
};

export type Bundle = {
  senderAddress: string;
  operations: Operation[];
  bundleHash: string;
  error?: string;
  transactionHash?: string;
  transactionIndex?: number;
  blockHash?: string;
  blockNumber?: number;
};
