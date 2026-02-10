'use client';

import { motion } from 'motion/react';
import { Quote, Star, TrendingUp, Building2, Globe2, Award } from 'lucide-react';
import Image from 'next/image';
import { TestimonialsBackground } from '@/components/ui/backgrounds';

const testimonials = [
  {
    id: 1,
    quote: "Shakel позволил нам запустить MVP за 2 недели вместо 6 месяцев разработки. Это изменило правила игры для нашего стартапа.",
    author: "Александр Ковалёв",
    role: "CTO",
    company: "FinFlow",
    avatar: "AK",
    rating: 5,
    metric: { value: "10x", label: "ускорение запуска" }
  },
  {
    id: 2,
    quote: "Мы сократили затраты на разработку на 70%, при этом качество кода оказалось выше, чем при аутсорсе.",
    author: "Елена Смирнова",
    role: "Product Manager",
    company: "RetailPro",
    avatar: "ЕС",
    rating: 5,
    metric: { value: "70%", label: "экономия бюджета" }
  },
  {
    id: 3,
    quote: "Возможность быстро прототипировать и тестировать идеи дала нам конкурентное преимущество на рынке.",
    author: "Михаил Петров",
    role: "Founder",
    company: "TechStart",
    avatar: "МП",
    rating: 5,
    metric: { value: "3x", label: "быстрее итерации" }
  },
];

const stats = [
  { icon: Building2, value: "500+", label: "Компаний", description: "Доверяют платформе" },
  { icon: Globe2, value: "50+", label: "Стран", description: "Глобальное присутствие" },
  { icon: TrendingUp, value: "$50M+", label: "Выручки", description: "Создано клиентами" },
  { icon: Award, value: "99.9%", label: "Аптайм", description: "Надёжность инфраструктуры" },
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <TestimonialsBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-border/50">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center px-6 py-4"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Истории <span className="text-gradient">успеха</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Присоединяйтесь к тысячам компаний, которые уже трансформировали свой бизнес
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground/90 mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Metric */}
                <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-gradient">{testimonial.metric.value}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.metric.label}</div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50"
        >
          <span className="text-sm text-muted-foreground uppercase tracking-wider">Доверяют лидеры индустрии</span>
        </motion.div>
      </div>
    </section>
  );
}
