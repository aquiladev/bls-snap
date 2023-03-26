import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { AccountImage } from '../../AccountImage';

export const Wrapper = styled.div`
  box-shadow: ${(props) => props.theme.shadow.dividerBottom.boxShadow};
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.text};
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};
`;

export const Row = styled.div`
  padding: ${(props) => props.theme.spacing.small};
  padding-left: ${(props) => props.theme.spacing.base};
  box-shadow: ${(props) => props.theme.shadow.dividerBottom.boxShadow};
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};
  &:hover {
    color: ${(props) => props.theme.colors.text.alternative};
  }
`;

export const AccountImageStyled = styled(AccountImage)`
  margin-left: 4px;
  display: inline-block;
`;

export const ActiveRow = styled.div`
  padding: ${(props) => props.theme.spacing.small};
  padding-left: ${(props) => props.theme.spacing.none};
  cursor: auto;
`;

export const ActiveIcon = styled(FontAwesomeIcon).attrs((props) => ({
  color: props.theme.colors.background.default,
  icon: 'check',
}))`
  padding-right: ${(props) => props.theme.spacing.tiny2};
`;
