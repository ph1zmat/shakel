'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useCallback, memo } from 'react';
import {
  ShoppingCart,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  FolderKanban,
  Eye,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentPageBackground } from '@/components/ui/backgrounds';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const projects = [
  {
    id: 'ecommerce',
    title: 'E-commerce Platform',
    category: 'Интернет-магазин',
    description:
      'Полноценная платформа электронной коммерции с корзиной, оплатой и аналитикой.',
    icon: ShoppingCart,
    color: '#3b82f6',
    stats: { users: '12K+', orders: '45K+', revenue: '$2.4M' },
    features: [
      'Каталог товаров',
      'Онлайн-оплата',
      'CRM интеграция',
      'Аналитика',
    ],
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    category: 'Аналитика',
    description:
      'Корпоративный дашборд для визуализации бизнес-метрик в реальном времени.',
    icon: BarChart3,
    color: '#84cc16',
    stats: { users: '850+', reports: '12K+', dataPoints: '50M+' },
    features: [
      'Real-time графики',
      'Экспорт отчётов',
      'AI прогнозы',
      'API доступ',
    ],
  },
  {
    id: 'crm',
    title: 'CRM System',
    category: 'Управление клиентами',
    description:
      'Система управления взаимоотношениями с клиентами для sales-команд.',
    icon: Users,
    color: '#8b5cf6',
    stats: { users: '2.4K+', deals: '18K+', conversion: '34%' },
    features: [
      'Воронки продаж',
      'Автоматизация',
      'Интеграции',
      'Мобильное приложение',
    ],
  },
  {
    id: 'chat',
    title: 'Support Chat',
    category: 'Коммуникации',
    description: 'Чат-платформа для поддержки клиентов с AI-ассистентом.',
    icon: MessageSquare,
    color: '#f59e0b',
    stats: { users: '5K+', messages: '1M+', responseTime: '2min' },
    features: ['AI чат-бот', 'Мультиканальность', 'Аналитика', 'Автоматизация'],
  },
  {
    id: 'booking',
    title: 'Booking System',
    category: 'Бронирование',
    description: 'Система бронирования для сервисных бизнесов и клиник.',
    icon: Calendar,
    color: '#ec4899',
    stats: { users: '3.2K+', bookings: '89K+', satisfaction: '4.9★' },
    features: ['Календарь', 'Уведомления', 'Оплата', 'Отзывы'],
  },
  {
    id: 'project',
    title: 'Project Management',
    category: 'Управление проектами',
    description: 'Kanban-доска и инструменты управления проектами для команд.',
    icon: FolderKanban,
    color: '#06b6d4',
    stats: { users: '1.8K+', projects: '4.5K+', tasks: '125K+' },
    features: ['Kanban', 'Gantt диаграммы', 'Time-tracking', 'Команды'],
  },
];

const statLabels: Record<string, string> = {
  users: 'Пользователей',
  orders: 'Заказов',
  revenue: 'Выручка',
  reports: 'Отчётов',
  dataPoints: 'Данных',
  deals: 'Сделок',
  conversion: 'Конверсия',
  messages: 'Сообщений',
  responseTime: 'Ответ',
  bookings: 'Броней',
  satisfaction: 'Рейтинг',
  projects: 'Проектов',
  tasks: 'Задач',
};

