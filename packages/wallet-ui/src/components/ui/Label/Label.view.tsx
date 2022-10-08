import { ReactNode } from 'react';
import { Label } from './Label.style';

type Props = {
  error?: boolean;
  children?: ReactNode;
};

export const LabelView = ({ error, children }: Props) => {
  return <Label error={error}>{children}</Label>;
};
