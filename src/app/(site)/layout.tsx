import { ReactNode } from 'react';

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({ children }: SiteLayoutProps) {
  return <>{children}</>;
}
