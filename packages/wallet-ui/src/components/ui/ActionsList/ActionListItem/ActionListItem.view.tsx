import { Action } from '@aquiladev/bls-snap/src/types/snapState';
import { useState } from 'react';
import {
  shortenAddress,
  getDate,
  getFunctionName,
  getAmountPrice,
} from '../../../../utils/utils';
import {
  Column,
  Description,
  Wrapper,
  IconStyled,
  Right,
} from './ActionListItem.style';

type Props = {
  action: Action;
};

export const ActionListItemView = ({ action }: Props) => {
  console.log(action);
  const [isSelected, setIsSelected] = useState(true);
  console.log(action);
  return (
    <Wrapper
      onClick={() => {
        setIsSelected(!isSelected);
      }}
    >
      <Column>
        <IconStyled
          icon={['fas', `${isSelected ? 'square-check' : 'square'}`]}
        />
      </Column>
      <Column>
        <div style={{ marginBottom: 8 }}>
          <Description>
            <span style={{ fontSize: 18 }}>
              {action.functionFragment
                ? getFunctionName(action.functionFragment)
                : 'Send'}
            </span>
          </Description>
        </div>
        <Description>
          <span style={{ color: 'green' }}>
            {getDate(action.createdAt)}&nbsp;&#183;
          </span>
          <span style={{ paddingLeft: 10, paddingRight: 4 }}>To:</span>
          <span style={{ color: 'slateGray' }}>
            {shortenAddress(action.contractAddress)}
          </span>
        </Description>
      </Column>
      <Right>
        <span>{action.value}</span>
        <span>&nbsp;ETH</span>
      </Right>
    </Wrapper>
  );
};
