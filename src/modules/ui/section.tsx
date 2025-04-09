import { ElementType, forwardRef, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/variants';

type SectionProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ as: Component = 'div', className, ...props }, ref) => {
    return (
      <Component
        {...props}
        ref={ref}
        className={cn('px-5 md:container', className)}
      />
    );
  }
);

Section.displayName = 'Section';
