import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { AccountAddress } from '../../AccountAddress';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background.default};
  width: ${(props) => props.theme.modal.base};
  padding: ${(props) => props.theme.spacing.base};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.spacing.base};
`;

export const Title = styled.div`
  font-size: ${(props) => props.theme.typography.h3.fontSize};
  font-weight: ${(props) => props.theme.typography.h3.fontWeight};
  color: ${(props) => props.theme.colors.text.default}};
`;

export const AddressQrCode = styled(QRCode).attrs(() => ({
  size: 134,
}))``;

export const AddressCopy = styled(AccountAddress)``;
