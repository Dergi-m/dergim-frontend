import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Footer } from '@/modules/site-layout/footer';
import { Header } from '@/modules/site-layout/header';

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <>
      <Header
        className="bg-background py-6"
        sticky
      >
        <div className="flex w-full items-center justify-center">
          <Link href={'/'}>
            <Image
              alt="header-logo"
              src={'/logo.png'}
              className="flex w-60 items-center justify-center"
              width={450}
              height={100}
            />
          </Link>
        </div>
      </Header>
      <main
        id="mainContent"
        className="flex-auto"
      >
        {children}
      </main>
      <Footer>
        <div className="text-center">Copyright &copy; {year}. All rights reserved.</div>
      </Footer>
    </>
  );
}
