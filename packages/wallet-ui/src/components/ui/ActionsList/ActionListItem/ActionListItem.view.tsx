import { Action } from 'bls-snap/src/types/snapState';
import { Column, Description, Wrapper } from './ActionListItem.style';

type Props = {
  action: Action;
};

export const ActionListItemView = ({ action }: Props) => {
  return (
    <Wrapper>
      <Column>
        <Description>{action.contractAddress}</Description>
      </Column>
      <Column style={{ maxWidth: 600 }}>
        <Description>{action.encodedFunction}</Description>
      </Column>
    </Wrapper>
  );
};
