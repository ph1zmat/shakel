/**
 * Lightweight TSX code generator for the code view panel.
 * Unlike NextJSGenerator (which uses ts-morph for full project generation),
 * this generates a single-file TSX preview from the current canvas state.
 */

import type { ComponentNode, Page } from '../stores/canvas-store'
import type { AnimationConfig } from '@/types/builder'
import { getComponentDefinition } from '@/lib/codegen/component-registry'
import {
	stylesToTailwind,
	containerPropsToClasses,
	gridPropsToClasses,
	buttonVariantClasses,
	textElementClasses,
	imageClasses,
} from '../utils/style-to-tailwind'
import { inferSpatialParentage } from './infer-nesting'

// ========================================
// Types
// ========================================

export interface GeneratedPreviewFile {
	name: string
	path: string
	content: string
	language: 'tsx' | 'css' | 'json'
}

// ========================================
// Generator
// ========================================

export function generatePreviewFiles(
	page: Page | null,
	nodes: Record<string, ComponentNode>,
	pageId: string | null,
): GeneratedPreviewFile[] {
	if (!page || !pageId) return []

	const pageNodes = Object.values(nodes).filter(n => n.pageId === pageId)
	const tree = buildNodeTree(pageNodes)
	const rootNodes = tree.get(null) ?? []

	// Collect imports
	const imports = collectImports(rootNodes, tree)
	const hasMotion = imports.has('__motion__')

	// Generate component body
	const jsxBody = rootNodes.map(n => nodeToJSX(n, tree, 2)).join('\n')

	const componentName = toComponentName(page.name)
	const pagePath = page.slug === '/' ? '/' : `/${page.slug}`

	// Page file
	const pageContent = generatePageFile(componentName, jsxBody, imports)

	// Layout file
	const layoutContent = generateLayoutFile()

	// globals.css
	const cssContent = generateGlobalCSS()

	// package.json
	const packageContent = generatePackageJSON(hasMotion)

	return [
		{
			name: 'page.tsx',
			path: `app${pagePath === '/' ? '' : pagePath}/page.tsx`,
			content: pageContent,
			language: 'tsx',
		},
		{
			name: 'layout.tsx',
			path: 'app/layout.tsx',
			content: layoutContent,
			language: 'tsx',
		},
		{
			name: 'globals.css',
			path: 'app/globals.css',
			content: cssContent,
			language: 'css',
		},
		{
			name: 'package.json',
			path: 'package.json',
			content: packageContent,
			language: 'json',
		},
	]
}

// ========================================
// Node → JSX
// ========================================

