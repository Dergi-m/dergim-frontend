import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { roboto } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { TrpcProvider } from '@/modules/providers/trpc-provider';
import { TailwindIndicator } from '@/modules/theme/tailwind-indicator';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Dergi-m',
  description: 'Ultimate tool for managing your digital journals',
  icons: '/favicon.svg',
};

type RootLayoutProps = {
  children: ReactNode;
};
export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      className={cn(
        roboto.variable,
        'touch-manipulation scroll-smooth bg-background font-sans text-foreground antialiased'
      )}
      lang="en"
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <Analytics />
        <SpeedInsights />
        <TrpcProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </TrpcProvider>
        {process.env.NODE_ENV !== 'production' && <TailwindIndicator />}
      </body>
    </html>
  );
}
