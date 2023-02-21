import { FC, useEffect, useRef } from 'react';
import { IListProps } from '../List/List.view';
import { Erc20TokenBalance } from '../../../types';
import { ASSETS_PRICE_REFRESH_FREQUENCY } from '../../../utils/constants';
import { useAppSelector } from '../../../hooks/redux';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { Button } from '../Button';
import { AssetListItem } from './AssetListItem';
import { Wrapper } from './AssetsList.style';

export const AssetsListView = () => {
  const { setErc20TokenBalance, refreshTokensUSDPrice } = useBLSSnap();
  const wallet = useAppSelector((state) => state.wallet);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeoutHandle = useRef(setTimeout(() => {}));

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (wallet.erc20TokenBalances?.length > 0) {
      clearTimeout(timeoutHandle.current); // cancel the timeout that was in-flight
      timeoutHandle.current = setTimeout(
        () => refreshTokensUSDPrice(),
        ASSETS_PRICE_REFRESH_FREQUENCY,
      );
      return () => clearTimeout(timeoutHandle.current);
    }
  }, [wallet.erc20TokenBalances]);

  const handleClick = (asset: Erc20TokenBalance) => {
    setErc20TokenBalance(asset);
  };

  return (
    <Wrapper<FC<IListProps<Erc20TokenBalance>>>
      data={wallet.erc20TokenBalances}
      render={(asset) => (
        <AssetListItem
          asset={asset}
          onClick={() => handleClick(asset)}
          selected={wallet.erc20TokenBalanceSelected.address === asset.address}
        />
      )}
      keyExtractor={(asset) => asset.address}
      lastItem={<Button>Add token</Button>}
    />
  );
};
