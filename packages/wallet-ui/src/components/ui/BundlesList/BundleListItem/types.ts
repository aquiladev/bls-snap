import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';

export const getBundleStatus = (bundle: Bundle): string => {
  // eslint-disable-next-line no-nested-ternary
  return bundle.blockNumber
    ? 'Success'
    : bundle.error
    ? `Error: ${bundle.error}`
    : 'Pending';
};
