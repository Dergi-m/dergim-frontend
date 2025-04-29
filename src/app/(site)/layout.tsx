import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Footer } from '@/modules/site-layout/footer';
import {
  Header,
  HeaderLeftArea,
  HeaderMainArea,
  HeaderMainBar,
  HeaderRightArea,
} from '@/modules/site-layout/header';
import { Text } from '@/modules/typography/text';

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
        <HeaderMainBar>
          <HeaderLeftArea>
            <Link href={'/'}>
              <Image
                alt="header-logo"
                src={'/logo.png'}
                className="w-60"
                width={450}
                height={100}
              />
            </Link>
          </HeaderLeftArea>
          <HeaderMainArea className="flex w-full items-center justify-center">
            <Link href={'/'}>
              <Text>Solutions</Text>
            </Link>
          </HeaderMainArea>
          <HeaderRightArea className="flex items-center justify-between">
            <Link href={'/auth?act=login'}>Login</Link>
            <Link href={'/auth?act=register'}>Register</Link>
          </HeaderRightArea>
        </HeaderMainBar>
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
