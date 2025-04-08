import { ReactNode } from 'react';

import { Footer } from '@/modules/site-layout/footer';
import { Header, HeaderMainBar, HeaderRightArea, HeaderTopBar } from '@/modules/site-layout/header';
import { MobilePrimaryNavigation } from '@/modules/site-layout/primary-navigation';

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Header sticky>
        <HeaderTopBar>
          <div className="flex h-full items-center justify-between px-4">
            <div>Logo</div>
            <div>Top Bar Content</div>
          </div>
        </HeaderTopBar>
        <HeaderMainBar>
          <div className="flex h-full items-center justify-between px-4">
            <div>Logo</div>
            <div>Search Bar</div>
            <div>Top Bar Content</div>
          </div>
          <HeaderRightArea>
            <MobilePrimaryNavigation>
              <div>Mobile Primary Navigation</div>
            </MobilePrimaryNavigation>
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
        <div className="flex flex-col gap-8 lg:gap-4">
          <div>Footer Content</div>
          <div>Footer Links</div>
        </div>
      </Footer>
    </>
  );
}
