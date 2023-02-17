import { Mutex } from 'async-mutex';
import { BIP44AddressKeyDeriver } from '@metamask/key-tree';
import { SnapState } from './snapState';

export type ApiParams = {
  state: SnapState;
  requestParams: ApiRequestParams;
  mutex: Mutex;
  snap: any;
  keyDeriver?: BIP44AddressKeyDeriver;
};

export type BaseRequestParams = {
  chainId: number;
};

export type GetNetworksRequestParams = Omit<BaseRequestParams, 'chainId'>;

export type RecoverAccountsRequestParams = BaseRequestParams;

export type CreateAccountRequestParams = {
  addressIndex?: string | number;
} & BaseRequestParams;

export type AddErc20TokenRequestParams = BaseRequestParams & {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals?: number;
};

export type GetErc20TokensRequestParams = BaseRequestParams;

export type RemoveErc20TokenRequestParams = BaseRequestParams & {
  tokenAddress: string;
};

export type GetErc20TokenBalanceRequestParams = {
  tokenAddress: string;
  userAddress: string;
} & BaseRequestParams;

export type GetActionsRequestParams = {
  senderAddress: string;
} & BaseRequestParams;

export type AddActionRequestParams = {
  value?: number;
  senderAddress: string;
  contractAddress: string;
  encodedFunction: string;
  functionFragment?: string;
} & BaseRequestParams;

export type GetBundleRequestParams = {
  bundleHash: string;
} & BaseRequestParams;

export type GetBundlesRequestParams = {
  senderAddress: string;
  contractAddress?: string;
  bundleHash?: string;
} & BaseRequestParams;

export type SendBundleRequestParams = {
  senderAddress: string;
} & BaseRequestParams;

export type ApiRequestParams =
  | GetNetworksRequestParams
  | RecoverAccountsRequestParams
  | CreateAccountRequestParams
  | AddErc20TokenRequestParams
  | GetErc20TokensRequestParams
  | RemoveErc20TokenRequestParams
  | GetErc20TokenBalanceRequestParams
  | GetActionsRequestParams
  | AddActionRequestParams
  | GetBundleRequestParams
  | GetBundlesRequestParams
  | SendBundleRequestParams;
