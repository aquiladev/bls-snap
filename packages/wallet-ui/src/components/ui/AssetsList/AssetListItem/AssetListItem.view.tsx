import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ethers } from 'ethers';
import { HTMLAttributes } from 'react';
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
      <Right>{!asset.isInternal && <FontAwesomeIcon icon="close" />}</Right>
    </Wrapper>
  );
};
