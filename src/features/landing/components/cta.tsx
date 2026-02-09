'use client';

import { motion } from 'motion/react';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CTABackground } from '@/shared/components/ui/backgrounds';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <CTABackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Начните бесплатно
            </span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Готовы создать своё{' '}
            <span className="text-gradient">приложение</span>?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Присоединяйтесь к тысячам создателей, которые уже строят свои проекты с помощью Shakel. 
            Бесплатный старт, никакой привязки карты.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button variant="gradient" size="lg" className="px-8 py-6 text-lg group" asChild>
              <a href="#get-started">
                Начать бесплатно
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg" asChild>
              <a href="#demo">
                Посмотреть демо
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Доверяют команды по всему миру
            </p>
            <div className="flex justify-center gap-8 text-muted-foreground/60">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">10K+</span>
                <span className="text-sm">проектов</span>
              </div>
              <div className="w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">500+</span>
                <span className="text-sm">компаний</span>
              </div>
              <div className="w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">99.9%</span>
                <span className="text-sm">аптайм</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
