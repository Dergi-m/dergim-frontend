import { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

import { tv, VariantProps } from '@/lib/variants';

const headingVariants = tv({
  base: '',
  variants: {
    size: {
      h1: 'text-6xl font-bold',
      h2: 'text-5xl font-bold',
      h3: 'text-4xl font-bold',
      h4: 'text-3xl font-bold',
      h5: 'text-2xl font-medium',
      h6: 'text-xl font-medium',
    },
  },
});

type HeadingProps =
  | {
      asChild?: false;
      as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    }
  | {
      asChild: true;
      as?: never;
    };

export function Heading({
  as: Component,
  asChild,
  size,
  className,
  ...props
}: ComponentPropsWithoutRef<'h1'> & HeadingProps & Required<VariantProps<typeof headingVariants>>) {
  const Tag = asChild ? Slot : Component;

  return (
    <Tag
      {...props}
      className={headingVariants({ size, className })}
    />
  );
}
