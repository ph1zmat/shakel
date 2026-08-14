'use client';

import { Github, Mail, MessageCircle, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FooterBackground } from '@/components/ui/backgrounds';
import Logo from '../../../../public/gochi-logo.png';

const footerLinks = {
  product: {
    title: 'Продукт',
    links: [
      { label: 'Возможности', href: '/features' },
      { label: 'Цены', href: '/pricing' },
      { label: 'Шаблоны', href: '/templates' },
      { label: 'Интеграции', href: '/integrations' },
    ],
  },
  resources: {
    title: 'Ресурсы',
    links: [
      { label: 'Документация', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Блог', href: '/blog' },
      { label: 'Обучение', href: '/learn' },
    ],
  },
  company: {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '/about' },
      { label: 'Карьера', href: '/careers' },
      { label: 'Контакты', href: '/contact' },
      { label: 'Партнёры', href: '/partners' },
    ],
  },
  legal: {
    title: 'Правовое',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
};

const socialLinks = [
  { icon: Github, href: 'https://github.com/shakel', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/shakel', label: 'Twitter' },
  { icon: MessageCircle, href: 'https://discord.gg/shakel', label: 'Discord' },
  { icon: Mail, href: 'mailto:hello@shakel.io', label: 'Email' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden bg-muted/30 border-t border-border/50"
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <FooterBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <section className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/"
                className="transition-opacity duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              >
                <Image
                  src={Logo}
                  alt="Shakel Logo"
                  width={120}
                  height={48}
                  className="h-auto w-auto max-w-[100px] md:max-w-[120px]"
                />
              </Link>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
              Платформа для создания веб-приложений без кода. Превращайте идеи в
              реальность за считанные минуты.
            </p>
            {/* Social links */}
            <nav aria-label="Social Media Links">
              <ul className="flex gap-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label={`Follow us on ${social.label}`}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <nav key={key} aria-labelledby={`${key}-heading`}>
              <h3
                id={`${key}-heading`}
                className="font-semibold text-foreground mb-4 text-sm"
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:text-primary relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all hover:after:w-full"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} Shakel. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
              Made with{' '}
              <span className="text-red-500" aria-hidden="true">
                &hearts;
              </span>{' '}
              for creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
