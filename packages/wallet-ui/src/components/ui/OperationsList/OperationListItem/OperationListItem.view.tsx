import { Operation } from 'bls-snap/src/types/snapState';
import {
  Column,
  Description,
  Label,
  Left,
  Right,
  Wrapper,
} from './OperationListItem.style';

type Props = {
  operation: Operation;
};

export const OperationListItemView = ({ operation }: Props) => {
  return (
    <Wrapper>
      <Column>
        <Description>{operation.contractAddress}</Description>
      </Column>
      <Column style={{ maxWidth: 600 }}>
        <Description>{operation.encodedFunction}</Description>
      </Column>
    </Wrapper>
  );
};
