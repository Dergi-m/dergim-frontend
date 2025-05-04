import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SessionProvider } from '@/contexts/session-context';
import { createServerCaller } from '@/server/api/root';
import { Button } from '@/modules/ui/button';
import { Footer } from '@/modules/site-layout/footer';
import {
  Header,
  HeaderLeftArea,
  HeaderMainBar,
  HeaderRightArea,
} from '@/modules/site-layout/header';

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const year = new Date().getFullYear();

  const api = await createServerCaller();
  const session = await api.website.authentication.getSession();

  if (session.success) {
    redirect('/tool');
  }

  return (
    <>
      <Header
        className="bg-background py-6"
        sticky
      >
        ,
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
          <HeaderRightArea className="flex items-center justify-between">
            <Link href={'/auth?act=login'}>
              <Button variant={'outline'}>Login</Button>
            </Link>
            <Link href={'/auth?act=register'}>
              <Button variant={'outline'}>Register</Button>
            </Link>
          </HeaderRightArea>
        </HeaderMainBar>
      </Header>
      <main
        id="mainContent"
        className="flex-auto"
      >
        <SessionProvider>{children}</SessionProvider>
      </main>
      <Footer>
        <div className="text-center">Copyright &copy; {year}. All rights reserved.</div>
      </Footer>
    </>
  );
}
