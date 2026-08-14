'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { HeroBackground } from '@/components/ui/backgrounds';

// Smooth easing curves from Linear/Vercel
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

// Product UI Mockup - Real interface visualization
const ProductMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.3 }}
      className="relative w-full max-w-4xl mx-auto"
    >
      {/* Browser chrome */}
      <div className="relative rounded-xl border border-white/10 bg-[#0f0f14] overflow-hidden shadow-2xl shadow-black/50">
        {/* Window header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-3 py-1 rounded-md bg-white/5 text-xs text-white/30 font-mono">
              app.shakel.io/projects
            </div>
          </div>
          <div className="w-16" />
        </div>

        {/* App interface */}
        <div className="flex h-[300px] sm:h-[350px] md:h-[400px]">
          {/* Sidebar */}
          <aside className="w-56 border-r border-white/5 bg-white/[0.01] p-4 hidden sm:block">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-lime-500 flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
              <span className="text-white/80 font-medium">Shakel</span>
            </div>

            <nav className="space-y-1" aria-label="Sidebar Navigation">
              {['Проекты', 'База данных', 'API', 'Аналитика', 'Настройки'].map(
                (item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 ${
                      i === 0
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </motion.div>
                ),
              )}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
              <div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-base md:text-lg font-semibold text-white"
                >
                  Мои проекты
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs md:text-sm text-white/40"
                >
                  12 активных приложений
                </motion.p>
              </div>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="px-3 md:px-4 py-2 rounded-lg bg-blue-500 text-white text-xs md:text-sm font-medium hover:bg-blue-600 active:scale-95 transition-all duration-200"
              >
                Новый проект
              </motion.button>
            </header>

            {/* Projects grid */}
            <section
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
              aria-label="Project Cards"
            >
              {[
                {
                  name: 'CRM Система',
                  status: 'Опубликован',
                  color: 'bg-green-500',
                  emoji: '🚀',
                },
                {
                  name: 'Интернет-магазин',
                  status: 'В разработке',
                  color: 'bg-yellow-500',
                  emoji: '🛒',
                },
                {
                  name: 'Блог платформа',
                  status: 'Опубликован',
                  color: 'bg-green-500',
                  emoji: '✍️',
                },
                {
                  name: 'Аналитика',
                  status: 'Черновик',
                  color: 'bg-gray-500',
                  emoji: '📊',
                },
              ].map((project, i) => (
                <motion.article
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, ease: EASE_OUT_EXPO }}
                  className="p-3 md:p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-base md:text-lg group-hover:scale-110 transition-transform duration-300">
                      {project.emoji}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${project.color}`} />
                  </div>
                  <h3 className="text-white/90 font-medium mb-1 text-sm md:text-base">
                    {project.name}
                  </h3>
                  <p className="text-xs text-white/40">{project.status}</p>
                </motion.article>
              ))}
            </section>
          </main>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
      </div>

      {/* Floating elements - positioned relative to viewport */}
      <div className="absolute inset-0 overflow-visible pointer-events-none hidden lg:block">
        {/* Deploy Badge - Left side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.5, ease: EASE_OUT_QUART }}
          className="absolute -left-6 xl:-left-12 top-[15%]"
        >
          <div className="px-4 py-3 rounded-xl border border-white/10 bg-[#0f0f14]/95 backdrop-blur-xl shadow-xl shadow-black/30 pointer-events-auto min-w-[160px]">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </div>
              <span className="text-sm text-white/90 font-medium whitespace-nowrap">
                Deploy успешен
              </span>
            </div>
            <div className="text-xs text-white/50 mt-1.5 ml-5">
              2 секунды назад
            </div>
          </div>
        </motion.div>

        {/* Uptime Badge - Right side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.5, ease: EASE_OUT_QUART }}
          className="absolute -right-6 xl:-right-12 bottom-[20%]"
        >
          <div className="px-4 py-3 rounded-xl border border-white/10 bg-[#0f0f14]/95 backdrop-blur-xl shadow-xl shadow-black/30 pointer-events-auto min-w-[140px]">
            <div className="text-2xl font-bold text-white">99.9%</div>
            <div className="text-xs text-white/50 mt-0.5">
              Аптайм за 30 дней
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Stats with count-up animation
const Stats = () => {
  const stats = [
    { value: '10K+', label: 'Проектов создано' },
    { value: '500+', label: 'Компаний' },
    { value: '99.9%', label: 'Аптайм' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6, ease: EASE_OUT_QUART }}
      className="flex flex-wrap gap-6 sm:gap-8 md:gap-12 justify-center"
      aria-label="Platform Statistics"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + i * 0.1, ease: EASE_OUT_QUART }}
          className="flex flex-col items-center sm:items-start"
        >
          <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight">
            {stat.value}
          </span>
          <span className="text-xs md:text-sm text-white/40 mt-1">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.section>
  );
};

export const Hero = () => {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#0a0a0f]"
      aria-labelledby="hero-heading"
    >
      {/* Unified Background System */}
      <HeroBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-32 pb-16">
        <div className="max-w-5xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 md:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-xs md:text-sm text-white/70">
              v2.0 уже доступен
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white tracking-tight leading-[1.1] mb-4 md:mb-6"
          >
            Создавайте приложения
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-lime-400">
              без единой строки кода
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4"
          >
            Визуальный конструктор корпоративных приложений. Базы данных, API,
            автоматизация и AI — всё в одной платформе.
          </motion.p>

          {/* CTAs */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16"
            aria-label="Hero Actions"
          >
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto px-6 md:px-8 h-11 md:h-12 text-sm md:text-base font-medium group active:scale-[0.98] transition-transform duration-150"
              asChild
            >
              <Link href="/projects/new">
                Начать бесплатно
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 md:px-8 h-11 md:h-12 text-sm md:text-base font-medium border-white/10 text-white hover:bg-white/5 active:scale-[0.98] transition-all duration-150"
              asChild
            >
              <Link href="/features" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Смотреть демо
              </Link>
            </Button>
          </motion.nav>

          {/* Stats */}
          <Stats />
        </div>

        {/* Product Mockup */}
        <ProductMockup />
      </div>
    </section>
  );
};
