import { Select, MenuItem } from '@mui/material';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  margin-right: 2.4rem;
  border-radius: 36px !important;
  background-color: ${({ theme }) => theme.colors.background.alternative};
  color: ${(props) => props.theme.colors.text.default} !important;
  font-size: ${(props) => props.theme.fontSizes.small} !important;

  & > svg {
    color: ${(props) => props.theme.colors.text.default} !important;
    font-size: ${(props) => props.theme.fontSizes.small} !important;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  font-size: ${(props) => props.theme.fontSizes.small} !important;
`;

export { StyledSelect as Select, StyledMenuItem as MenuItem };
