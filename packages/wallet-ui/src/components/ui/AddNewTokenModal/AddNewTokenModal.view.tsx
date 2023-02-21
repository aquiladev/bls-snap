import { useAppDispatch } from '../../../hooks/redux';
import { AddressInput } from '../AddressInput';
import { Button } from '../Button';
import { ValueInput } from '../ValueInput';
import {
  Wrapper,
  ModalTitle,
  ModalHeaderContainer,
  ButtonsContainer,
} from './AddNewTokenModal.style';

export const AddNewTokenModalView = () => {
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <ModalHeaderContainer>
        <ModalTitle>Add token</ModalTitle>
      </ModalHeaderContainer>
      <AddressInput label="Contract Address" />
      <ValueInput label="Name" />
      <ValueInput label="Symbol" />
      <ValueInput
        label="Decimals"
        validator={(val) => Number.isInteger(Number(val))}
      />
      <ButtonsContainer>
        <Button variant="primary">Cancel</Button>
        <Button>Add</Button>
      </ButtonsContainer>
    </Wrapper>
  );
};
