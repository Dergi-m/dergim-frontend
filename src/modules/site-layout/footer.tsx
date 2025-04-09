import { ReactNode } from 'react';

type FooterProps = {
  children?: ReactNode;
};

export function Footer({ children }: FooterProps) {
  return (
    <footer className="bg-footer text-footer-foreground h-1/6 border-t py-6 lg:py-8">
      <div className="flex flex-col gap-8 lg:gap-4">{children}</div>
    </footer>
  );
}
