import styled from 'styled-components';
import { Button } from '../Button';

export const Wrapper = styled(Button).attrs((props) => ({
  fontSize: props.theme.fontSizes.text,
  upperCaseOnly: false,
  // textStyle: {
  //   fontWeight: props.theme.typography.p1.fontWeight,
  //   fontFamily: props.theme.typography.p1.fontFamily,
  // },
  // iconStyle: {
  //   fontSize: props.theme.typography.i1.fontSize,
  //   color: props.theme.palette.grey.grey1,
  // },
}))`
  padding: 4px 5px;
  height: 25px;
  color: ${(props) => props.theme.colors.text.black};
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.colors.text.black};

  :hover {
    background-color: ${(props) => props.theme.colors.text.black};
    border: none;
  }
`;