function nodeToJSX(
	node: ComponentNode,
	tree: Map<string | null, ComponentNode[]>,
	indent: number,
): string {
	const pad = ' '.repeat(indent)
	const def = getComponentDefinition(node.type)
	if (!def) return `${pad}{/* Unknown: ${node.type} */}`

	const tw = stylesToTailwind(node.styles)
	const children = tree.get(node.id) ?? []

	let jsx = ''

	switch (node.type) {
		case 'container': {
			const layout = containerPropsToClasses(node.props)
			const cls = mergeClasses(layout, tw, 'min-h-[48px]')
			jsx = wrapTag('div', cls, children, node, tree, indent)
			break
		}

		case 'grid': {
			const grid = gridPropsToClasses(node.props)
			const cls = mergeClasses(grid, tw, 'min-h-[48px]')
			jsx = wrapTag('div', cls, children, node, tree, indent)
			break
		}

		case 'form': {
			const cls = mergeClasses('flex flex-col gap-4', tw)
			const submitLabel = String(node.props.submitLabel || 'Submit')
			const childJSX = children
				.map(c => nodeToJSX(c, tree, indent + 2))
				.join('\n')
			jsx = [
				`${pad}<form className="${cls}" onSubmit={(e) => e.preventDefault()}>`,
				childJSX,
				`${pad}  <button type="submit" className="self-start px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">`,
				`${pad}    ${submitLabel}`,
				`${pad}  </button>`,
				`${pad}</form>`,
			].join('\n')
			break
		}

		case 'text': {
			const as = (node.props.as as string) || 'p'
			const ec = textElementClasses(node.props)
			const cls = mergeClasses(ec, tw)
			const content = (node.props.content as string) || 'Text content'
			const tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'].includes(
				as,
			)
				? as
				: 'p'
			jsx = `${pad}<${tag} className="${cls}">${escapeJSX(content)}</${tag}>`
			break
		}

		case 'button': {
			const btnCls = buttonVariantClasses(node.props)
			const cls = mergeClasses(btnCls, tw)
			const text = (node.props.text as string) || 'Button'
			const disabled = node.props.disabled ? ' disabled' : ''
			jsx = `${pad}<button type="button" className="${cls}"${disabled}>${escapeJSX(text)}</button>`
			break
		}

		case 'link': {
			const href = (node.props.href as string) || '#'
			const text = (node.props.text as string) || 'Click here'
			const cls = mergeClasses(
				'text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors',
				tw,
			)
			jsx = `${pad}<a href="${href}" className="${cls}">${escapeJSX(text)}</a>`
			break
		}

		case 'input': {
			const label = String(node.props.label || 'Label')
			const inputType = (node.props.type as string) || 'text'
			const placeholder = (node.props.placeholder as string) || 'Enter value...'
			const required = node.props.required ? ' required' : ''
			const cls = mergeClasses('flex flex-col gap-1.5', tw)
			jsx = [
				`${pad}<div className="${cls}">`,
				`${pad}  <label className="text-sm font-medium text-gray-700">${escapeJSX(label)}${node.props.required ? ' *' : ''}</label>`,
				`${pad}  <input`,
				`${pad}    type="${inputType}"`,
				`${pad}    placeholder="${placeholder}"`,
				`${pad}    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"`,
				`${pad}  ${required}/>`,
				`${pad}</div>`,
			].join('\n')
			break
		}

		case 'image': {
			const imgCls = imageClasses(node.props)
			const src = (node.props.src as string) || '/placeholder.svg'
			const alt = (node.props.alt as string) || 'Image'
			const cls = mergeClasses('overflow-hidden', imgCls, tw)
			jsx = [
				`${pad}<div className="${cls}">`,
				`${pad}  <img src="${src}" alt="${escapeJSX(alt)}" className="w-full h-full object-cover" />`,
				`${pad}</div>`,
			].join('\n')
			break
		}

		default: {
			const cls = mergeClasses(
				'p-3 bg-gray-50 border border-gray-200 rounded-lg',
				tw,
			)
			jsx = wrapTag('div', cls, children, node, tree, indent)
		}
	}

	// Wrap with motion.div if node has animations
	if (node.animations && node.animations.length > 0) {
		jsx = wrapWithMotion(jsx, node.animations, indent)
	}

	return jsx
}

// ========================================
// Helpers
// ========================================

function wrapWithMotion(
	jsx: string,
	animations: AnimationConfig[],
	indent: number,
): string {
	const pad = ' '.repeat(indent)
	const anim = animations[0] // Use first animation for codegen
	const { initialStr, animateStr, transitionStr, whileHoverStr } =
		animConfigToCodeStrings(anim)

	const props: string[] = []

	if (
		anim.trigger === 'onMount' ||
		anim.trigger === 'onScroll' ||
		anim.trigger === 'onClick'
	) {
		props.push(`initial={${initialStr}}`)
		props.push(`animate={${animateStr}}`)
	}

	if (anim.trigger === 'onHover') {
		props.push(`whileHover={${whileHoverStr || animateStr}}`)
	}

	props.push(`transition={${transitionStr}}`)

	return [
		`${pad}<motion.div`,
		...props.map(p => `${pad}  ${p}`),
		`${pad}>`,
		jsx,
		`${pad}</motion.div>`,
	].join('\n')
}

function animConfigToCodeStrings(anim: AnimationConfig) {
	let initialStr = '{ opacity: 0 }'
	let animateStr = '{ opacity: 1 }'
	let whileHoverStr = ''

	switch (anim.preset) {
		case 'fadeIn':
			initialStr = '{ opacity: 0 }'
			animateStr = '{ opacity: 1 }'
			break
		case 'fadeOut':
			initialStr = '{ opacity: 1 }'
			animateStr = '{ opacity: 0 }'
			break
		case 'slideUp':
			initialStr = '{ opacity: 0, y: 30 }'
			animateStr = '{ opacity: 1, y: 0 }'
			break
		case 'slideDown':
			initialStr = '{ opacity: 0, y: -30 }'
			animateStr = '{ opacity: 1, y: 0 }'
			break
		case 'slideLeft':
			initialStr = '{ opacity: 0, x: 30 }'
			animateStr = '{ opacity: 1, x: 0 }'
			break
		case 'slideRight':
			initialStr = '{ opacity: 0, x: -30 }'
			animateStr = '{ opacity: 1, x: 0 }'
			break
		case 'scaleIn':
			initialStr = '{ opacity: 0, scale: 0.8 }'
			animateStr = '{ opacity: 1, scale: 1 }'
			break
		case 'scaleOut':
			initialStr = '{ opacity: 1, scale: 1 }'
			animateStr = '{ opacity: 0, scale: 0.8 }'
			break
		case 'bounceIn':
			initialStr = '{ opacity: 0, scale: 0.3 }'
			animateStr = '{ opacity: 1, scale: 1 }'
			break
		case 'rotateIn':
			initialStr = '{ opacity: 0, rotate: -90 }'
			animateStr = '{ opacity: 1, rotate: 0 }'
			break
		case 'pulse':
			initialStr = '{ scale: 1 }'
			animateStr = '{ scale: [1, 1.05, 1] }'
			break
		case 'shake':
			initialStr = '{ x: 0 }'
			animateStr = '{ x: [0, -5, 5, -5, 5, 0] }'
			break
	}

	whileHoverStr = animateStr

	const parts: string[] = []
	parts.push(`duration: ${anim.duration}`)
	if (anim.delay > 0) parts.push(`delay: ${anim.delay}`)
	if (anim.ease === 'spring') {
		parts.push('type: "spring"')
	} else {
		parts.push(`ease: "${anim.ease}"`)
	}
	if (anim.repeat !== 0) {
		parts.push(`repeat: ${anim.repeat === -1 ? 'Infinity' : anim.repeat}`)
	}
	const transitionStr = `{ ${parts.join(', ')} }`

	return { initialStr, animateStr, transitionStr, whileHoverStr }
}

