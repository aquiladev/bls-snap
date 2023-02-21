import * as Types from '@aquiladev/bls-snap/src/types/snapState';
import { BigNumber } from 'ethers';

export { type GetSnapsResponse, type Snap } from './snap';

export type Network = Pick<Types.Network, 'name' | 'chainId' | 'explorerUrl'>;
export type Account = Pick<Types.BlsAccount, 'address'>;

export type Action = {
  to: string;
  calldata: string;
};

export type Erc20TokenBalance = {
  amount: BigNumber;
  chainId: number;
  usdPrice?: number;
} & Types.Erc20Token;
