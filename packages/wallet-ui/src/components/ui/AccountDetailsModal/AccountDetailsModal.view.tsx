import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
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
  accountName: string;
};

export const AccountDetailsModalView = ({ address, accountName }: Props) => {
  const themeContext = useContext(ThemeContext);

  return (
    <ModalWrapper>
      <AccountImageDiv>
        <AccountImageStyled size={64} address={address} />
      </AccountImageDiv>
      <Wrapper>
        <TitleDiv>
          <Title>{accountName}</Title>
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
