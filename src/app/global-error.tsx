'use client';

import { roboto } from '@/lib/fonts';
import { cn } from '@/lib/variants';
import { ClientError } from '@/modules/error/client-error';

type GlobalErrorPageProps = {
  error: Error & {
    digest?: string;
  };
};

export default function GlobalErrorPage({ error }: GlobalErrorPageProps) {
  return (
    <html
      className={cn(
        roboto.variable,
        'touch-manipulation scroll-smooth bg-background font-sans text-foreground antialiased'
      )}
    >
      <head />
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <ClientError error={error} />
      </body>
    </html>
  );
}
