'use client';
import { IconMenu2, IconX } from '@tabler/icons-react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Smooth easing curve
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
  id?: string;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn('fixed inset-x-0 top-0 z-50 w-full', className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(12px)' : 'blur(0px)',
        boxShadow: visible
          ? '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : 'none',
        width: visible ? 'min(90%, 900px)' : '100%',
        y: visible ? 16 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        'relative z-50 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-none lg:rounded-full bg-transparent px-4 lg:px-6 py-3 lg:flex',
        visible && 'bg-black/60 dark:bg-neutral-950/60',
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'hidden flex-row items-center justify-center gap-1 text-sm font-medium transition-colors lg:flex',
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-neutral-300 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
          key={item.link}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="nav-hovered"
              className="absolute inset-0 h-full w-full rounded-lg bg-white/5"
              transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(12px)' : 'blur(0px)',
        boxShadow: visible ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none',
        width: visible ? 'calc(100% - 2rem)' : '100%',
        marginLeft: visible ? '1rem' : '0',
        marginRight: visible ? '1rem' : '0',
        marginTop: visible ? '1rem' : '0',
        borderRadius: visible ? '1rem' : '0',
        y: visible ? 0 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        'relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-3 lg:hidden',
        visible && 'bg-black/80 dark:bg-neutral-950/80',
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  id,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={id}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
          className={cn(
            'absolute inset-x-0 top-full z-50 mt-2 flex w-full flex-col items-start justify-start gap-4 rounded-xl bg-black/95 border border-white/10 p-4 shadow-2xl',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
}: {
  isOpen: boolean;
  onClick: () => void;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}) => {
  return (
    <button
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {isOpen ? (
        <IconX className="w-6 h-6" />
      ) : (
        <IconMenu2 className="w-6 h-6" />
      )}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg transition-opacity hover:opacity-80"
      aria-label="Shakel Home"
    >
      <Image
        src="/gochi-logo.png"
        alt="Shakel"
        width={100}
        height={40}
        className="h-auto w-auto max-w-[80px] md:max-w-[100px]"
        priority
      />
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = 'a',
  children,
  className,
  variant = 'primary',
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'gradient';
} & (
  | React.ComponentPropsWithoutRef<'a'>
  | React.ComponentPropsWithoutRef<'button'>
)) => {
  const baseStyles =
    'px-4 py-2 rounded-lg text-sm font-medium relative cursor-pointer transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10',
    secondary:
      'bg-transparent text-white hover:bg-white/5 border border-white/10',
    dark: 'bg-black text-white border border-white/10 hover:bg-black/80',
    gradient:
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 shadow-lg shadow-blue-500/25',
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
