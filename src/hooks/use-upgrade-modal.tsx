'use client';

import { useCallback, useState } from 'react';
import { TRPCClientError } from '@trpc/client';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function useUpgradeModal() {
  const [open, setOpen] = useState(false);

  const handleError = useCallback((error: unknown) => {
    const isUpgradeError =
      error instanceof TRPCClientError && error.data?.code === 'FORBIDDEN';
    if (isUpgradeError) {
      setOpen(true);
      return;
    }
    throw error;
  }, []);

  const handleUpgrade = async () => {
    try {
      await authClient.checkoutEmbed({
        slug: 'Shakel',
        successUrl: window.location.href,
        returnUrl: window.location.href,
      });
    } catch (error) {
      console.error('Failed to start checkout:', error);
      setOpen(false);
    }
  };

  const modal = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            This feature requires an active subscription. Upgrade to unlock
            premium workflows and integrations.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade}>Upgrade now</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { handleError, modal };
}
