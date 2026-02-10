'use client';

import { motion } from 'framer-motion';

export function DynamicRays() {
  const rayCount = 24;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted opacity-50" />

      {/* Animated rays container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(rayCount)].map((_, i) => {
          const angle = (i / rayCount) * 360;
          const isEven = i % 2 === 0;

          return (
            <motion.div
              key={i}
              className="absolute origin-bottom"
              style={{
                width: '2px',
                height: '50%',
                bottom: '50%',
                left: '50%',
                background: isEven
                  ? 'linear-gradient(to top, transparent, rgba(59, 130, 246, 0.8), transparent)'
                  : 'linear-gradient(to top, transparent, rgba(132, 204, 22, 0.6), transparent)',
                transform: `rotate(${angle}deg)`,
              }}
              animate={{
                scaleY: [0.3, 1, 0.3],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.05,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Secondary rotating ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-gradient-primary"
            style={{
              left: `${50 + Math.cos((i / 8) * 2 * Math.PI) * 50}%`,
              top: `${50 + Math.sin((i / 8) * 2 * Math.PI) * 50}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </motion.div>

      {/* Tertiary counter-rotating ring */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-primary/10 border-dashed"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center core */}
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center z-10"
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 0 30px rgba(59, 130, 246, 0.5)',
            '0 0 60px rgba(132, 204, 22, 0.6)',
            '0 0 30px rgba(59, 130, 246, 0.5)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="text-3xl font-black text-white">POWER</span>
      </motion.div>

      {/* Speed lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 360;
          return (
            <motion.circle
              key={i}
              cx="50%"
              cy="50%"
              r="80"
              fill="none"
              stroke={i % 2 === 0 ? '#3b82f6' : '#84cc16'}
              strokeWidth="1"
              strokeDasharray="10 20"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                rotate: [angle, angle + 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              style={{
                transformOrigin: 'center',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
