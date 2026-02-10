'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  Search, 
  Book, 
  Code2, 
  Zap, 
  Shield, 
  Database,
  LayoutGrid,
  ArrowRight,
  ExternalLink,
  FileText,
  Video,
  Terminal,
  Layers,
  ChevronRight,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentPageBackground } from '@/components/ui/backgrounds';

const categories = [
  {
    id: 'getting-started',
    title: 'Начало работы',
    icon: Zap,
    color: '#84cc16',
    items: [
      { title: 'Быстрый старт', desc: 'Создайте первое приложение за 5 минут', time: '5 мин' },
      { title: 'Основы платформы', desc: 'Архитектура и ключевые концепции', time: '10 мин' },
      { title: 'Шаблоны проектов', desc: 'Готовые решения для разных задач', time: '15 мин' },
    ],
  },
  {
    id: 'builder',
    title: 'Визуальный конструктор',
    icon: LayoutGrid,
    color: '#3b82f6',
    items: [
      { title: 'Работа с компонентами', desc: 'Добавление и настройка UI элементов', time: '12 мин' },
      { title: 'Адаптивный дизайн', desc: 'Создание mobile-friendly интерфейсов', time: '8 мин' },
      { title: 'Темы и стили', desc: 'Кастомизация внешнего вида', time: '10 мин' },
    ],
  },
  {
    id: 'database',
    title: 'База данных',
    icon: Database,
    color: '#8b5cf6',
    items: [
      { title: 'Создание схемы', desc: 'Визуальный редактор структуры данных', time: '15 мин' },
      { title: 'Relations', desc: 'Связи между таблицами', time: '12 мин' },
      { title: 'API Queries', desc: 'Запросы к данным', time: '20 мин' },
    ],
  },
  {
    id: 'automation',
    title: 'Автоматизация',
    icon: Zap,
    color: '#f59e0b',
    items: [
      { title: 'Workflow Basics', desc: 'Создание первого workflow', time: '10 мин' },
      { title: 'Триггеры', desc: 'Условия запуска процессов', time: '15 мин' },
      { title: 'Интеграции', desc: 'Подключение внешних сервисов', time: '25 мин' },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code2,
    color: '#ec4899',
    items: [
      { title: 'REST API', desc: 'Полная документация endpoints', time: '30 мин' },
      { title: 'GraphQL', desc: 'Схема и примеры запросов', time: '25 мин' },
      { title: 'Webhooks', desc: 'Настройка real-time событий', time: '15 мин' },
    ],
  },
  {
    id: 'security',
    title: 'Безопасность',
    icon: Shield,
    color: '#ef4444',
    items: [
      { title: 'Аутентификация', desc: 'Настройка auth и прав доступа', time: '20 мин' },
      { title: 'RBAC', desc: 'Role-based access control', time: '18 мин' },
      { title: 'Best Practices', desc: 'Рекомендации по безопасности', time: '15 мин' },
    ],
  },
];

const quickLinks = [
  { icon: FileText, label: 'Changelog', href: '#changelog' },
  { icon: Video, label: 'Video Tutorials', href: '#videos' },
  { icon: Terminal, label: 'CLI Reference', href: '#cli' },
  { icon: Star, label: 'Examples', href: '#examples' },
];

const popularGuides = [
  { title: 'Deploy на Vercel', category: 'Deployment', views: '12.5K' },
  { title: 'Подключение Stripe', category: 'Payments', views: '8.2K' },
  { title: 'Auth с NextAuth', category: 'Security', views: '15.1K' },
  { title: 'Real-time с WebSockets', category: 'API', views: '6.8K' },
];

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Unified Background System */}
        <ContentPageBackground />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <Book className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">Документация</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Как создать <span className="text-gradient">всё что угодно</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
              Пошаговые руководства, API reference и примеры кода 
              для создания приложений любой сложности.
            </p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Поиск по документации..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-white/30">
                <span className="px-2 py-1 rounded bg-white/10">⌘</span>
                <span className="px-2 py-1 rounded bg-white/10">K</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 relative border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <category.icon className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{category.title}</h3>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-white/5">
                  {category.items.map((item, i) => (
                    <a
                      key={item.title}
                      href="#"
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group/item"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-white/80 group-hover/item:text-white transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/30">{item.time}</span>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover/item:text-primary transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                  <a 
                    href="#" 
                    className="flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: category.color }}
                  >
                    Все материалы
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-20 relative border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Популярные гайды</h2>
              <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                Все гайды
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {popularGuides.map((guide, index) => (
                <motion.a
                  key={guide.title}
                  href="#"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all group"
                >
                  <div>
                    <span className="text-xs text-primary font-medium">{guide.category}</span>
                    <h3 className="text-white font-medium mt-1 group-hover:text-gradient transition-all">
                      {guide.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-sm">
                    <Star className="w-4 h-4" />
                    {guide.views}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Reference CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  API Reference
                </h2>
                <p className="text-white/50 mb-8">
                  Полная документация REST и GraphQL API. 
                  Примеры кода на JavaScript, Python, Go и других языках.
                </p>
                <a 
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <Terminal className="w-5 h-5" />
                  Открыть API Docs
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Code Preview */}
              <div className="rounded-xl bg-[#0d0d12] border border-white/10 p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 text-xs text-white/30 border-b border-white/5 pb-2">
                  <span className="text-primary">GET</span>
                  <span>/api/v1/projects</span>
                </div>
                <pre className="text-white/70">
                  <code>{`{
  "projects": [
    {
      "id": "proj_123",
      "name": "My App",
      "status": "active",
      "url": "https://..."
    }
  ],
  "meta": {
    "total": 42,
    "page": 1
  }
}`}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
