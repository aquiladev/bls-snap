import { HTMLAttributes, ReactNode } from 'react';
import { Wrapper } from './RoundedIcon.style';

type Props = {
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const RoundedIconView = ({ children, ...otherProps }: Props) => {
  return <Wrapper {...otherProps}>{children}</Wrapper>;
};
