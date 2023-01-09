import styled from 'styled-components';
import { Button } from '../Button';

export const Wrapper = styled(Button).attrs((props) => ({
  fontSize: props.theme.fontSizes.text,
  upperCaseOnly: false,
}))`
  padding: ${(props) => props.theme.spacing.tiny};
  height: 25px;
  border-radius: ${(props) => props.theme.radii.default};
  border: 1px solid ${(props) => props.theme.colors.text.black};
  color: ${(props) => props.theme.colors.text.inverse};

  :hover {
    background-color: ${(props) => props.theme.colors.text.black};
    border: none;
  }
`;
