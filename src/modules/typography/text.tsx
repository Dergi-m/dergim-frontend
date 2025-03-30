import { HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import { tv, VariantProps } from '@/lib/variants';

const textVariants = tv({
  base: '',
  variants: {
    size: {
      default: 'text-base font-normal',
      xs: 'text-xs font-light',
      sm: 'text-sm font-normal',
      lg: 'text-lg font-normal',
    },
    multirow: {
      true: 'whitespace-pre-line',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type TextProps = HTMLAttributes<HTMLElement> &
  (
    | {
        as?: 'p' | 'div' | 'span' | 'label';
        asChild?: false;
      }
    | {
        as?: never;
        asChild: true;
      }
  );

export function Text({
  as: Component = 'p',
  asChild,
  size,
  multirow,
  className,
  ...props
}: TextProps & VariantProps<typeof textVariants>) {
  const Tag = asChild ? Slot : Component;

  return (
    <Tag
      {...props}
      className={textVariants({ size, multirow, className })}
    />
  );
}
