import * as Types from 'bls-snap/src/types/snapState';

export { type GetSnapsResponse, type Snap } from './snap';

export type Network = Pick<Types.Network, 'name' | 'chainId'>;
