import styled from 'styled-components';
import { Alert } from '../../Alert';
import { Button } from '../../Button';
import { Label } from '../../Label/Label.style';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background.default};
  width: ${(props) => props.theme.modal.base};
  padding: ${(props) => props.theme.spacing.base};
  border-radius: 8px 8px 0px 0px;
`;

export const Header = styled(Label)`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.base};
`;

export const Title = styled.div`
  font-size: ${(props) => props.theme.typography.h3.fontSize};
  font-weight: ${(props) => props.theme.typography.h3.fontWeight};
  color: ${(props) => props.theme.colors.text.default};
  width: 100%;
  text-align: center;
`;

export const Network = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.small};
  color: ${(props) => props.theme.colors.text.default};
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.border.default};
  margin-top: ${(props) => props.theme.spacing.tiny};
  margin-bottom: ${(props) => props.theme.spacing.tiny};
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: ${(props) => props.theme.modal.base};
  background-color: ${(props) => props.theme.palette.grey.white};
  border-radius: 0px 0px 8px 8px;
  box-shadow: inset 0px 1px 0px rgba(212, 212, 225, 0.4);
`;

export const ButtonStyled = styled(Button)`
  width: 152px;
`;
