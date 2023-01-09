import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

import {
  AddressCopy,
  AddressQrCode,
  Title,
  Wrapper,
} from './ReceiveModal.style';

type Props = {
  address: string;
};

export const ReceiveModalView = ({ address }: Props) => {
  const themeContext = useContext(ThemeContext);
  return (
    <Wrapper>
      <Title>Receive</Title>
      <AddressQrCode
        value={address}
        bgColor={themeContext.colors.background.default}
        fgColor={themeContext.colors.text.default}
      />
      <AddressCopy address={address} placement="top" />
    </Wrapper>
  );
};
