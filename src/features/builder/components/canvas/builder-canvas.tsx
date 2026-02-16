'use client'

import { useCanvasStore } from '../../stores/canvas-store'
import { CanvasNode, CanvasEmptyZone } from './canvas-node'
import { SmartGuides } from './smart-guides'
import { CodeEditorView } from './code-editor-view'
import {
	useCallback,
	useMemo,
	useRef,
	useState,
	createContext,
	useContext,
	type MouseEvent,
} from 'react'
import { cn } from '@/lib/utils'
import {
	IconDeviceMobile,
	IconDeviceTablet,
	IconDeviceDesktop,
	IconCode,
} from '@tabler/icons-react'
import type { CanvasViewport } from '../../utils/resolve-styles'

type Viewport = CanvasViewport
type ViewMode = 'design' | 'code'

// Viewport pixel widths for scaling
const VIEWPORT_PX: Record<Viewport, number> = {
	mobile: 375,
	tablet: 768,
	desktop: 1280,
}
const DESIGN_WIDTH = 1280

export interface ViewportInfo {
	viewport: CanvasViewport
	scale: number
}

// Viewport context so nested CanvasNodes can access it
const ViewportContext = createContext<ViewportInfo>({
	viewport: 'desktop',
	scale: 1,
})
export function useCanvasViewport(): ViewportInfo {
	return useContext(ViewportContext)
}

const viewportWidths: Record<Viewport, string> = {
	mobile: 'max-w-[375px]',
	tablet: 'max-w-[768px]',
	desktop: 'max-w-[1280px]',
}

interface MarqueeRect {
	startX: number
	startY: number
	currentX: number
	currentY: number
}

interface BuilderCanvasProps {
	pageId: string
}

