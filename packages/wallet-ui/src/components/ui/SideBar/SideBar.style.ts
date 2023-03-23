import styled from 'styled-components';
import { PopIn } from '../PopIn';
import { Button } from '../Button';
import { AccountImage } from '../AccountImage';
import { PopperTooltip } from '../PopperTooltip';

type IAddTokenButton = {
  shadowVisible?: boolean;
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background.default};
  min-width: 272px;
  border-right: 1px solid ${(props) => props.theme.colors.border.default};
  padding: ${(props) => props.theme.spacing.small};
`;

export const AccountLabel = styled.h3`
  font-weight: 900;
  align-self: center;
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: ${(props) => props.theme.fontSizes.text};
`;

export const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

export const DivList = styled.div``;

export const AddTokenButton = styled(Button).attrs(
  (props) => ({}),
)<IAddTokenButton>`
  height: 36px;
  justify-content: center;
  padding-left: 20px;
  box-shadow: ${(props) =>
    props.shadowVisible ? '0px -4px 12px -8px rgba(0, 0, 0, 0.25)' : 'initial'};
  margin-top: auto;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray4};
  }
`;

export const AccountImageStyled = styled(AccountImage)`
  margin-left: 4px;
  margin-top: 4px;
  cursor: pointer;
`;

export const AccountDetails = styled(PopperTooltip)`
  margin: 8px;
`;

export const AccountDetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px;
  align-items: flex-start;
`;

export const AccountDetailButton = styled(Button).attrs((props) => ({
  backgroundTransparent: true,
  fontSize: props.theme.fontSizes.text,
}))`
  padding: 0px;
  border-radius: 0px;
  border: 1px solid transparent;
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};

  &:hover {
    background-color: ${(props) => props.theme.colors.background.default};
    color: ${(props) => props.theme.colors.text.default};
  }
`;

export const CreateAccountButton = styled(Button).attrs((props) => ({
  // backgroundTransparent: true,
  fontSize: props.theme.fontSizes.text,
}))`
  background-color: ${(props) => props.theme.colors.background.default};
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 0px;
  font-weight: 400;
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};

  &:hover {
    background-color: ${(props) => props.theme.colors.background.default};
    color: ${(props) => props.theme.colors.text.default};
  }
`;

export const PopInStyled = styled(PopIn)`
  background-color: ${(props) => props.theme.colors.background.default};
  .modal-close-button {
    transform: translateY(45px);
  }
`;
