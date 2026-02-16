'use client';

import { useState, useCallback, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const useUpgradeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = useCallback((error: { message?: string; data?: { code?: string } | null }) => {
    if (error.data?.code === 'FORBIDDEN' || error.message?.includes('limit')) {
      setErrorMessage(
        error.message || 'Вы достигли лимита вашего тарифного плана.',
      );
      setIsOpen(true);
    }
  }, []);

  const modal: ReactNode = (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Обновите тариф</DialogTitle>
          <DialogDescription>
            {errorMessage ||
              'Вы достигли лимита вашего тарифного плана. Обновите тариф для продолжения.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Закрыть
          </Button>
          <Button
            onClick={() => {
              window.location.href = '/pricing';
            }}
          >
            Обновить тариф
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { handleError, modal };
};
