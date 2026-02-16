/**
 * Конвертация StyleConfig → Tailwind CSS классы
 * Поддержка responsive breakpoints (sm/md/lg)
 */

import type { StyleConfig, StyleValue } from '@/types/builder'

// ========================================
// Token maps → Tailwind classes
// ========================================

const spacingTokenMap: Record<string, string> = {
	xs: '1',
	sm: '2',
	md: '4',
	lg: '6',
	xl: '8',
	'2xl': '12',
	'3xl': '16',
}

const colorTokenMap: Record<string, string> = {
	background: 'white',
	foreground: 'gray-900',
	primary: 'blue-600',
	'primary-foreground': 'white',
	muted: 'gray-100',
	'muted-foreground': 'gray-500',
	danger: 'red-500',
	success: 'green-500',
	warning: 'amber-500',
}

const fontSizeMap: Record<string, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
	'2xl': 'text-2xl',
	'3xl': 'text-3xl',
	'4xl': 'text-4xl',
}

const fontWeightMap: Record<string, string> = {
	'100': 'font-thin',
	'200': 'font-extralight',
	'300': 'font-light',
	'400': 'font-normal',
	'500': 'font-medium',
	'600': 'font-semibold',
	'700': 'font-bold',
	'800': 'font-extrabold',
	'900': 'font-black',
	thin: 'font-thin',
	light: 'font-light',
	normal: 'font-normal',
	medium: 'font-medium',
	semibold: 'font-semibold',
	bold: 'font-bold',
}

const textAlignMap: Record<string, string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
	justify: 'text-justify',
}

// ========================================
// Single value → Tailwind class
// ========================================

function resolveStyleValue(property: string, value: StyleValue): string | null {
	const v = String(value.value)

	if (value.type === 'token') {
		switch (value.tokenType) {
			case 'spacing': {
				const tw = spacingTokenMap[v]
				if (!tw) return null
				// Map CSS prop → Tailwind prefix
				if (property === 'padding') return `p-${tw}`
				if (property === 'paddingX') return `px-${tw}`
				if (property === 'paddingY') return `py-${tw}`
				if (property === 'margin') return `m-${tw}`
				if (property === 'marginX') return `mx-${tw}`
				if (property === 'marginY') return `my-${tw}`
				if (property === 'gap') return `gap-${tw}`
				if (property === 'borderRadius')
					return `rounded-${v === '1' ? 'sm' : v === '2' ? 'md' : v === '4' ? 'lg' : v}`
				return null
			}
			case 'color': {
				const tw = colorTokenMap[v]
				if (!tw) return null
				if (property === 'backgroundColor') return `bg-${tw}`
				if (property === 'color') return `text-${tw}`
				if (property === 'borderColor') return `border-${tw}`
				return null
			}
			case 'typography': {
				if (property === 'fontSize') return fontSizeMap[v] ?? null
				if (property === 'fontWeight') return fontWeightMap[v] ?? null
				return null
			}
			default:
				return null
		}
	}

	// Static values
	if (property === 'textAlign') return textAlignMap[v] ?? null
	if (property === 'fontSize')
		return fontSizeMap[v] ?? `text-[${v}${value.unit || 'px'}]`
	if (property === 'fontWeight') return fontWeightMap[v] ?? null
	if (property === 'backgroundColor') return `bg-[${v}]`
	if (property === 'color') return `text-[${v}]`
	if (property === 'padding') return `p-[${v}${value.unit || 'px'}]`
	if (property === 'margin') return `m-[${v}${value.unit || 'px'}]`
	if (property === 'gap') return `gap-[${v}${value.unit || 'px'}]`
	if (property === 'borderRadius') return `rounded-[${v}${value.unit || 'px'}]`
	if (property === 'width') return `w-[${v}${value.unit || 'px'}]`
	if (property === 'height') return `h-[${v}${value.unit || 'px'}]`
	if (property === 'maxWidth') return `max-w-[${v}${value.unit || 'px'}]`
	if (property === 'minHeight') return `min-h-[${v}${value.unit || 'px'}]`

	return null
}

