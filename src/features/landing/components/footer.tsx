'use client'

import { Github, Twitter, MessageCircle, Mail } from 'lucide-react'
import Image from 'next/image'
import Logo from '../../../../public/gochi-logo.png'
import { FooterBackground } from '@/components/ui/backgrounds'

const footerLinks = {
	product: {
		title: 'Продукт',
		links: [
			{ label: 'Возможности', href: '#features' },
			{ label: 'Цены', href: '#pricing' },
			{ label: 'Шаблоны', href: '#templates' },
			{ label: 'Интеграции', href: '#integrations' },
			{ label: 'Roadmap', href: '#roadmap' },
		],
	},
	resources: {
		title: 'Ресурсы',
		links: [
			{ label: 'Документация', href: '#docs' },
			{ label: 'API Reference', href: '#api' },
			{ label: 'Блог', href: '#blog' },
			{ label: 'Обучение', href: '#learn' },
			{ label: 'Сообщество', href: '#community' },
		],
	},
	company: {
		title: 'Компания',
		links: [
			{ label: 'О нас', href: '#about' },
			{ label: 'Карьера', href: '#careers' },
			{ label: 'Контакты', href: '#contact' },
			{ label: 'Партнёры', href: '#partners' },
			{ label: 'Статус', href: '#status' },
		],
	},
	legal: {
		title: 'Правовое',
		links: [
			{ label: 'Privacy Policy', href: '#privacy' },
			{ label: 'Terms of Service', href: '#terms' },
			{ label: 'Cookie Policy', href: '#cookies' },
			{ label: 'GDPR', href: '#gdpr' },
		],
	},
}

const socialLinks = [
	{ icon: Github, href: '#', label: 'GitHub' },
	{ icon: Twitter, href: '#', label: 'Twitter' },
	{ icon: MessageCircle, href: '#', label: 'Discord' },
	{ icon: Mail, href: '#', label: 'Email' },
]

export function Footer() {
	return (
		<footer className='relative overflow-hidden bg-muted/30 border-t border-border/50'>
			<FooterBackground />
			<div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Main footer */}
				<div className='py-16 grid grid-cols-2 md:grid-cols-6 gap-8'>
					{/* Brand column */}
					<div className='col-span-2'>
						<div className='flex items-center gap-2 mb-4'>
							<Image src={Logo} alt='Shakel Logo' width={120} height={48} />
						</div>
						<p className='text-muted-foreground text-sm mb-6 max-w-xs'>
							Платформа для создания веб-приложений без кода. Превращайте идеи в
							реальность за считанные минуты.
						</p>
						{/* Social links */}
						<div className='flex gap-3'>
							{socialLinks.map(social => (
								<a
									key={social.label}
									href={social.href}
									className='w-9 h-9 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all'
									aria-label={social.label}
								>
									<social.icon className='w-4 h-4' />
								</a>
							))}
						</div>
					</div>

					{/* Link columns */}
					{Object.values(footerLinks).map(section => (
						<div key={section.title}>
							<h4 className='font-semibold text-foreground mb-4'>
								{section.title}
							</h4>
							<ul className='space-y-3'>
								{section.links.map(link => (
									<li key={link.label}>
										<a
											href={link.href}
											className='text-sm text-muted-foreground hover:text-foreground transition-colors'
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div className='py-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4'>
					<p className='text-sm text-muted-foreground'>
						© {new Date().getFullYear()} Shakel. Все права защищены.
					</p>
					<div className='flex items-center gap-6'>
						<span className='text-xs text-muted-foreground'>
							Made with ❤️ for creators
						</span>
					</div>
				</div>
			</div>
		</footer>
	)
}
