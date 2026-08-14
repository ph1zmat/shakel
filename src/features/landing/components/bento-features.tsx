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
  X,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
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
import { FeaturesBackground } from '@/components/ui/backgrounds';

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
    fullDescription:
      'Создавайте интерфейсы методом drag-and-drop. Более 50 готовых компонентов, которые автоматически адаптируются под любые устройства.',
    icon: LayoutGrid,
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    capabilities: [
      '50+ UI компонентов',
      'Адаптивная сетка',
      'Real-time preview',
      'Темы оформления',
      'Custom CSS',
      'Компоненты AI',
    ],
    stats: { value: '10x', label: 'быстрее разработка' },
    Animation: BuilderAnimation,
  },
  {
    id: 'workflow',
    title: 'Автоматизация',
    shortDescription: 'Визуальные workflows без кода',
    fullDescription:
      'Визуальный редактор бизнес-процессов. Соединяйте триггеры, условия и действия в мощные workflows без написания кода.',
    icon: Workflow,
    color: '#84cc16',
    gradient: 'from-lime-500/20 to-green-500/20',
    capabilities: [
      'Визуальный редактор',
      'CRON триггеры',
      'Условная логика',
      'Webhooks',
      'Обработка ошибок',
      'Логи выполнения',
    ],
    stats: { value: '500+', label: 'автоматизаций в месяц' },
    Animation: WorkflowAnimation,
  },
  {
    id: 'ai',
    title: 'AI Помощник',
    shortDescription: 'ИИ для генерации кода и контента',
    fullDescription:
      'Встроенный искусственный интеллект помогает генерировать код, создавать контент, анализировать данные и отвечать на вопросы.',
    icon: Sparkles,
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-500/20',
    capabilities: [
      'Генерация UI',
      'Написание кода',
      'Анализ данных',
      'Чат-боты',
      'Обработка текста',
      'Изображения',
    ],
    stats: { value: 'GPT-4', label: 'последняя модель' },
    Animation: AIAnimation,
  },
  {
    id: 'database',
    title: 'База данных',
    shortDescription: 'Визуальная схема и миграции',
    fullDescription:
      'Создавайте схемы данных, связи и индексы через графический интерфейс. Автоматические миграции и GraphQL API из коробки.',
    icon: Database,
    color: '#8b5cf6',
    gradient: 'from-violet-500/20 to-purple-500/20',
    capabilities: [
      'Визуальные схемы',
      'Relations & Foreign Keys',
      'Авто-миграции',
      'GraphQL API',
      'Real-time subscriptions',
      'Бэкапы',
    ],
    stats: { value: '99.99%', label: 'доступность данных' },
    Animation: DatabaseAnimation,
  },
  {
    id: 'api',
    title: 'API Конструктор',
    shortDescription: 'REST и GraphQL без кода',
    fullDescription:
      'Создавайте REST и GraphQL endpoints без кода. Автоматическая документация Swagger, аутентификация и rate limiting.',
    icon: Globe,
    color: '#f59e0b',
    gradient: 'from-orange-500/20 to-amber-500/20',
    capabilities: [
      'REST & GraphQL',
      'JWT Auth',
      'Rate limiting',
      'API versioning',
      'Swagger docs',
      'Webhooks',
    ],
    stats: { value: '<50ms', label: 'время ответа' },
    Animation: APIAnimation,
  },
  {
    id: 'edge',
    title: 'Edge Runtime',
    shortDescription: '100+ глобальных локаций',
    fullDescription:
      'Приложения запускаются на 100+ edge-локациях по всему миру. Минимальная задержка и максимальная производительность.',
    icon: Zap,
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    capabilities: [
      'Global CDN',
      'Edge functions',
      'Auto-scaling',
      'Zero cold start',
      'Streaming',
      'Load balancing',
    ],
    stats: { value: '100+', label: 'локаций' },
    Animation: EdgeAnimation,
  },
  {
    id: 'security',
    title: 'Безопасность',
    shortDescription: 'Enterprise-grade защита',
    fullDescription:
      'Банковский уровень безопасности с SSO, 2FA, audit logs и полным шифрованием данных в покое и при передаче.',
    icon: Shield,
    color: '#ef4444',
    gradient: 'from-red-500/20 to-orange-500/20',
    capabilities: [
      'SSO/SAML',
      '2FA/MFA',
      'Audit logs',
      'RBAC',
      'Encryption',
      'Compliance',
    ],
    stats: { value: 'SOC2', label: 'сертификат' },
    Animation: SecurityAnimation,
  },
  {
    id: 'collaboration',
    title: 'Командная работа',
    shortDescription: 'Real-time совместное редактирование',
    fullDescription:
      'Работайте вместе с командой в реальном времени. Git-интеграция, code review, комментарии и совместное редактирование.',
    icon: Code2,
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-green-500/20',
    capabilities: [
      'Real-time совместная работа',
      'Git sync',
      'Code review',
      'Комментарии',
      'Роли и права',
      'История версий',
    ],
    stats: { value: '∞', label: 'участников' },
    Animation: CollaborationAnimation,
  },
];

