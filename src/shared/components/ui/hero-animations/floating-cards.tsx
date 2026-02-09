'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'

export interface FloatingCard {
	icon: LucideIcon
	label: string
	color: string
	delay: number
}

interface FloatingCardsProps {
	cards: FloatingCard[]
	imageSrc: string
	imageAlt?: string
}

const defaultCards: FloatingCard[] = []

export function FloatingCards({
	cards = defaultCards,
	imageSrc,
	imageAlt = 'Center image',
}: FloatingCardsProps) {
	return (
		<div className='relative w-full h-full flex items-center justify-center overflow-hidden'>
			{/* Central element */}
			<motion.div
				className='absolute w-24 h-24 rounded-full flex items-center justify-center z-20 overflow-hidden'
				animate={{
					scale: [1, 1.1, 1],
					boxShadow: [
						'0 0 30px rgba(59, 130, 246, 0.3)',
						'0 0 60px rgba(132, 204, 22, 0.4)',
						'0 0 30px rgba(59, 130, 246, 0.3)',
					],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			>
				<Image
					src={imageSrc}
					alt={imageAlt}
					className='w-full h-full object-cover p-4'
					fill
					priority
				/>
			</motion.div>

			{/* Orbiting cards */}
			{cards.map((card, index) => {
				const angle = (index / cards.length) * 2 * Math.PI
				const radius = 140
				const x = Math.cos(angle) * radius
				const y = Math.sin(angle) * radius

				return (
					<motion.div
						key={card.label}
						className='absolute'
						initial={{ x, y, opacity: 0, scale: 0 }}
						animate={{
							x: [x, x * 1.1, x],
							y: [y, y * 1.1, y],
							opacity: 1,
							scale: 1,
							rotate: [0, 5, -5, 0],
						}}
						transition={{
							x: {
								duration: 4,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: card.delay,
							},
							y: {
								duration: 5,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: card.delay,
							},
							opacity: { duration: 0.5, delay: card.delay },
							scale: { duration: 0.5, delay: card.delay },
							rotate: {
								duration: 6,
								repeat: Infinity,
								ease: 'easeInOut',
								delay: card.delay,
							},
						}}
					>
						<motion.div
							className='w-16 h-16 rounded-xl backdrop-blur-md border border-primary/20 flex flex-col items-center justify-center gap-1 cursor-pointer'
							style={{ backgroundColor: `${card.color}15` }}
							whileHover={{ scale: 1.15, backgroundColor: `${card.color}30` }}
							transition={{ type: 'spring', stiffness: 300 }}
						>
							<card.icon className='w-6 h-6' style={{ color: card.color }} />
							<span className='text-[8px] font-medium text-muted-foreground text-center leading-tight px-1'>
								{card.label}
							</span>
						</motion.div>
					</motion.div>
				)
			})}

			{/* Connection lines */}
			<svg className='absolute inset-0 w-full h-full pointer-events-none'>
				<defs>
					<linearGradient id='lineGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
						<stop offset='0%' stopColor='#3b82f6' stopOpacity='0.3' />
						<stop offset='100%' stopColor='#84cc16' stopOpacity='0.3' />
					</linearGradient>
				</defs>
				{cards.map((_, index) => {
					const angle1 = (index / cards.length) * 2 * Math.PI
					const angle2 =
						(((index + 1) % cards.length) / cards.length) * 2 * Math.PI
					const radius = 140
					const x1 = 50 + (Math.cos(angle1) * radius) / 3
					const y1 = 50 + (Math.sin(angle1) * radius) / 3
					const x2 = 50 + (Math.cos(angle2) * radius) / 3
					const y2 = 50 + (Math.sin(angle2) * radius) / 3

					return (
						<motion.line
							key={`line-${cards[index].label}`}
							x1={`${x1}%`}
							y1={`${y1}%`}
							x2={`${x2}%`}
							y2={`${y2}%`}
							stroke='url(#lineGradient)'
							strokeWidth='1'
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 0.5 }}
							transition={{ duration: 1, delay: index * 0.1 }}
						/>
					)
				})}
			</svg>
		</div>
	)
}
