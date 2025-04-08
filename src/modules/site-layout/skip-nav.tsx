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
        'border-border bg-secondary text-secondary-foreground focus-visible:ring-ring fixed top-0 left-1/2 z-50 -translate-x-1/2 translate-y-[-150%] rounded-b px-5 py-2 text-xl transition-transform duration-200 ease-in focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
    >
      {children}
    </Link>
  );
}
