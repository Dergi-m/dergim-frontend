import { ComponentProps, forwardRef } from 'react';

import { tv, type VariantProps } from '@/lib/variants';

const richText = tv({
  base: 'prose',
  variants: {
    variant: {
      invert: 'prose-invert',
    },
    size: {
      default: 'prose-base',
      sm: 'prose-sm',
      lg: 'prose-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type RichTextProps = {
  text: string | null | undefined;
  children?: never;
} & ComponentProps<'div'>;

export const RichText = forwardRef<HTMLDivElement, RichTextProps & VariantProps<typeof richText>>(
  (props, ref) => {
    const { text, variant, size, ...forwardProps } = props;

    return (
      <div
        {...forwardProps}
        ref={ref}
        className={richText({ variant, size })}
        dangerouslySetInnerHTML={{ __html: text ?? '' }}
      />
    );
  }
);

RichText.displayName = 'RichText';
