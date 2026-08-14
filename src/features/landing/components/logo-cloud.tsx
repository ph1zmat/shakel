'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

// Real tech brand logos using SVG icons
const integrations = [
  {
    name: 'PostgreSQL',
    icon: '/icons/postgresql.svg',
    fallback: '🔷',
  },
  {
    name: 'Redis',
    icon: '/icons/redis.svg',
    fallback: '⚡',
  },
  {
    name: 'Docker',
    icon: '/icons/docker.svg',
    fallback: '🐳',
  },
  {
    name: 'Stripe',
    icon: '/icons/stripe.svg',
    fallback: '💳',
  },
  {
    name: 'GitHub',
    icon: '/icons/github.svg',
    fallback: '🐙',
  },
  {
    name: 'MongoDB',
    icon: '/icons/mongodb.svg',
    fallback: '🍃',
  },
  {
    name: 'AWS',
    icon: '/icons/aws.svg',
    fallback: '☁️',
  },
  {
    name: 'Vercel',
    icon: '/icons/vercel.svg',
    fallback: '▲',
  },
  {
    name: 'Supabase',
    icon: '/icons/supabase.svg',
    fallback: '⚡',
  },
  {
    name: 'OpenAI',
    icon: '/icons/openai.svg',
    fallback: '🤖',
  },
  {
    name: 'Slack',
    icon: '/icons/slack.svg',
    fallback: '💬',
  },
  {
    name: 'Discord',
    icon: '/icons/discord.svg',
    fallback: '🎮',
  },
];

export function LogoCloud() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      aria-labelledby="integrations-heading"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-xs md:text-sm text-white/40 mb-8 uppercase tracking-widest"
          id="integrations-heading"
        >
          Интеграции с мировыми технологиями
        </motion.p>

        <div className="relative overflow-hidden">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />

          {/* Scrolling container */}
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex gap-4 md:gap-6 items-center will-change-transform"
          >
            {/* Double the items for seamless loop */}
            {[...integrations, ...integrations].map((item, index) => (
              <motion.div
                key={`${item.name}-${index}`}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 shrink-0 group hover:border-white/10 hover:bg-white/[0.04]"
              >
                <span
                  className="text-lg md:text-xl transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                >
                  {item.fallback}
                </span>
                <span className="text-xs md:text-sm font-medium text-white/60 whitespace-nowrap group-hover:text-white/80 transition-colors duration-300">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