// Modal/Drawer for feature details
const FeatureModal = ({
  feature,
  onClose,
}: {
  feature: Feature | null;
  onClose: () => void;
}) => {
  if (!feature) return null;

  const Animation = feature.Animation;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] overflow-auto bg-[#0a0a0f] border border-white/10 rounded-2xl z-[101] shadow-2xl"
      >
        {/* Close button - highest z-index */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="fixed top-4 right-4 z-[110] p-2 rounded-lg bg-black/50 border border-white/20 text-white/80 hover:text-white hover:bg-black/70 hover:border-white/40 transition-all duration-200 active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="relative z-[105] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Content side - higher z-index than animation */}
            <div className="flex-1 relative z-[106]">
              {/* Header */}
              <header className="flex items-start mb-6">
                <div
                  className="p-3 md:p-4 rounded-2xl"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon
                    className="w-7 h-7 md:w-8 md:h-8"
                    style={{ color: feature.color }}
                  />
                </div>
              </header>

              {/* Title and description */}
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed mb-6">
                {feature.fullDescription}
              </p>

              {/* Capabilities */}
              <ul
                className="flex flex-wrap gap-2 mb-8"
                aria-label={`${feature.title} Capabilities`}
              >
                {feature.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="px-3 py-1.5 rounded-full text-sm border"
                    style={{
                      borderColor: `${feature.color}40`,
                      backgroundColor: `${feature.color}10`,
                      color: `${feature.color}`,
                    }}
                  >
                    {cap}
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <footer className="flex items-center gap-4">
                <div
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: feature.color }}
                >
                  {feature.stats.value}
                </div>
                <div className="text-sm text-white/50 leading-tight">
                  {feature.stats.label}
                </div>
              </footer>
            </div>

            {/* Animation side - isolated container */}
            <div className="lg:w-[380px] shrink-0 relative z-[105]">
              <div
                className="aspect-square rounded-2xl border overflow-hidden relative"
                style={{
                  borderColor: `${feature.color}30`,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                {/* Animation wrapper with isolation */}
                <div className="absolute inset-0 isolate">
                  <Animation color={feature.color} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background gradient - lowest layer */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none z-0',
            feature.gradient,
          )}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Feature Card Component
