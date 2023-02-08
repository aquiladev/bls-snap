import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background.default};
  width: ${(props) => props.theme.modal.base};
  padding: ${(props) => props.theme.spacing.base};
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
  border-radius: 8px 8px 0px 0px;
  gap: ${(props) => props.theme.spacing.small};
  overflow-wrap: break-word;
`;

export const Bold = styled.div`
  font-size: ${(props) => props.theme.typography.p1.fontSize};
  font-weight: ${(props) => props.theme.typography.bold.fontWeight};
`;

export const Normal = styled.div`
  font-size: ${(props) => props.theme.typography.p2.fontSize};
`;
