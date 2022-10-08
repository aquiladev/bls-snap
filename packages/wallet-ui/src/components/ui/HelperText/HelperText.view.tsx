import { ReactNode } from 'react';
import { HelperText } from './HelperText.style';

type Props = {
  children?: ReactNode;
};

export const HelperTextView = ({ children }: Props) => {
  return <HelperText>{children}</HelperText>;
};
