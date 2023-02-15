import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';

export const getBundleStatus = (bundle: Bundle): string => {
  return bundle.blockNumber ? 'Completed' : 'Pending';
};
