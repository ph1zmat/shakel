'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Puzzle, 
  Palette, 
  Wand2, 
  Rocket,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  MousePointer2,
  Box,
  Share2,
  Globe
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { HowItWorksBackground } from '@/shared/components/ui/backgrounds';

const steps = [
  {
    id: 1,
    number: '01',
    title: 'Выберите основу',
    subtitle: 'Шаблон или с нуля',
    description: 'Начните с 20+ профессиональных шаблонов или создайте уникальный проект с чистого листа.',
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
    description: 'Перетаскивайте компоненты, настраивайте стили и создавайте уникальный дизайн без кода.',
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
    description: 'Добавьте базу данных, создайте workflow и интегрируйте внешние сервисы через API.',
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
    description: 'Одним кликом разверните на global CDN. Получите SSL, домен и мониторинг автоматически.',
    icon: Rocket,
    color: '#ec4899',
    features: ['One-click deploy', 'Global CDN', 'SSL/Domain', 'Analytics'],
    visual: 'deploy',
  },
];

// Visual representations for each step
function StepVisual({ type, color, isActive }: { type: string; color: string; isActive: boolean }) {
  const visuals = {
    template: (
      <div className="relative w-full h-full p-6">
        <div className="grid grid-cols-2 gap-3 h-full">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'rounded-xl border-2 border-dashed transition-all',
                i === 1 ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5'
              )}
            >
              {i === 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center h-full"
                >
                  <Check className="w-8 h-8 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        {/* Cursor */}
        <motion.div
          animate={{ x: [0, 80, 80], y: [0, 0, 80], opacity: [0, 1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-10 left-10"
        >
          <MousePointer2 className="w-6 h-6 text-white drop-shadow-lg" />
        </motion.div>
      </div>
    ),
    builder: (
      <div className="relative w-full h-full p-6">
        <div className="flex flex-col gap-3 h-full">
          {/* Sidebar */}
          <div className="flex gap-3 h-full">
            <div className="w-16 rounded-lg bg-white/10 p-2 space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  className="w-full h-8 rounded bg-white/20"
                />
              ))}
            </div>
            {/* Canvas */}
            <div className="flex-1 rounded-lg bg-white/5 border border-white/10 relative overflow-hidden">
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 100, top: 0, bottom: 100 }}
                className="absolute top-4 left-4 w-20 h-12 rounded bg-primary/30 border border-primary flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <span className="text-xs text-white/70">Button</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-20 left-4 w-32 h-20 rounded bg-white/10 border border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    ),
    logic: (
      <div className="relative w-full h-full p-6 flex items-center justify-center">
        <div className="flex items-center gap-4">
          {/* Database */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-20 rounded-lg bg-violet-500/20 border border-violet-500/50 flex flex-col items-center justify-center gap-1"
          >
            <div className="w-8 h-1 rounded-full bg-violet-400" />
            <div className="w-8 h-1 rounded-full bg-violet-400" />
            <div className="w-8 h-1 rounded-full bg-violet-400" />
          </motion.div>
          
          {/* Connection */}
          <motion.div
            animate={{ width: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-0.5 bg-gradient-to-r from-violet-500 to-pink-500"
          />
          
          {/* Logic Node */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-pink-500/20 border border-pink-500/50 flex items-center justify-center"
          >
            <Wand2 className="w-8 h-8 text-pink-400" />
          </motion.div>
          
          {/* Connection */}
          <motion.div
            animate={{ width: [0, 40, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
            className="h-0.5 bg-gradient-to-r from-pink-500 to-blue-500"
          />
          
          {/* API */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center"
          >
            <Share2 className="w-6 h-6 text-blue-400" />
          </motion.div>
        </div>
      </div>
    ),
    deploy: (
      <div className="relative w-full h-full p-6">
        {/* Globe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 relative"
          >
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={deg}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="absolute w-3 h-3 rounded-full bg-primary"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translate(60px, -50%)`,
                }}
              />
            ))}
          </motion.div>
          <div className="absolute w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-primary" />
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
            transition={{ delay: 1 + i * 0.3 }}
            className="absolute flex items-center gap-2"
            style={{ left: item.x, top: item.y }}
          >
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-xs text-white/60">{item.text}</span>
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
  const prevStep = () => goToStep((activeStep - 1 + steps.length) % steps.length);

  const currentStep = steps[activeStep];

  return (
    <section className="py-24 relative overflow-hidden">
      <HowItWorksBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">Как это работает</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            От идеи до{' '}
            <span className="text-gradient">запуска</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Четыре простых шага для создания профессионального приложения
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className="relative flex flex-col items-center group"
                >
                  {/* Number */}
                  <motion.div
                    animate={{
                      scale: activeStep === index ? 1.1 : 1,
                      backgroundColor: activeStep >= index ? step.color : 'rgba(255,255,255,0.05)',
                    }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white mb-3 transition-all border border-white/10"
                    style={{
                      boxShadow: activeStep === index ? `0 0 30px ${step.color}40` : 'none',
                    }}
                  >
                    {activeStep > index ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      step.number
                    )}
                  </motion.div>
                  
                  {/* Label */}
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    activeStep === index ? 'text-white' : 'text-white/40'
                  )}>
                    {step.title}
                  </span>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-7 left-full w-[calc(100%-2rem)] h-0.5 -translate-y-1/2">
                      <div className="w-full h-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: step.color }}
                          animate={{
                            width: activeStep > index ? '100%' : activeStep === index ? `${progress}%` : '0%',
                          }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Card */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="order-2 lg:order-1"
              >
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 border"
                  style={{ 
                    color: currentStep.color,
                    borderColor: `${currentStep.color}30`,
                    backgroundColor: `${currentStep.color}10`
                  }}
                >
                  <currentStep.icon className="w-4 h-4" />
                  {currentStep.subtitle}
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  {currentStep.title}
                </h3>
                
                <p className="text-lg text-white/60 mb-6 leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {currentStep.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${currentStep.color}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: currentStep.color }} />
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevStep}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all"
                    style={{ backgroundColor: currentStep.color }}
                  >
                    {activeStep === steps.length - 1 ? 'Начать' : 'Далее'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-white/40 ml-2">
                    {activeStep + 1} / {steps.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right - Visual */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="order-1 lg:order-2"
              >
                <div 
                  className="aspect-square rounded-3xl border overflow-hidden relative"
                  style={{ 
                    backgroundColor: `${currentStep.color}08`,
                    borderColor: `${currentStep.color}20`,
                    boxShadow: `0 0 100px ${currentStep.color}10`
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
                      backgroundSize: '40px 40px'
                    }}
                  />
                  
                  {/* Visual */}
                  <StepVisual 
                    type={currentStep.visual} 
                    color={currentStep.color}
                    isActive={true}
                  />

                  {/* Glow */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full blur-[100px]"
                    style={{ backgroundColor: `${currentStep.color}20` }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
