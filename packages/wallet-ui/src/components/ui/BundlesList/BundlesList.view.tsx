import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { FC, useEffect, useRef } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { TRANSACTIONS_REFRESH_FREQUENCY } from '../../../utils/constants';
import { IListProps } from '../List/List.view';
import { BundleListItem } from './BundleListItem';
import { Wrapper } from './BundlesList.style';

export const BundlesListView = () => {
  const { getBundle } = useBLSSnap();
  const networks = useAppSelector((state) => state.networks);
  const wallet = useAppSelector((state) => state.wallet);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeoutHandle = useRef(setTimeout(() => {}));

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const chainId = networks.items[networks.activeNetwork]?.chainId;
    const address = wallet.accounts?.[0] as unknown as string;
    const pandingBundles = (wallet.bundles || []).filter((b) => !b.blockNumber);
    if (chainId && address && pandingBundles?.length) {
      clearTimeout(timeoutHandle.current); // cancel the timeout that was in-flight
      timeoutHandle.current = setTimeout(async () => {
        console.log('check bundles', pandingBundles);
        for (const bundle of pandingBundles) {
          const _bundle = await getBundle(bundle.bundleHash, chainId);
          console.log('bundle', _bundle);
        }
      }, TRANSACTIONS_REFRESH_FREQUENCY);
      return () => clearTimeout(timeoutHandle.current);
    }
  }, [wallet.bundles]);

  return (
    <Wrapper<FC<IListProps<Bundle>>>
      data={wallet.bundles || []}
      render={(bundle) => <BundleListItem bundle={bundle} />}
      keyExtractor={(bundle) => bundle.bundleHash?.toString()}
    />
  );
};