function wrapTag(
	tag: string,
	className: string,
	children: ComponentNode[],
	_node: ComponentNode,
	tree: Map<string | null, ComponentNode[]>,
	indent: number,
): string {
	const pad = ' '.repeat(indent)
	if (children.length === 0) {
		return `${pad}<${tag} className="${className}" />`
	}
	const childJSX = children.map(c => nodeToJSX(c, tree, indent + 2)).join('\n')
	return `${pad}<${tag} className="${className}">\n${childJSX}\n${pad}</${tag}>`
}

function mergeClasses(...parts: string[]): string {
	return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

function escapeJSX(text: string): string {
	return text.replace(/[{}<>&"]/g, c => {
		if (c === '{') return '&#123;'
		if (c === '}') return '&#125;'
		if (c === '<') return '&lt;'
		if (c === '>') return '&gt;'
		if (c === '&') return '&amp;'
		if (c === '"') return '&quot;'
		return c
	})
}

function buildNodeTree(
	nodes: ComponentNode[],
): Map<string | null, ComponentNode[]> {
	const resolved = inferSpatialParentage(nodes)

	const tree = new Map<string | null, ComponentNode[]>()
	for (const node of resolved) {
		const key = node.parentId
		if (!tree.has(key)) tree.set(key, [])
		const list = tree.get(key)
		if (list) list.push(node)
	}
	for (const [, children] of tree) {
		children.sort((a, b) => a.order - b.order)
	}
	return tree
}

function collectImports(
	roots: ComponentNode[],
	tree: Map<string | null, ComponentNode[]>,
): Set<string> {
	const imports = new Set<string>()
	function walk(nodes: ComponentNode[]) {
		for (const node of nodes) {
			imports.add(node.type)
			if (node.animations && node.animations.length > 0) {
				imports.add('__motion__')
			}
			const children = tree.get(node.id) ?? []
			walk(children)
		}
	}
	walk(roots)
	return imports
}

function toComponentName(pageName: string): string {
	return (
		pageName
			.replace(/[^a-zA-Z0-9\s]/g, '')
			.split(/\s+/)
			.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join('') || 'Page'
	)
}

// ========================================
// File templates
// ========================================

function generatePageFile(
	componentName: string,
	jsxBody: string,
	imports: Set<string>,
): string {
	const motionImport = imports.has('__motion__')
		? `'use client'\n\nimport { motion } from 'motion/react'\n\n`
		: ''
	return `${motionImport}export default function ${componentName}() {
  return (
    <main className="min-h-screen">
${jsxBody}
    </main>
  )
}
`
}

function generateLayoutFile(): string {
	return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My App',
  description: 'Generated with Shakel Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
`
}

function generateGlobalCSS(): string {
	return `@import 'tailwindcss';

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
`
}

function generatePackageJSON(hasMotion: boolean): string {
	const deps: Record<string, string> = {
		next: '^15.0.0',
		react: '^19.0.0',
		'react-dom': '^19.0.0',
	}
	if (hasMotion) {
		deps.motion = '^12.0.0'
	}
	return JSON.stringify(
		{
			name: 'my-app',
			version: '0.1.0',
			private: true,
			scripts: {
				dev: 'next dev',
				build: 'next build',
				start: 'next start',
			},
			dependencies: deps,
			devDependencies: {
				'@types/node': '^20',
				'@types/react': '^19',
				typescript: '^5',
				'@tailwindcss/postcss': '^4',
				tailwindcss: '^4',
			},
		},
		null,
		2,
	)
}
