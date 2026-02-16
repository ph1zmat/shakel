/**
 * Shared types for the visual builder system.
 * Used by both component-registry and canvas-store to avoid duplication.
 */

export interface StyleConfig {
	base: Record<string, StyleValue>
	hover?: Record<string, StyleValue>
	focus?: Record<string, StyleValue>
	responsive?: {
		sm?: Record<string, StyleValue>
		md?: Record<string, StyleValue>
		lg?: Record<string, StyleValue>
		xl?: Record<string, StyleValue>
		'2xl'?: Record<string, StyleValue>
	}
}

export interface StyleValue {
	type: 'token' | 'static'
	tokenType?: 'color' | 'spacing' | 'typography' | 'effect'
	value: string | number
	unit?: string
}

// ========================================
// Constraints (Figma-like)
// ========================================

export type ConstraintAxisH = 'left' | 'right' | 'center' | 'stretch' | 'scale'
export type ConstraintAxisV = 'top' | 'bottom' | 'center' | 'stretch' | 'scale'

export interface Constraints {
	horizontal: ConstraintAxisH
	vertical: ConstraintAxisV
}

// ========================================
// Transform
// ========================================

export interface TransformConfig {
	rotation: number // degrees
	scaleX: number
	scaleY: number
}

// ========================================
// Effects (shadows, blurs)
// ========================================

export type EffectType =
	| 'dropShadow'
	| 'innerShadow'
	| 'layerBlur'
	| 'backgroundBlur'

export interface EffectConfig {
	id: string
	type: EffectType
	visible: boolean
	// Shadow props
	offsetX?: number
	offsetY?: number
	blur?: number
	spread?: number
	color?: string // rgba string
	// Blur props
	blurAmount?: number
}

// ========================================
// Animations (Motion library)
// ========================================

export type AnimationTrigger = 'onMount' | 'onHover' | 'onClick' | 'onScroll'
export type AnimationPreset =
	| 'fadeIn'
	| 'fadeOut'
	| 'slideUp'
	| 'slideDown'
	| 'slideLeft'
	| 'slideRight'
	| 'scaleIn'
	| 'scaleOut'
	| 'bounceIn'
	| 'rotateIn'
	| 'flipX'
	| 'flipY'
	| 'pulse'
	| 'shake'
	| 'custom'

export interface AnimationConfig {
	id: string
	trigger: AnimationTrigger
	preset: AnimationPreset
	duration: number // seconds
	delay: number // seconds
	ease: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring'
	repeat: number // 0 = once, -1 = infinite
	/** Custom from/to keyframes (only used when preset = 'custom') */
	customFrom?: Record<string, number | string>
	customTo?: Record<string, number | string>
}
