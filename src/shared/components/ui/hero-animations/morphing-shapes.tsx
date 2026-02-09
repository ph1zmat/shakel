'use client';

import { motion } from 'framer-motion';

export function MorphingShapes() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background ambient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

      {/* Morphing shape container */}
      <div className="relative w-64 h-64">
        {/* Shape 1 - Circle to Square */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="absolute bg-gradient-to-br from-blue-500/40 to-lime-500/40 backdrop-blur-sm"
            animate={{
              borderRadius: ['50%', '10%', '50%'],
              scale: [1, 0.8, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: '200px',
              height: '200px',
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.3)',
            }}
          />
        </motion.div>

        {/* Shape 2 - Triangle morph */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="absolute bg-gradient-to-tr from-lime-500/30 to-blue-500/30 backdrop-blur-sm"
            animate={{
              clipPath: [
                'polygon(50% 0%, 100% 100%, 0% 100%)',
                'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                'polygon(50% 0%, 100% 100%, 0% 100%)',
              ],
              scale: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: '160px',
              height: '160px',
            }}
          />
        </motion.div>

        {/* Shape 3 - Hexagon pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="absolute border-2"
            animate={{
              borderColor: [
                'rgba(59, 130, 246, 0.6)',
                'rgba(132, 204, 22, 0.6)',
                'rgba(59, 130, 246, 0.6)',
              ],
              rotate: [0, 60, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: '120px',
              height: '120px',
              clipPath:
                'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              boxShadow: 'inset 0 0 30px rgba(132, 204, 22, 0.2)',
            }}
          />
        </motion.div>

        {/* Center logo/text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-white">S</span>
          </div>
        </motion.div>

        {/* Orbiting dots */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * 2 * Math.PI;
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-primary"
              animate={{
                x: [
                  Math.cos(angle) * 100,
                  Math.cos(angle + Math.PI / 3) * 100,
                  Math.cos(angle + (2 * Math.PI) / 3) * 100,
                  Math.cos(angle + Math.PI) * 100,
                  Math.cos(angle + (4 * Math.PI) / 3) * 100,
                  Math.cos(angle + (5 * Math.PI) / 3) * 100,
                  Math.cos(angle) * 100,
                ],
                y: [
                  Math.sin(angle) * 100,
                  Math.sin(angle + Math.PI / 3) * 100,
                  Math.sin(angle + (2 * Math.PI) / 3) * 100,
                  Math.sin(angle + Math.PI) * 100,
                  Math.sin(angle + (4 * Math.PI) / 3) * 100,
                  Math.sin(angle + (5 * Math.PI) / 3) * 100,
                  Math.sin(angle) * 100,
                ],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.5,
              }}
              style={{
                left: 'calc(50% - 6px)',
                top: 'calc(50% - 6px)',
              }}
            />
          );
        })}

        {/* Grid lines effect */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Text indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="text-muted-foreground text-sm tracking-wider uppercase">
          Трансформация идей
        </p>
      </motion.div>
    </div>
  );
}
