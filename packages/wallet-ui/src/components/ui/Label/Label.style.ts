import styled from 'styled-components';

type ILabel = {
  error?: boolean;
};

export const Label = styled.span<ILabel>`
  font-size: ${(props) => props.theme.typography.p2.fontSize};
  color: ${(props) =>
    props.error
      ? props.theme.palette.error.main
      : props.theme.colors.text.default};
  font-weight: ${(props) => props.theme.typography.bold.fontWeight};
  margin-bottom: ${(props) => props.theme.spacing.tiny2};
`;
