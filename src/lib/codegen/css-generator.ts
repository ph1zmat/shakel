/**
 * CSS Generator — генерация CSS из Design System токенов.
 * Преобразует ColorToken, SpacingToken, TypographyToken, EffectToken
 * в CSS Custom Properties.
 */

export interface ColorTokenData {
	name: string
	hue: number
	saturation: number
	lightness: number
	alpha: number
	semanticRole?: string | null
}

export interface SpacingTokenData {
	name: string
	value: number
}

export interface TypographyTokenData {
	name: string
	family: string
	weights: number[]
	fallback: string
	minSize: number
	maxSize: number
	lineHeight: number
}

export interface EffectTokenData {
	name: string
	type: string
	params: Record<string, unknown>
}

export interface DesignTokens {
	colors: ColorTokenData[]
	spacing: SpacingTokenData[]
	typography: TypographyTokenData[]
	effects?: EffectTokenData[]
}

export function generateCSSVariables(tokens: DesignTokens): string {
	const lines: string[] = []

	lines.push(':root {')

	// Colors
	lines.push('  /* Colors */')
	for (const color of tokens.colors) {
		const hsl = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`
		const hsla = `hsla(${color.hue}, ${color.saturation}%, ${color.lightness}%, ${color.alpha})`
		lines.push(`  --color-${color.name}: ${color.alpha < 1 ? hsla : hsl};`)
		lines.push(`  --color-${color.name}-h: ${color.hue};`)
		lines.push(`  --color-${color.name}-s: ${color.saturation}%;`)
		lines.push(`  --color-${color.name}-l: ${color.lightness}%;`)
	}

	lines.push('')

	// Spacing
	lines.push('  /* Spacing */')
	for (const spacing of tokens.spacing) {
		lines.push(`  --spacing-${spacing.name}: ${spacing.value}rem;`)
	}

	lines.push('')

	// Typography
	lines.push('  /* Typography */')
	for (const typo of tokens.typography) {
		lines.push(`  --font-${typo.name}: '${typo.family}', ${typo.fallback};`)
		lines.push(`  --font-${typo.name}-min: ${typo.minSize}rem;`)
		lines.push(`  --font-${typo.name}-max: ${typo.maxSize}rem;`)
		lines.push(`  --font-${typo.name}-lh: ${typo.lineHeight};`)
		// Fluid typography using clamp
		lines.push(
			`  --font-${typo.name}-size: clamp(${typo.minSize}rem, ${typo.minSize}rem + 1vw, ${typo.maxSize}rem);`,
		)
	}

	// Effects
	if (tokens.effects && tokens.effects.length > 0) {
		lines.push('')
		lines.push('  /* Effects */')
		for (const effect of tokens.effects) {
			const value = generateEffectValue(effect)
			if (value) {
				lines.push(`  --effect-${effect.name}: ${value};`)
			}
		}
	}

	lines.push('}')

	return lines.join('\n')
}

function generateEffectValue(effect: EffectTokenData): string | null {
	const p = effect.params

	switch (effect.type) {
		case 'SHADOW':
			return `${p.x ?? 0}px ${p.y ?? 4}px ${p.blur ?? 12}px ${p.spread ?? 0}px ${p.color ?? 'rgba(0,0,0,0.1)'}`
		case 'BLUR':
			return `blur(${p.radius ?? 8}px)`
		case 'GLOW':
			return `0 0 ${p.radius ?? 12}px ${p.color ?? 'rgba(59,130,246,0.5)'}`
		case 'BORDER':
			return `${p.width ?? 1}px ${p.style ?? 'solid'} ${p.color ?? '#e5e7eb'}`
		default:
			return null
	}
}

/**
 * Generate a minimal globals.css based on design tokens
 */
export function generateGlobalCSS(tokens: DesignTokens): string {
	const variables = generateCSSVariables(tokens)

	return `${variables}

/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: var(--font-body);
  font-size: var(--font-body-size);
  line-height: var(--font-body-lh);
  color: var(--color-foreground, #111827);
  background-color: var(--color-background, #ffffff);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: var(--font-heading-lh);
}

code, pre {
  font-family: var(--font-mono);
}
`
}
