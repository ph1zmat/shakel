'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  ShoppingCart, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar,
  FolderKanban,
  ExternalLink,
  Eye,
  ChevronRight,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ContentPageBackground } from '@/components/ui/backgrounds';

const projects = [
  {
    id: 'ecommerce',
    title: 'E-commerce Platform',
    category: 'Интернет-магазин',
    description: 'Полноценная платформа электронной коммерции с корзиной, оплатой и аналитикой.',
    icon: ShoppingCart,
    color: '#3b82f6',
    stats: { users: '12K+', orders: '45K+', revenue: '$2.4M' },
    features: ['Каталог товаров', 'Онлайн-оплата', 'CRM интеграция', 'Аналитика'],
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    category: 'Аналитика',
    description: 'Корпоративный дашборд для визуализации бизнес-метрик в реальном времени.',
    icon: BarChart3,
    color: '#84cc16',
    stats: { users: '850+', reports: '12K+', dataPoints: '50M+' },
    features: ['Real-time графики', 'Экспорт отчётов', 'AI прогнозы', 'API доступ'],
  },
  {
    id: 'crm',
    title: 'CRM System',
    category: 'Управление клиентами',
    description: 'Система управления взаимоотношениями с клиентами для sales-команд.',
    icon: Users,
    color: '#8b5cf6',
    stats: { users: '2.4K+', deals: '18K+', conversion: '34%' },
    features: ['Воронки продаж', 'Автоматизация', 'Интеграции', 'Мобильное приложение'],
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

export function Showcase() {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      <ContentPageBackground />

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
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">Примеры реализаций</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Что можно <span className="text-gradient">создать</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            От простых лендингов до сложных корпоративных систем — 
            вот что уже построено на Shakel
          </p>
        </motion.div>

        {/* Main Showcase Area */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Project List */}
          <div className="space-y-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveProject(project)}
                onMouseEnter={() => setIsHovered(project.id)}
                onMouseLeave={() => setIsHovered(null)}
                className={cn(
                  'group relative p-5 rounded-xl cursor-pointer transition-all duration-500',
                  'border border-white/10 bg-white/[0.02] backdrop-blur-sm',
                  activeProject.id === project.id 
                    ? 'bg-white/[0.08] border-primary/30 shadow-lg shadow-primary/10' 
                    : 'hover:bg-white/[0.05] hover:border-white/20'
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <project.icon className="w-6 h-6" style={{ color: project.color }} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold">{project.title}</h3>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{ 
                          borderColor: `${project.color}40`,
                          color: project.color,
                          backgroundColor: `${project.color}10`
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/40 mt-1 line-clamp-1">
                      {project.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight 
                    className={cn(
                      'w-5 h-5 text-white/30 transition-all duration-300',
                      activeProject.id === project.id ? 'text-primary translate-x-1' : 'group-hover:text-white/60'
                    )} 
                  />
                </div>

                {/* Progress Bar */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-primary/50"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: activeProject.id === project.id ? '100%' : isHovered === project.id ? '30%' : '0%' 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Active Project Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${activeProject.color}20` }}
                      >
                        <activeProject.icon className="w-7 h-7" style={{ color: activeProject.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{activeProject.title}</h3>
                        <p className="text-sm text-white/50">{activeProject.category}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Preview</span>
                    </button>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="relative h-[280px] bg-gradient-to-br from-white/[0.02] to-transparent">
                  {/* Mock UI */}
                  <div className="absolute inset-0 p-6">
                    <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      {/* Mock Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="flex-1 h-6 rounded-md bg-white/5" />
                      </div>
                      {/* Mock Content */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 h-24 rounded-lg bg-white/5" />
                        <div className="h-24 rounded-lg bg-white/5" />
                        <div className="h-20 rounded-lg bg-white/5" />
                        <div className="h-20 rounded-lg bg-white/5" />
                        <div className="h-20 rounded-lg bg-white/5" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div 
                    className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-50"
                    style={{ backgroundColor: activeProject.color }}
                  />
                </div>

                {/* Footer Stats */}
                <div className="p-6 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(activeProject.stats).map(([key, value], i) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{value}</div>
                        <div className="text-xs text-white/40 uppercase tracking-wider">
                          {key === 'users' && 'Пользователей'}
                          {key === 'orders' && 'Заказов'}
                          {key === 'revenue' && 'Выручка'}
                          {key === 'reports' && 'Отчётов'}
                          {key === 'dataPoints' && 'Данных'}
                          {key === 'deals' && 'Сделок'}
                          {key === 'conversion' && 'Конверсия'}
                          {key === 'messages' && 'Сообщений'}
                          {key === 'responseTime' && 'Ответ'}
                          {key === 'bookings' && 'Броней'}
                          {key === 'satisfaction' && 'Рейтинг'}
                          {key === 'projects' && 'Проектов'}
                          {key === 'tasks' && 'Задач'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium shadow-lg shadow-primary/30"
              >
                Live Project
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Features Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {['Drag & Drop', 'Real-time', 'Responsive', 'API Ready', 'SEO Optimized', 'Secure'].map((tag) => (
            <span 
              key={tag}
              className="px-4 py-2 rounded-full text-sm text-white/60 border border-white/10 bg-white/[0.02]"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