export function BuilderCanvas({ pageId: _pageId }: BuilderCanvasProps) {
	const getRootNodes = useCanvasStore(state => state.getRootNodes)
	const nodes = useCanvasStore(state => state.nodes)
	const selectedNodeId = useCanvasStore(state => state.selectedNodeId)
	const selectedNodeIds = useCanvasStore(state => state.selectedNodeIds)
	const selectNode = useCanvasStore(state => state.selectNode)
	const selectNodes = useCanvasStore(state => state.selectNodes)
	const addNode = useCanvasStore(state => state.addNode)
	const addTemplate = useCanvasStore(state => state.addTemplate)
	const removeNode = useCanvasStore(state => state.removeNode)
	const updateNodePosition = useCanvasStore(state => state.updateNodePosition)
	const updateNodeSize = useCanvasStore(state => state.updateNodeSize)
	const groupNodes = useCanvasStore(state => state.groupNodes)
	const ungroupNodes = useCanvasStore(state => state.ungroupNodes)
	const zoom = useCanvasStore(state => state.zoom)
	const snapGuides = useCanvasStore(state => state.snapGuides)

	const [viewport, setViewport] = useState<Viewport>('desktop')
	const [viewMode, setViewMode] = useState<ViewMode>('design')

	// Canvas panning state
	const [isPanning, setIsPanning] = useState(false)
	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
	const panStartRef = useRef<{
		mouseX: number
		mouseY: number
		offsetX: number
		offsetY: number
	} | null>(null)
	const canvasRef = useRef<HTMLDivElement>(null)

	// Marquee selection state
	const [marquee, setMarquee] = useState<MarqueeRect | null>(null)

	const vpScale = VIEWPORT_PX[viewport] / DESIGN_WIDTH
	const viewportInfo = useMemo<ViewportInfo>(
		() => ({ viewport, scale: vpScale }),
		[viewport, vpScale],
	)

	const rootNodes = getRootNodes()

	const handleCanvasClick = (e: MouseEvent) => {
		// Only deselect if clicking directly on the canvas background (no marquee was active)
		if (
			e.target === e.currentTarget ||
			(e.target as HTMLElement).dataset?.canvasArea === 'true'
		) {
			selectNode(null)
		}
	}

	// Marquee selection: start on left-click on empty canvas (no alt/middle)
	const handleMarqueeStart = useCallback(
		(e: MouseEvent) => {
			// Only start marquee on left click, no modifier that means pan
			if (e.button !== 0 || e.altKey) return
			// Only if target is the canvas itself (not a node)
			const target = e.target as HTMLElement
			if (!target.dataset?.canvasArea && target !== canvasRef.current) return
			if (!canvasRef.current) return

			const rect = canvasRef.current.getBoundingClientRect()
			const totalScale = zoom * vpScale
			const x = (e.clientX - rect.left) / totalScale
			const y = (e.clientY - rect.top) / totalScale

			const startMarq: MarqueeRect = {
				startX: x,
				startY: y,
				currentX: x,
				currentY: y,
			}
			setMarquee(startMarq)

			const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
				if (!canvasRef.current) return
				const r = canvasRef.current.getBoundingClientRect()
				const mx = (moveEvent.clientX - r.left) / totalScale
				const my = (moveEvent.clientY - r.top) / totalScale
				setMarquee(prev =>
					prev ? { ...prev, currentX: mx, currentY: my } : null,
				)
			}

			const handleMouseUp = () => {
				setMarquee(prev => {
					if (prev) {
						// Calculate selection rectangle
						const minX = Math.min(prev.startX, prev.currentX)
						const minY = Math.min(prev.startY, prev.currentY)
						const maxX = Math.max(prev.startX, prev.currentX)
						const maxY = Math.max(prev.startY, prev.currentY)
						const w = maxX - minX
						const h = maxY - minY

						// Only select if dragged at least 5px
						if (w > 5 || h > 5) {
							const currentPageId = useCanvasStore.getState().currentPageId
							const allNodes = Object.values(nodes)
							const intersecting = allNodes.filter(n => {
								if (n.pageId !== currentPageId) return false
								if (n.parentId !== null) return false
								const nx = n.position.x
								const ny = n.position.y
								const nw = n.size.width
								const nh = n.size.height
								return (
									nx < maxX && nx + nw > minX && ny < maxY && ny + nh > minY
								)
							})

							if (intersecting.length > 0) {
								selectNodes(intersecting.map(n => n.id))
							}
						}
					}
					return null
				})
				window.removeEventListener('mousemove', handleMouseMove)
				window.removeEventListener('mouseup', handleMouseUp)
			}

			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('mouseup', handleMouseUp)
		},
		[nodes, zoom, vpScale, selectNodes],
	)

	// Space + drag for panning
	const handleCanvasMouseDown = useCallback(
		(e: MouseEvent) => {
			if (e.button === 1 || (e.button === 0 && e.altKey)) {
				// Middle mouse or Alt+click = panning
				e.preventDefault()
				setIsPanning(true)
				panStartRef.current = {
					mouseX: e.clientX,
					mouseY: e.clientY,
					offsetX: panOffset.x,
					offsetY: panOffset.y,
				}

				const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
					if (!panStartRef.current) return
					const dx = moveEvent.clientX - panStartRef.current.mouseX
					const dy = moveEvent.clientY - panStartRef.current.mouseY
					setPanOffset({
						x: panStartRef.current.offsetX + dx,
						y: panStartRef.current.offsetY + dy,
					})
				}

				const handleMouseUp = () => {
					panStartRef.current = null
					setIsPanning(false)
					window.removeEventListener('mousemove', handleMouseMove)
					window.removeEventListener('mouseup', handleMouseUp)
				}

				window.addEventListener('mousemove', handleMouseMove)
				window.addEventListener('mouseup', handleMouseUp)
			}
		},
		[panOffset.x, panOffset.y],
	)

	// Handle drop from palette or templates (coordinate-based)
	const handleCanvasDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			if (!canvasRef.current) return

			const rect = canvasRef.current.getBoundingClientRect()
			const totalScale = zoom * vpScale
			const x = (e.clientX - rect.left) / totalScale
			const y = (e.clientY - rect.top) / totalScale

			// Check for template drop first
			const templateId = e.dataTransfer.getData('application/x-template-id')
			if (templateId) {
				addTemplate(templateId, { x: Math.round(x), y: Math.round(y) })
				return
			}

			// Then check for component drop
			const componentType = e.dataTransfer.getData(
				'application/x-component-type',
			)
			if (componentType) {
				// Find the smallest container at the drop point to auto-parent
				const CONTAINER_TYPES = new Set([
					'container', 'card', 'form', 'group', 'grid', 'tabs',
				])
				const isFullWidth =
					componentType === 'container' || componentType === 'grid'

				let parentId: string | null = null
				// Only auto-parent non-container types (or containers dropped inside larger containers)
				const currentPageId = useCanvasStore.getState().currentPageId
				const allNodes = Object.values(nodes)
				const containers = allNodes
					.filter(
						n =>
							n.pageId === currentPageId &&
							CONTAINER_TYPES.has(n.type) &&
							x >= n.position.x &&
							x <= n.position.x + n.size.width &&
							y >= n.position.y &&
							y <= n.position.y + n.size.height,
					)
					.sort(
						(a, b) =>
							a.size.width * a.size.height -
							(b.size.width * b.size.height),
					)

				if (containers.length > 0 && !isFullWidth) {
					parentId = containers[0].id // smallest enclosing container
				}

				const newId = addNode(componentType, parentId)
				updateNodePosition(newId, {
					x: isFullWidth ? 0 : Math.round(x),
					y: Math.round(y),
				})
				if (isFullWidth) {
					updateNodeSize(newId, { width: DESIGN_WIDTH, height: 400 })
				}
			}
		},
		[addNode, addTemplate, updateNodePosition, updateNodeSize, zoom, vpScale, nodes],
	)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'copy'
	}, [])

	return (
		<div className='flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden'>
			{/* Viewport switcher + Code toggle */}
			<div className='flex items-center justify-center gap-1 py-2 border-b bg-white dark:bg-gray-950 px-4'>
				{/* Design / Code mode switcher */}
				<div className='flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 mr-3'>
					<button
						type='button'
						onClick={() => setViewMode('design')}
						className={cn(
							'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
							viewMode === 'design'
								? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
								: 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
						)}
						title='Визуальный редактор'
					>
						<IconDeviceDesktop className='h-3.5 w-3.5' />
						Design
					</button>
					<button
						type='button'
						onClick={() => setViewMode('code')}
						className={cn(
							'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
							viewMode === 'code'
								? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
								: 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
						)}
						title='Редактор кода'
					>
						<IconCode className='h-3.5 w-3.5' />
						Code
					</button>
				</div>

				{/* Viewport buttons (only visible in design mode) */}
				{viewMode === 'design' && (
					<>
						<div className='h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1' />
						<ViewportButton
							icon={<IconDeviceMobile className='h-4 w-4' />}
							label='Mobile'
							isActive={viewport === 'mobile'}
							onClick={() => setViewport('mobile')}
						/>
						<ViewportButton
							icon={<IconDeviceTablet className='h-4 w-4' />}
							label='Tablet'
							isActive={viewport === 'tablet'}
							onClick={() => setViewport('tablet')}
						/>
						<ViewportButton
							icon={<IconDeviceDesktop className='h-4 w-4' />}
							label='Desktop'
							isActive={viewport === 'desktop'}
							onClick={() => setViewport('desktop')}
						/>
					</>
				)}
			</div>

			{/* Content area: Design canvas + Code editor (both mounted, toggle visibility) */}
			<div
				className={cn(
					'flex-1 flex flex-col overflow-hidden',
					viewMode !== 'code' && 'hidden',
				)}
			>
				<CodeEditorView />
			</div>

			{/* Canvas area */}
			{viewMode === 'design' && (
				// biome-ignore lint/a11y/noStaticElementInteractions: Canvas area
				<div
					className={cn(
						'flex-1 overflow-auto p-6',
						isPanning && 'cursor-grabbing',
					)}
					onClick={handleCanvasClick}
					onMouseDown={handleCanvasMouseDown}
					onKeyDown={e => {
						if (e.key === 'Escape') selectNode(null)
						if (e.key === 'Delete' || e.key === 'Backspace') {
							for (const id of selectedNodeIds) removeNode(id)
						}
						if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
							e.preventDefault()
							if (e.shiftKey) {
								// Ctrl+Shift+G = ungroup
								if (selectedNodeId && nodes[selectedNodeId]?.type === 'group') {
									ungroupNodes(selectedNodeId)
								}
							} else {
								// Ctrl+G = group
								if (selectedNodeIds.length >= 2) groupNodes()
							}
						}
					}}
				>
					<div
						className={cn(
							'mx-auto bg-white dark:bg-gray-950 shadow-lg rounded-lg transition-all duration-300 min-h-[600px] overflow-hidden',
							viewportWidths[viewport],
							viewport === 'mobile' &&
								'border-[6px] border-gray-800 rounded-4xl',
						)}
						style={{
							transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
							transformOrigin: 'top center',
						}}
					>
						{/* Simulated browser chrome */}
						<div className='flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-b rounded-t-lg'>
							<div className='flex gap-1.5'>
								<div className='w-2.5 h-2.5 rounded-full bg-red-400' />
								<div className='w-2.5 h-2.5 rounded-full bg-yellow-400' />
								<div className='w-2.5 h-2.5 rounded-full bg-green-400' />
							</div>
							<div className='flex-1 mx-8'>
								<div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1 text-[11px] text-gray-400 text-center truncate'>
									localhost:3000
								</div>
							</div>
						</div>

						{/* Page content area - free canvas */}
						{/* biome-ignore lint/a11y/noStaticElementInteractions: Canvas drop target */}
						<ViewportContext.Provider value={viewportInfo}>
							<div
								ref={canvasRef}
								className='relative p-0'
								style={{
									width: `${DESIGN_WIDTH}px`,
									minHeight: '800px',
									transform: vpScale < 1 ? `scale(${vpScale})` : undefined,
									transformOrigin: 'top left',
								}}
								data-canvas-area='true'
								onDrop={handleCanvasDrop}
								onDragOver={handleDragOver}
								onMouseDown={handleMarqueeStart}
							>
								{rootNodes.map(node => (
									<CanvasNode
										key={node.id}
										nodeId={node.id}
										isSelected={selectedNodeId === node.id}
										onSelect={() => selectNode(node.id)}
									/>
								))}

								{rootNodes.length === 0 && <CanvasEmptyZone />}

								{/* Marquee selection rectangle */}
								{marquee &&
									(() => {
										const x = Math.min(marquee.startX, marquee.currentX)
										const y = Math.min(marquee.startY, marquee.currentY)
										const w = Math.abs(marquee.currentX - marquee.startX)
										const h = Math.abs(marquee.currentY - marquee.startY)
										return w > 3 || h > 3 ? (
											<div
												className='absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10 rounded-sm'
												style={{ left: x, top: y, width: w, height: h }}
											/>
										) : null
									})()}

								{/* Smart guides overlay */}
								<SmartGuides guides={snapGuides} />
							</div>
						</ViewportContext.Provider>
						{/* Spacer: CSS transform:scale doesn't shrink layout box */}
						{vpScale < 1 && (
							<div
								style={{ marginTop: `${-800 * (1 - vpScale)}px` }}
								aria-hidden
							/>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

function ViewportButton({
	icon,
	label,
	isActive,
	onClick,
}: {
	icon: React.ReactNode
	label: string
	isActive: boolean
	onClick: () => void
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			className={cn(
				'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
				isActive
					? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
					: 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
			)}
			title={label}
		>
			{icon}
			<span className='hidden sm:inline'>{label}</span>
		</button>
	)
}
