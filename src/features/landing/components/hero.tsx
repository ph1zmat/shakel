'use client'

import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import { HeroBackground } from '@/components/ui/backgrounds'

// Smooth easing curves from Linear/Vercel
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Product UI Mockup - Real interface visualization
const ProductMockup = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.3 }}
			className='relative w-full max-w-4xl mx-auto'
		>
			{/* Browser chrome */}
			<div className='relative rounded-xl border border-white/10 bg-[#0f0f14] overflow-hidden shadow-2xl shadow-black/50'>
				{/* Window header */}
				<div className='flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]'>
					<div className='flex gap-1.5'>
						<div className='w-3 h-3 rounded-full bg-red-500/80' />
						<div className='w-3 h-3 rounded-full bg-yellow-500/80' />
						<div className='w-3 h-3 rounded-full bg-green-500/80' />
					</div>
					<div className='flex-1 flex justify-center'>
						<div className='px-3 py-1 rounded-md bg-white/5 text-xs text-white/30 font-mono'>
							app.shakel.io/projects
						</div>
					</div>
					<div className='w-16' />
				</div>

				{/* App interface */}
				<div className='flex h-[400px]'>
					{/* Sidebar */}
					<div className='w-56 border-r border-white/5 bg-white/[0.01] p-4 hidden sm:block'>
						<div className='flex items-center gap-2 mb-6'>
							<div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-lime-500 flex items-center justify-center text-white text-sm font-bold'>
								S
							</div>
							<span className='text-white/80 font-medium'>Shakel</span>
						</div>

						<div className='space-y-1'>
							{['Проекты', 'База данных', 'API', 'Аналитика', 'Настройки'].map(
								(item, i) => (
									<motion.div
										key={item}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.8 + i * 0.1 }}
										className={`px-3 py-2 rounded-lg text-sm ${i === 0 ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'} cursor-pointer transition-colors`}
									>
										{item}
									</motion.div>
								),
							)}
						</div>
					</div>

					{/* Main content */}
					<div className='flex-1 p-6'>
						{/* Header */}
						<div className='flex items-center justify-between mb-6'>
							<div>
								<motion.h3
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.6 }}
									className='text-lg font-semibold text-white'
								>
									Мои проекты
								</motion.h3>
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.7 }}
									className='text-sm text-white/40'
								>
									12 активных приложений
								</motion.p>
							</div>
							<motion.button
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.9 }}
								className='px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors'
							>
								Новый проект
							</motion.button>
						</div>

						{/* Projects grid */}
						<div className='grid grid-cols-2 gap-4'>
							{[
								{
									name: 'CRM Система',
									status: 'Опубликован',
									color: 'bg-green-500',
								},
								{
									name: 'Интернет-магазин',
									status: 'В разработке',
									color: 'bg-yellow-500',
								},
								{
									name: 'Блог платформа',
									status: 'Опубликован',
									color: 'bg-green-500',
								},
								{ name: 'Аналитика', status: 'Черновик', color: 'bg-gray-500' },
							].map((project, i) => (
								<motion.div
									key={project.name}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1 + i * 0.1, ease: EASE_OUT_EXPO }}
									className='p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group'
								>
									<div className='flex items-start justify-between mb-3'>
										<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-lg'>
											{['🚀', '🛒', '✍️', '📊'][i]}
										</div>
										<div className={`w-2 h-2 rounded-full ${project.color}`} />
									</div>
									<h4 className='text-white/90 font-medium mb-1'>
										{project.name}
									</h4>
									<p className='text-xs text-white/40'>{project.status}</p>
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* Bottom gradient fade */}
				<div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none' />
			</div>

			{/* Floating elements */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 1.4, duration: 0.6 }}
				className='absolute -left-4 sm:-left-8 top-1/4 px-4 py-3 rounded-xl border border-white/10 bg-[#0f0f14]/90 backdrop-blur-xl shadow-xl hidden md:block'
			>
				<div className='flex items-center gap-3'>
					<div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
					<span className='text-sm text-white/70'>Deploy успешен</span>
				</div>
				<div className='text-xs text-white/40 mt-1'>2 секунды назад</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 1.6, duration: 0.6 }}
				className='absolute -right-4 sm:-right-8 bottom-1/4 px-4 py-3 rounded-xl border border-white/10 bg-[#0f0f14]/90 backdrop-blur-xl shadow-xl hidden md:block'
			>
				<div className='flex items-center gap-2 mb-2'>
					<span className='text-2xl font-bold text-white'>99.9%</span>
				</div>
				<div className='text-xs text-white/40'>Аптайм за 30 дней</div>
			</motion.div>
		</motion.div>
	)
}

// Stats with count-up animation
const Stats = () => {
	const stats = [
		{ value: '10K+', label: 'Проектов создано' },
		{ value: '500+', label: 'Компаний' },
		{ value: '99.9%', label: 'Аптайм' },
	]

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.8, duration: 0.6 }}
			className='flex flex-wrap gap-8 sm:gap-12'
		>
			{stats.map((stat, i) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1 + i * 0.1 }}
					className='flex flex-col'
				>
					<span className='text-2xl sm:text-3xl font-semibold text-white tracking-tight'>
						{stat.value}
					</span>
					<span className='text-sm text-white/40 mt-1'>{stat.label}</span>
				</motion.div>
			))}
		</motion.div>
	)
}

export const Hero = () => {
	return (
		<section className='relative min-h-screen overflow-hidden bg-[#0a0a0f]'>
			{/* Unified Background System */}
			<HeroBackground />

			<div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16'>
				<div className='max-w-5xl mx-auto text-center mb-12 sm:mb-16'>
					{/* Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
						className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8'
					>
						<span className='relative flex h-2 w-2'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
							<span className='relative inline-flex rounded-full h-2 w-2 bg-blue-500' />
						</span>
						<span className='text-sm text-white/70'>v2.0 уже доступен</span>
					</motion.div>

					{/* Headline */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
						className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1] mb-6'
					>
						Создавайте приложения
						<br />
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-lime-400'>
							без единой строки кода
						</span>
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
						className='text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed'
					>
						Визуальный конструктор корпоративных приложений. Базы данных, API,
						автоматизация и AI — всё в одной платформе.
					</motion.p>

					{/* CTAs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
						className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'
					>
						<Button
							variant='gradient'
							size='lg'
							className='w-full sm:w-auto px-8 h-12 text-base font-medium group'
							asChild
						>
							<a href='#get-started'>
								Начать бесплатно
								<ArrowRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1' />
							</a>
						</Button>
						<Button
							variant='outline'
							size='lg'
							className='w-full sm:w-auto px-8 h-12 text-base font-medium border-white/10 text-white hover:bg-white/5'
							asChild
						>
							<a href='#demo' className='flex items-center gap-2'>
								<Play className='w-4 h-4' />
								Смотреть демо
							</a>
						</Button>
					</motion.div>

					{/* Stats */}
					<div className='flex justify-center'>
						<Stats />
					</div>
				</div>

				{/* Product Mockup */}
				<ProductMockup />
			</div>
		</section>
	)
}
