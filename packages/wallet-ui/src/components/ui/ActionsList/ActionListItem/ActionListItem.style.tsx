import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { RoundedIcon } from '../../RoundedIcon';
import { Button } from '../../Button';

type IIconeStyled = {
  transactionname?: string;
};
type IIconButton = {
  transactionname?: string;
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  box-shadow: ${(props) => props.theme.shadow.dividerBottom.boxShadow};
  background-color: ${(props) => props.theme.colors.background.default};
  padding: ${(props) => props.theme.spacing.base};
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
  align-items: center;
  &:hover {
    background-color: ${(props) => props.theme.colors.background.inverse};
    color: ${(props) => props.theme.colors.text.inverse};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${(props) => props.theme.spacing.small};
`;

export const LeftIcon = styled(RoundedIcon)`
  height: 32px;
  width: 32px;
`;

export const IconStyled = styled(FontAwesomeIcon)<IIconeStyled>`
  font-size: ${(props) => props.theme.typography.i2.fontSize};
  color: ${(props) => props.theme.palette.grey.grey1};
  transform: ${(props) =>
    props.transactionname === 'Send' ? 'rotate(45deg)' : 'initial'};
`;

export const Label = styled.span`
  font-size: ${(props) => props.theme.typography.p1.fontSize};
  font-weight: ${(props) => props.theme.typography.bold.fontWeight};
`;

export const Description = styled.span`
  font-size: ${(props) => props.theme.typography.p2.fontSize};
`;

export const Left = styled.div`
  flex: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Middle = styled.div`
  font-size: ${(props) => props.theme.typography.p2.fontSize};
  color: ${(props) => props.theme.palette.grey.grey1};
  flex: 2;
  text-align: center;
`;

export const Right = styled.div`
  flex: 1;
  text-align: end;
  display: flex;
  justify-content: flex-end;
`;

export const IconButton = styled(FontAwesomeIcon)<IIconButton>`
  cursor: pointer;
  font-size: ${(props) => props.theme.typography.i3.fontSize};
  padding-left: 20px;
  color: ${(props) => props.theme.palette.grey.grey1};
  transition: all 0.2s ease-in-out;
  &&:hover {
    color: ${(props) => props.theme.palette.warning.dark};
  }
`;

export const Link = styled.a`
  color: ${(props) => props.theme.palette.grey.grey1};
  text-decoration: none;
  padding-left: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    box-sizing: border-box;
  }
`;
