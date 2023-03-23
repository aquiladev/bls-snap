import { useContext, useMemo } from 'react';
import { ThemeContext } from 'styled-components';
import { useAppSelector } from '../../../hooks/redux';
import {
  AccountImageDiv,
  AccountImageStyled,
  AddressCopy,
  AddressQrCode,
  ModalWrapper,
  Title,
  TitleDiv,
  Wrapper,
} from './AccountDetailsModal.style';

type Props = {
  address: string;
};

export const AccountDetailsModalView = ({ address }: Props) => {
  const themeContext = useContext(ThemeContext);
  const { accounts } = useAppSelector((state) => state.wallet);
  const accountName = useMemo(
    () => accounts?.find((account) => account.selected)?.name || 'My account',
    [accounts],
  );

  return (
    <ModalWrapper>
      <AccountImageDiv>
        <AccountImageStyled size={64} address={address} />
      </AccountImageDiv>
      <Wrapper>
        <TitleDiv>
          <Title>{accountName}</Title>
          {/* <ModifyIcon /> */}
        </TitleDiv>
        <AddressQrCode
          value={address}
          bgColor={themeContext.colors.background.default}
          fgColor={themeContext.colors.text.default}
        />
        <AddressCopy address={address} />
      </Wrapper>
    </ModalWrapper>
  );
};
