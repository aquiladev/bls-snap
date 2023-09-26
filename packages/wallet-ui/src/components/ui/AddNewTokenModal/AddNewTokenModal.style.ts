import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background.default};
  width: ${(props) => props.theme.modal.base};
  padding: ${(props) => props.theme.spacing.base};
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
  border-radius: 8px 8px 0px 0px;
  gap: ${(props) => props.theme.spacing.small};
  overflow-wrap: break-word;
`;

export const ModalHeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const ModalTitle = styled.h1`
  color: ${(props) => props.theme.colors.text.default};
  font-size: ${({ theme }) => theme.fontSizes.text};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const LoadingSpinner = styled(FontAwesomeIcon)``;
