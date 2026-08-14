'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// DESIGN SYSTEM TOKENS
// ============================================
const COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#84cc16', // lime-500
  accent: '#8b5cf6', // violet-500
  glow: 'rgba(59, 130, 246, 0.15)',
  glowSecondary: 'rgba(132, 204, 22, 0.1)',
};

const BLUR = {
  sm: '60px',
  md: '100px',
  lg: '150px',
  xl: '200px',
};

// ============================================
// BASE COMPONENTS
// ============================================

// Gradient Orb - базовый элемент свечения
function GradientOrb({
  color,
  size = 400,
  blur = BLUR.lg,
  className,
  animate = false,
}: {
  color: string;
  size?: number;
  blur?: string;
  className?: string;
  animate?: boolean;
}) {
  const orb = (
    <div
      className={cn('absolute rounded-full pointer-events-none', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur})`,
      }}
    />
  );

  if (animate) {
    return (
      <motion.div
        className={cn('absolute rounded-full pointer-events-none', className)}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${blur})`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return orb;
}

// Grid Pattern - базовый паттерн сетки
function GridPattern({
  className,
  color = 'rgba(255,255,255,0.03)',
  size = 60,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

// Dot Pattern - точечный паттерн
function DotPattern({
  className,
  color = 'rgba(255,255,255,0.15)',
  size = 24,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

// Noise Texture - шум для текстуры
function NoiseTexture({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none opacity-[0.015]',
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ============================================
// SECTION BACKGROUNDS
// ============================================

// HERO: Большие центральные orbs + grid
export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary large orb - top center */}
      <GradientOrb
        color={COLORS.glow}
        size={800}
        blur={BLUR.xl}
        className="-top-1/4 left-1/2 -translate-x-1/2"
        animate
      />

      {/* Secondary orb - right side */}
      <GradientOrb
        color={COLORS.glowSecondary}
        size={600}
        blur={BLUR.lg}
        className="top-1/4 -right-32"
        animate
      />

      {/* Tertiary accent - left bottom */}
      <GradientOrb
        color="rgba(139, 92, 246, 0.1)"
        size={500}
        blur={BLUR.lg}
        className="bottom-0 -left-32"
      />

      {/* Grid overlay */}
      <GridPattern className="opacity-100" size={60} />

      {/* Noise texture */}
      <NoiseTexture />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </div>
  );
}

// BENTO/FEATURES: Горизонтальные полосы + centered glow
export function FeaturesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Central glow behind cards */}
      <GradientOrb
        color={COLORS.glow}
        size={700}
        blur={BLUR.xl}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Horizontal gradient strips */}
      <div
        className="absolute top-1/4 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}30, transparent)`,
        }}
      />
      <div
        className="absolute bottom-1/3 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.secondary}20, transparent)`,
        }}
      />

      {/* Subtle dots */}
      <DotPattern className="opacity-50" size={32} />

      {/* Noise */}
      <NoiseTexture />
    </div>
  );
}

// HOW IT WORKS: Диагональные элементы
export function HowItWorksBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Left side glow */}
      <GradientOrb
        color={COLORS.glow}
        size={500}
        blur={BLUR.lg}
        className="top-1/2 -left-32 -translate-y-1/2"
        animate
      />

      {/* Right side secondary glow */}
      <GradientOrb
        color={COLORS.glowSecondary}
        size={400}
        blur={BLUR.md}
        className="bottom-1/4 -right-20"
      />

      {/* Diagonal lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="diagonal"
            patternUnits="userSpaceOnUse"
            width="40"
            height="40"
          >
            <line
              x1="0"
              y1="40"
              x2="40"
              y2="0"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal)" />
      </svg>

      {/* Noise */}
      <NoiseTexture />
    </div>
  );
}

