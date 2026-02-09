'use client';

import { motion } from 'motion/react';
import { 
  Database, 
  Globe, 
  Cloud, 
  Shield, 
  Zap, 
  Layers,
  Server,
  Code,
  Box,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';

const integrations = [
  { name: 'PostgreSQL', icon: Database },
  { name: 'REST API', icon: Globe },
  { name: 'AWS', icon: Cloud },
  { name: 'Auth0', icon: Shield },
  { name: 'Redis', icon: Zap },
  { name: 'Docker', icon: Box },
  { name: 'GraphQL', icon: Network },
  { name: 'Stripe', icon: Layers },
  { name: 'Kubernetes', icon: Server },
  { name: 'GitHub', icon: Code },
  { name: 'MongoDB', icon: HardDrive },
  { name: 'TensorFlow', icon: Cpu },
];

export function LogoCloud() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-white/40 mb-8 uppercase tracking-widest"
        >
          Интеграции с мировыми технологиями
        </motion.p>
        
        <div className="relative overflow-hidden">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
          
          {/* Scrolling container */}
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex gap-6 items-center"
          >
            {/* Double the items for seamless loop */}
            {[...integrations, ...integrations].map((item, index) => (
              <motion.div
                key={`${item.name}-${index}`}
                whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.3)' }}
                className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-300 shrink-0 group"
              >
                <item.icon className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-white/60 whitespace-nowrap group-hover:text-white/80 transition-colors">
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
