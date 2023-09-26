import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

type IIconStyled = {
  transactionname?: string;
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  box-shadow: ${(props) => props.theme.shadow.dividerBottom.boxShadow};
  padding: ${(props) => props.theme.spacing.base};
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
  align-items: center;
  &:hover {
    background-color: ${(props) => props.theme.colors.background.inverse};
    color: ${(props) => props.theme.colors.text.inverse};
  }
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.background.default};
`;

export const IconStyled = styled(FontAwesomeIcon)<IIconStyled>`
  font-size: ${(props) => props.theme.typography.i2.fontSize};
  color: ${(props) => props.theme.palette.grey.grey1};
  transform: ${(props) =>
    props.transactionname === 'Send' ? 'rotate(45deg)' : 'initial'};
`;

export const Right = styled.div`
  flex: 1;
  text-align: end;
`;

export const Content = styled.div`
  margin-left: ${(props) => props.theme.spacing.small};
`;

export const Link = styled.a`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.palette.grey.grey1};
  text-decoration: none;
  padding-left: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    box-sizing: border-box;
  }
`;
