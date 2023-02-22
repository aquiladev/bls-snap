import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { setAddTokenModalVisible } from '../../../slices/UISlice';
import { AddressInput } from '../AddressInput';
import { Alert } from '../Alert';
import { Button } from '../Button';
import { LoadingSpinner } from '../LoadingSmall/LoadingSmall.style';
import { ValueInput } from '../ValueInput';
import {
  Wrapper,
  ModalTitle,
  ModalHeaderContainer,
  ButtonsContainer,
} from './AddNewTokenModal.style';

export const AddNewTokenModalView = () => {
  const networks = useAppSelector((state) => state.networks);
  const dispatch = useAppDispatch();
  const { addERC20Token, getWalletData } = useBLSSnap();

  const [isAddingToken, setIsAddingToken] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isValidName, setIsValidName] = useState(false);
  const [isValidSymbol, setIsValidSymbol] = useState(false);
  const [isValidDecimals, setIsValidDecimals] = useState(false);

  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(0);
  const [error, setError] = useState<string>();

  const isAllValid = useMemo(() => {
    return isValidAddress && isValidName && isValidSymbol && isValidDecimals;
  }, [isValidAddress, isValidName, isValidSymbol, isValidDecimals]);

  const addToken = useCallback(async () => {
    if (isAddingToken) {
      return;
    }

    try {
      setIsAddingToken(true);
      setError(undefined);
      const activeNetwork = networks.items[networks.activeNetwork];
      await addERC20Token(
        address,
        name,
        symbol,
        decimals,
        activeNetwork.chainId,
      );
      await getWalletData(activeNetwork.chainId, networks.items);
      dispatch(setAddTokenModalVisible(false));
    } catch (err: any) {
      setError(err?.message || 'Error during token adding');
    } finally {
      setIsAddingToken(false);
    }
  }, [
    address,
    name,
    symbol,
    decimals,
    networks,
    dispatch,
    addERC20Token,
    getWalletData,
  ]);

  return (
    <Wrapper>
      <ModalHeaderContainer>
        <ModalTitle>Add token</ModalTitle>
      </ModalHeaderContainer>
      <AddressInput
        label="Contract Address"
        setIsValidAddress={setIsValidAddress}
        onChange={(val) => setAddress(val.target.value)}
      />
      <ValueInput
        label="Name"
        validator={(val) => val?.length > 0 && val?.length <= 64}
        setIsValid={setIsValidName}
        onChange={(val) => setName(val.target.value)}
      />
      <ValueInput
        label="Symbol"
        validator={(val) => val?.length > 0 && val?.length <= 16}
        setIsValid={setIsValidSymbol}
        onChange={(val) => setSymbol(val.target.value)}
      />
      <ValueInput
        label="Decimals"
        validator={(val) => Number.isInteger(Number(val))}
        setIsValid={setIsValidDecimals}
        onChange={(val) => setDecimals(Number(val.target.value))}
      />
      {error && <Alert text={error} variant="error" />}
      <ButtonsContainer>
        <Button
          disabled={isAddingToken}
          onClick={() => dispatch(setAddTokenModalVisible(false))}
        >
          Cancel
        </Button>
        <Button
          customIconLeft={
            isAddingToken ? <LoadingSpinner icon="spinner" pulse /> : null
          }
          disabled={!isAllValid || isAddingToken}
          onClick={addToken}
        >
          Add
        </Button>
      </ButtonsContainer>
    </Wrapper>
  );
};
