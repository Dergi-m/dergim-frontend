import { ReactNode } from 'react';

type FooterProps = {
  children?: ReactNode;
};

export function Footer({ children }: FooterProps) {
  return (
    <footer className="h-1/6 border-t bg-footer py-6 text-footer-foreground lg:py-8">
      <div className="flex flex-col gap-8 lg:gap-4">{children}</div>
    </footer>
  );
}
