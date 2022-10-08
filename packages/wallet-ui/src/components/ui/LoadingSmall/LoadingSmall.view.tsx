import { HTMLAttributes } from 'react';
import { LoadingSpinner, LoadingText, Wrapper } from './LoadingSmall.style';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {} & HTMLAttributes<HTMLDivElement>;

export const LoadingSmallView = ({ ...otherProps }: Props) => {
  return (
    <Wrapper {...otherProps}>
      <LoadingSpinner icon="spinner" pulse />
      <LoadingText>Loading</LoadingText>
    </Wrapper>
  );
};
