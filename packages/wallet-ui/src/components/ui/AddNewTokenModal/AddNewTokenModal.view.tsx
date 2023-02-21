import { useMemo, useState } from 'react';
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
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isValidName, setIsValidName] = useState(false);
  const [isValidSymbol, setIsValidSymbol] = useState(false);
  const [isValidDecimals, setIsValidDecimals] = useState(false);

  const isAllValid = useMemo(() => {
    return isValidAddress && isValidName && isValidSymbol && isValidDecimals;
  }, [isValidAddress, isValidName, isValidSymbol, isValidDecimals]);

  return (
    <Wrapper>
      <ModalHeaderContainer>
        <ModalTitle>Add token</ModalTitle>
      </ModalHeaderContainer>
      <AddressInput
        label="Contract Address"
        setIsValidAddress={setIsValidAddress}
      />
      <ValueInput
        label="Name"
        validator={(val) => val?.length > 0 && val?.length <= 64}
        setIsValid={setIsValidName}
      />
      <ValueInput
        label="Symbol"
        validator={(val) => val?.length > 0 && val?.length <= 16}
        setIsValid={setIsValidSymbol}
      />
      <ValueInput
        label="Decimals"
        validator={(val) => Number.isInteger(Number(val))}
        setIsValid={setIsValidDecimals}
      />
      <ButtonsContainer>
        <Button variant="primary">Cancel</Button>
        <Button disabled={!isAllValid}>Add</Button>
      </ButtonsContainer>
    </Wrapper>
  );
};
