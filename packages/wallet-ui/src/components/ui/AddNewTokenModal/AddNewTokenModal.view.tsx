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
      <ValueInput
        label="Name"
        validator={(val) => val?.length > 0 && val?.length <= 64}
      />
      <ValueInput
        label="Symbol"
        validator={(val) => val?.length > 0 && val?.length <= 16}
      />
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
