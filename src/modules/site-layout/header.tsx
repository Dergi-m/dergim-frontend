import { ComponentProps } from 'react';

import { cn, tv, VariantProps } from '@/lib/variants';
import { Section } from '@/modules/ui/section';

const headerVariants = tv({
  base: 'bg-primary z-20 drop-shadow-md',
  variants: {
    sticky: {
      true: 'sticky top-0',
    },
  },
});

export async function Header({
  sticky,
  className,
  children,
  ...props
}: ComponentProps<'header'> & VariantProps<typeof headerVariants>) {
  return (
    <header
      {...props}
      className={headerVariants({ sticky, className })}
    >
      {children}
    </header>
  );
}

export function HeaderContainer({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <Section
      {...props}
      className={cn('flex w-full justify-between px-5 md:container', className)}
    >
      {children}
    </Section>
  );
}

export function HeaderTopBar({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('bg-header text-header-foreground flex w-full', className)}
    >
      <HeaderContainer>{children}</HeaderContainer>
    </div>
  );
}

export function HeaderMainBar({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('bg-header text-header-foreground flex w-full py-4', className)}
    >
      <HeaderContainer>{children}</HeaderContainer>
    </div>
  );
}

export function HeaderBottomBar({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('bg-header text-header-foreground w-full', className)}
    >
      <HeaderContainer>{children}</HeaderContainer>
    </div>
  );
}

export function HeaderLeftArea({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex items-center gap-4', className)}
    >
      {children}
    </div>
  );
}

export function HeaderMainArea({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex-auto items-center justify-center gap-4', className)}
    >
      {children}
    </div>
  );
}

export function HeaderRightArea({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex items-center gap-4', className)}
    >
      {children}
    </div>
  );
}
