'use client';

import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Workflow, 
  Database, 
  Globe, 
  Zap, 
  Shield,
  Sparkles,
  Code2,
  ArrowUpRight,
  Cpu,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  BuilderAnimation,
  WorkflowAnimation,
  AIAnimation,
  DatabaseAnimation,
  APIAnimation,
  EdgeAnimation,
  SecurityAnimation,
  CollaborationAnimation,
} from './feature-animations';
import { FeaturesBackground } from '@/shared/components/ui/backgrounds';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Feature {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  capabilities: string[];
  stats: { value: string; label: string };
  Animation: React.ComponentType<{ color: string }>;
}

const features: Feature[] = [
  {
    id: 'builder',
    title: 'Визуальный конструктор',
    shortDescription: 'Drag-and-drop интерфейс для создания UI',
    fullDescription: 'Создавайте интерфейсы методом drag-and-drop. Более 50 готовых компонентов, которые автоматически адаптируются под любые устройства.',
    icon: LayoutGrid,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    capabilities: ['50+ UI компонентов', 'Адаптивная сетка', 'Real-time preview', 'Темы оформления', 'Custom CSS', 'Компоненты AI'],
    stats: { value: '10x', label: 'быстрее разработка' },
    Animation: BuilderAnimation,
  },
  {
    id: 'workflow',
    title: 'Автоматизация',
    shortDescription: 'Визуальные workflows без кода',
    fullDescription: 'Визуальный редактор бизнес-процессов. Соединяйте триггеры, условия и действия в мощные workflows без написания кода.',
    icon: Workflow,
    color: '#84cc16',
    gradient: 'from-lime-500/20 to-green-500/20',
    capabilities: ['Визуальный редактор', 'CRON триггеры', 'Условная логика', 'Webhooks', 'Обработка ошибок', 'Логи выполнения'],
    stats: { value: '500+', label: 'автоматизаций в месяц' },
    Animation: WorkflowAnimation,
  },
  {
    id: 'ai',
    title: 'AI Помощник',
    shortDescription: 'ИИ для генерации кода и контента',
    fullDescription: 'Встроенный искусственный интеллект помогает генерировать код, создавать контент, анализировать данные и отвечать на вопросы.',
    icon: Sparkles,
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-500/20',
    capabilities: ['Генерация UI', 'Написание кода', 'Анализ данных', 'Чат-боты', 'Обработка текста', 'Изображения'],
    stats: { value: 'GPT-4', label: 'последняя модель' },
    Animation: AIAnimation,
  },
  {
    id: 'database',
    title: 'База данных',
    shortDescription: 'Визуальная схема и миграции',
    fullDescription: 'Создавайте схемы данных, связи и индексы через графический интерфейс. Автоматические миграции и GraphQL API из коробки.',
    icon: Database,
    color: '#8b5cf6',
    gradient: 'from-violet-500/20 to-purple-500/20',
    capabilities: ['Визуальные схемы', 'Relations & Foreign Keys', 'Авто-миграции', 'GraphQL API', 'Real-time subscriptions', 'Бэкапы'],
    stats: { value: '99.99%', label: 'доступность данных' },
    Animation: DatabaseAnimation,
  },
  {
    id: 'api',
    title: 'API Конструктор',
    shortDescription: 'REST и GraphQL без кода',
    fullDescription: 'Создавайте REST и GraphQL endpoints без кода. Автоматическая документация Swagger, аутентификация и rate limiting.',
    icon: Globe,
    color: '#f59e0b',
    gradient: 'from-orange-500/20 to-amber-500/20',
    capabilities: ['REST & GraphQL', 'JWT Auth', 'Rate limiting', 'API versioning', 'Swagger docs', 'Webhooks'],
    stats: { value: '<50ms', label: 'время ответа' },
    Animation: APIAnimation,
  },
  {
    id: 'edge',
    title: 'Edge Runtime',
    shortDescription: '100+ глобальных локаций',
    fullDescription: 'Приложения запускаются на 100+ edge-локациях по всему миру. Минимальная задержка и максимальная производительность.',
    icon: Zap,
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    capabilities: ['Global CDN', 'Edge functions', 'Auto-scaling', 'Zero cold start', 'Streaming', 'Load balancing'],
    stats: { value: '100+', label: 'локаций' },
    Animation: EdgeAnimation,
  },
  {
    id: 'security',
    title: 'Безопасность',
    shortDescription: 'Enterprise-grade защита',
    fullDescription: 'Банковский уровень безопасности с SSO, 2FA, audit logs и полным шифрованием данных в покое и при передаче.',
    icon: Shield,
    color: '#ef4444',
    gradient: 'from-red-500/20 to-orange-500/20',
    capabilities: ['SSO/SAML', '2FA/MFA', 'Audit logs', 'RBAC', 'Encryption', 'Compliance'],
    stats: { value: 'SOC2', label: 'сертификат' },
    Animation: SecurityAnimation,
  },
  {
    id: 'collaboration',
    title: 'Командная работа',
    shortDescription: 'Real-time совместное редактирование',
    fullDescription: 'Работайте вместе с командой в реальном времени. Git-интеграция, code review, комментарии и совместное редактирование.',
    icon: Code2,
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-green-500/20',
    capabilities: ['Real-time совместная работа', 'Git sync', 'Code review', 'Комментарии', 'Роли и права', 'История версий'],
    stats: { value: '∞', label: 'участников' },
    Animation: CollaborationAnimation,
  },
];

