import styled from 'styled-components';

export const Wrapper = styled.div`
  /* display: flex; */
  /* flex-direction: row; */
  /* align-items: center; */
  /* justify-content: center; */
  box-shadow: ${(props) => props.theme.shadow.dividerBottom.boxShadow};
  /* padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small}; */
  text-align: center;
  font-size: ${(props) => props.theme.typography.p1.fontSize};
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};
  &:hover {
    background-color: ${(props) => props.theme.colors.background.default};
    color: ${(props) => props.theme.colors.text.default};
  }
`;

export const Row = styled.div`
  padding: ${(props) => props.theme.spacing.large};
  /* margin-left: auto; */
  /* margin-right: auto; */
  text-align: center;
  box-shadow: ${(props) => props.theme.shadow.dividerBottom.boxShadow};
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.background.inverse};
  color: ${(props) => props.theme.colors.text.inverse};
  &:hover {
    background-color: ${(props) => props.theme.colors.background.default};
    color: ${(props) => props.theme.colors.text.default};
  }
`;

export const HighlightedRow = styled.div`
  /* padding: ${(props) => props.theme.spacing.large}; */
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
  cursor: auto;
  background-color: ${(props) => props.theme.colors.background.default};
  color: ${(props) => props.theme.colors.text.default};
`;
