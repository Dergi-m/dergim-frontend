import { ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/variants';

type SkipNavProps = {
  target: string;
  className?: string;
  children: ReactNode;
};

export async function SkipNav({ target, className, children }: SkipNavProps) {
  return (
    <Link
      href={target}
      className={cn(
        'fixed left-1/2 top-0 z-50 -translate-x-1/2 translate-y-[-150%] rounded-b border-border bg-secondary px-5 py-2 text-xl text-secondary-foreground transition-transform duration-200 ease-in focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {children}
    </Link>
  );
}
