import { NetworkConfig } from 'bls-wallet-clients';

export type SnapState = {
  networks: Network[];
  accounts: BlsAccount[];
  erc20Tokens: Erc20Token[];
  ops: Operation[];
};

export type Network = {
  name: string;
  chainId: string;
  config: NetworkConfig;
};

export type BlsAccount = {
  address: string;
  chainId: string;
};

export type Erc20Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: string;
};

export type Operation = {
  ethValue: number;
  contractAddress: string;
  encodedFunction: string;
};

export type Transaction = {
  txnHash: string;
  chainId: string;
  senderAddress: string;
  contractAddress: string;
  contractFuncName: string;
  contractCallData: string[];
  status: string;
  failureReason: string;
  eventIds: string[];
  timestamp: number;
};