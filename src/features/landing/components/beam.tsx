'use client';

import {
  IconAppWindow,
  IconBrandTelegram,
  IconServerBolt,
  IconWorldWww,
} from '@tabler/icons-react';
import { BotIcon, UserIcon } from 'lucide-react';
import type React from 'react';
import { forwardRef, useRef } from 'react';
import { AnimatedBeam } from '@/components/ui/magic/animated-beam';
import { cn } from '@/lib/utils';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';

export function BeamMultiple({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full items-center justify-center p-10',
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref} className="size-16">
            <UserIcon size={48} className="text-accent" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-20">
            <BotIcon size={48} className="text-accent" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-12">
          <Circle ref={div1Ref} className="size-16">
            <IconAppWindow size={48} className="text-accent" />
          </Circle>
          <Circle ref={div2Ref} className="size-16">
            <IconWorldWww size={48} className="text-accent" />
          </Circle>
          <Circle ref={div3Ref} className="size-16">
            <IconBrandTelegram size={48} className="text-accent" />
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <IconServerBolt size={48} className="text-accent" />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
      />
    </div>
  );
}