// ========================================
// StyleConfig → class list
// ========================================

function stateToClasses(
	styles: Record<string, StyleValue>,
	prefix?: string,
): string[] {
	const classes: string[] = []
	for (const [prop, val] of Object.entries(styles)) {
		const cls = resolveStyleValue(prop, val)
		if (cls) {
			classes.push(prefix ? `${prefix}:${cls}` : cls)
		}
	}
	return classes
}

export function stylesToTailwind(config: StyleConfig): string {
	const classes: string[] = []

	// Base state
	if (config.base) {
		classes.push(...stateToClasses(config.base))
	}

	// Hover
	if (config.hover) {
		classes.push(...stateToClasses(config.hover, 'hover'))
	}

	// Focus
	if (config.focus) {
		classes.push(...stateToClasses(config.focus, 'focus'))
	}

	// Responsive
	if (config.responsive) {
		for (const [bp, styles] of Object.entries(config.responsive)) {
			if (styles) {
				classes.push(...stateToClasses(styles, bp))
			}
		}
	}

	return classes.join(' ')
}

// ========================================
// Props → Tailwind helpers
// ========================================

const gapMap: Record<string, string> = {
	none: 'gap-0',
	sm: 'gap-2',
	md: 'gap-4',
	lg: 'gap-6',
	xl: 'gap-8',
}

const alignMap: Record<string, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
}

const justifyMap: Record<string, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
}

export function containerPropsToClasses(
	props: Record<string, unknown>,
): string {
	const classes = ['flex']

	classes.push(props.direction === 'row' ? 'flex-row' : 'flex-col')
	classes.push(gapMap[props.gap as string] ?? 'gap-4')
	classes.push(alignMap[props.align as string] ?? 'items-stretch')
	classes.push(justifyMap[props.justify as string] ?? 'justify-start')

	return classes.join(' ')
}

export function gridPropsToClasses(props: Record<string, unknown>): string {
	const cols = Number(props.columns) || 2
	const classes = ['grid', `grid-cols-${cols}`]

	classes.push(gapMap[props.gap as string] ?? 'gap-4')

	return classes.join(' ')
}

export function buttonVariantClasses(props: Record<string, unknown>): string {
	const variant = (props.variant as string) || 'solid'
	const size = (props.size as string) || 'md'

	const variantStyles: Record<string, string> = {
		solid: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
		outline:
			'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50',
		ghost: 'text-blue-600 bg-transparent hover:bg-blue-50',
		soft: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
	}

	const sizeStyles: Record<string, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
	}

	return [
		'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer',
		variantStyles[variant] ?? variantStyles.solid,
		sizeStyles[size] ?? sizeStyles.md,
		props.disabled ? 'opacity-50 pointer-events-none' : '',
	]
		.filter(Boolean)
		.join(' ')
}

export function textElementClasses(props: Record<string, unknown>): string {
	const as = (props.as as string) || 'p'

	const headingStyles: Record<string, string> = {
		h1: 'text-4xl font-bold tracking-tight',
		h2: 'text-3xl font-semibold tracking-tight',
		h3: 'text-2xl font-semibold',
		h4: 'text-xl font-semibold',
		h5: 'text-lg font-medium',
		h6: 'text-base font-medium',
		p: 'text-base leading-relaxed',
		span: 'text-base',
		div: 'text-base',
	}

	return headingStyles[as] ?? 'text-base'
}

