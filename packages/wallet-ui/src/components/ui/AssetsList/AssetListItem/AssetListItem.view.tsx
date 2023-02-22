import { HTMLAttributes, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ethers } from 'ethers';
import { useAppSelector } from '../../../../hooks/redux';
import { useBLSSnap } from '../../../../services/useBLSSnap';
import { Erc20TokenBalance } from '../../../../types';
import {
  Column,
  Description,
  Label,
  Left,
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

  const [isRemovingToken, setIsRemovingToken] = useState(false);

  const removeToken = useCallback(async () => {
    if (isRemovingToken) {
      return;
    }

    try {
      setIsRemovingToken(true);
      const activeNetwork = networks.items[networks.activeNetwork];
      await removeERC20Token(asset.address, asset.chainId);
      await getWalletData(activeNetwork.chainId, networks.items);
    } finally {
      setIsRemovingToken(false);
    }
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
      <Right>
        {!asset.isInternal && (
          <span id="icon">
            <FontAwesomeIcon
              onClick={removeToken}
              icon={isRemovingToken ? 'spinner' : 'trash'}
            />
          </span>
        )}
      </Right>
    </Wrapper>
  );
};
