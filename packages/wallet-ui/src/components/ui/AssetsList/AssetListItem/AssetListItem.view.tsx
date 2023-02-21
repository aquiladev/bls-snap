import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ethers } from 'ethers';
import { HTMLAttributes, useCallback } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import { useBLSSnap } from '../../../../services/useBLSSnap';
import { Erc20TokenBalance } from '../../../../types';
import {
  Column,
  Description,
  Label,
  Left,
  Middle,
  Right,
  Wrapper,
} from './AssetListItem.style';

type Props = {
  asset: Erc20TokenBalance;
  selected?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const AssetListItemView = ({
  asset,
  selected,
  ...otherProps
}: Props) => {
  const { removeERC20Token, getWalletData } = useBLSSnap();
  const networks = useAppSelector((state) => state.networks);

  const removeToken = useCallback(async () => {
    const activeNetwork = networks.items[networks.activeNetwork];
    await removeERC20Token(asset.address, asset.chainId);
    await getWalletData(activeNetwork.chainId, networks.items);
  }, [removeERC20Token, asset]);

  return (
    <Wrapper selected={selected} {...otherProps}>
      <Left>
        <Column>
          <Label>{asset.name}</Label>
          <Description>
            {ethers.utils.formatUnits(asset.amount, asset.decimals).toString()}{' '}
            {asset.symbol}
          </Description>
        </Column>
      </Left>

      <Middle></Middle>
      <Right>
        {!asset.isInternal && (
          <FontAwesomeIcon onClick={removeToken} icon="close" />
        )}
      </Right>
    </Wrapper>
  );
};
