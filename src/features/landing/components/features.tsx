'use client';

import {
  Activity,
  Clock,
  Fingerprint,
  Gauge,
  GitBranch,
  History,
  Key,
  Lock,
  Share2,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FeaturesBackground } from '@/components/ui/backgrounds';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const featureGroups = [
  {
    id: 'security',
    title: 'Безопасность',
    subtitle: 'Enterprise-grade защита',
    description:
      'Полный контроль над данными с возможностью развёртывания на собственных серверах и продвинутыми инструментами аутентификации.',
    icon: Shield,
    color: '#3b82f6',
    features: [
      {
        icon: Lock,
        label: 'SSL шифрование',
        description: 'Все данные передаются по защищённому соединению',
      },
      {
        icon: Key,
        label: 'SSO & SAML',
        description: 'Интеграция с корпоративными системами аутентификации',
      },
      {
        icon: Fingerprint,
        label: '2FA защита',
        description: 'Двухфакторная аутентификация для всех аккаунтов',
      },
    ],
  },
  {
    id: 'performance',
    title: 'Производительность',
    subtitle: 'Масштабируемая инфраструктура',
    description:
      'Высокая доступность и скорость работы благодаря современной облачной архитектуре и оптимизированной доставке контента.',
    icon: Zap,
    color: '#84cc16',
    features: [
      {
        icon: Gauge,
        label: 'CDN доставка',
        description:
          'Глобальная сеть доставки контента для максимальной скорости',
      },
      {
        icon: Activity,
        label: '99.9% аптайм',
        description: 'Гарантированная доступность ваших приложений',
      },
      {
        icon: Clock,
        label: 'Автомасштабирование',
        description: 'Автоматическое распределение нагрузки в пиковые периоды',
      },
    ],
  },
  {
    id: 'collaboration',
    title: 'Коллаборация',
    subtitle: 'Командная работа',
    description:
      'Эффективное взаимодействие команды с инструментами для совместной разработки, контроля версий и управления доступом.',
    icon: Users,
    color: '#8b5cf6',
    features: [
      {
        icon: GitBranch,
        label: 'Версионирование',
        description: 'Отслеживание изменений и возможность отката',
      },
      {
        icon: Share2,
        label: 'Ролевая модель',
        description: 'Гибкое управление правами доступа',
      },
      {
        icon: History,
        label: 'История правок',
        description: 'Полная история изменений с авторством',
      },
    ],
  },
];

export function Features() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      <FeaturesBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
              Готовы к production
            </p>
            <h2
              id="features-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              <span className="text-gradient">Надёжность</span> премиум-класса
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Постройте автоматизацию с той же надёжностью, что и при
              развёртывании кода. Работайте в облаке или на собственных
              серверах.
            </p>
          </motion.div>
        </header>

        {/* Feature groups */}
        <div
          className="grid gap-6 lg:gap-8 lg:grid-cols-3"
          role="list"
          aria-label="Feature Categories"
        >
          {featureGroups.map((group, groupIndex) => (
            <motion.article
              key={group.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: groupIndex * 0.1,
                ease: EASE_OUT_EXPO,
              }}
              className="group relative"
              role="listitem"
            >
              <div className="relative h-full rounded-2xl border border-border/60 bg-card/50 p-6 md:p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 will-change-transform">
                {/* Header */}
                <header className="mb-6">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 will-change-transform"
                    style={{ backgroundColor: `${group.color}15` }}
                  >
                    <group.icon
                      className="w-6 h-6 md:w-7 md:h-7"
                      style={{ color: group.color }}
                    />
                  </div>
                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: group.color }}
                  >
                    {group.subtitle}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    {group.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {group.description}
                  </p>
                </header>

                {/* Feature list */}
                <ul
                  className="space-y-3 md:space-y-4"
                  aria-label={`${group.title} Features`}
                >
                  {group.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.1 * featureIndex + groupIndex * 0.1,
                        ease: EASE_OUT_EXPO,
                      }}
                    >
                      <div className="flex gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl transition-all duration-300 hover:bg-muted/50 group/item cursor-default">
                        <div
                          className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-110"
                          style={{ backgroundColor: `${group.color}10` }}
                        >
                          <feature.icon
                            className="w-4 h-4 md:w-5 md:h-5"
                            style={{ color: group.color }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground text-sm mb-0.5">
                            {feature.label}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
