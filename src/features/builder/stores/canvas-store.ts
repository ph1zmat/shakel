// Canvas Store - Zustand + Immer для управления состоянием редактора
// Поддержка undo/redo через паттерн Command

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { getDefaultProps } from '@/lib/codegen/component-registry'
import { getTemplateById } from '@/config/block-templates'
import type {
	StyleConfig,
	StyleValue,
	Constraints,
	TransformConfig,
	EffectConfig,
	AnimationConfig,
} from '@/types/builder'
import type { SnapLine } from '../components/canvas/smart-guides'

// ========================================
// Types
// ========================================

// Re-export for consumers
export type {
	StyleConfig,
	StyleValue,
	Constraints,
	TransformConfig,
	EffectConfig,
	AnimationConfig,
}

export interface ComponentNode {
	id: string
	type: string
	parentId: string | null
	pageId: string
	order: number
	props: Record<string, unknown>
	styles: StyleConfig
	interactions: InteractionConfig[]
	// Free positioning (always absolute)
	position: { x: number; y: number }
	size: { width: number; height: number }
	// Visual properties
	rotation: number
	zIndex: number
	opacity: number
	locked: boolean
	visible: boolean
	// Constraints (Figma-like)
	constraints: Constraints
	// Effects
	effects: EffectConfig[]
	// Animations
	animations: AnimationConfig[]
}

export interface InteractionConfig {
	id: string
	trigger: 'onClick' | 'onSubmit' | 'onHover' | 'onMount' | 'onMessage'
	type: 'NAVIGATE' | 'OPEN_MODAL' | 'TRIGGER_WORKFLOW' | 'SEND_MESSAGE'
	config: Record<string, unknown>
	order: number
}

export interface Page {
	id: string
	name: string
	slug: string
	isEntry: boolean
}

export interface Project {
	id: string
	name: string
	platform: 'WEB' | 'TELEGRAM_BOT'
	designSystemId: string
}

// Command для undo/redo
interface Command {
	type:
		| 'ADD_NODE'
		| 'REMOVE_NODE'
		| 'MOVE_NODE'
		| 'UPDATE_PROPS'
		| 'UPDATE_STYLES'
		| 'REORDER_NODES'
	payload: unknown
	undo: () => void
	redo: () => void
}

// ========================================
// State Interface
// ========================================

export type CanvasViewport = 'mobile' | 'tablet' | 'desktop'
export type ViewMode = 'design' | 'code'

interface CanvasState {
	// Project Data
	project: Project | null
	pages: Page[]
	currentPageId: string | null

	// Nodes (normalized)
	nodes: Record<string, ComponentNode>

	// UI State
	selectedNodeId: string | null
	selectedNodeIds: string[]
	expandedNodeIds: string[]
	zoom: number
	viewport: { x: number; y: number }
	isDragging: boolean
	isResizing: boolean
	dragPayload: {
		nodeId: string
		sourceParentId: string | null
		sourceIndex: number
	} | null

	// Viewport & View Mode (Phase 1)
	activeViewport: CanvasViewport
	viewMode: ViewMode

	// Clipboard (Phase 2)
	clipboard: ComponentNode[]

	// Smart guides (transient)
	snapGuides: SnapLine[]

	// History
	history: Command[]
	historyIndex: number
	canUndo: boolean
	canRedo: boolean

	// Actions
	setProject: (project: Project) => void
	setPages: (pages: Page[]) => void
	setCurrentPage: (pageId: string) => void

	// Viewport & View Mode (Phase 1)
	setActiveViewport: (viewport: CanvasViewport) => void
	setViewMode: (mode: ViewMode) => void

	// Node CRUD
	addNode: (type: string, parentId: string | null) => string
	addTemplate: (
		templateId: string,
		origin: { x: number; y: number },
	) => string[]
	removeNode: (nodeId: string) => void
	moveNode: (
		nodeId: string,
		targetParentId: string | null,
		targetIndex: number,
	) => void

