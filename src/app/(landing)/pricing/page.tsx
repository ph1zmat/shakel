'use client';

import {
  ArrowRight,
  Building2,
  Check,
  Clock,
  Globe,
  HelpCircle,
  Shield,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import {
  FooterBackground,
  PricingBackground,
} from '@/components/ui/backgrounds';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Для знакомства с платформой и pet-проектов',
    price: { monthly: 0, yearly: 0 },
    icon: Zap,
    color: '#3b82f6',
    popular: false,
    features: [
      { text: '3 проекта', included: true },
      { text: '10 000 запросов/мес', included: true },
      { text: '1 GB хранилища', included: true },
      { text: 'Community поддержка', included: true },
      { text: 'Базовые компоненты', included: true },
      { text: 'SSL сертификат', included: true },
      { text: 'Кастомный домен', included: false },
      { text: 'API доступ', included: false },
      { text: 'AI генерация', included: false },
      { text: 'Приоритетная поддержка', included: false },
    ],
    cta: 'Начать бесплатно',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Для профессионалов и растущих бизнесов',
    price: { monthly: 29, yearly: 24 },
    icon: Sparkles,
    color: '#84cc16',
    popular: true,
    features: [
      { text: 'Неограниченные проекты', included: true },
      { text: '100 000 запросов/мес', included: true },
      { text: '10 GB хранилища', included: true },
      { text: 'Email поддержка', included: true },
      { text: 'Все компоненты', included: true },
      { text: 'SSL сертификат', included: true },
      { text: 'Кастомный домен', included: true },
      { text: 'API доступ', included: true },
      { text: 'AI генерация (500 запросов)', included: true },
      { text: 'Приоритетная поддержка', included: false },
    ],
    cta: 'Начать 14 дней бесплатно',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Для команд и корпоративных клиентов',
    price: { monthly: 99, yearly: 79 },
    icon: Building2,
    color: '#8b5cf6',
    popular: false,
    features: [
      { text: 'Неограниченные проекты', included: true },
      { text: '1 000 000 запросов/мес', included: true },
      { text: '100 GB хранилища', included: true },
      { text: 'Приоритетная поддержка 24/7', included: true },
      { text: 'Все компоненты + Enterprise', included: true },
      { text: 'SSL сертификат Wildcard', included: true },
      { text: 'Неограниченные домены', included: true },
      { text: 'API + Webhooks', included: true },
      { text: 'AI генерация безлимит', included: true },
      { text: 'SSO / SAML', included: true },
    ],
    cta: 'Связаться с отделом продаж',
  },
];

const faqs = [
  {
    question: 'Можно ли изменить тариф позже?',
    answer:
      'Да, вы можете повысить или понизить тариф в любое время. Изменения вступят в силу со следующего платёжного периода.',
  },
  {
    question: 'Есть ли скидка для стартапов?',
    answer:
      'Да! Стартапы могут получить скидку до 90% на первый год через нашу программу Shakel for Startups.',
  },
  {
    question: 'Что происходит при превышении лимитов?',
    answer:
      'Мы не блокируем сервис. Вы получите уведомление и сможете либо повысить тариф, либо доплатить за перерасход.',
  },
  {
    question: 'Поддерживаете ли вы on-premise?',
    answer:
      'Да, в корпоративном тарифе доступна установка на собственные серверы с полной изоляцией данных.',
  },
];

const enterpriseFeatures = [
  {
    icon: Shield,
    title: 'SOC 2 Compliance',
    desc: 'Сертифицированная безопасность',
  },
  { icon: Clock, title: '99.99% SLA', desc: 'Гарантированная доступность' },
  { icon: Globe, title: 'Private Cloud', desc: 'Выделенная инфраструктура' },
];

function PricingCard({
  plan,
  isYearly,
  index,
}: {
  plan: (typeof plans)[0];
  isYearly: boolean;
  index: number;
}) {
  const price = isYearly ? plan.price.yearly : plan.price.monthly;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative rounded-2xl border backdrop-blur-sm overflow-hidden',
        plan.popular
          ? 'border-primary/50 bg-gradient-to-b from-primary/10 to-transparent scale-105 z-10'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20',
      )}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 py-2 bg-primary text-center text-sm font-medium text-white">
          Самый популярный
        </div>
      )}

      <div className={cn('p-8', plan.popular && 'pt-14')}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${plan.color}15` }}
          >
            <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-sm text-white/40">{plan.description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">${price}</span>
            <span className="text-white/40">/месяц</span>
          </div>
          {isYearly && price > 0 && (
            <p className="text-sm text-primary mt-1">
              Экономия ${(plan.price.monthly - plan.price.yearly) * 12}/год
            </p>
          )}
        </div>

        {/* CTA */}
        <Button
          variant={plan.popular ? 'gradient' : 'outline'}
          className={cn(
            'w-full mb-8',
            !plan.popular && 'border-white/20 text-white hover:bg-white/10',
          )}
          size="lg"
        >
          {plan.cta}
        </Button>

        {/* Features */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Включено:
          </p>
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              {feature.included ? (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}20` }}
                >
                  <Check className="w-3 h-3" style={{ color: plan.color }} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-3 h-3 text-white/20" />
                </div>
              )}
              <span
                className={cn(
                  'text-sm',
                  feature.included ? 'text-white/80' : 'text-white/30',
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Unified Background System */}
        <PricingBackground />

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
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">
                Прозрачное ценообразование
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Простая и <span className="text-gradient">честная</span> цена
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
              Начните бесплатно, масштабируйтесь по мере роста. Никаких скрытых
              платежей.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={cn(
                  'text-sm',
                  !isYearly ? 'text-white' : 'text-white/40',
                )}
              >
                Месячно
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-16 h-8 rounded-full bg-white/10 border border-white/10 p-1 transition-colors"
              >
                <motion.div
                  animate={{ x: isYearly ? 32 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-primary"
                />
              </button>
              <span
                className={cn(
                  'text-sm',
                  isYearly ? 'text-white' : 'text-white/40',
                )}
              >
                Годовой
              </span>
              {isYearly && (
                <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  -20%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isYearly={isYearly}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Enterprise
                </h2>
                <p className="text-white/50 mb-8">
                  Индивидуальные условия для крупных организаций. Dedicated
                  инфраструктура, custom SLA, персональный менеджер.
                </p>
                <Button variant="gradient" size="lg" asChild>
                  <a href="/contact" className="flex items-center gap-2">
                    Обсудить требования
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>

              <div className="grid gap-4">
                {enterpriseFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {feature.title}
                      </div>
                      <div className="text-sm text-white/40">
                        {feature.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Частые вопросы
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-medium text-white">
                      {faq.question}
                    </span>
                    <HelpCircle
                      className={cn(
                        'w-5 h-5 text-white/40 transition-transform',
                        openFaq === index && 'rotate-180',
                      )}
                    />
                  </button>
                  <motion.div
                    animate={{ height: openFaq === index ? 'auto' : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-white/50">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
