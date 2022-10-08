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
            {asset.name} {asset.symbol}
          </Description>
        </Column>
      </Left>

      <Middle></Middle>
      <Right></Right>
    </Wrapper>
  );
};