	// Node updates
	updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void
	updateNodeStyles: (nodeId: string, styles: Partial<StyleConfig>) => void
	updateStyleValue: (
		nodeId: string,
		state: 'base' | 'hover' | 'focus',
		property: string,
		value: StyleValue | null,
	) => void
	updateNodeRotation: (nodeId: string, rotation: number) => void
	updateNodeZIndex: (nodeId: string, zIndex: number) => void
	updateNodeOpacity: (nodeId: string, opacity: number) => void
	toggleNodeLock: (nodeId: string) => void
	toggleNodeVisibility: (nodeId: string) => void
	updateNodeEffects: (nodeId: string, effects: EffectConfig[]) => void
	updateNodeAnimations: (nodeId: string, animations: AnimationConfig[]) => void

	// Interactions
	addInteraction: (
		nodeId: string,
		interaction: Omit<InteractionConfig, 'id' | 'order'>,
	) => void
	removeInteraction: (nodeId: string, interactionId: string) => void
	updateInteraction: (
		nodeId: string,
		interactionId: string,
		updates: Partial<InteractionConfig>,
	) => void

	// Selection
	selectNode: (nodeId: string | null) => void
	selectNodes: (nodeIds: string[]) => void
	toggleExpanded: (nodeId: string) => void

	// Alignment (multi-select)
	alignNodes: (
		direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom',
	) => void
	distributeNodes: (axis: 'horizontal' | 'vertical') => void

	// Group operations
	groupNodes: () => string | null
	ungroupNodes: (groupId: string) => void

	// Copy/Paste (Phase 2)
	copyNodes: (nodeIds: string[]) => void
	pasteNodes: (offset?: { x: number; y: number }) => void
	duplicateNodes: (nodeIds: string[]) => void

	// Multi-move
	moveSelectedNodes: (dx: number, dy: number) => void

	// Bulk insert (AI generation)
	addBulkNodes: (nodes: ComponentNode[]) => void

	// Position & Size (free mode)
	updateNodePosition: (
		nodeId: string,
		position: { x: number; y: number },
	) => void
	updateNodeSize: (
		nodeId: string,
		size: { width: number; height: number },
	) => void

	// Drag & Drop
	startDrag: (payload: {
		nodeId: string
		sourceParentId: string | null
		sourceIndex: number
	}) => void
	endDrag: () => void

	// Smart guides
	setSnapGuides: (guides: SnapLine[]) => void

	// History
	undo: () => void
	redo: () => void

	// Utils
	getRootNodes: () => ComponentNode[]
	getChildNodes: (parentId: string | null) => ComponentNode[]
	getNodePath: (nodeId: string) => ComponentNode[]
}

// ========================================
// Helpers
// ========================================

function generateId(): string {
	return Math.random().toString(36).substring(2, 15)
}

/** Default sizes per component type. Containers/grids are full-width sections. */
const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
	container: { width: 1280, height: 400 },
	grid:      { width: 1280, height: 400 },
	form:      { width: 500, height: 300 },
	card:      { width: 360, height: 260 },
	image:     { width: 320, height: 200 },
	button:    { width: 160, height: 44 },
	input:     { width: 320, height: 48 },
	textarea:  { width: 320, height: 120 },
	select:    { width: 320, height: 48 },
	text:      { width: 300, height: 32 },
	heading:   { width: 400, height: 48 },
	link:      { width: 140, height: 32 },
	badge:     { width: 80, height: 28 },
	separator: { width: 400, height: 2 },
	icon:      { width: 40, height: 40 },
	tabs:      { width: 500, height: 200 },
	group:     { width: 400, height: 300 },
}

const FALLBACK_SIZE = { width: 200, height: 48 }

function createNode(
	type: string,
	pageId: string,
	parentId: string | null,
	order: number,
): ComponentNode {
	const size = DEFAULT_SIZES[type] ?? FALLBACK_SIZE
	return {
		id: generateId(),
		type,
		parentId,
		pageId,
		order,
		props: getDefaultProps(type),
		styles: { base: {} },
		interactions: [],
		position: { x: 0, y: 0 },
		size: { ...size },
		rotation: 0,
		zIndex: order,
		opacity: 1,
		locked: false,
		visible: true,
		constraints: { horizontal: 'left', vertical: 'top' },
		effects: [],
		animations: [],
	}
}

// ========================================
// Store
// ========================================

