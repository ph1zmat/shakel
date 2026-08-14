'use client';

import {
  Eye,
  EyeOff,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCanvasStore } from '../../stores/canvas-store';
import type { ViewportType } from '../../types';

const viewportIcons: Record<ViewportType, typeof Smartphone> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

const viewportLabels: Record<ViewportType, string> = {
  mobile: 'Mobile',
  tablet: 'Tablet',
  desktop: 'Desktop',
};

export function ViewportSwitcher() {
  const {
    viewport,
    setActiveViewport,
    toggleViewportVisibility,
    toggleSyncViewports,
    setDisplayMode,
  } = useCanvasStore();

  const handleViewportClick = (type: ViewportType) => {
    setActiveViewport(type);
    setDisplayMode('single');
  };

  const handleToggleVisibility = (e: React.MouseEvent, type: ViewportType) => {
    e.stopPropagation();
    toggleViewportVisibility(type);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
        {(Object.keys(viewport.viewports) as ViewportType[]).map((type) => {
          const Icon = viewportIcons[type];
          const config = viewport.viewports[type];
          const isActive = viewport.activeViewport === type;
          const isVisible = config.visible;

          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-8 px-2 gap-1.5 transition-all',
                      isActive && 'bg-primary/10 text-primary',
                    )}
                    onClick={() => handleViewportClick(type)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs hidden sm:inline">
                      {viewportLabels[type]}
                    </span>
                    <span className="text-[10px] text-muted-foreground hidden md:inline">
                      {config.width}px
                    </span>
                  </Button>

                  {/* Visibility toggle */}
                  <button
                    onClick={(e) => handleToggleVisibility(e, type)}
                    className={cn(
                      'absolute -top-1 -right-1 p-0.5 rounded-full bg-background border shadow-sm',
                      'opacity-0 group-hover:opacity-100 transition-opacity',
                      !isVisible && 'opacity-100 text-muted-foreground',
                    )}
                  >
                    {isVisible ? (
                      <Eye className="h-2.5 w-2.5" />
                    ) : (
                      <EyeOff className="h-2.5 w-2.5" />
                    )}
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {viewportLabels[type]} ({config.width}×{config.height})
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <div className="w-px h-4 bg-border mx-1" />

        {/* Sync toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewport.syncViewports ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 px-2',
                viewport.syncViewports && 'bg-primary/10 text-primary',
              )}
              onClick={toggleSyncViewports}
            >
              <RefreshCw
                className={cn(
                  'h-4 w-4',
                  viewport.syncViewports && 'animate-spin-slow',
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Синхронное редактирование всех viewport</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
