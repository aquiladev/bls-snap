import QRCode from 'react-qr-code';
import styled from 'styled-components';
import { AccountAddress } from '../AccountAddress';
import { AccountImage } from '../AccountImage';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius-top-left: ${(props) => props.theme.radii.default};
  border-radius-top-right: ${(props) => props.theme.radii.default};
  margin-top: -32px;
  padding-top: 56px;
  padding-bottom: 24px;
  align-items: center;
`;

export const AccountImageDiv = styled.div`
  background-color: transparent;
`;

export const AccountImageStyled = styled(AccountImage)`
  margin: auto;
  border: 7px solid white;
  padding: 0px;
`;

export const TitleDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export const Title = styled.div`
  font-size: ${(props) => props.theme.fontSizes.text};
  margin-right: 13px;
`;

export const AddressQrCode = styled(QRCode).attrs(() => ({
  size: 134,
}))`
  margin-bottom: 24px;
`;

export const AddressCopy = styled(AccountAddress)``;

export const ModalWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.background.default};
  padding: ${(props) => props.theme.spacing.tiny2};
`;