// PRICING: Симметричные боковые glows
export function PricingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Left glow */}
      <GradientOrb
        color={COLORS.glow}
        size={500}
        blur={BLUR.lg}
        className="top-1/3 -left-40"
      />

      {/* Right glow */}
      <GradientOrb
        color={COLORS.glowSecondary}
        size={500}
        blur={BLUR.lg}
        className="bottom-1/3 -right-40"
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}40, transparent)`,
        }}
      />

      {/* Fine grid */}
      <GridPattern className="opacity-100" size={40} />

      {/* Noise */}
      <NoiseTexture />
    </div>
  );
}

// TESTIMONIALS: Мягкий центральный glow
export function TestimonialsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Central soft glow */}
      <GradientOrb
        color="rgba(139, 92, 246, 0.1)"
        size={600}
        blur={BLUR.xl}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate
      />

      {/* Corner accents */}
      <GradientOrb
        color={COLORS.glow}
        size={300}
        blur={BLUR.md}
        className="-top-20 -left-20"
      />

      <GradientOrb
        color={COLORS.glowSecondary}
        size={300}
        blur={BLUR.md}
        className="-bottom-20 -right-20"
      />

      {/* Dot pattern */}
      <DotPattern className="opacity-30" size={40} />

      {/* Noise */}
      <NoiseTexture />
    </div>
  );
}

// CTA: Фокусный центральный glow
export function CTABackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Strong central glow */}
      <GradientOrb
        color={COLORS.glow}
        size={700}
        blur={BLUR.xl}
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate
      />

      {/* Secondary glow */}
      <GradientOrb
        color={COLORS.glowSecondary}
        size={500}
        blur={BLUR.lg}
        className="top-1/4 right-1/4"
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, #0a0a0f 70%)',
        }}
      />

      {/* Grid */}
      <GridPattern className="opacity-100" size={50} />

      {/* Noise */}
      <NoiseTexture />
    </div>
  );
}

// FOOTER: Минималистичный с тонким паттерном
export function FooterBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}30, ${COLORS.secondary}30, transparent)`,
        }}
      />

      {/* Subtle bottom glow */}
      <GradientOrb
        color={COLORS.glow}
        size={400}
        blur={BLUR.lg}
        className="-bottom-40 left-1/2 -translate-x-1/2"
      />

      {/* Very subtle grid */}
      <GridPattern className="opacity-[0.02]" size={80} />

      {/* Noise */}
      <NoiseTexture />
    </div>
  );
}

// CONTENT PAGE (docs, contact, etc): Чистый с боковым акцентом
export function ContentPageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Left side vertical glow */}
      <div
        className="absolute top-0 bottom-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, ${COLORS.primary}20, transparent)`,
        }}
      />

      {/* Top right corner glow */}
      <GradientOrb
        color={COLORS.glow}
        size={400}
        blur={BLUR.lg}
        className="-top-40 -right-40"
      />

      {/* Subtle grid */}
      <GridPattern className="opacity-[0.02]" size={60} />

      {/* Noise */}
      <NoiseTexture />
    </div>
  );
}

// ============================================
// WRAPPER COMPONENT
// ============================================

interface SectionBackgroundProps {
  children: ReactNode;
  variant:
    | 'hero'
    | 'features'
    | 'howItWorks'
    | 'pricing'
    | 'testimonials'
    | 'cta'
    | 'footer'
    | 'content';
  className?: string;
}

const backgroundMap = {
  hero: HeroBackground,
  features: FeaturesBackground,
  howItWorks: HowItWorksBackground,
  pricing: PricingBackground,
  testimonials: TestimonialsBackground,
  cta: CTABackground,
  footer: FooterBackground,
  content: ContentPageBackground,
};

export function SectionBackground({
  children,
  variant,
  className,
}: SectionBackgroundProps) {
  const BackgroundComponent = backgroundMap[variant];

  return (
    <section className={cn('relative overflow-hidden', className)}>
      <BackgroundComponent />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

// ============================================
// LEGACY WRAPPER (для обратной совместимости)
// ============================================

export function Background({
  children,
  className,
  variant = 'content',
}: {
  children: ReactNode;
  className?: string;
  variant?: SectionBackgroundProps['variant'];
}) {
  return (
    <SectionBackground variant={variant} className={className}>
      {children}
    </SectionBackground>
  );
}
