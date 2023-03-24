import * as Types from '@aquiladev/bls-snap/src/types/snapState';
import { BigNumber } from 'ethers';

export { type GetSnapsResponse, type Snap } from './snap';

export type Network = Pick<Types.Network, 'name' | 'chainId' | 'explorerUrl'>;

export type SelectableAction = Types.Action & {
  selected: boolean;
};

export type Account = {
  address: string;
  name: string;
  index: number;
};

export type ActiveAccount = number;

export type Erc20TokenBalance = Types.Erc20Token & {
  amount: BigNumber;
  chainId: number;
  usdPrice?: number;
};
