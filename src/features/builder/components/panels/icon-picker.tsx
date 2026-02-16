'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { IconSearch, IconX } from '@tabler/icons-react'

// ========================================
// Popular Tabler icon names for quick picker
// Full library has 5000+ icons; we offer a curated set
// ========================================

const POPULAR_ICONS = [
	'IconStar',
	'IconHeart',
	'IconHome',
	'IconUser',
	'IconSettings',
	'IconSearch',
	'IconBell',
	'IconMail',
	'IconPhone',
	'IconCalendar',
	'IconCamera',
	'IconLock',
	'IconShield',
	'IconBolt',
	'IconFlame',
	'IconRocket',
	'IconWorld',
	'IconMap',
	'IconCloud',
	'IconSun',
	'IconMoon',
	'IconEye',
	'IconThumbUp',
	'IconDownload',
	'IconUpload',
	'IconCheck',
	'IconX',
	'IconPlus',
	'IconMinus',
	'IconArrowRight',
	'IconArrowLeft',
	'IconArrowUp',
	'IconArrowDown',
	'IconChevronRight',
	'IconMenu2',
	'IconDots',
	'IconEdit',
	'IconTrash',
	'IconCopy',
	'IconShare',
	'IconLink',
	'IconExternalLink',
	'IconBookmark',
	'IconFlag',
	'IconTag',
	'IconFilter',
	'IconAdjustments',
	'IconCode',
	'IconTerminal',
	'IconDatabase',
	'IconServer',
	'IconBrandGithub',
	'IconBrandTwitter',
	'IconBrandFacebook',
	'IconBrandInstagram',
	'IconBrandLinkedin',
	'IconBrandYoutube',
	'IconBrandDiscord',
	'IconBrandSlack',
	'IconBrandSpotify',
	'IconPlayerPlay',
	'IconPlayerPause',
	'IconVolume',
	'IconMusic',
	'IconPhoto',
	'IconVideo',
	'IconFile',
	'IconFolder',
	'IconMessage',
	'IconSend',
	'IconInbox',
	'IconArchive',
	'IconCreditCard',
	'IconWallet',
	'IconShoppingCart',
	'IconGift',
	'IconTrophy',
	'IconAward',
	'IconCrown',
	'IconDiamond',
	'IconPalette',
	'IconBrush',
	'IconDroplet',
	'IconSparkles',
	'IconPuzzle',
	'IconTarget',
	'IconCompass',
	'IconAnchor',
	'IconClock',
	'IconAlarm',
	'IconHourglass',
	'IconRefresh',
	'IconZoomIn',
	'IconMaximize',
	'IconLayout',
	'IconGrid',
] as const

// Simple SVG paths for common icons (subset for canvas preview)
const ICON_CATEGORIES = [
	{ id: 'all', label: 'All' },
	{ id: 'ui', label: 'UI' },
	{ id: 'social', label: 'Social' },
	{ id: 'media', label: 'Media' },
	{ id: 'misc', label: 'Misc' },
] as const

function categorizeIcon(name: string): string {
	if (name.includes('Brand')) return 'social'
	if (
		name.includes('Player') ||
		name.includes('Volume') ||
		name.includes('Music') ||
		name.includes('Photo') ||
		name.includes('Video') ||
		name.includes('Camera')
	)
		return 'media'
	if (
		name.includes('Arrow') ||
		name.includes('Chevron') ||
		name.includes('Menu') ||
		name.includes('Check') ||
		name.includes('Plus') ||
		name.includes('Minus') ||
		name.includes('Search') ||
		name.includes('Filter') ||
		name.includes('Layout') ||
		name.includes('Grid')
	)
		return 'ui'
	return 'misc'
}

// ========================================
// Icon Picker Dialog
// ========================================

export function IconPicker({
	value,
	onChange,
	onClose,
}: {
	value: string
	onChange: (iconName: string) => void
	onClose: () => void
}) {
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState('all')

	const filteredIcons = useMemo(() => {
		return POPULAR_ICONS.filter(name => {
			const matchSearch =
				!search || name.toLowerCase().includes(search.toLowerCase())
			const matchCat = category === 'all' || categorizeIcon(name) === category
			return matchSearch && matchCat
		})
	}, [search, category])

	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 z-50 bg-white dark:bg-gray-950 flex flex-col'>
			{/* Header */}
			<div className='p-2 border-b space-y-2'>
				<div className='flex items-center justify-between'>
					<h4 className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
						Pick Icon
					</h4>
					<button
						type='button'
						onClick={onClose}
						className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800'
					>
						<IconX className='h-3.5 w-3.5 text-gray-400' />
					</button>
				</div>

				<div className='relative'>
					<IconSearch className='absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400' />
					<input
						type='text'
						placeholder='Search icons...'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='w-full pl-6 pr-2 py-1 text-[11px] border rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-700 outline-none'
					/>
				</div>

				<div className='flex gap-1'>
					{ICON_CATEGORIES.map(cat => (
						<button
							key={cat.id}
							type='button'
							onClick={() => setCategory(cat.id)}
							className={cn(
								'px-2 py-0.5 text-[9px] rounded-full transition-colors',
								category === cat.id
									? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
									: 'text-gray-400 hover:bg-gray-100',
							)}
						>
							{cat.label}
						</button>
					))}
				</div>
			</div>

			{/* Icons grid */}
			<div className='flex-1 overflow-y-auto p-2'>
				<div className='grid grid-cols-6 gap-1'>
					{filteredIcons.map(iconName => (
						<button
							key={iconName}
							type='button'
							onClick={() => {
								onChange(iconName)
								onClose()
							}}
							className={cn(
								'flex flex-col items-center gap-0.5 p-1.5 rounded-md transition-colors',
								value === iconName
									? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
									: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
							)}
							title={iconName.replace('Icon', '')}
						>
							<span className='text-[10px] font-mono truncate w-full text-center'>
								{iconName.replace('Icon', '').slice(0, 3)}
							</span>
						</button>
					))}
				</div>

				{filteredIcons.length === 0 && (
					<p className='text-xs text-gray-400 text-center py-6'>
						No icons match your search
					</p>
				)}
			</div>

			{/* Current selection */}
			<div className='p-2 border-t text-[10px] text-gray-400 text-center'>
				Selected:{' '}
				<span className='font-mono text-gray-600 dark:text-gray-300'>
					{value}
				</span>
			</div>
		</div>
	)
}

export { POPULAR_ICONS }
