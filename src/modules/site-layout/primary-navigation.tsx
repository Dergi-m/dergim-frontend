import { ReactNode } from 'react';
import { MenuIcon } from 'lucide-react';

import { NavigationMenu, NavigationMenuList } from '@/modules/ui/navigation-menu';
import { ScrollArea } from '@/modules/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/modules/ui/sheet';

type PrimaryNavigationProps = {
  children?: ReactNode;
};

export function DesktopPrimaryNavigation({ children }: PrimaryNavigationProps) {
  return (
    <NavigationMenu className="hidden h-full lg:block">
      <NavigationMenuList className="h-full">{children}</NavigationMenuList>
    </NavigationMenu>
  );
}

export function MobilePrimaryNavigation({ children }: PrimaryNavigationProps) {
  return (
    <div className="flex lg:hidden">
      <Sheet>
        <SheetTrigger className="flex items-center">
          <MenuIcon className="size-6" />
        </SheetTrigger>
        <SheetContent className="flex flex-1 flex-col p-0 pt-10">
          {/* Sheet title and description are mandatory for sheets. If they do not exist it causes an error.
          Since we don't need them, they are hidden.*/}
          <SheetTitle className="hidden" />
          <SheetDescription className="hidden" />

          <ScrollArea>{children}</ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
