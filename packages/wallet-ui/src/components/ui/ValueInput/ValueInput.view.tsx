import {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { HelperText } from '../HelperText';
import { Label } from '../Label';
import {
  Icon,
  Input,
  InputContainer,
  Left,
  RowWrapper,
  Wrapper,
} from './ValueInput.style';

type Props = {
  label?: string;
  validator?: (value: any) => boolean;
  setIsValid?: Dispatch<SetStateAction<boolean>>;
} & InputHTMLAttributes<HTMLInputElement>;

export const ValueInputView = ({
  disabled,
  onChange,
  label,
  validator,
  setIsValid,
  ...otherProps
}: Props) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  const displayIcon = () => {
    return valid || error !== '';
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);

    if (!inputRef.current) {
      return;
    }
    let isValid = inputRef.current.value !== '';
    if (validator !== null) {
      isValid = isValid && validator(inputRef.current.value);
    }

    if (isValid) {
      setValid(true);
      setError('');
    } else {
      setValid(false);
      setError('Invalid format');
    }

    if (setIsValid) {
      setIsValid(isValid);
    }
  };

  return (
    <Wrapper>
      <RowWrapper>
        <Label error={Boolean(error)}>{label}</Label>
      </RowWrapper>

      <InputContainer
        error={Boolean(error)}
        disabled={disabled}
        focused={focused}
        withIcon={displayIcon()}
      >
        <Left>
          {displayIcon() && (
            <Icon
              icon={error ? ['fas', 'times-circle'] : ['fas', 'check-circle']}
              error={error}
            />
          )}
          <Input
            error={Boolean(error)}
            disabled={disabled}
            focused={focused}
            withIcon={displayIcon()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            ref={inputRef}
            // onKeyDown={(event) => handleOnKeyDown(event)}
            onChange={(event) => handleOnChange(event)}
            {...otherProps}
          />
        </Left>
      </InputContainer>
      {error && <HelperText>{error}</HelperText>}
    </Wrapper>
  );
};
