import { useRef, useEffect, useState } from 'react';
import { theme, Variant, VariantOptions } from '../../../config/theme';
import { Icon, Parag, Wrapper } from './Alert.style';

type Props = {
  text: string;
  variant: Variant;
};

export function AlertView({ text, variant }: Props) {
  const paragraph = useRef<HTMLParagraphElement | null>(null);
  const [isMultiline, setIsMultiline] = useState(false);
  useEffect(() => {
    if (paragraph.current) {
      const height = paragraph.current.offsetHeight;
      setIsMultiline(height > 20);
    }
  }, []);
  return (
    <Wrapper isMultiline={isMultiline} variant={variant}>
      <>
        {variant === VariantOptions.SUCCESS && (
          <Icon icon={['fas', 'check-circle']} />
        )}
        {variant === VariantOptions.INFO && (
          <Icon icon={['fas', 'info-circle']} color={theme.palette.info.dark} />
        )}
        {variant === VariantOptions.ERROR && (
          <Icon
            icon={['fas', 'exclamation-circle']}
            color={theme.palette.error.main}
          />
        )}
        {variant === VariantOptions.WARNING && (
          <Icon
            icon={['fas', 'exclamation-triangle']}
            color={theme.palette.warning.main}
          />
        )}
        <Parag
          ref={paragraph}
          color={variant}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </>
    </Wrapper>
  );
}
