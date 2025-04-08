import { ReactNode } from 'react';

type ToolLayoutProps = {
  children: ReactNode;
};

export default async function ToolLayout({ children }: ToolLayoutProps) {
  return <>{children}</>;
}
