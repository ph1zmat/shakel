/**
 * Resolve StyleConfig + EffectConfig → React.CSSProperties for canvas preview.
 * Converts design tokens to real CSS values, merges responsive overrides
 * based on the current viewport.
 */

import type { StyleConfig, StyleValue, EffectConfig } from '@/types/builder'

// ========================================
// Design token → CSS value maps
// ========================================

const COLOR_TOKENS: Record<string, string> = {
	background: '#ffffff',
	foreground: '#0a0a0a',
	primary: '#2563eb',
	'primary-foreground': '#ffffff',
	secondary: '#f1f5f9',
	'secondary-foreground': '#0f172a',
	muted: '#f1f5f9',
	'muted-foreground': '#64748b',
	accent: '#f1f5f9',
	'accent-foreground': '#0f172a',
	destructive: '#ef4444',
	'destructive-foreground': '#ffffff',
	border: '#e2e8f0',
	ring: '#2563eb',
	card: '#ffffff',
	'card-foreground': '#0a0a0a',
	popover: '#ffffff',
	'popover-foreground': '#0a0a0a',
	input: '#e2e8f0',
}

const SPACING_TOKENS: Record<string, string> = {
	xs: '4px',
	sm: '8px',
	md: '16px',
	lg: '24px',
	xl: '32px',
	'2xl': '48px',
	'3xl': '64px',
}

// ========================================
// Viewport → breakpoint mapping
// ========================================

export type CanvasViewport = 'mobile' | 'tablet' | 'desktop'

/**
 * Given a viewport, return which responsive breakpoint keys should be active.
 * mobile  → only base
 * tablet  → base + sm + md
 * desktop → base + sm + md + lg + xl + 2xl
 */
function getActiveBreakpoints(
	viewport: CanvasViewport,
): ('sm' | 'md' | 'lg' | 'xl' | '2xl')[] {
	switch (viewport) {
		case 'mobile':
			return []
		case 'tablet':
			return ['sm', 'md']
		case 'desktop':
			return ['sm', 'md', 'lg', 'xl', '2xl']
	}
}

// ========================================
// Resolve a single StyleValue → CSS string value
// ========================================

function resolveValue(sv: StyleValue): string {
	if (sv.type === 'token') {
		switch (sv.tokenType) {
			case 'color':
				return COLOR_TOKENS[String(sv.value)] ?? String(sv.value)
			case 'spacing':
				return SPACING_TOKENS[String(sv.value)] ?? `${sv.value}px`
			case 'typography':
				return String(sv.value)
			default:
				return String(sv.value)
		}
	}

	// Static value
	const val = String(sv.value)
	if (sv.unit) return `${val}${sv.unit}`

	// If it looks like a plain number that needs a unit for certain properties
	return val
}

// ========================================
// Map style property name → CSS property name
// ========================================

const CSS_PROP_MAP: Record<string, string> = {
	backgroundColor: 'backgroundColor',
	color: 'color',
	fontSize: 'fontSize',
	fontWeight: 'fontWeight',
	fontFamily: 'fontFamily',
	lineHeight: 'lineHeight',
	letterSpacing: 'letterSpacing',
	textAlign: 'textAlign',
	padding: 'padding',
	paddingTop: 'paddingTop',
	paddingRight: 'paddingRight',
	paddingBottom: 'paddingBottom',
	paddingLeft: 'paddingLeft',
	margin: 'margin',
	marginTop: 'marginTop',
	marginRight: 'marginRight',
	marginBottom: 'marginBottom',
	marginLeft: 'marginLeft',
	gap: 'gap',
	borderRadius: 'borderRadius',
	borderTopLeftRadius: 'borderTopLeftRadius',
	borderTopRightRadius: 'borderTopRightRadius',
	borderBottomLeftRadius: 'borderBottomLeftRadius',
	borderBottomRightRadius: 'borderBottomRightRadius',
	borderWidth: 'borderWidth',
	borderColor: 'borderColor',
	borderStyle: 'borderStyle',
	boxShadow: 'boxShadow',
	width: 'width',
	height: 'height',
	minWidth: 'minWidth',
	minHeight: 'minHeight',
	maxWidth: 'maxWidth',
	maxHeight: 'maxHeight',
	overflow: 'overflow',
	display: 'display',
	opacity: 'opacity',
	flexDirection: 'flexDirection',
	alignItems: 'alignItems',
	justifyContent: 'justifyContent',
	flexWrap: 'flexWrap',
	gridTemplateColumns: 'gridTemplateColumns',
}

