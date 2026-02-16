'use client'

import Image from 'next/image'
import { useCanvasStore, type ComponentNode } from '../../stores/canvas-store'
import { getComponentDefinition } from '@/lib/codegen/component-registry'

/**
 * Preview component — рендерит дерево компонентов
 * как они будут выглядеть в финальном приложении.
 */
export function CanvasPreview() {
	const getRootNodes = useCanvasStore(state => state.getRootNodes)
	const rootNodes = getRootNodes()

	return (
		<div className='w-full min-h-screen bg-white dark:bg-gray-950 p-0'>
			{rootNodes.map(node => (
				<PreviewNode key={node.id} nodeId={node.id} />
			))}
		</div>
	)
}

function PreviewNode({ nodeId }: { nodeId: string }) {
	const node = useCanvasStore(state => state.nodes[nodeId])
	const getChildNodes = useCanvasStore(state => state.getChildNodes)

	if (!node) return null

	const def = getComponentDefinition(node.type)
	const children = getChildNodes(nodeId)
	const style = buildPreviewStyles(node)

	switch (node.type) {
		case 'container': {
			const direction = (node.props.direction as string) ?? 'column'
			const gap = gapToCSS((node.props.gap as string) ?? 'md')
			const align = (node.props.align as string) ?? 'stretch'
			const justify = (node.props.justify as string) ?? 'start'

			return (
				<div
					style={{
						...style,
						display: 'flex',
						flexDirection: direction as 'row' | 'column',
						gap,
						alignItems: mapAlign(align),
						justifyContent: mapJustify(justify),
					}}
				>
					{children.map(child => (
						<PreviewNode key={child.id} nodeId={child.id} />
					))}
				</div>
			)
		}

		case 'grid': {
			const columns = Number(node.props.columns ?? 2)
			const gap = gapToCSS((node.props.gap as string) ?? 'md')

			return (
				<div
					style={{
						...style,
						display: 'grid',
						gridTemplateColumns: `repeat(${columns}, 1fr)`,
						gap,
					}}
				>
					{children.map(child => (
						<PreviewNode key={child.id} nodeId={child.id} />
					))}
				</div>
			)
		}

		case 'text':
			return (
				<p style={style}>
					{(node.props.content as string) ??
						(node.props.text as string) ??
						'Text'}
				</p>
			)

		case 'button':
			return (
				<button type='button' style={style} className='cursor-pointer'>
					{(node.props.text as string) ?? 'Button'}
				</button>
			)

		case 'input':
			return (
				<input
					type={(node.props.inputType as string) ?? 'text'}
					placeholder={(node.props.placeholder as string) ?? ''}
					style={style}
					readOnly
				/>
			)

		case 'image':
			return (
				<div
					style={{
						...style,
						minHeight: '100px',
						background: '#f3f4f6',
						position: 'relative',
					}}
				>
					{(node.props.src as string) ? (
						<Image
							src={node.props.src as string}
							alt={(node.props.alt as string) ?? ''}
							fill
							style={{ objectFit: 'cover' }}
						/>
					) : (
						<div className='flex items-center justify-center h-full text-gray-400 text-sm'>
							Image Placeholder
						</div>
					)}
				</div>
			)

		case 'link':
			return (
				// biome-ignore lint/a11y/useSemanticElements: Preview link placeholder
				<span
					role='link'
					tabIndex={0}
					style={{
						...style,
						color: 'var(--color-primary, #3b82f6)',
						cursor: 'pointer',
						textDecoration: 'underline',
					}}
				>
					{(node.props.text as string) ?? 'Link'}
				</span>
			)

		case 'form':
			return (
				<form style={style} onSubmit={e => e.preventDefault()}>
					{children.map(child => (
						<PreviewNode key={child.id} nodeId={child.id} />
					))}
				</form>
			)

		default:
			return (
				<div style={style}>
					{def?.isContainer &&
						children.map(child => (
							<PreviewNode key={child.id} nodeId={child.id} />
						))}
				</div>
			)
	}
}

function buildPreviewStyles(node: ComponentNode): React.CSSProperties {
	const styles: React.CSSProperties = {}
	const base = node.styles.base

	if (!base) return styles

	for (const [prop, value] of Object.entries(base)) {
		if (!value) continue

		const sv = value as {
			type: string
			value: string | number
			unit?: string
			tokenType?: string
		}

		if (sv.type === 'token') {
			// Map token to CSS variable
			const varName = `--${sv.tokenType}-${sv.value}`
			;(styles as Record<string, string>)[prop] = `var(${varName})`
		} else {
			const unit = sv.unit ?? (typeof sv.value === 'number' ? 'px' : '')
			;(styles as Record<string, string>)[prop] = `${sv.value}${unit}`
		}
	}

	return styles
}

function gapToCSS(gap: string): string {
	const map: Record<string, string> = {
		none: '0',
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
	}
	return map[gap] ?? '1rem'
}

function mapAlign(align: string): string {
	const map: Record<string, string> = {
		start: 'flex-start',
		center: 'center',
		end: 'flex-end',
		stretch: 'stretch',
	}
	return map[align] ?? 'stretch'
}

function mapJustify(justify: string): string {
	const map: Record<string, string> = {
		start: 'flex-start',
		center: 'center',
		end: 'flex-end',
		between: 'space-between',
		around: 'space-around',
	}
	return map[justify] ?? 'flex-start'
}
