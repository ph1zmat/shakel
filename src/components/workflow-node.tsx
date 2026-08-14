'use client';

import { Settings2Icon, Trash2Icon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function WorkflowNode({
  name,
  description,
  onSettings,
  onDelete,
  children,
  className,
}: {
  name: string;
  description?: string;
  onSettings?: () => void;
  onDelete?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const showToolbar = onSettings || onDelete;
  return (
    <div className={cn('group/workflow-node relative flex flex-col items-center', className)}>
      {showToolbar ? (
        <div className="absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-md border bg-background px-1 py-0.5 opacity-0 shadow-sm transition-opacity group-hover/workflow-node:opacity-100">
          {onSettings ? (
            <button
              type="button"
              aria-label="Settings"
              onClick={onSettings}
              className="flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Settings2Icon className="size-3.5" />
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              aria-label="Delete"
              onClick={onDelete}
              className="flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2Icon className="size-3.5" />
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="mb-0.5 text-center text-[10px] leading-tight font-medium text-muted-foreground">
        {name}
        {description ? (
          <div className="text-[9px] font-normal text-muted-foreground/70">
            {description}
          </div>
        ) : null}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
