'use client';

import { motion } from 'framer-motion';

export function PulseGlow() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Outer rings */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/10"
          style={{
            width: `${300 + i * 60}px`,
            height: `${300 + i * 60}px`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
            borderColor: [
              'rgba(59, 130, 246, 0.1)',
              'rgba(132, 204, 22, 0.2)',
              'rgba(59, 130, 246, 0.1)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main glowing orb */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(132, 204, 22, 0.8) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Core */}
      <motion.div
        className="relative w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center z-10"
        animate={{
          boxShadow: [
            '0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(132, 204, 22, 0.3)',
            '0 0 60px rgba(132, 204, 22, 0.6), 0 0 100px rgba(59, 130, 246, 0.4)',
            '0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(132, 204, 22, 0.3)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.span
          className="text-4xl font-black text-white"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡
        </motion.span>
      </motion.div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI;
        const radius = 180;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-primary"
            style={{
              left: `calc(50% + ${Math.cos(angle) * radius}px)`,
              top: `calc(50% + ${Math.sin(angle) * radius}px)`,
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
              x: [0, Math.cos(angle) * 30, 0],
              y: [0, Math.sin(angle) * 30, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Energy lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient
            id="energyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#84cc16" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={`${50 + Math.cos((i / 6) * 2 * Math.PI) * 40}%`}
            y2={`${50 + Math.sin((i / 6) * 2 * Math.PI) * 40}%`}
            stroke="url(#energyGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
