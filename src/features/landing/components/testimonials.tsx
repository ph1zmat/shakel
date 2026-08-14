'use client';

import {
  Award,
  Building2,
  Globe2,
  Quote,
  Star,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { TestimonialsBackground } from '@/components/ui/backgrounds';

const testimonials = [
  {
    id: 1,
    quote:
      'Shakel позволил нам запустить MVP за 2 недели вместо 6 месяцев разработки. Это изменило правила игры для нашего стартапа.',
    author: 'Александр Ковалёв',
    role: 'CTO',
    company: 'FinFlow',
    avatar: 'АК',
    rating: 5,
    metric: { value: '10x', label: 'ускорение запуска' },
  },
  {
    id: 2,
    quote:
      'Мы сократили затраты на разработку на 70%, при этом качество кода оказалось выше, чем при аутсорсе.',
    author: 'Елена Смирнова',
    role: 'Product Manager',
    company: 'RetailPro',
    avatar: 'ЕС',
    rating: 5,
    metric: { value: '70%', label: 'экономия бюджета' },
  },
  {
    id: 3,
    quote:
      'Возможность быстро прототипировать и тестировать идеи дала нам конкурентное преимущество на рынке.',
    author: 'Михаил Петров',
    role: 'Founder',
    company: 'TechStart',
    avatar: 'МП',
    rating: 5,
    metric: { value: '3x', label: 'быстрее итерации' },
  },
];

const stats = [
  {
    icon: Building2,
    value: '500+',
    label: 'Компаний',
    description: 'Доверяют платформе',
  },
  {
    icon: Globe2,
    value: '50+',
    label: 'Стран',
    description: 'Глобальное присутствие',
  },
  {
    icon: TrendingUp,
    value: '$50M+',
    label: 'Выручки',
    description: 'Создано клиентами',
  },
  {
    icon: Award,
    value: '99.9%',
    label: 'Аптайм',
    description: 'Надёжность инфраструктуры',
  },
];

export function Testimonials() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <TestimonialsBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Bar */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
          aria-label="Platform Statistics"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-border/50">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-center px-6 py-4 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 transition-transform duration-300 group-hover:scale-110">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Header */}
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
            >
              Истории <span className="text-gradient">успеха</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Присоединяйтесь к тысячам компаний, которые уже трансформировали
              свой бизнес
            </p>
          </motion.div>
        </header>

        {/* Testimonial Cards */}
        <div
          className="grid md:grid-cols-3 gap-6"
          role="list"
          aria-label="Customer Testimonials"
        >
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
              role="listitem"
            >
              <div className="relative h-full p-6 md:p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 will-change-transform">
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Quote className="w-5 h-5 text-primary" />
                </div>

                {/* Rating */}
                <div
                  className="flex gap-1 mb-6"
                  role="img"
                  aria-label={`Rating: ${testimonial.rating} out of 5 stars`}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground/90 mb-8 leading-relaxed text-sm md:text-base">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Metric */}
                <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10 transition-all duration-300 group-hover:bg-primary/10">
                  <div className="text-2xl font-bold text-gradient">
                    {testimonial.metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.metric.label}
                  </div>
                </div>

                {/* Author */}
                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold transition-transform duration-300 group-hover:scale-105">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-foreground">
                      {testimonial.author}
                    </cite>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </footer>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50"
        >
          <span className="text-sm text-muted-foreground uppercase tracking-wider">
            Доверяют лидеры индустрии
          </span>
        </motion.footer>
      </div>
    </section>
  );
}
