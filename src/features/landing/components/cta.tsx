'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { CTABackground } from '@/components/ui/backgrounds';
import { Button } from '@/components/ui/button';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function CTA() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <CTABackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Начните бесплатно
            </span>
          </motion.div>

          {/* Heading */}
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            Готовы создать своё{' '}
            <span className="text-gradient">приложение</span>?
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Присоединяйтесь к тысячам создателей, которые уже строят свои
            проекты с помощью Shakel. Бесплатный старт, никакой привязки карты.
          </p>

          {/* CTA Buttons */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            aria-label="Call to Action"
          >
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-base md:text-lg group active:scale-[0.98] transition-transform duration-150"
              asChild
            >
              <Link href="/projects/new">
                Начать бесплатно
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-base md:text-lg active:scale-[0.98] transition-transform duration-150"
              asChild
            >
              <Link href="/features">Посмотреть демо</Link>
            </Button>
          </motion.nav>

          {/* Trust indicators */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Доверяют команды по всему миру
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0 text-muted-foreground/60">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">10K+</span>
                <span className="text-sm">проектов</span>
              </div>
              <span
                className="hidden sm:block w-px h-4 bg-border mx-6"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">500+</span>
                <span className="text-sm">компаний</span>
              </div>
              <span
                className="hidden sm:block w-px h-4 bg-border mx-6"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  99.9%
                </span>
                <span className="text-sm">аптайм</span>
              </div>
            </div>
          </motion.footer>
        </motion.article>
      </div>
    </section>
  );
}
