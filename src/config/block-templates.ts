// Block Templates — pre-built component combinations
// Each template defines a tree of nodes with positions, sizes, and default props

import type { StyleConfig, EffectConfig, Constraints } from '@/types/builder'

export interface TemplateNode {
	/** Temporary local id used for parent references within the template */
	localId: string
	type: string
	parentLocalId: string | null
	/** Offset relative to template origin */
	offset: { x: number; y: number }
	size: { width: number; height: number }
	props: Record<string, unknown>
	styles: StyleConfig
	rotation: number
	zIndex: number
	opacity: number
	constraints: Constraints
	effects: EffectConfig[]
}

export interface BlockTemplate {
	id: string
	name: string
	description: string
	category:
		| 'hero'
		| 'card'
		| 'form'
		| 'navigation'
		| 'content'
		| 'footer'
		| 'cta'
	icon: string
	/** Preview thumbnail color (gradient stops) */
	previewColors: [string, string]
	nodes: TemplateNode[]
}

export const templateCategories = [
	{ id: 'all', label: 'All' },
	{ id: 'hero', label: 'Hero' },
	{ id: 'card', label: 'Cards' },
	{ id: 'form', label: 'Forms' },
	{ id: 'navigation', label: 'Nav' },
	{ id: 'content', label: 'Content' },
	{ id: 'cta', label: 'CTA' },
	{ id: 'footer', label: 'Footer' },
] as const

// ========================================
// Helper to create template nodes easier
// ========================================

function node(
	localId: string,
	type: string,
	parentLocalId: string | null,
	offset: { x: number; y: number },
	size: { width: number; height: number },
	props: Record<string, unknown> = {},
	styles: StyleConfig = { base: {} },
): TemplateNode {
	return {
		localId,
		type,
		parentLocalId,
		offset,
		size,
		props,
		styles,
		rotation: 0,
		zIndex: 0,
		opacity: 1,
		constraints: { horizontal: 'left', vertical: 'top' },
		effects: [],
	}
}

// ========================================
// Template Definitions
// ========================================

