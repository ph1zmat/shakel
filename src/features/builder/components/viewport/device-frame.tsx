'use client';

import { cn } from '@/lib/utils';
import type { ViewportType } from '../../types';

interface DeviceFrameProps {
  type: ViewportType;
  width: number;
  height: number;
  scale: number;
  children: React.ReactNode;
  className?: string;
}

export function DeviceFrame({
  type,
  width,
  height,
  scale,
  children,
  className,
}: DeviceFrameProps) {
  const isMobile = type === 'mobile';
  const isTablet = type === 'tablet';
  const isDesktop = type === 'desktop';

  return (
    <div
      className={cn(
        'relative flex flex-col transition-all duration-300 ease-out',
        className,
      )}
      style={{
        width: width * scale,
        height: height * scale + (isDesktop ? 0 : 40), // Add space for frame elements
      }}
    >
      {/* Device Frame Header */}
      {(isMobile || isTablet) && (
        <div className="relative h-6 bg-zinc-800 rounded-t-2xl flex items-center justify-center">
          {/* Notch / Camera */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-900" />
          </div>
        </div>
      )}

      {/* Screen Content */}
      <div
        className={cn(
          'relative overflow-hidden bg-background',
          (isMobile || isTablet) &&
            'border-x-8 border-b-8 border-zinc-800 rounded-b-2xl',
          isDesktop && 'rounded-lg border border-border shadow-2xl',
        )}
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        {/* Inner content with inverse scale for actual content */}
        <div
          className="absolute origin-top-left"
          style={{
            width,
            height,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>

        {/* Viewport Label */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-background/80 backdrop-blur-sm rounded text-[10px] font-medium text-muted-foreground border">
          {width} × {height}
        </div>
      </div>

      {/* Desktop Stand */}
      {isDesktop && (
        <div className="flex flex-col items-center">
          <div className="w-32 h-3 bg-zinc-700 rounded-b-lg" />
          <div className="w-48 h-1.5 bg-zinc-800 rounded-full mt-1" />
        </div>
      )}

      {/* Home Indicator */}
      {(isMobile || isTablet) && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-600 rounded-full z-10" />
      )}
    </div>
  );
}
