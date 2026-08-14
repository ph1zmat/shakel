'use client';

import {
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  MousePointer2,
  Palette,
  Puzzle,
  Rocket,
  Share2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { HowItWorksBackground } from '@/components/ui/backgrounds';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const steps = [
  {
    id: 1,
    number: '01',
    title: 'Выберите основу',
    subtitle: 'Шаблон или с нуля',
    description:
      'Начните с 20+ профессиональных шаблонов или создайте уникальный проект с чистого листа.',
    icon: Puzzle,
    color: '#3b82f6',
    features: ['20+ шаблонов', 'Blank проект', 'AI генерация', 'Импорт'],
    visual: 'template',
  },
  {
    id: 2,
    number: '02',
    title: 'Дизайн интерфейса',
    subtitle: 'Визуальный редактор',
    description:
      'Перетаскивайте компоненты, настраивайте стили и создавайте уникальный дизайн без кода.',
    icon: Palette,
    color: '#84cc16',
    features: ['Drag & Drop', '50+ компонентов', 'Адаптивность', 'Темы'],
    visual: 'builder',
  },
  {
    id: 3,
    number: '03',
    title: 'Настройте логику',
    subtitle: 'Workflow & Data',
    description:
      'Добавьте базу данных, создайте workflow и интегрируйте внешние сервисы через API.',
    icon: Wand2,
    color: '#8b5cf6',
    features: ['База данных', 'Workflows', 'API интеграции', 'Автоматизация'],
    visual: 'logic',
  },
  {
    id: 4,
    number: '04',
    title: 'Запустите',
    subtitle: 'Deploy & Scale',
    description:
      'Одним кликом разверните на global CDN. Получите SSL, домен и мониторинг автоматически.',
    icon: Rocket,
    color: '#ec4899',
    features: ['One-click deploy', 'Global CDN', 'SSL/Domain', 'Analytics'],
    visual: 'deploy',
  },
];

// Visual representations for each step
function StepVisual({ type, color }: { type: string; color: string }) {
  const visuals = {
    template: (
      <div className="relative w-full h-full p-4 md:p-6">
        <div className="grid grid-cols-2 gap-2 md:gap-3 h-full">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, ease: EASE_OUT_EXPO }}
              className={cn(
                'rounded-xl border-2 border-dashed transition-all duration-300',
                i === 1
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 bg-white/5',
              )}
            >
              {i === 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, ease: EASE_OUT_EXPO }}
                  className="flex items-center justify-center h-full"
                >
                  <Check className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        {/* Cursor */}
        <motion.div
          animate={{ x: [0, 80, 80], y: [0, 0, 80], opacity: [0, 1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 left-8 md:top-10 md:left-10"
        >
          <MousePointer2 className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
        </motion.div>
      </div>
    ),
    builder: (
      <div className="relative w-full h-full p-4 md:p-6">
        <div className="flex flex-col gap-3 h-full">
          {/* Sidebar */}
          <div className="flex gap-3 h-full">
            <div className="w-12 md:w-16 rounded-lg bg-white/10 p-1.5 md:p-2 space-y-1.5 md:space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-full h-6 md:h-8 rounded bg-white/20"
                />
              ))}
            </div>
            {/* Canvas */}
            <div className="flex-1 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden">
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 80, top: 0, bottom: 60 }}
                className="absolute top-3 left-3 w-16 md:w-20 h-10 md:h-12 rounded bg-primary/30 border border-primary flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <span className="text-[8px] md:text-xs text-white/70">
                  Button
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-14 md:top-20 left-3 w-24 md:w-32 h-14 md:h-20 rounded bg-white/10 border border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    ),
    logic: (
      <div className="relative w-full h-full p-4 md:p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Database */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-16 md:w-16 md:h-20 rounded-lg bg-violet-500/20 border border-violet-500/50 flex flex-col items-center justify-center gap-1"
          >
            <div className="w-6 md:w-8 h-0.5 md:h-1 rounded-full bg-violet-400" />
            <div className="w-6 md:w-8 h-0.5 md:h-1 rounded-full bg-violet-400" />
            <div className="w-6 md:w-8 h-0.5 md:h-1 rounded-full bg-violet-400" />
          </motion.div>

          {/* Connection */}
          <motion.div
            animate={{ width: [0, 24, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 hidden sm:block"
          />

          {/* Logic Node */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-pink-500/20 border border-pink-500/50 flex items-center justify-center"
          >
            <Wand2 className="w-5 h-5 md:w-8 md:h-8 text-pink-400" />
          </motion.div>

          {/* Connection */}
          <motion.div
            animate={{ width: [0, 24, 0] }}
            transition={{
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 hidden sm:block"
          />

          {/* API */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
          </motion.div>
        </div>
      </div>
    ),
    deploy: (
      <div className="relative w-full h-full p-4 md:p-6">
        {/* Globe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-white/20 relative"
          >
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={deg}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2, ease: EASE_OUT_EXPO }}
                className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translate(40px, -50%)`,
                }}
              />
            ))}
          </motion.div>
          <div className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Rocket className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
        </div>

        {/* Checkmarks */}
        {[
          { text: 'SSL', x: '10%', y: '20%' },
          { text: 'CDN', x: '75%', y: '15%' },
          { text: 'Domain', x: '80%', y: '70%' },
          { text: 'Monitor', x: '5%', y: '75%' },
        ].map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.3, ease: EASE_OUT_EXPO }}
            className="absolute flex items-center gap-1.5 md:gap-2"
            style={{ left: item.x, top: item.y }}
          >
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-400" />
            </div>
            <span className="text-[8px] md:text-xs text-white/60">
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    ),
  };

  return visuals[type as keyof typeof visuals] || null;
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-advance progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((step) => (step + 1) % steps.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [activeStep]);

  const goToStep = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  const nextStep = () => goToStep((activeStep + 1) % steps.length);
  const prevStep = () =>
    goToStep((activeStep - 1 + steps.length) % steps.length);

  const currentStep = steps[activeStep];

  return (
    <section
      className="py-24 relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      <HowItWorksBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">
                Как это работает
              </span>
            </motion.div>

            <h2
              id="how-it-works-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              От идеи до <span className="text-gradient">запуска</span>
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto">
              Четыре простых шага для создания профессионального приложения
            </p>
          </motion.div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <nav className="mb-8 md:mb-12" aria-label="Progress Steps">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className="relative flex flex-col items-center group focus:outline-none"
                  aria-current={activeStep === index ? 'step' : undefined}
                  aria-label={`Go to step ${step.number}: ${step.title}`}
                >
                  {/* Number */}
                  <motion.div
                    animate={{
                      scale: activeStep === index ? 1.1 : 1,
                      backgroundColor:
                        activeStep >= index
                          ? step.color
                          : 'rgba(255,255,255,0.05)',
                    }}
                    transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-sm md:text-lg font-bold text-white mb-2 md:mb-3 transition-all border border-white/10"
                    style={{
                      boxShadow:
                        activeStep === index
                          ? `0 0 30px ${step.color}40`
                          : 'none',
                    }}
                  >
                    {activeStep > index ? (
                      <Check className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    ) : (
                      step.number
                    )}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-xs md:text-sm font-medium transition-colors text-center',
                      activeStep === index ? 'text-white' : 'text-white/40',
                    )}
                  >
                    {step.title}
                  </span>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-5 md:top-7 left-full w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] h-0.5 -translate-y-1/2">
                      <div className="w-full h-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: step.color }}
                          animate={{
                            width:
                              activeStep > index
                                ? '100%'
                                : activeStep === index
                                  ? `${progress}%`
                                  : '0%',
                          }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Content Card */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left - Description */}
            <AnimatePresence mode="wait">
              <motion.article
                key={currentStep.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                className="order-2 lg:order-1"
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-4 border"
                  style={{
                    color: currentStep.color,
                    borderColor: `${currentStep.color}30`,
                    backgroundColor: `${currentStep.color}10`,
                  }}
                >
                  <currentStep.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {currentStep.subtitle}
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {currentStep.title}
                </h3>

                <p className="text-base md:text-lg text-white/60 mb-6 leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Features */}
                <ul
                  className="grid grid-cols-2 gap-2 md:gap-3 mb-8"
                  aria-label="Step Features"
                >
                  {currentStep.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, ease: EASE_OUT_EXPO }}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${currentStep.color}20` }}
                      >
                        <Check
                          className="w-2.5 h-2.5 md:w-3 md:h-3"
                          style={{ color: currentStep.color }}
                        />
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Navigation */}
                <nav
                  className="flex items-center gap-3 md:gap-4"
                  aria-label="Step Navigation"
                >
                  <button
                    onClick={prevStep}
                    className="p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95"
                    style={{ backgroundColor: currentStep.color }}
                    aria-label={
                      activeStep === steps.length - 1
                        ? 'Start building'
                        : 'Next step'
                    }
                  >
                    {activeStep === steps.length - 1 ? 'Начать' : 'Далее'}
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <span className="text-sm text-white/40 ml-2">
                    {activeStep + 1} / {steps.length}
                  </span>
                </nav>
              </motion.article>
            </AnimatePresence>

            {/* Right - Visual */}
            <AnimatePresence mode="wait">
              <motion.aside
                key={currentStep.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                className="order-1 lg:order-2"
                aria-label="Step Visual"
              >
                <div
                  className="aspect-square rounded-2xl md:rounded-3xl border overflow-hidden relative max-w-md mx-auto lg:max-w-none"
                  style={{
                    backgroundColor: `${currentStep.color}08`,
                    borderColor: `${currentStep.color}20`,
                    boxShadow: `0 0 100px ${currentStep.color}10`,
                  }}
                >
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(${currentStep.color}20 1px, transparent 1px),
                        linear-gradient(90deg, ${currentStep.color}20 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                    }}
                  />

                  {/* Visual */}
                  <StepVisual
                    type={currentStep.visual}
                    color={currentStep.color}
                  />

                  {/* Glow */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full blur-[80px] md:blur-[100px]"
                    style={{ backgroundColor: `${currentStep.color}20` }}
                  />
                </div>
              </motion.aside>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