export const blockTemplates: BlockTemplate[] = [
	// ----- Hero Sections -----
	{
		id: 'hero-centered',
		name: 'Centered Hero',
		description:
			'Full-width hero with centered heading, subtext, and CTA button',
		category: 'hero',
		icon: '🏠',
		previewColors: ['#6366f1', '#8b5cf6'],
		nodes: [
			node(
				'bg',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 800, height: 400 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#f8fafc' },
						borderRadius: { type: 'static', value: '12px' },
					},
				},
			),
			node(
				'title',
				'text',
				null,
				{ x: 160, y: 80 },
				{ width: 480, height: 60 },
				{
					content: 'Build something amazing',
					tag: 'h1',
				},
				{
					base: {
						fontSize: { type: 'static', value: '42px' },
						fontWeight: { type: 'static', value: '700' },
						textAlign: { type: 'static', value: 'center' },
						color: { type: 'static', value: '#1e293b' },
					},
				},
			),
			node(
				'subtitle',
				'text',
				null,
				{ x: 160, y: 160 },
				{ width: 480, height: 40 },
				{
					content: 'Create beautiful websites with our drag-and-drop builder',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '18px' },
						textAlign: { type: 'static', value: 'center' },
						color: { type: 'static', value: '#64748b' },
					},
				},
			),
			node(
				'cta',
				'button',
				null,
				{ x: 310, y: 240 },
				{ width: 180, height: 48 },
				{
					label: 'Get Started',
					variant: 'default',
				},
				{
					base: {
						backgroundColor: { type: 'static', value: '#6366f1' },
						color: { type: 'static', value: '#ffffff' },
						borderRadius: { type: 'static', value: '8px' },
						fontSize: { type: 'static', value: '16px' },
						fontWeight: { type: 'static', value: '600' },
					},
				},
			),
		],
	},
	{
		id: 'hero-split',
		name: 'Split Hero',
		description: 'Hero with text on left and image placeholder on right',
		category: 'hero',
		icon: '📐',
		previewColors: ['#0ea5e9', '#06b6d4'],
		nodes: [
			node(
				'title',
				'text',
				null,
				{ x: 0, y: 40 },
				{ width: 360, height: 56 },
				{
					content: 'Your headline goes here',
					tag: 'h1',
				},
				{
					base: {
						fontSize: { type: 'static', value: '36px' },
						fontWeight: { type: 'static', value: '700' },
						color: { type: 'static', value: '#0f172a' },
					},
				},
			),
			node(
				'subtitle',
				'text',
				null,
				{ x: 0, y: 110 },
				{ width: 360, height: 60 },
				{
					content:
						'A descriptive paragraph that explains your product or service in detail.',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '16px' },
						color: { type: 'static', value: '#64748b' },
						lineHeight: { type: 'static', value: '1.6' },
					},
				},
			),
			node(
				'cta',
				'button',
				null,
				{ x: 0, y: 200 },
				{ width: 160, height: 44 },
				{
					label: 'Learn More',
				},
			),
			node(
				'img',
				'image',
				null,
				{ x: 400, y: 0 },
				{ width: 360, height: 280 },
				{
					src: '',
					alt: 'Hero image',
				},
				{
					base: {
						backgroundColor: { type: 'static', value: '#e2e8f0' },
						borderRadius: { type: 'static', value: '12px' },
					},
				},
			),
		],
	},

	// ----- Cards -----
	{
		id: 'card-basic',
		name: 'Basic Card',
		description: 'Simple card with title, description, and action button',
		category: 'card',
		icon: '🃏',
		previewColors: ['#f59e0b', '#f97316'],
		nodes: [
			node(
				'card-bg',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 320, height: 280 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#ffffff' },
						borderRadius: { type: 'static', value: '12px' },
						border: { type: 'static', value: '1px solid #e2e8f0' },
					},
				},
			),
			node(
				'card-img',
				'container',
				null,
				{ x: 12, y: 12 },
				{ width: 296, height: 120 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#f1f5f9' },
						borderRadius: { type: 'static', value: '8px' },
					},
				},
			),
			node(
				'card-title',
				'text',
				null,
				{ x: 20, y: 148 },
				{ width: 280, height: 28 },
				{
					content: 'Card Title',
					tag: 'h3',
				},
				{
					base: {
						fontSize: { type: 'static', value: '18px' },
						fontWeight: { type: 'static', value: '600' },
						color: { type: 'static', value: '#1e293b' },
					},
				},
			),
			node(
				'card-desc',
				'text',
				null,
				{ x: 20, y: 180 },
				{ width: 280, height: 40 },
				{
					content: 'A brief description of the card content goes here.',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#64748b' },
					},
				},
			),
			node(
				'card-btn',
				'button',
				null,
				{ x: 20, y: 230 },
				{ width: 120, height: 36 },
				{
					label: 'View More',
				},
				{
					base: {
						fontSize: { type: 'static', value: '13px' },
					},
				},
			),
		],
	},
	{
		id: 'card-pricing',
		name: 'Pricing Card',
		description: 'Pricing card with price, feature list, and subscribe button',
		category: 'card',
		icon: '💲',
		previewColors: ['#10b981', '#059669'],
		nodes: [
			node(
				'bg',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 300, height: 360 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#ffffff' },
						borderRadius: { type: 'static', value: '16px' },
						border: { type: 'static', value: '1px solid #e2e8f0' },
					},
				},
			),
			node(
				'plan',
				'text',
				null,
				{ x: 24, y: 24 },
				{ width: 252, height: 24 },
				{
					content: 'Pro Plan',
					tag: 'h3',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						fontWeight: { type: 'static', value: '600' },
						color: { type: 'static', value: '#10b981' },
						textTransform: { type: 'static', value: 'uppercase' },
						letterSpacing: { type: 'static', value: '0.05em' },
					},
				},
			),
			node(
				'price',
				'text',
				null,
				{ x: 24, y: 56 },
				{ width: 252, height: 48 },
				{
					content: '$29/mo',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '36px' },
						fontWeight: { type: 'static', value: '700' },
						color: { type: 'static', value: '#0f172a' },
					},
				},
			),
			node(
				'f1',
				'text',
				null,
				{ x: 24, y: 120 },
				{ width: 252, height: 28 },
				{
					content: '✓  Unlimited projects',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#475569' },
					},
				},
			),
			node(
				'f2',
				'text',
				null,
				{ x: 24, y: 152 },
				{ width: 252, height: 28 },
				{
					content: '✓  Priority support',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#475569' },
					},
				},
			),
			node(
				'f3',
				'text',
				null,
				{ x: 24, y: 184 },
				{ width: 252, height: 28 },
				{
					content: '✓  Custom domains',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#475569' },
					},
				},
			),
			node(
				'f4',
				'text',
				null,
				{ x: 24, y: 216 },
				{ width: 252, height: 28 },
				{
					content: '✓  Analytics dashboard',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#475569' },
					},
				},
			),
			node(
				'btn',
				'button',
				null,
				{ x: 24, y: 268 },
				{ width: 252, height: 48 },
				{
					label: 'Subscribe Now',
				},
				{
					base: {
						backgroundColor: { type: 'static', value: '#10b981' },
						color: { type: 'static', value: '#ffffff' },
						borderRadius: { type: 'static', value: '10px' },
						fontWeight: { type: 'static', value: '600' },
					},
				},
			),
		],
	},

	// ----- Forms -----
	{
		id: 'form-contact',
		name: 'Contact Form',
		description: 'Simple contact form with name, email, message fields',
		category: 'form',
		icon: '📧',
		previewColors: ['#8b5cf6', '#a855f7'],
		nodes: [
			node(
				'title',
				'text',
				null,
				{ x: 0, y: 0 },
				{ width: 400, height: 36 },
				{
					content: 'Contact Us',
					tag: 'h2',
				},
				{
					base: {
						fontSize: { type: 'static', value: '28px' },
						fontWeight: { type: 'static', value: '700' },
						color: { type: 'static', value: '#1e293b' },
					},
				},
			),
			node(
				'name-input',
				'input',
				null,
				{ x: 0, y: 56 },
				{ width: 400, height: 44 },
				{
					placeholder: 'Your name',
					type: 'text',
				},
			),
			node(
				'email-input',
				'input',
				null,
				{ x: 0, y: 116 },
				{ width: 400, height: 44 },
				{
					placeholder: 'your@email.com',
					type: 'email',
				},
			),
			node(
				'message-input',
				'input',
				null,
				{ x: 0, y: 176 },
				{ width: 400, height: 100 },
				{
					placeholder: 'Your message...',
					type: 'text',
				},
			),
			node(
				'submit-btn',
				'button',
				null,
				{ x: 0, y: 296 },
				{ width: 400, height: 48 },
				{
					label: 'Send Message',
				},
				{
					base: {
						backgroundColor: { type: 'static', value: '#8b5cf6' },
						color: { type: 'static', value: '#ffffff' },
						borderRadius: { type: 'static', value: '8px' },
						fontWeight: { type: 'static', value: '600' },
					},
				},
			),
		],
	},
	{
		id: 'form-login',
		name: 'Login Form',
		description: 'Login form with email, password, and sign-in button',
		category: 'form',
		icon: '🔐',
		previewColors: ['#3b82f6', '#6366f1'],
		nodes: [
			node(
				'card',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 360, height: 340 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#ffffff' },
						borderRadius: { type: 'static', value: '16px' },
						border: { type: 'static', value: '1px solid #e2e8f0' },
					},
				},
			),
			node(
				'title',
				'text',
				null,
				{ x: 32, y: 32 },
				{ width: 296, height: 36 },
				{
					content: 'Sign In',
					tag: 'h2',
				},
				{
					base: {
						fontSize: { type: 'static', value: '24px' },
						fontWeight: { type: 'static', value: '700' },
						color: { type: 'static', value: '#0f172a' },
					},
				},
			),
			node(
				'subtitle',
				'text',
				null,
				{ x: 32, y: 72 },
				{ width: 296, height: 24 },
				{
					content: 'Enter your credentials to continue',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#94a3b8' },
					},
				},
			),
			node(
				'email',
				'input',
				null,
				{ x: 32, y: 116 },
				{ width: 296, height: 44 },
				{
					placeholder: 'Email address',
					type: 'email',
				},
			),
			node(
				'pass',
				'input',
				null,
				{ x: 32, y: 176 },
				{ width: 296, height: 44 },
				{
					placeholder: 'Password',
					type: 'password',
				},
			),
			node(
				'btn',
				'button',
				null,
				{ x: 32, y: 244 },
				{ width: 296, height: 44 },
				{
					label: 'Sign In',
				},
				{
					base: {
						backgroundColor: { type: 'static', value: '#3b82f6' },
						color: { type: 'static', value: '#ffffff' },
						borderRadius: { type: 'static', value: '8px' },
						fontWeight: { type: 'static', value: '600' },
					},
				},
			),
		],
	},

	// ----- Navigation -----
	{
		id: 'nav-simple',
		name: 'Simple Nav',
		description: 'Navigation bar with logo text and menu links',
		category: 'navigation',
		icon: '🧭',
		previewColors: ['#1e293b', '#334155'],
		nodes: [
			node(
				'bar',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 800, height: 56 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#ffffff' },
						borderBottom: { type: 'static', value: '1px solid #e2e8f0' },
					},
				},
			),
			node(
				'logo',
				'text',
				null,
				{ x: 20, y: 14 },
				{ width: 120, height: 28 },
				{
					content: 'YourLogo',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '20px' },
						fontWeight: { type: 'static', value: '700' },
						color: { type: 'static', value: '#0f172a' },
					},
				},
			),
			node(
				'link1',
				'text',
				null,
				{ x: 440, y: 18 },
				{ width: 80, height: 20 },
				{
					content: 'Features',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#475569' },
					},
				},
			),
			node(
				'link2',
				'text',
				null,
				{ x: 540, y: 18 },
				{ width: 80, height: 20 },
				{
					content: 'Pricing',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#475569' },
					},
				},
			),
			node(
				'link3',
				'text',
				null,
				{ x: 640, y: 18 },
				{ width: 80, height: 20 },
				{
					content: 'About',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#475569' },
					},
				},
			),
			node(
				'cta',
				'button',
				null,
				{ x: 700, y: 10 },
				{ width: 90, height: 36 },
				{
					label: 'Sign Up',
				},
				{
					base: {
						fontSize: { type: 'static', value: '13px' },
						borderRadius: { type: 'static', value: '6px' },
					},
				},
			),
		],
	},

	// ----- Content -----
	{
		id: 'content-features',
		name: 'Feature Grid',
		description: 'Three feature cards with icons and descriptions',
		category: 'content',
		icon: '📊',
		previewColors: ['#ec4899', '#f43f5e'],
		nodes: [
			node(
				'f1-bg',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 240, height: 200 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#fef2f2' },
						borderRadius: { type: 'static', value: '12px' },
					},
				},
			),
			node(
				'f1-title',
				'text',
				null,
				{ x: 20, y: 24 },
				{ width: 200, height: 28 },
				{
					content: '⚡ Fast',
					tag: 'h3',
				},
				{
					base: {
						fontSize: { type: 'static', value: '18px' },
						fontWeight: { type: 'static', value: '600' },
						color: { type: 'static', value: '#1e293b' },
					},
				},
			),
			node(
				'f1-desc',
				'text',
				null,
				{ x: 20, y: 60 },
				{ width: 200, height: 80 },
				{
					content: 'Lightning-fast performance optimized for the modern web.',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#64748b' },
						lineHeight: { type: 'static', value: '1.5' },
					},
				},
			),
			node(
				'f2-bg',
				'container',
				null,
				{ x: 266, y: 0 },
				{ width: 240, height: 200 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#eff6ff' },
						borderRadius: { type: 'static', value: '12px' },
					},
				},
			),
			node(
				'f2-title',
				'text',
				null,
				{ x: 286, y: 24 },
				{ width: 200, height: 28 },
				{
					content: '🔒 Secure',
					tag: 'h3',
				},
				{
					base: {
						fontSize: { type: 'static', value: '18px' },
						fontWeight: { type: 'static', value: '600' },
						color: { type: 'static', value: '#1e293b' },
					},
				},
			),
			node(
				'f2-desc',
				'text',
				null,
				{ x: 286, y: 60 },
				{ width: 200, height: 80 },
				{
					content: 'Enterprise-grade security to protect your data.',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#64748b' },
						lineHeight: { type: 'static', value: '1.5' },
					},
				},
			),
			node(
				'f3-bg',
				'container',
				null,
				{ x: 532, y: 0 },
				{ width: 240, height: 200 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#f0fdf4' },
						borderRadius: { type: 'static', value: '12px' },
					},
				},
			),
			node(
				'f3-title',
				'text',
				null,
				{ x: 552, y: 24 },
				{ width: 200, height: 28 },
				{
					content: '🎨 Beautiful',
					tag: 'h3',
				},
				{
					base: {
						fontSize: { type: 'static', value: '18px' },
						fontWeight: { type: 'static', value: '600' },
						color: { type: 'static', value: '#1e293b' },
					},
				},
			),
			node(
				'f3-desc',
				'text',
				null,
				{ x: 552, y: 60 },
				{ width: 200, height: 80 },
				{
					content: 'Pixel-perfect designs that look great on every device.',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '14px' },
						color: { type: 'static', value: '#64748b' },
						lineHeight: { type: 'static', value: '1.5' },
					},
				},
			),
		],
	},

	// ----- CTA -----
	{
		id: 'cta-banner',
		name: 'CTA Banner',
		description: 'Full-width call-to-action banner with text and button',
		category: 'cta',
		icon: '📢',
		previewColors: ['#f59e0b', '#ef4444'],
		nodes: [
			node(
				'bg',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 800, height: 160 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#1e293b' },
						borderRadius: { type: 'static', value: '16px' },
					},
				},
			),
			node(
				'title',
				'text',
				null,
				{ x: 60, y: 32 },
				{ width: 480, height: 36 },
				{
					content: 'Ready to get started?',
					tag: 'h2',
				},
				{
					base: {
						fontSize: { type: 'static', value: '28px' },
						fontWeight: { type: 'static', value: '700' },
						color: { type: 'static', value: '#ffffff' },
					},
				},
			),
			node(
				'desc',
				'text',
				null,
				{ x: 60, y: 76 },
				{ width: 480, height: 20 },
				{
					content: 'Join thousands of users building amazing things',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '16px' },
						color: { type: 'static', value: '#94a3b8' },
					},
				},
			),
			node(
				'btn',
				'button',
				null,
				{ x: 60, y: 108 },
				{ width: 180, height: 40 },
				{
					label: 'Start Building',
				},
				{
					base: {
						backgroundColor: { type: 'static', value: '#f59e0b' },
						color: { type: 'static', value: '#0f172a' },
						borderRadius: { type: 'static', value: '8px' },
						fontWeight: { type: 'static', value: '600' },
					},
				},
			),
		],
	},

	// ----- Footer -----
	{
		id: 'footer-simple',
		name: 'Simple Footer',
		description: 'Footer with copyright and social links',
		category: 'footer',
		icon: '🦶',
		previewColors: ['#475569', '#334155'],
		nodes: [
			node(
				'bar',
				'container',
				null,
				{ x: 0, y: 0 },
				{ width: 800, height: 64 },
				{},
				{
					base: {
						backgroundColor: { type: 'static', value: '#f8fafc' },
						borderTop: { type: 'static', value: '1px solid #e2e8f0' },
					},
				},
			),
			node(
				'copy',
				'text',
				null,
				{ x: 24, y: 22 },
				{ width: 300, height: 20 },
				{
					content: '© 2025 YourBrand. All rights reserved.',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '13px' },
						color: { type: 'static', value: '#94a3b8' },
					},
				},
			),
			node(
				'link1',
				'text',
				null,
				{ x: 560, y: 22 },
				{ width: 60, height: 20 },
				{
					content: 'Privacy',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '13px' },
						color: { type: 'static', value: '#64748b' },
					},
				},
			),
			node(
				'link2',
				'text',
				null,
				{ x: 640, y: 22 },
				{ width: 60, height: 20 },
				{
					content: 'Terms',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '13px' },
						color: { type: 'static', value: '#64748b' },
					},
				},
			),
			node(
				'link3',
				'text',
				null,
				{ x: 720, y: 22 },
				{ width: 60, height: 20 },
				{
					content: 'Contact',
					tag: 'p',
				},
				{
					base: {
						fontSize: { type: 'static', value: '13px' },
						color: { type: 'static', value: '#64748b' },
					},
				},
			),
		],
	},
]

export function getTemplateById(id: string): BlockTemplate | undefined {
	return blockTemplates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): BlockTemplate[] {
	if (category === 'all') return blockTemplates
	return blockTemplates.filter(t => t.category === category)
}
