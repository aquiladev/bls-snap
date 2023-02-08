import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { AccountAddress } from '../AccountAddress';

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

export const InfoDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;
`;

export const InfoRow = styled.div`
  font-size: ${(props) => props.theme.fontSizes.text};
  margin-right: 13px;
`;

export const AddressCopy = styled(AccountAddress)``;

export const ModalWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.background.default};
  padding: ${(props) => props.theme.spacing.large};
`;