export const useCanvasStore = create<CanvasState>()(
	devtools(
		immer((set, get) => ({
			// Initial state
			project: null,
			pages: [],
			currentPageId: null,
			nodes: {},
			selectedNodeId: null,
			selectedNodeIds: [],
			expandedNodeIds: [],
			zoom: 1,
			viewport: { x: 0, y: 0 },
			isDragging: false,
			isResizing: false,
			dragPayload: null,
			activeViewport: 'desktop',
			viewMode: 'design',
			clipboard: [],
			snapGuides: [],
			history: [],
			historyIndex: -1,
			canUndo: false,
			canRedo: false,

			// Project
			setProject: project => {
				set(state => {
					state.project = project
				})
			},

			setPages: pages => {
				set(state => {
					state.pages = pages
					if (pages.length > 0 && !state.currentPageId) {
						state.currentPageId = pages[0].id
					}
				})
			},

			setCurrentPage: pageId => {
				set(state => {
					state.currentPageId = pageId
					state.selectedNodeId = null
				})
			},

			// Viewport & View Mode
			setActiveViewport: viewport => {
				set(state => {
					state.activeViewport = viewport
				})
			},

			setViewMode: mode => {
				set(state => {
					state.viewMode = mode
				})
			},

			// Node CRUD
			addNode: (type, parentId) => {
				const { currentPageId, nodes } = get()
				if (!currentPageId) throw new Error('No current page')

				// Calculate order
				const siblings = Object.values(nodes).filter(
					n => n.pageId === currentPageId && n.parentId === parentId,
				)
				const order = siblings.length

				const newNode = createNode(type, currentPageId, parentId, order)

				set(state => {
					state.nodes[newNode.id] = newNode
					state.selectedNodeId = newNode.id

					// Add to history
					const command: Command = {
						type: 'ADD_NODE',
						payload: { nodeId: newNode.id },
						undo: () => {
							set(s => {
								delete s.nodes[newNode.id]
								if (s.selectedNodeId === newNode.id) {
									s.selectedNodeId = null
								}
							})
						},
						redo: () => {
							set(s => {
								s.nodes[newNode.id] = newNode
								s.selectedNodeId = newNode.id
							})
						},
					}

					// Truncate redo history
					state.history = state.history.slice(0, state.historyIndex + 1)
					state.history.push(command)
					state.historyIndex++
					state.canUndo = true
					state.canRedo = false
				})

				return newNode.id
			},

			addTemplate: (templateId, origin) => {
				const template = getTemplateById(templateId)
				if (!template) return []

				const { currentPageId, nodes } = get()
				if (!currentPageId) throw new Error('No current page')

				const siblings = Object.values(nodes).filter(
					n => n.pageId === currentPageId && n.parentId === null,
				)
				let order = siblings.length

				// Map localId -> real id
				const idMap = new Map<string, string>()
				const newNodes: ComponentNode[] = []

				for (const tNode of template.nodes) {
					const id = generateId()
					idMap.set(tNode.localId, id)

					const parentId = tNode.parentLocalId
						? (idMap.get(tNode.parentLocalId) ?? null)
						: null

					const node: ComponentNode = {
						id,
						type: tNode.type,
						parentId,
						pageId: currentPageId,
						order: order++,
						props: { ...tNode.props },
						styles: structuredClone(tNode.styles),
						interactions: [],
						position: {
							x: origin.x + tNode.offset.x,
							y: origin.y + tNode.offset.y,
						},
						size: { ...tNode.size },
						rotation: tNode.rotation,
						zIndex: tNode.zIndex || order,
						opacity: tNode.opacity,
						locked: false,
						visible: true,
						constraints: { ...tNode.constraints },
						effects: [...tNode.effects],
						animations: [],
					}
					newNodes.push(node)
				}

				set(state => {
					for (const n of newNodes) {
						state.nodes[n.id] = n
					}
					if (newNodes.length > 0) {
						state.selectedNodeId = newNodes[0].id
						state.selectedNodeIds = newNodes.map(n => n.id)
					}

					// History
					const nodeIds = newNodes.map(n => n.id)
					const command: Command = {
						type: 'ADD_NODE',
						payload: { nodeIds },
						undo: () => {
							set(s => {
								for (const id of nodeIds) {
									delete s.nodes[id]
								}
								s.selectedNodeId = null
								s.selectedNodeIds = []
							})
						},
						redo: () => {
							set(s => {
								for (const n of newNodes) {
									s.nodes[n.id] = n
								}
								s.selectedNodeId = newNodes[0]?.id ?? null
								s.selectedNodeIds = newNodes.map(n => n.id)
							})
						},
					}

					state.history = state.history.slice(0, state.historyIndex + 1)
					state.history.push(command)
					state.historyIndex++
					state.canUndo = true
					state.canRedo = false
				})

				return newNodes.map(n => n.id)
			},

			addBulkNodes: (newNodes: ComponentNode[]) => {
				if (newNodes.length === 0) return

				set(state => {
					for (const n of newNodes) {
						state.nodes[n.id] = n
					}
					if (newNodes.length > 0) {
						state.selectedNodeId = newNodes[0].id
						state.selectedNodeIds = newNodes.map(n => n.id)
					}

					const nodeIds = newNodes.map(n => n.id)
					const command: Command = {
						type: 'ADD_NODE',
						payload: { nodeIds },
						undo: () => {
							set(s => {
								for (const id of nodeIds) {
									delete s.nodes[id]
								}
								s.selectedNodeId = null
								s.selectedNodeIds = []
							})
						},
						redo: () => {
							set(s => {
								for (const n of newNodes) {
									s.nodes[n.id] = n
								}
								s.selectedNodeId = newNodes[0]?.id ?? null
								s.selectedNodeIds = newNodes.map(n => n.id)
							})
						},
					}

					state.history = state.history.slice(0, state.historyIndex + 1)
					state.history.push(command)
					state.historyIndex++
					state.canUndo = true
					state.canRedo = false
				})
			},

			removeNode: nodeId => {
				const { nodes } = get()
				const node = nodes[nodeId]
				if (!node) return

				// Collect all descendants
				const collectDescendants = (id: string): string[] => {
					const children = Object.values(nodes).filter(n => n.parentId === id)
					const childIds = children.map(c => c.id)
					const descendantIds = children.flatMap(c => collectDescendants(c.id))
					return [...childIds, ...descendantIds]
				}

				const descendants = collectDescendants(nodeId)
				const allIds = [nodeId, ...descendants]
				const snapshot = allIds.map(id => ({ id, node: nodes[id] }))

				set(state => {
					// Remove node and descendants
					allIds.forEach(id => {
						delete state.nodes[id]
					})

					// Reorder siblings
					Object.values(state.nodes)
						.filter(
							n =>
								n.pageId === node.pageId &&
								n.parentId === node.parentId &&
								n.order > node.order,
						)
						.forEach(n => {
							n.order--
						})

					if (state.selectedNodeId && allIds.includes(state.selectedNodeId)) {
						state.selectedNodeId = null
					}

					// Add to history
					const command: Command = {
						type: 'REMOVE_NODE',
						payload: { ids: allIds },
						undo: () => {
							set(s => {
								snapshot.forEach(({ id, node }) => {
									s.nodes[id] = node
								})
							})
						},
						redo: () => {
							set(s => {
								allIds.forEach(id => {
									delete s.nodes[id]
								})
							})
						},
					}

					state.history = state.history.slice(0, state.historyIndex + 1)
					state.history.push(command)
					state.historyIndex++
					state.canUndo = true
					state.canRedo = false
				})
			},

			moveNode: (nodeId, targetParentId, targetIndex) => {
				const { nodes, currentPageId } = get()
				const node = nodes[nodeId]
				if (!node || !currentPageId) return

				const sourceParentId = node.parentId
				const sourceIndex = node.order

				if (sourceParentId === targetParentId && sourceIndex === targetIndex)
					return

				set(state => {
					// Reorder source siblings
					Object.values(state.nodes)
						.filter(
							n =>
								n.pageId === currentPageId &&
								n.parentId === sourceParentId &&
								n.order > sourceIndex,
						)
						.forEach(n => {
							n.order--
						})

					// Reorder target siblings
					Object.values(state.nodes)
						.filter(
							n =>
								n.pageId === currentPageId &&
								n.parentId === targetParentId &&
								n.order >= targetIndex &&
								n.id !== nodeId,
						)
						.forEach(n => {
							n.order++
						})

					// Update node
					state.nodes[nodeId].parentId = targetParentId
					state.nodes[nodeId].order = targetIndex

					// Add to history
					const command: Command = {
						type: 'MOVE_NODE',
						payload: {
							nodeId,
							sourceParentId,
							sourceIndex,
							targetParentId,
							targetIndex,
						},
						undo: () => {
							set(s => {
								// Restore original positions
								Object.values(s.nodes)
									.filter(
										n =>
											n.pageId === currentPageId &&
											n.parentId === targetParentId &&
											n.order > targetIndex,
									)
									.forEach(n => {
										n.order--
									})

								Object.values(s.nodes)
									.filter(
										n =>
											n.pageId === currentPageId &&
											n.parentId === sourceParentId &&
											n.order >= sourceIndex,
									)
									.forEach(n => {
										n.order++
									})

								s.nodes[nodeId].parentId = sourceParentId
								s.nodes[nodeId].order = sourceIndex
							})
						},
						redo: () => {
							set(s => {
								Object.values(s.nodes)
									.filter(
										n =>
											n.pageId === currentPageId &&
											n.parentId === sourceParentId &&
											n.order > sourceIndex,
									)
									.forEach(n => {
										n.order--
									})

								Object.values(s.nodes)
									.filter(
										n =>
											n.pageId === currentPageId &&
											n.parentId === targetParentId &&
											n.order >= targetIndex,
									)
									.forEach(n => {
										n.order++
									})

								s.nodes[nodeId].parentId = targetParentId
								s.nodes[nodeId].order = targetIndex
							})
						},
					}

					state.history = state.history.slice(0, state.historyIndex + 1)
					state.history.push(command)
					state.historyIndex++
					state.canUndo = true
					state.canRedo = false
				})
			},

			// Node updates
			updateNodeProps: (nodeId, props) => {
				const { nodes } = get()
				const node = nodes[nodeId]
				if (!node) return

				const oldProps = { ...node.props }

				set(state => {
					state.nodes[nodeId].props = { ...state.nodes[nodeId].props, ...props }

					// Add to history (debounced in real implementation)
					const command: Command = {
						type: 'UPDATE_PROPS',
						payload: { nodeId, oldProps, newProps: props },
						undo: () => {
							set(s => {
								s.nodes[nodeId].props = oldProps
							})
						},
						redo: () => {
							set(s => {
								s.nodes[nodeId].props = { ...s.nodes[nodeId].props, ...props }
							})
						},
					}

					state.history = state.history.slice(0, state.historyIndex + 1)
					state.history.push(command)
					state.historyIndex++
					state.canUndo = true
					state.canRedo = false
				})
			},

			updateNodeStyles: (nodeId, styles) => {
				set(state => {
					state.nodes[nodeId].styles = {
						...state.nodes[nodeId].styles,
						...styles,
					}
				})
			},

			updateStyleValue: (nodeId, styleState, property, value) => {
				set(state => {
					if (!state.nodes[nodeId].styles[styleState]) {
						state.nodes[nodeId].styles[styleState] = {}
					}

					const styles = state.nodes[nodeId].styles[styleState]
					if (styles && value === null) {
						delete styles[property]
					} else if (styles && value !== null) {
						styles[property] = value as StyleValue
					}
				})
			},

			// Visual property updates
			updateNodeRotation: (nodeId, rotation) => {
				set(state => {
					if (state.nodes[nodeId]) state.nodes[nodeId].rotation = rotation
				})
			},

			updateNodeZIndex: (nodeId, zIndex) => {
				set(state => {
					if (state.nodes[nodeId]) state.nodes[nodeId].zIndex = zIndex
				})
			},

			updateNodeOpacity: (nodeId, opacity) => {
				set(state => {
					if (state.nodes[nodeId])
						state.nodes[nodeId].opacity = Math.max(0, Math.min(1, opacity))
				})
			},

			toggleNodeLock: nodeId => {
				set(state => {
					if (state.nodes[nodeId])
						state.nodes[nodeId].locked = !state.nodes[nodeId].locked
				})
			},

			toggleNodeVisibility: nodeId => {
				set(state => {
					if (state.nodes[nodeId])
						state.nodes[nodeId].visible = !state.nodes[nodeId].visible
				})
			},

			updateNodeEffects: (nodeId, effects) => {
				set(state => {
					if (state.nodes[nodeId]) state.nodes[nodeId].effects = effects
				})
			},

			updateNodeAnimations: (nodeId, animations) => {
				set(state => {
					if (state.nodes[nodeId]) state.nodes[nodeId].animations = animations
				})
			},

			// Interactions
			addInteraction: (nodeId, interaction) => {
				set(state => {
					const newInteraction: InteractionConfig = {
						...interaction,
						id: generateId(),
						order: state.nodes[nodeId].interactions.length,
					}
					state.nodes[nodeId].interactions.push(newInteraction)
				})
			},

			removeInteraction: (nodeId, interactionId) => {
				set(state => {
					state.nodes[nodeId].interactions = state.nodes[nodeId].interactions
						.filter(i => i.id !== interactionId)
						.map((i, idx) => ({ ...i, order: idx }))
				})
			},

			updateInteraction: (nodeId, interactionId, updates) => {
				set(state => {
					const interaction = state.nodes[nodeId].interactions.find(
						i => i.id === interactionId,
					)
					if (interaction) {
						Object.assign(interaction, updates)
					}
				})
			},

			// Selection
			selectNode: nodeId => {
				set(state => {
					state.selectedNodeId = nodeId
					state.selectedNodeIds = nodeId ? [nodeId] : []
				})
			},

			selectNodes: nodeIds => {
				set(state => {
					state.selectedNodeIds = nodeIds
					state.selectedNodeId =
						nodeIds.length === 1 ? nodeIds[0] : (nodeIds[0] ?? null)
				})
			},

			toggleExpanded: nodeId => {
				set(state => {
					const index = state.expandedNodeIds.indexOf(nodeId)
					if (index === -1) {
						state.expandedNodeIds.push(nodeId)
					} else {
						state.expandedNodeIds.splice(index, 1)
					}
				})
			},

			// Alignment (operates on selectedNodeIds)
			alignNodes: direction => {
				const { selectedNodeIds, nodes } = get()
				if (selectedNodeIds.length < 2) return

				const selected = selectedNodeIds.map(id => nodes[id]).filter(Boolean)
				if (selected.length < 2) return

				set(state => {
					switch (direction) {
						case 'left': {
							const minX = Math.min(...selected.map(n => n.position.x))
							for (const id of selectedNodeIds) {
								if (state.nodes[id]) state.nodes[id].position.x = minX
							}
							break
						}
						case 'center': {
							const centers = selected.map(n => n.position.x + n.size.width / 2)
							const avgCenter =
								centers.reduce((a, b) => a + b, 0) / centers.length
							for (const id of selectedNodeIds) {
								const n = state.nodes[id]
								if (n) n.position.x = Math.round(avgCenter - n.size.width / 2)
							}
							break
						}
						case 'right': {
							const maxRight = Math.max(
								...selected.map(n => n.position.x + n.size.width),
							)
							for (const id of selectedNodeIds) {
								const n = state.nodes[id]
								if (n) n.position.x = maxRight - n.size.width
							}
							break
						}
						case 'top': {
							const minY = Math.min(...selected.map(n => n.position.y))
							for (const id of selectedNodeIds) {
								if (state.nodes[id]) state.nodes[id].position.y = minY
							}
							break
						}
						case 'middle': {
							const middles = selected.map(
								n => n.position.y + n.size.height / 2,
							)
							const avgMiddle =
								middles.reduce((a, b) => a + b, 0) / middles.length
							for (const id of selectedNodeIds) {
								const n = state.nodes[id]
								if (n) n.position.y = Math.round(avgMiddle - n.size.height / 2)
							}
							break
						}
						case 'bottom': {
							const maxBottom = Math.max(
								...selected.map(n => n.position.y + n.size.height),
							)
							for (const id of selectedNodeIds) {
								const n = state.nodes[id]
								if (n) n.position.y = maxBottom - n.size.height
							}
							break
						}
					}
				})
			},

			distributeNodes: axis => {
				const { selectedNodeIds, nodes } = get()
				if (selectedNodeIds.length < 3) return

				const selected = selectedNodeIds.map(id => nodes[id]).filter(Boolean)
				if (selected.length < 3) return

				set(state => {
					if (axis === 'horizontal') {
						const sorted = [...selected].sort(
							(a, b) => a.position.x - b.position.x,
						)
						const first = sorted[0]
						const last = sorted[sorted.length - 1]
						const totalSpan =
							last.position.x + last.size.width - first.position.x
						const totalWidths = sorted.reduce((sum, n) => sum + n.size.width, 0)
						const gap = (totalSpan - totalWidths) / (sorted.length - 1)
						let currentX = first.position.x
						for (const n of sorted) {
							state.nodes[n.id].position.x = Math.round(currentX)
							currentX += n.size.width + gap
						}
					} else {
						const sorted = [...selected].sort(
							(a, b) => a.position.y - b.position.y,
						)
						const first = sorted[0]
						const last = sorted[sorted.length - 1]
						const totalSpan =
							last.position.y + last.size.height - first.position.y
						const totalHeights = sorted.reduce(
							(sum, n) => sum + n.size.height,
							0,
						)
						const gap = (totalSpan - totalHeights) / (sorted.length - 1)
						let currentY = first.position.y
						for (const n of sorted) {
							state.nodes[n.id].position.y = Math.round(currentY)
							currentY += n.size.height + gap
						}
					}
				})
			},

			// Position & Size
			updateNodePosition: (nodeId, position) => {
				set(state => {
					if (state.nodes[nodeId]) {
						state.nodes[nodeId].position = position
					}
				})
			},

			// Multi-move: shift all selected nodes by dx/dy
			moveSelectedNodes: (dx, dy) => {
				const { selectedNodeIds } = get()
				if (selectedNodeIds.length === 0) return
				set(state => {
					for (const id of selectedNodeIds) {
						const n = state.nodes[id]
						if (n && !n.locked) {
							n.position.x = Math.round(n.position.x + dx)
							n.position.y = Math.round(n.position.y + dy)
						}
					}
				})
			},

			// Group operations
			groupNodes: () => {
				const { selectedNodeIds, nodes, currentPageId } = get()
				if (selectedNodeIds.length < 2 || !currentPageId) return null

				const selected = selectedNodeIds.map(id => nodes[id]).filter(Boolean)
				if (selected.length < 2) return null

				// Calculate bounding box of all selected nodes
				const minX = Math.min(...selected.map(n => n.position.x))
				const minY = Math.min(...selected.map(n => n.position.y))
				const maxX = Math.max(...selected.map(n => n.position.x + n.size.width))
				const maxY = Math.max(
					...selected.map(n => n.position.y + n.size.height),
				)

				const groupId = generateId()
				const maxOrder = Math.max(
					...Object.values(nodes)
						.filter(n => n.pageId === currentPageId && n.parentId === null)
						.map(n => n.order),
					0,
				)

				set(state => {
					// Create group node
					state.nodes[groupId] = {
						id: groupId,
						type: 'group',
						parentId: null,
						pageId: currentPageId,
						order: maxOrder + 1,
						props: { label: 'Group' },
						styles: { base: {} },
						interactions: [],
						position: { x: minX, y: minY },
						size: { width: maxX - minX, height: maxY - minY },
						rotation: 0,
						zIndex: Math.max(...selected.map(n => n.zIndex)),
						opacity: 1,
						locked: false,
						visible: true,
						constraints: { horizontal: 'left', vertical: 'top' },
						effects: [],
						animations: [],
					}

					// Move selected nodes into the group, adjusting positions to be relative
					for (let i = 0; i < selectedNodeIds.length; i++) {
						const n = state.nodes[selectedNodeIds[i]]
						if (n) {
							n.parentId = groupId
							n.order = i
							n.position.x -= minX
							n.position.y -= minY
						}
					}

					// Select the group
					state.selectedNodeId = groupId
					state.selectedNodeIds = [groupId]
				})

				return groupId
			},

			ungroupNodes: groupId => {
				const { nodes } = get()
				const group = nodes[groupId]
				if (!group || group.type !== 'group') return

				const children = Object.values(nodes).filter(
					n => n.parentId === groupId,
				)

				set(state => {
					// Move children back to root, restoring absolute positions
					for (const child of children) {
						const n = state.nodes[child.id]
						if (n) {
							n.parentId = group.parentId
							n.position.x += group.position.x
							n.position.y += group.position.y
						}
					}

					// Remove the group node
					delete state.nodes[groupId]

					// Select the former children
					const childIds = children.map(c => c.id)
					state.selectedNodeIds = childIds
					state.selectedNodeId = childIds[0] ?? null
				})
			},

			// Copy/Paste (Phase 2)
			copyNodes: nodeIds => {
				const { nodes } = get()
				const nodesToCopy = nodeIds
					.map(id => nodes[id])
					.filter(Boolean) as ComponentNode[]

				set(state => {
					// Deep clone nodes to clipboard
					state.clipboard = nodesToCopy.map(node => ({
						...node,
						id: generateId(), // New IDs for paste
					}))
				})
			},

			pasteNodes: (offset = { x: 20, y: 20 }) => {
				const { clipboard, currentPageId } = get()
				if (clipboard.length === 0 || !currentPageId) return

				set(state => {
					const newNodeIds: string[] = []

					for (const clipNode of clipboard) {
						const newNode: ComponentNode = {
							...clipNode,
							id: generateId(),
							pageId: currentPageId,
							position: {
								x: clipNode.position.x + offset.x,
								y: clipNode.position.y + offset.y,
							},
						}
						state.nodes[newNode.id] = newNode
						newNodeIds.push(newNode.id)
					}

					// Select newly pasted nodes
					state.selectedNodeIds = newNodeIds
					state.selectedNodeId = newNodeIds[0] ?? null
				})
			},

			duplicateNodes: nodeIds => {
				const { nodes, currentPageId } = get()
				if (!currentPageId) return

				const nodesToDuplicate = nodeIds
					.map(id => nodes[id])
					.filter(Boolean) as ComponentNode[]

				set(state => {
					const newNodeIds: string[] = []

					for (const node of nodesToDuplicate) {
						const newNode: ComponentNode = {
							...node,
							id: generateId(),
							pageId: currentPageId,
							position: {
								x: node.position.x + 20,
								y: node.position.y + 20,
							},
						}
						state.nodes[newNode.id] = newNode
						newNodeIds.push(newNode.id)
					}

					// Select newly duplicated nodes
					state.selectedNodeIds = newNodeIds
					state.selectedNodeId = newNodeIds[0] ?? null
				})
			},

			updateNodeSize: (nodeId, size) => {
				set(state => {
					if (state.nodes[nodeId]) {
						state.nodes[nodeId].size = size
					}
				})
			},

			// Drag & Drop
			startDrag: payload => {
				set(state => {
					state.isDragging = true
					state.dragPayload = payload
				})
			},

			endDrag: () => {
				set(state => {
					state.isDragging = false
					state.dragPayload = null
					state.snapGuides = []
				})
			},

			setSnapGuides: guides => {
				set(state => {
					state.snapGuides = guides
				})
			},

			// History
			undo: () => {
				const { historyIndex, history } = get()
				if (historyIndex < 0) return

				const command = history[historyIndex]
				command.undo()

				set(state => {
					state.historyIndex--
					state.canUndo = state.historyIndex >= 0
					state.canRedo = state.historyIndex < state.history.length - 1
				})
			},

			redo: () => {
				const { historyIndex, history } = get()
				if (historyIndex >= history.length - 1) return

				const command = history[historyIndex + 1]
				command.redo()

				set(state => {
					state.historyIndex++
					state.canUndo = state.historyIndex >= 0
					state.canRedo = state.historyIndex < state.history.length - 1
				})
			},

			// Utils
			getRootNodes: () => {
				const { nodes, currentPageId } = get()
				if (!currentPageId) return []

				return Object.values(nodes)
					.filter(n => n.pageId === currentPageId && n.parentId === null)
					.sort((a, b) => a.order - b.order)
			},

			getChildNodes: parentId => {
				const { nodes, currentPageId } = get()
				if (!currentPageId) return []

				return Object.values(nodes)
					.filter(n => n.pageId === currentPageId && n.parentId === parentId)
					.sort((a, b) => a.order - b.order)
			},

			getNodePath: nodeId => {
				const { nodes } = get()
				const path: ComponentNode[] = []

				let current: ComponentNode | undefined = nodes[nodeId]
				while (current) {
					path.unshift(current)
					current = current.parentId ? nodes[current.parentId] : undefined
				}

				return path
			},
		})),
		{ name: 'CanvasStore' },
	),
)

// Selectors
export const useSelectedNode = () => {
	return useCanvasStore(state =>
		state.selectedNodeId ? state.nodes[state.selectedNodeId] : null,
	)
}

export const useCurrentPage = () => {
	return useCanvasStore(
		state => state.pages.find(p => p.id === state.currentPageId) || null,
	)
}