// Static Project Preview Card - no internal animations
const ProjectPreview = memo(function ProjectPreview({
  project,
}: {
  project: (typeof projects)[0];
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl h-full">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-white/10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div
              className="w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${project.color}20` }}
            >
              <project.icon
                className="w-5 h-5 md:w-7 md:h-7"
                style={{ color: project.color }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-white truncate">
                {project.title}
              </h3>
              <p className="text-xs md:text-sm text-white/50">
                {project.category}
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95 shrink-0"
            aria-label="Preview project"
          >
            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm hidden sm:inline">Preview</span>
          </button>
        </div>
      </header>

      {/* Preview Area - Static mock UI */}
      <div className="relative h-[200px] sm:h-[240px] md:h-[260px] bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden">
        <div className="absolute inset-0 p-4 md:p-6">
          <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-3 md:p-4">
            {/* Mock Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 h-5 md:h-6 rounded-md bg-white/5" />
            </div>
            {/* Mock Content Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="col-span-2 h-14 md:h-20 rounded-lg bg-white/5" />
              <div className="h-14 md:h-20 rounded-lg bg-white/5" />
              <div className="h-12 md:h-16 rounded-lg bg-white/5" />
              <div className="h-12 md:h-16 rounded-lg bg-white/5" />
              <div className="h-12 md:h-16 rounded-lg bg-white/5" />
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div
          className="absolute -bottom-16 -right-16 w-28 md:w-36 h-28 md:h-36 rounded-full blur-[50px] md:blur-[70px] opacity-40"
          style={{ backgroundColor: project.color }}
        />
      </div>

      {/* Footer Stats */}
      <footer className="p-4 md:p-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {Object.entries(project.stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-1">
                {value}
              </div>
              <div className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">
                {statLabels[key] || key}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
});

export function Showcase() {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleProjectSelect = useCallback((project: typeof projects[0]) => {
    setActiveProject(project);
  }, []);

  return (
    <section
      className="py-24 relative overflow-hidden"
      aria-labelledby="showcase-heading"
    >
      <ContentPageBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="text-center mb-16">
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
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">
                Примеры реализаций
              </span>
            </motion.div>

            <h2
              id="showcase-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Что можно <span className="text-gradient">создать</span>
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto">
              От простых лендингов до сложных корпоративных систем — вот что уже
              построено на Shakel
            </p>
          </motion.div>
        </header>

        {/* Main Showcase Area */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Project List */}
          <nav className="space-y-3" aria-label="Project Selection">
            {projects.map((project, index) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: EASE_OUT_EXPO,
                }}
                onClick={() => handleProjectSelect(project)}
                onMouseEnter={() => setIsHovered(project.id)}
                onMouseLeave={() => setIsHovered(null)}
                className={cn(
                  'group relative w-full text-left p-4 md:p-5 rounded-xl transition-all duration-300',
                  'border border-white/10 bg-white/[0.02] backdrop-blur-sm',
                  activeProject.id === project.id
                    ? 'bg-white/[0.08] border-primary/30 shadow-lg shadow-primary/10'
                    : 'hover:bg-white/[0.05] hover:border-white/20',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50',
                )}
                aria-pressed={activeProject.id === project.id}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <project.icon
                      className="w-5 h-5 md:w-6 md:h-6"
                      style={{ color: project.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                      <h3 className="text-white font-semibold text-sm md:text-base">
                        {project.title}
                      </h3>
                      <span
                        className="text-[10px] md:text-xs px-2 py-0.5 rounded-full border shrink-0"
                        style={{
                          borderColor: `${project.color}40`,
                          color: project.color,
                          backgroundColor: `${project.color}10`,
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-white/40 mt-1 line-clamp-1">
                      {project.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    className={cn(
                      'w-5 h-5 text-white/30 transition-all duration-300 shrink-0',
                      activeProject.id === project.id
                        ? 'text-primary translate-x-1'
                        : 'group-hover:text-white/60',
                    )}
                    aria-hidden="true"
                  />
                </div>

                {/* Progress Bar */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary/50 transition-all duration-300"
                  style={{
                    width:
                      activeProject.id === project.id
                        ? '100%'
                        : isHovered === project.id
                          ? '30%'
                          : '0%',
                  }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Active Project Preview - Fixed height container with cross-fade */}
          <div className="relative lg:sticky lg:top-24">
            <div className="relative h-[420px] sm:h-[460px] md:h-[480px]">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <ProjectPreview project={activeProject} />
                </motion.div>
              </AnimatePresence>

              {/* Live Project Badge - outside of AnimatePresence */}
              <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 z-10">
                <span className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-primary text-white text-[10px] md:text-xs font-medium shadow-lg shadow-primary/30">
                  Live Project
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Tags */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="mt-12 flex flex-wrap justify-center gap-2 md:gap-3"
        >
          {[
            'Drag & Drop',
            'Real-time',
            'Responsive',
            'API Ready',
            'SEO Optimized',
            'Secure',
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm text-white/60 border border-white/10 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.05] hover:text-white/80"
            >
              {tag}
            </span>
          ))}
        </motion.footer>
      </div>
    </section>
  );
}