const FeatureCard = ({
  feature,
  onClick,
  index,
  size = 'normal',
}: {
  feature: Feature;
  onClick: () => void;
  index: number;
  size?: 'normal' | 'large';
}) => {
  const isLarge = size === 'large';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.4,
        ease: EASE_OUT_EXPO,
        delay: index * 0.05,
      }}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View ${feature.title} details`}
      className={cn(
        'group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-pointer',
        'hover:border-white/[0.12] hover:bg-white/[0.04]',
        'transition-all duration-300',
        'outline-none focus:ring-2 focus:ring-primary/50',
        isLarge ? 'p-6 md:p-8' : 'p-4 md:p-5',
      )}
    >
      {/* Hover gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none',
          feature.gradient,
        )}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon and Arrow */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              'rounded-xl transition-transform duration-300 group-hover:scale-110',
              isLarge ? 'p-3 md:p-4' : 'p-2.5 md:p-3',
            )}
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <feature.icon
              className={isLarge ? 'w-6 h-6 md:w-8 md:h-8' : 'w-5 h-5 md:w-6 md:h-6'}
              style={{ color: feature.color }}
            />
          </div>
          <div
            className={cn(
              'rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:opacity-100 group-hover:scale-110',
              isLarge ? 'w-9 h-9 md:w-10 md:h-10' : 'w-7 h-7 md:w-8 md:h-8',
              'opacity-0',
            )}
          >
            <ArrowUpRight
              className={isLarge ? 'w-5 h-5' : 'w-4 h-4'}
              style={{ color: feature.color }}
            />
          </div>
        </div>

        {/* Content */}
        <h4
          className={cn(
            'font-semibold text-white mb-2 group-hover:text-white transition-colors',
            isLarge ? 'text-lg md:text-xl' : 'text-sm md:text-base',
          )}
        >
          {feature.title}
        </h4>
        <p
          className={cn(
            'text-white/40 leading-relaxed',
            isLarge ? 'text-sm md:text-base mb-4' : 'text-xs md:text-sm',
          )}
        >
          {isLarge ? feature.fullDescription : feature.shortDescription}
        </p>

        {/* Stats on hover - only for small cards */}
        {!isLarge && (
          <div className="mt-auto pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span
              className="text-lg font-bold"
              style={{ color: feature.color }}
            >
              {feature.stats.value}
            </span>
            <span className="text-xs text-white/30">
              {feature.stats.label}
            </span>
          </div>
        )}

        {/* Capabilities for large card */}
        {isLarge && (
          <div className="mt-auto flex flex-wrap gap-2">
            {feature.capabilities.slice(0, 4).map((cap) => (
              <span
                key={cap}
                className="px-2.5 py-1 rounded-full text-xs border"
                style={{
                  borderColor: `${feature.color}30`,
                  backgroundColor: `${feature.color}08`,
                  color: `${feature.color}dd`,
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export function BentoFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const handleCardClick = useCallback((feature: Feature) => {
    setSelectedFeature(feature);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  // First feature is highlighted (large card)
  const [firstFeature, ...otherFeatures] = features;

  return (
    <section
      className="relative py-24 md:py-32"
      aria-labelledby="bento-heading"
    >
      {/* Unified Background System */}
      <FeaturesBackground />

      {/* Modal - rendered at top level with portal-like behavior */}
      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal feature={selectedFeature} onClose={handleClose} />
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <header className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 mb-4 md:mb-6"
          >
            <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
            <span className="text-xs md:text-sm text-white/60">
              Возможности платформы
            </span>
          </motion.div>

          <motion.h2
            id="bento-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 md:mb-6 tracking-tight"
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
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="text-base md:text-lg text-white/40"
          >
            Кликните на любую карточку, чтобы увидеть детали и интерактивную
            демонстрацию
          </motion.p>
        </header>

        {/* Bento Grid Layout */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
          role="region"
          aria-label="Feature Grid"
        >
          {/* First card - Large */}
          <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <div className="h-full">
              <FeatureCard
                feature={firstFeature}
                onClick={() => handleCardClick(firstFeature)}
                index={0}
                size="large"
              />
            </div>
          </div>

          {/* Other cards */}
          {otherFeatures.map((feature, index) => (
            <div key={feature.id} className="h-[160px] md:h-[180px]">
              <FeatureCard
                feature={feature}
                onClick={() => handleCardClick(feature)}
                index={index + 1}
                size="normal"
              />
            </div>
          ))}
        </div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 md:mt-12 text-center text-xs md:text-sm text-white/30"
        >
          Нажмите на любую карточку, чтобы раскрыть детали
        </motion.p>
      </div>
    </section>
  );
}
