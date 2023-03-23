import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  box-shadow: ${(props) => props.theme.shadow.dividerBottom.boxShadow};
  background-color: ${(props) => props.theme.colors.background.default};
  padding: ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
  align-items: center;
  color: ${(props) => props.theme.colors.text.default};
  &:hover {
    background-color: ${(props) => props.theme.colors.background.inverse};
    color: ${(props) => props.theme.colors.text.inverse};
  }
`;

export const Description = styled.span`
  font-size: ${(props) => props.theme.typography.p1.fontSize};
`;