// ========================================
// Resolve a style record → CSSProperties
// ========================================

function resolveRecord(
	record: Record<string, StyleValue>,
): React.CSSProperties {
	const css: Record<string, string | number> = {}
	for (const [prop, sv] of Object.entries(record)) {
		const cssProp = CSS_PROP_MAP[prop]
		if (!cssProp) continue
		css[cssProp] = resolveValue(sv)
	}
	return css as React.CSSProperties
}

// ========================================
// Main: resolve full StyleConfig → CSSProperties
// ========================================

export function resolveStyleConfig(
	config: StyleConfig | undefined,
	viewport: CanvasViewport = 'desktop',
): React.CSSProperties {
	if (!config) return {}

	// Start with base styles
	const css: Record<string, string | number> = {
		...resolveRecord(config.base ?? {}),
	}

	// Layer responsive overrides based on viewport
	if (config.responsive) {
		const activeBPs = getActiveBreakpoints(viewport)
		for (const bp of activeBPs) {
			const bpStyles = config.responsive[bp]
			if (bpStyles) {
				Object.assign(css, resolveRecord(bpStyles))
			}
		}
	}

	return css as React.CSSProperties
}

/**
 * Resolve hover styles — returns separate CSSProperties for hover state.
 */
export function resolveHoverStyles(
	config: StyleConfig | undefined,
): React.CSSProperties {
	if (!config?.hover) return {}
	return resolveRecord(config.hover)
}

// ========================================
// Resolve effects → CSS
// ========================================

export function resolveEffects(
	effects: EffectConfig[] | undefined,
): React.CSSProperties {
	if (!effects || effects.length === 0) return {}

	const css: React.CSSProperties = {}
	const shadows: string[] = []
	let filterParts: string[] = []
	let backdropParts: string[] = []

	for (const effect of effects) {
		if (!effect.visible) continue

		switch (effect.type) {
			case 'dropShadow': {
				const ox = effect.offsetX ?? 0
				const oy = effect.offsetY ?? 4
				const blur = effect.blur ?? 8
				const spread = effect.spread ?? 0
				const color = effect.color ?? 'rgba(0,0,0,0.15)'
				shadows.push(`${ox}px ${oy}px ${blur}px ${spread}px ${color}`)
				break
			}
			case 'innerShadow': {
				const ox = effect.offsetX ?? 0
				const oy = effect.offsetY ?? 2
				const blur = effect.blur ?? 4
				const spread = effect.spread ?? 0
				const color = effect.color ?? 'rgba(0,0,0,0.1)'
				shadows.push(
					`inset ${ox}px ${oy}px ${blur}px ${spread}px ${color}`,
				)
				break
			}
			case 'layerBlur': {
				const amount = effect.blurAmount ?? effect.blur ?? 4
				filterParts.push(`blur(${amount}px)`)
				break
			}
			case 'backgroundBlur': {
				const amount = effect.blurAmount ?? effect.blur ?? 8
				backdropParts.push(`blur(${amount}px)`)
				break
			}
		}
	}

	if (shadows.length > 0) css.boxShadow = shadows.join(', ')
	if (filterParts.length > 0) css.filter = filterParts.join(' ')
	if (backdropParts.length > 0) css.backdropFilter = backdropParts.join(' ')

	return css
}

/**
 * Merge all style sources into a single CSSProperties for canvas preview.
 */
export function resolveAllStyles(
	styles: StyleConfig | undefined,
	effects: EffectConfig[] | undefined,
	viewport: CanvasViewport = 'desktop',
): React.CSSProperties {
	return {
		...resolveStyleConfig(styles, viewport),
		...resolveEffects(effects),
	}
}