// Large featured card with animation
const FeaturedCard = ({ feature, onClear }: { feature: Feature; onClear: () => void }) => {
  const Animation = feature.Animation;

  return (
    <motion.div
      layoutId={`card-${feature.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      className="relative h-full rounded-3xl border border-white/[0.08] bg-[#0a0a0f] overflow-hidden"
    >
      {/* Background gradient */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30', feature.gradient)} />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(${feature.color} 1px, transparent 1px),
                            linear-gradient(90deg, ${feature.color} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 h-full flex flex-col lg:flex-row">
        {/* Content side */}
        <div className="flex-1 p-8 lg:p-10 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div 
              className="p-4 rounded-2xl"
              style={{ backgroundColor: `${feature.color}15` }}
            >
              <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
            </div>
            <button
              onClick={onClear}
              className="px-4 py-2 rounded-full border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-colors"
            >
              Свернуть
            </button>
          </div>

          {/* Title and description */}
          <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4">{feature.title}</h3>
          <p className="text-white/50 leading-relaxed mb-6 max-w-md">{feature.fullDescription}</p>

          {/* Capabilities */}
          <div className="flex flex-wrap gap-2 mb-8">
            {feature.capabilities.map((cap) => (
              <span 
                key={cap}
                className="px-3 py-1.5 rounded-full text-sm border"
                style={{ 
                  borderColor: `${feature.color}30`, 
                  backgroundColor: `${feature.color}08`,
                  color: `${feature.color}dd`
                }}
              >
                {cap}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-auto flex items-center gap-4">
            <div 
              className="text-4xl font-bold"
              style={{ color: feature.color }}
            >
              {feature.stats.value}
            </div>
            <div className="text-sm text-white/40 leading-tight">
              {feature.stats.label}
            </div>
          </div>
        </div>

        {/* Animation side */}
        <div className="lg:w-[400px] xl:w-[450px] p-6 lg:p-8">
          <div 
            className="h-full min-h-[280px] rounded-2xl border overflow-hidden relative"
            style={{ borderColor: `${feature.color}30`, backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            <Animation color={feature.color} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Small grid card
const SmallCard = ({ feature, onClick, index }: { feature: Feature; onClick: () => void; index: number }) => {
  return (
    <motion.div
      layoutId={`card-${feature.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        'group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-pointer',
        'hover:border-white/[0.12] hover:bg-white/[0.03]',
        'transition-all duration-300',
        'p-5 flex flex-col h-full'
      )}
    >
      {/* Hover gradient */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl', feature.gradient)} />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-white/60" />
          </div>
        </div>

        {/* Content */}
        <h4 className="text-base font-semibold text-white mb-2 group-hover:text-white transition-colors">{feature.title}</h4>
        <p className="text-sm text-white/40 leading-relaxed">{feature.shortDescription}</p>

        {/* Stats on hover */}
        <div className="mt-auto pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-lg font-bold" style={{ color: feature.color }}>{feature.stats.value}</span>
          <span className="text-xs text-white/30">{feature.stats.label}</span>
        </div>
      </div>
    </motion.div>
  );
};

export function BentoFeatures() {
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  
  const activeFeature = features.find(f => f.id === activeFeatureId);
  const gridFeatures = activeFeatureId 
    ? features.filter(f => f.id !== activeFeatureId)
    : features;

  return (
    <section className="relative py-32">
      {/* Unified Background System */}
      <FeaturesBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6"
          >
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/60">Возможности платформы</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight"
          >
            Всё необходимое для создания
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-lime-400">
              современных приложений
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="text-lg text-white/40"
          >
            Кликните на любую карточку, чтобы увидеть детали и интерактивную демонстрацию
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {/* Featured card (takes 2 columns) */}
            {activeFeature && (
              <motion.div
                key="featured"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:col-span-2 lg:row-span-2 min-h-[500px] lg:min-h-[600px]"
              >
                <FeaturedCard 
                  feature={activeFeature} 
                  onClear={() => setActiveFeatureId(null)}
                />
              </motion.div>
            )}

            {/* Grid of small cards */}
            {gridFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                layout
                className={cn(
                  'h-[180px]',
                  !activeFeature && index === 0 && 'lg:col-span-2 lg:row-span-2 lg:h-auto'
                )}
              >
                {!activeFeature && index === 0 ? (
                  <FeaturedCard 
                    feature={feature} 
                    onClear={() => {}}
                  />
                ) : (
                  <SmallCard 
                    feature={feature} 
                    onClick={() => setActiveFeatureId(feature.id)}
                    index={index}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Hint */}
        {!activeFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-white/30">
              Нажмите на любую карточку, чтобы раскрыть детали
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
