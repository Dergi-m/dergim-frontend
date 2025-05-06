'use client';

import { useState } from 'react';

import { Button } from '@/modules/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/modules/ui/dialog';
import { SpinAnim } from '@/modules/ui/spin-anim';

type LogOutButtonProps = {
  logOutAction: () => Promise<void>;
};

export function LogOutButtonContent({ logOutAction }: LogOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  async function handleLogOut() {
    setIsLoading(true);
    await logOutAction();
    setIsLoading(false);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Log Out</DialogTitle>
        <DialogDescription>Are you sure you want to log out?</DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex items-end justify-between">
        <DialogClose>
          <Button variant={'outline'}>Cancel</Button>
        </DialogClose>
        <Button
          onClick={handleLogOut}
          disabled={isLoading}
          className="w-24 bg-destructive hover:bg-destructive/90"
        >
          {isLoading ? <SpinAnim /> : 'Log Out'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
