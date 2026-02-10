'use client';

import { motion } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Users,
  Lock,
  Key,
  Fingerprint,
  Gauge,
  Activity,
  Clock,
  GitBranch,
  Share2,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeaturesBackground } from '@/components/ui/backgrounds';

const featureGroups = [
  {
    id: 'security',
    title: 'Безопасность',
    subtitle: 'Enterprise-grade защита',
    description: 'Полный контроль над данными с возможностью развёртывания на собственных серверах и продвинутыми инструментами аутентификации.',
    icon: Shield,
    color: '#3b82f6',
    features: [
      { icon: Lock, label: 'SSL шифрование', description: 'Все данные передаются по защищённому соединению' },
      { icon: Key, label: 'SSO & SAML', description: 'Интеграция с корпоративными системами аутентификации' },
      { icon: Fingerprint, label: '2FA защита', description: 'Двухфакторная аутентификация для всех аккаунтов' },
    ],
  },
  {
    id: 'performance',
    title: 'Производительность',
    subtitle: 'Масштабируемая инфраструктура',
    description: 'Высокая доступность и скорость работы благодаря современной облачной архитектуре и оптимизированной доставке контента.',
    icon: Zap,
    color: '#84cc16',
    features: [
      { icon: Gauge, label: 'CDN доставка', description: 'Глобальная сеть доставки контента для максимальной скорости' },
      { icon: Activity, label: '99.9% аптайм', description: 'Гарантированная доступность ваших приложений' },
      { icon: Clock, label: 'Автомасштабирование', description: 'Автоматическое распределение нагрузки в пиковые периоды' },
    ],
  },
  {
    id: 'collaboration',
    title: 'Коллаборация',
    subtitle: 'Командная работа',
    description: 'Эффективное взаимодействие команды с инструментами для совместной разработки, контроля версий и управления доступом.',
    icon: Users,
    color: '#3b82f6',
    features: [
      { icon: GitBranch, label: 'Версионирование', description: 'Отслеживание изменений и возможность отката' },
      { icon: Share2, label: 'Ролевая модель', description: 'Гибкое управление правами доступа' },
      { icon: History, label: 'История правок', description: 'Полная история изменений с авторством' },
    ],
  },
];

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden">
      <FeaturesBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
            Готовы к production
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <span className="text-gradient">Надёжность</span> премиум-класса
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Постройте автоматизацию с той же надёжностью, что и при развёртывании кода. 
            Работайте в облаке или на собственных серверах.
          </p>
        </motion.div>

        {/* Feature groups */}
        <div className="grid gap-8 lg:grid-cols-3">
          {featureGroups.map((group, groupIndex) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full rounded-2xl border border-border/60 bg-card/50 p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                {/* Header */}
                <div className="mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${group.color}15` }}
                  >
                    <group.icon className="w-7 h-7" style={{ color: group.color }} />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: group.color }}>
                    {group.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {group.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {group.description}
                  </p>
                </div>

                {/* Feature list */}
                <div className="space-y-4">
                  {group.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * featureIndex + groupIndex * 0.1 }}
                      className="flex gap-4 p-3 rounded-xl transition-colors hover:bg-muted/50"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${group.color}10` }}
                      >
                        <feature.icon className="w-5 h-5" style={{ color: group.color }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm mb-1">
                          {feature.label}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
