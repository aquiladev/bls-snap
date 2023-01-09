import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type IDiv = {
  selected?: boolean;
};

export const Wrapper = styled.div<IDiv>`
  display: flex;
  flex-direction: row;
  box-shadow: ${(props) => props.theme.colors.border.default};
  background-color: ${(props) =>
    props.selected
      ? props.theme.colors.background.default
      : props.theme.colors.background.inverse};
  height: 64px;
  padding-left: 20px;
  align-items: center;
  border-color: ${(props) => props.theme.colors.border.default};
  border-width: 0px;
  border-right-width: ${(props) => (props.selected ? '2px' : '0px')};
  border-style: solid;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => props.theme.spacing.small};
`;

export const LeftIcon = styled(FontAwesomeIcon)`
  font-size: ${(props) => props.theme.typography.i4.fontSize};
`;

export const Label = styled.span`
  font-size: ${(props) => props.theme.typography.c1.fontSize};
  font-weight: ${(props) => props.theme.typography.bold.fontWeight};
  color: ${(props) => props.theme.colors.text.default};
`;

export const Description = styled.span`
  font-size: ${(props) => props.theme.typography.c2.fontSize};
  color: ${(props) => props.theme.colors.text.default}};
`;

export const Left = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Middle = styled.div`
  font-size: ${(props) => props.theme.typography.p2.fontSize};
  color: ${(props) => props.theme.palette.grey.grey1};
  flex-grow: 2;
  text-align: center;
`;

export const Right = styled.div`
  flex-grow: 1;
  text-align: end;
`;
