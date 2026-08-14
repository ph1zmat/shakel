'use client';

import {
  ArrowRight,
  Building2,
  Check,
  Clock,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  Twitter,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import {
  ContentPageBackground,
  FooterBackground,
} from '@/components/ui/backgrounds';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@shakel.dev',
    description: 'Отвечаем в течение 24 часов',
    href: 'mailto:hello@shakel.dev',
    color: '#3b82f6',
  },
  {
    icon: MessageCircle,
    title: 'Discord Community',
    value: 'Присоединиться',
    description: '10,000+ разработчиков',
    href: '#',
    color: '#8b5cf6',
  },
  {
    icon: Phone,
    title: 'Телефон',
    value: '+7 (999) 123-45-67',
    description: 'Пн-Пт, 9:00-18:00 МСК',
    href: 'tel:+79991234567',
    color: '#84cc16',
  },
];

const offices = [
  {
    city: 'Москва',
    address: 'ул. Технопарковая, 1',
    timezone: 'МСК (UTC+3)',
    phone: '+7 (999) 123-45-67',
  },
  {
    city: 'Дубай',
    address: 'Dubai Internet City',
    timezone: 'GST (UTC+4)',
    phone: '+971 4 123 4567',
  },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#', followers: '5.2K' },
  { icon: Twitter, label: 'Twitter', href: '#', followers: '12.8K' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', followers: '3.1K' },
  { icon: MessageCircle, label: 'Discord', href: '#', followers: '10K+' },
];

const inquiryTypes = [
  { value: 'sales', label: 'Sales — обсудить проект' },
  { value: 'support', label: 'Поддержка — нужна помощь' },
  { value: 'partners', label: 'Партнёрство' },
  { value: 'press', label: 'Пресса и медиа' },
  { value: 'other', label: 'Другое' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiry: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">
                Связаться с нами
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Давайте <span className="text-gradient">поговорим</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Есть вопросы? Мы здесь, чтобы помочь. Выберите удобный способ
              связи или заполните форму.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04] transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${method.color}15` }}
                >
                  <method.icon
                    className="w-6 h-6"
                    style={{ color: method.color }}
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {method.title}
                </h3>
                <p className="text-primary font-medium mb-2">{method.value}</p>
                <p className="text-sm text-white/40">{method.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Отправить сообщение
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="Иван Иванов"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="ivan@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Компания
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="ООО «Компания»"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Тема обращения
                    </label>
                    <select
                      value={formData.inquiry}
                      onChange={(e) =>
                        setFormData({ ...formData, inquiry: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled className="bg-[#0a0a0f]">
                        Выберите тему
                      </option>
                      {inquiryTypes.map((type) => (
                        <option
                          key={type.value}
                          value={type.value}
                          className="bg-[#0a0a0f]"
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Сообщение
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="Расскажите о вашем проекте..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitted}
                  >
                    {isSubmitted ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Отправлено!
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Отправить сообщение
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Offices */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Наши офисы
                </h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <motion.div
                      key={office.city}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-5 rounded-xl border border-white/10 bg-white/[0.02]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white">
                          {office.city}
                        </h4>
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Clock className="w-3 h-3" />
                          {office.timezone}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-white/60">
                          <MapPin className="w-4 h-4 text-primary" />
                          {office.address}
                        </p>
                        <p className="flex items-center gap-2 text-white/60">
                          <Phone className="w-4 h-4 text-primary" />
                          {office.phone}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6">
                  Социальные сети
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04] transition-all group"
                    >
                      <social.icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
                      <div>
                        <div className="font-medium text-white text-sm">
                          {social.label}
                        </div>
                        <div className="text-xs text-white/40">
                          {social.followers}
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Response Time */}
              <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-white">Время ответа</h4>
                </div>
                <p className="text-white/60 text-sm">
                  Обычно отвечаем в течение нескольких часов. Для Enterprise
                  клиентов — доступен приоритетный канал 24/7.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto h-[300px] rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center relative overflow-hidden"
          >
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Location Pins */}
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-4 h-4 rounded-full bg-primary" />
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-50" />
              </motion.div>
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-white/40 whitespace-nowrap">
                Москва
              </span>
            </div>

            <div className="absolute right-1/3 top-1/3">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="relative"
              >
                <div className="w-4 h-4 rounded-full bg-primary" />
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-50" />
              </motion.div>
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-white/40 whitespace-nowrap">
                Дубай
              </span>
            </div>

            <p className="text-white/30 text-sm">Global presence</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
