import styled from 'styled-components';

type IDiv = {
  selected?: boolean;
};

export const Right = styled.div`
  flex-grow: 1;
  text-align: end;

  && > #icon {
    display: none;
    cursor: pointer;
    padding-right: 10px;
  }

  && > #icon > svg:hover > path {
    color: ${(props) => props.theme.palette.warning.dark};
  }
`;

export const Wrapper = styled.div<IDiv>`
  display: flex;
  flex-direction: row;
  box-shadow: ${(props) => props.theme.colors.border.default};
  background-color: ${(props) => props.theme.colors.background.default};
  cursor: ${(props) => (props.selected ? 'initial' : 'pointer')};
  height: 64px;
  padding-left: 20px;
  align-items: center;
  border-color: ${(props) => props.theme.colors.border.default};
  border-width: 0px;
  border-right-width: ${(props) => (props.selected ? '2px' : '0px')};
  border-style: solid;

  &&:hover > ${Right} > #icon {
    display: initial;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => props.theme.spacing.small};
`;

export const Label = styled.span`
  font-size: ${(props) => props.theme.typography.p1.fontSize};
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
