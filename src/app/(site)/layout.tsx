import { ReactNode } from 'react';
import Image from 'next/image';

import { Footer } from '@/modules/site-layout/footer';
import { Header } from '@/modules/site-layout/header';

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Header
        className="bg-background py-6"
        sticky
      >
        <div className="flex w-full items-center justify-center">
          <Image
            alt="header-logo"
            src={'/logo.png'}
            className="flex w-60 items-center justify-center"
            width={450}
            height={100}
          />
        </div>
      </Header>
      <main
        id="mainContent"
        className="flex-auto"
      >
        {children}
      </main>
      <Footer>
        <div className="flex flex-col gap-8 lg:gap-4">
          <div>Footer Content</div>
          <div>Footer Links</div>
        </div>
      </Footer>
    </>
  );
}
