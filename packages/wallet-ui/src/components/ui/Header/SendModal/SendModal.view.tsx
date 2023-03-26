import { useState } from 'react';
import { ethers } from 'ethers';
import { useAppSelector } from '../../../../hooks/redux';
import { AmountInput } from '../../AmountInput';
import { AddressInput } from '../../AddressInput';
import { useBLSSnap } from '../../../../services/useBLSSnap';
import {
  Buttons,
  ButtonStyled,
  Header,
  Network,
  Title,
  Wrapper,
} from './SendModal.style';

type Props = {
  closeModal?: () => void;
};

export const SendModalView = ({ closeModal }: Props) => {
  const networks = useAppSelector((state) => state.networks);
  const wallet = useAppSelector((state) => state.wallet); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { addAction } = useBLSSnap();
  const [fields, setFields] = useState({
    amount: '',
    address: '',
    chainId:
      networks.items.length > 0
        ? networks.items[networks.activeNetwork].chainId
        : 0,
  });
  const [errors, setErrors] = useState({ amount: '', address: '' });

  const handleChange = (fieldName: string, fieldValue: string) => {
    // Check if input amount does not exceed user balance
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));

    // eslint-disable-next-line default-case
    switch (fieldName) {
      case 'amount':
        if (fieldValue !== '' && fieldValue !== '.') {
          const inputAmount = ethers.utils.parseUnits(
            fieldValue,
            wallet.erc20TokenBalanceSelected.decimals,
          );
          const userBalance = wallet.erc20TokenBalanceSelected.amount;
          if (inputAmount.gt(userBalance)) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              amount: 'Input amount exceeds user balance',
            }));
          }
        }
        break;
      case 'address':
        if (fieldValue !== '') {
          if (!ethers.utils.isAddress(fieldValue)) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              address: 'Invalid address format',
            }));
          }
        }
        break;
    }

    setFields((prevFields) => ({
      ...prevFields,
      [fieldName]: fieldValue,
    }));
  };

  const confirmEnabled = () => {
    return (
      !errors.address &&
      !errors.amount &&
      fields.amount.length > 0 &&
      fields.address.length > 0
    );
  };

  const handleConfirmClick = async () => {
    const { chainId } = networks.items[networks.activeNetwork];
    const senderAddress = wallet.accounts[wallet.activeAccount].address;
    const contractAddress = wallet.erc20TokenBalanceSelected.address;

    const erc20Abi = [
      'function transfer(address recipient, uint256 amount) returns (bool)',
    ];
    const erc20Contract = new ethers.Contract(contractAddress, erc20Abi);
    const encodedFunction = erc20Contract.interface.encodeFunctionData(
      'transfer',
      [
        fields.address,
        ethers.utils.parseUnits(
          fields.amount,
          wallet.erc20TokenBalanceSelected.decimals,
        ),
      ],
    );
    const functionFragment = erc20Contract.interface
      .getFunction('transfer')
      .format('minimal');

    await addAction(
      senderAddress,
      contractAddress,
      encodedFunction,
      functionFragment,
      chainId,
    );
    closeModal();
  };

  return (
    <div>
      <Wrapper>
        <Header>
          <Title>Send</Title>
        </Header>
        <Network>Network {networks.items[networks.activeNetwork].name}</Network>
        <AddressInput
          label="To"
          placeholder="Paste recipient address here"
          onChange={(value) => handleChange('address', value.target.value)}
        />
        <AmountInput
          label="Amount"
          onChangeCustom={(value) => handleChange('amount', value)}
          error={errors.amount !== ''}
          helperText={errors.amount}
          decimalsMax={wallet.erc20TokenBalanceSelected.decimals}
          asset={wallet.erc20TokenBalanceSelected}
        />
      </Wrapper>
      <Buttons>
        <ButtonStyled onClick={closeModal} backgroundTransparent borderVisible>
          CANCEL
        </ButtonStyled>
        <ButtonStyled
          onClick={() => handleConfirmClick()}
          enabled={confirmEnabled()}
        >
          CONFIRM
        </ButtonStyled>
      </Buttons>
    </div>
  );
};