export function imageClasses(props: Record<string, unknown>): string {
	const aspectRatio = (props.aspectRatio as string) || 'auto'
	const objectFit = (props.objectFit as string) || 'cover'

	const aspectStyles: Record<string, string> = {
		auto: '',
		'1:1': 'aspect-square',
		'4:3': 'aspect-[4/3]',
		'16:9': 'aspect-video',
	}

	const fitStyles: Record<string, string> = {
		cover: 'object-cover',
		contain: 'object-contain',
		fill: 'object-fill',
	}

	return [
		'w-full rounded-md',
		aspectStyles[aspectRatio] ?? '',
		fitStyles[objectFit] ?? 'object-cover',
	]
		.filter(Boolean)
		.join(' ')
}

// ========================================
// Smart class optimization
// ========================================

/** Remove redundant / conflicting Tailwind classes */
export function optimizeClasses(input: string): string {
	const parts = input.split(/\s+/).filter(Boolean)
	if (parts.length <= 1) return input

	// Track property families — last one wins
	const families = new Map<string, string>()

	for (const cls of parts) {
		const family = getClassFamily(cls)
		if (family) {
			families.set(family, cls)
		} else {
			families.set(`__raw_${cls}`, cls)
		}
	}

	return Array.from(families.values()).join(' ')
}

/** Map a Tailwind class to its "property family" so we can dedupe */
function getClassFamily(cls: string): string | null {
	// Handle responsive / state prefixes
	let prefix = ''
	let base = cls
	const colonIdx = cls.lastIndexOf(':')
	if (colonIdx > 0) {
		prefix = cls.slice(0, colonIdx + 1)
		base = cls.slice(colonIdx + 1)
	}

	const familyPatterns: [RegExp, string][] = [
		// Spacing
		[/^p-/, `${prefix}padding`],
		[/^px-/, `${prefix}padding-x`],
		[/^py-/, `${prefix}padding-y`],
		[/^pt-/, `${prefix}padding-top`],
		[/^pb-/, `${prefix}padding-bottom`],
		[/^pl-/, `${prefix}padding-left`],
		[/^pr-/, `${prefix}padding-right`],
		[/^m-/, `${prefix}margin`],
		[/^mx-/, `${prefix}margin-x`],
		[/^my-/, `${prefix}margin-y`],
		[/^gap-/, `${prefix}gap`],
		// Sizing
		[/^w-/, `${prefix}width`],
		[/^h-/, `${prefix}height`],
		[/^min-w-/, `${prefix}min-width`],
		[/^min-h-/, `${prefix}min-height`],
		[/^max-w-/, `${prefix}max-width`],
		[/^max-h-/, `${prefix}max-height`],
		// Typography
		[/^text-(xs|sm|base|lg|xl|[2-9]xl|\[)/, `${prefix}font-size`],
		[
			/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/,
			`${prefix}font-weight`,
		],
		[/^text-(left|center|right|justify)/, `${prefix}text-align`],
		[/^leading-/, `${prefix}line-height`],
		[/^tracking-/, `${prefix}letter-spacing`],
		// Colors
		[/^bg-/, `${prefix}bg-color`],
		[
			/^text-(gray|blue|red|green|yellow|amber|white|black|teal|sky|purple|orange|pink|indigo|inherit|current|transparent)/,
			`${prefix}text-color`,
		],
		[
			/^border-(gray|blue|red|green|yellow|amber|white|black)/,
			`${prefix}border-color`,
		],
		// Borders
		[/^rounded/, `${prefix}border-radius`],
		[/^border-[0-9]/, `${prefix}border-width`],
		// Layout
		[/^flex$/, `${prefix}display`],
		[/^grid$/, `${prefix}display`],
		[/^block$/, `${prefix}display`],
		[/^inline/, `${prefix}display`],
		[/^flex-(row|col)/, `${prefix}flex-direction`],
		[/^items-/, `${prefix}align-items`],
		[/^justify-/, `${prefix}justify-content`],
		[/^grid-cols-/, `${prefix}grid-cols`],
		// Effects
		[/^opacity-/, `${prefix}opacity`],
		[/^shadow/, `${prefix}shadow`],
	]

	for (const [pattern, family] of familyPatterns) {
		if (pattern.test(base)) return family
	}

	return null
}
