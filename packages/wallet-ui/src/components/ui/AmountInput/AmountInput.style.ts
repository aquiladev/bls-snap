import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Button } from '../Button';

type IInput = {
  focused?: boolean;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

const getInputTextColorByState = (
  props: any,
  focused?: boolean,
  disabled?: boolean,
  error?: boolean,
) => {
  if ((!focused && !error) || disabled) {
    return props.theme.palette.grey.grey1;
  }

  return props.theme.palette.grey.black;
};

const getInputBorderColorByState = (
  props: any,
  focused?: boolean,
  disabled?: boolean,
  error?: boolean,
) => {
  if (disabled) {
    return 'transparent';
  }

  if (error) {
    return props.theme.palette.error.main;
  }

  if (!focused) {
    return props.theme.palette.grey.grey3;
  }

  return props.theme.palette.grey.grey2;
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const MaxButton = styled(Button).attrs((props) => ({
  backgroundTransparent: true,
  fontSize: props.theme.typography.c1.fontSize,
}))`
  padding-right: 0px;
  min-width: 0px;
`;

export const Input = styled.input<IInput>`
  border: none;
  height: 50px;
  width: 8px;
  font-size: ${(props) => props.theme.typography.p2.fontSize};
  color: ${(props) =>
    getInputTextColorByState(
      props,
      props.focused,
      props.disabled,
      props.error,
    )};
  :focus {
    outline: none;
  }
  padding-left: 0px;
  background-color: ${(props) => props.theme.palette.grey.white};
  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${(props) => props.theme.palette.grey.grey1};
  }
`;

export const USDDiv = styled.div`
  color: ${(props) => props.theme.palette.grey.grey1};
  margin-left: ${(props) => props.theme.spacing.tiny2};
`;

export const InputContainer = styled.div<IInput>`
  border-radius: ${(props) => props.theme.corner.small};
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.palette.grey.grey3};
  border-color: ${(props) =>
    getInputBorderColorByState(
      props,
      props.focused,
      props.disabled,
      props.error,
    )};
  background-color: ${(props) => props.theme.palette.grey.white};
  padding-left: ${(props) => props.theme.spacing.small};
  padding-right: ${(props) => props.theme.spacing.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const IconRight = styled(FontAwesomeIcon).attrs((props) => ({
  color: props.theme.palette.grey.grey1,
}))<IInput>`
  cursor: pointer;
`;
