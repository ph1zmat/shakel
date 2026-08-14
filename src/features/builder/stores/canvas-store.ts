// Canvas Store v2.0 - Zustand + Immer для управления состоянием редактора
// Поддержка undo/redo через паттерн Command
// Расширенная поддержка Viewport, Multi-select, Code Sync

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getDefaultProps } from '@/lib/codegen/component-registry';
import type {
  BuilderUIState,
  CodeSyncState,
  DnDEngineConfig,
  SelectionState,
  ViewportState,
  ViewportType,
} from '../types';
import { DEFAULT_DND_CONFIG, DEFAULT_VIEWPORT_CONFIG } from '../types';

// ========================================
// Types
// ========================================

export interface ComponentNode {
  id: string;
  type: string;
  parentId: string | null;
  pageId: string;
  order: number;
  props: Record<string, unknown>;
  styles: StyleConfig;
  interactions: InteractionConfig[];
  // v2.0: Positioning mode
  positioning?: {
    mode: 'flow' | 'absolute' | 'fixed';
    x?: number;
    y?: number;
    zIndex?: number;
  };
  // Whether this node can contain other nodes
  isContainer?: boolean;
}

export interface StyleConfig {
  base: Record<string, StyleValue>;
  hover?: Record<string, StyleValue>;
  focus?: Record<string, StyleValue>;
  active?: Record<string, StyleValue>;
  disabled?: Record<string, StyleValue>;
  // v2.0: Extended responsive breakpoints
  responsive?: {
    sm?: Record<string, StyleValue>;
    md?: Record<string, StyleValue>;
    lg?: Record<string, StyleValue>;
    xl?: Record<string, StyleValue>;
    '2xl'?: Record<string, StyleValue>;
  };
  // v2.0: Container queries
  container?: Record<string, Record<string, StyleValue>>;
}

export interface StyleValue {
  type: 'token' | 'static';
  tokenType?: 'color' | 'spacing' | 'typography' | 'effect';
  value: string | number;
  unit?: string;
}

export interface InteractionConfig {
  id: string;
  trigger:
    | 'onClick'
    | 'onSubmit'
    | 'onHover'
    | 'onMount'
    | 'onMessage'
    | 'onChange';
  type:
    | 'NAVIGATE'
    | 'OPEN_MODAL'
    | 'CLOSE_MODAL'
    | 'TRIGGER_WORKFLOW'
    | 'SEND_MESSAGE'
    | 'SET_STATE';
  config: Record<string, unknown>;
  order: number;
  condition?: string; // v2.0: Conditional execution
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  isEntry: boolean;
}

export interface Project {
  id: string;
  name: string;
  platform: 'WEB' | 'TELEGRAM_BOT' | 'MOBILE_APP';
  designSystemId: string;
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
    | 'UPDATE_MULTIPLE';
  payload: unknown;
  undo: () => void;
  redo: () => void;
}

// ========================================
// State Interface
// ========================================

interface CanvasState {
  // Project Data
  project: Project | null;
  pages: Page[];
  currentPageId: string | null;

  // Nodes (normalized)
  nodes: Record<string, ComponentNode>;

  // v2.0: Viewport State
  viewport: ViewportState;

  // v2.0: Multi-selection
  selection: SelectionState;

  // v2.0: Code Sync
  codeSync: CodeSyncState;

  // v2.0: UI State
  ui: BuilderUIState;

  // v2.0: DnD Config
  dndConfig: DnDEngineConfig;

  // Legacy UI State (для совместимости)
  selectedNodeId: string | null;
  expandedNodeIds: string[];
  zoom: number;
  viewportOffset: { x: number; y: number };
  isDragging: boolean;
  dragPayload: {
    nodeId: string;
    sourceParentId: string | null;
    sourceIndex: number;
  } | null;

  // History
  history: Command[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  setProject: (project: Project) => void;
  setPages: (pages: Page[]) => void;
  setCurrentPage: (pageId: string) => void;

  // Node CRUD
  addNode: (type: string, parentId: string | null) => string;
  removeNode: (nodeId: string) => void;
  removeMultipleNodes: (nodeIds: string[]) => void;
  moveNode: (
    nodeId: string,
    targetParentId: string | null,
    targetIndex: number,
  ) => void;
  duplicateNode: (nodeId: string) => string | null;

  // Node updates
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void;
  updateNodeStyles: (
    nodeId: string,
    styles: Partial<StyleConfig>,
    viewport?: 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  ) => void;
  updateStyleValue: (
    nodeId: string,
    state: 'base' | 'hover' | 'focus',
    property: string,
    value: StyleValue | null,
  ) => void;
  updateResponsiveStyle: (
    nodeId: string,
    breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl',
    property: string,
    value: StyleValue | null,
  ) => void;

  // Interactions
  addInteraction: (
    nodeId: string,
    interaction: Omit<InteractionConfig, 'id' | 'order'>,
  ) => void;
  removeInteraction: (nodeId: string, interactionId: string) => void;
  updateInteraction: (
    nodeId: string,
    interactionId: string,
    updates: Partial<InteractionConfig>,
  ) => void;

  // Selection (Legacy + v2.0)
  selectNode: (nodeId: string | null) => void;
  toggleNodeSelection: (nodeId: string, multi?: boolean) => void;
  selectMultipleNodes: (nodeIds: string[]) => void;
  clearSelection: () => void;
  startSelectionBox: (point: { x: number; y: number }) => void;
  updateSelectionBox: (point: { x: number; y: number }) => void;
  endSelectionBox: () => void;
  toggleExpanded: (nodeId: string) => void;

  // Viewport Actions
  setActiveViewport: (viewport: ViewportType) => void;
  setDisplayMode: (mode: ViewportState['displayMode']) => void;
  toggleViewportVisibility: (viewport: ViewportType) => void;
  setViewportScale: (viewport: ViewportType, scale: number) => void;
  toggleSyncViewports: () => void;

  // Code Sync Actions
  setCodeEditorMode: (mode: CodeSyncState['mode']) => void;
  updateGeneratedCode: (code: string) => void;
  markSynced: (source: 'canvas' | 'editor') => void;

  // UI Actions
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  setActiveLeftTab: (tab: BuilderUIState['activeLeftTab']) => void;
  setActiveRightTab: (tab: BuilderUIState['activeRightTab']) => void;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  toggleGrid: () => void;
  toggleRulers: () => void;
  toggleSnapToGrid: () => void;

  // Drag & Drop
  startDrag: (payload: {
    nodeId: string;
    sourceParentId: string | null;
    sourceIndex: number;
  }) => void;
  endDrag: () => void;

  // History
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // Utils
  getRootNodes: () => ComponentNode[];
  getChildNodes: (parentId: string | null) => ComponentNode[];
  getNodePath: (nodeId: string) => ComponentNode[];
  getSelectedNodes: () => ComponentNode[];
  canMoveTo: (nodeId: string, targetParentId: string | null) => boolean;
}

// ========================================
// Helpers
// ========================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function createNode(
  type: string,
  pageId: string,
  parentId: string | null,
  order: number,
): ComponentNode {
  return {
    id: generateId(),
    type,
    parentId,
    pageId,
    order,
    props: getDefaultProps(type),
    styles: { base: {} },
    interactions: [],
    positioning: { mode: 'flow' },
  };
}

function cloneNode(node: ComponentNode, newPageId?: string): ComponentNode {
  return {
    ...node,
    id: generateId(),
    pageId: newPageId || node.pageId,
    interactions: node.interactions.map((i) => ({ ...i, id: generateId() })),
  };
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

      // v2.0: Viewport
      viewport: DEFAULT_VIEWPORT_CONFIG,

      // v2.0: Selection
      selection: {
        selectedIds: [],
        lastSelectedId: null,
        selectionBox: {
          start: null,
          end: null,
          isSelecting: false,
        },
      },

      // v2.0: Code Sync
      codeSync: {
        mode: 'design',
        isSynced: true,
        lastEditSource: null,
        lastEditTime: null,
        generatedCode: '',
        sourceMap: new Map(),
      },

      // v2.0: UI State
      ui: {
        leftPanelOpen: true,
        rightPanelOpen: true,
        bottomPanelOpen: false,
        activeLeftTab: 'components',
        activeRightTab: 'properties',
        zoom: 1,
        showGrid: true,
        showRulers: false,
        snapToGrid: true,
        aiPanelOpen: false,
        aiCommandInput: '',
      },

      // v2.0: DnD Config
      dndConfig: DEFAULT_DND_CONFIG,

      // Legacy UI State
      selectedNodeId: null,
      expandedNodeIds: [],
      zoom: 1,
      viewportOffset: { x: 0, y: 0 },
      isDragging: false,
      dragPayload: null,

      // History
      history: [],
      historyIndex: -1,
      canUndo: false,
      canRedo: false,

      // ========================================
      // Project Actions
      // ========================================

      setProject: (project) => {
        set((state) => {
          state.project = project;
        });
      },

      setPages: (pages) => {
        set((state) => {
          state.pages = pages;
          if (pages.length > 0 && !state.currentPageId) {
            state.currentPageId = pages[0].id;
          }
        });
      },

      setCurrentPage: (pageId) => {
        set((state) => {
          state.currentPageId = pageId;
          state.selectedNodeId = null;
          state.selection.selectedIds = [];
        });
      },

      // ========================================
      // Node CRUD
      // ========================================

      addNode: (type, parentId) => {
        const { currentPageId, nodes } = get();
        if (!currentPageId) throw new Error('No current page');

        const siblings = Object.values(nodes).filter(
          (n) => n.pageId === currentPageId && n.parentId === parentId,
        );
        const order = siblings.length;

        const newNode = createNode(type, currentPageId, parentId, order);

        set((state) => {
          state.nodes[newNode.id] = newNode;
          state.selectedNodeId = newNode.id;
          state.selection.selectedIds = [newNode.id];
          state.selection.lastSelectedId = newNode.id;

          const command: Command = {
            type: 'ADD_NODE',
            payload: { nodeId: newNode.id },
            undo: () => {
              set((s) => {
                delete s.nodes[newNode.id];
                if (s.selectedNodeId === newNode.id) {
                  s.selectedNodeId = null;
                }
                s.selection.selectedIds = s.selection.selectedIds.filter(
                  (id) => id !== newNode.id,
                );
              });
            },
            redo: () => {
              set((s) => {
                s.nodes[newNode.id] = newNode;
                s.selectedNodeId = newNode.id;
                s.selection.selectedIds = [newNode.id];
              });
            },
          };

          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(command);
          state.historyIndex++;
          state.canUndo = true;
          state.canRedo = false;
        });

        return newNode.id;
      },

      removeNode: (nodeId) => {
        const { nodes } = get();
        const node = nodes[nodeId];
        if (!node) return;

        const collectDescendants = (id: string): string[] => {
          const children = Object.values(nodes).filter(
            (n) => n.parentId === id,
          );
          const childIds = children.map((c) => c.id);
          const descendantIds = children.flatMap((c) =>
            collectDescendants(c.id),
          );
          return [...childIds, ...descendantIds];
        };

        const descendants = collectDescendants(nodeId);
        const allIds = [nodeId, ...descendants];
        const snapshot = allIds.map((id) => ({ id, node: nodes[id] }));

        set((state) => {
          allIds.forEach((id) => {
            delete state.nodes[id];
          });

          Object.values(state.nodes)
            .filter(
              (n) =>
                n.pageId === node.pageId &&
                n.parentId === node.parentId &&
                n.order > node.order,
            )
            .forEach((n) => {
              n.order--;
            });

          if (state.selectedNodeId && allIds.includes(state.selectedNodeId)) {
            state.selectedNodeId = null;
          }
          state.selection.selectedIds = state.selection.selectedIds.filter(
            (id) => !allIds.includes(id),
          );

          const command: Command = {
            type: 'REMOVE_NODE',
            payload: { ids: allIds },
            undo: () => {
              set((s) => {
                snapshot.forEach(({ id, node }) => {
                  s.nodes[id] = node;
                });
              });
            },
            redo: () => {
              set((s) => {
                allIds.forEach((id) => {
                  delete s.nodes[id];
                });
              });
            },
          };

          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(command);
          state.historyIndex++;
          state.canUndo = true;
          state.canRedo = false;
        });
      },

      removeMultipleNodes: (nodeIds) => {
        const { nodes } = get();
        const snapshots: { id: string; node: ComponentNode }[] = [];

        nodeIds.forEach((nodeId) => {
          const node = nodes[nodeId];
          if (node) {
            const collectDescendants = (id: string): string[] => {
              const children = Object.values(nodes).filter(
                (n) => n.parentId === id,
              );
              return children.flatMap((c) => [
                c.id,
                ...collectDescendants(c.id),
              ]);
            };
            snapshots.push({ id: nodeId, node });
            collectDescendants(nodeId).forEach((id) => {
              if (nodes[id]) snapshots.push({ id, node: nodes[id] });
            });
          }
        });

        const allIds = snapshots.map((s) => s.id);

        set((state) => {
          allIds.forEach((id) => {
            delete state.nodes[id];
          });

          state.selectedNodeId = null;
          state.selection.selectedIds = [];

          const command: Command = {
            type: 'REMOVE_NODE',
            payload: { ids: allIds },
            undo: () => {
              set((s) => {
                snapshots.forEach(({ id, node }) => {
                  s.nodes[id] = node;
                });
              });
            },
            redo: () => {
              set((s) => {
                allIds.forEach((id) => {
                  delete s.nodes[id];
                });
              });
            },
          };

          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(command);
          state.historyIndex++;
          state.canUndo = true;
          state.canRedo = false;
        });
      },

      moveNode: (nodeId, targetParentId, targetIndex) => {
        const { nodes, currentPageId } = get();
        const node = nodes[nodeId];
        if (!node || !currentPageId) return;

        const sourceParentId = node.parentId;
        const sourceIndex = node.order;

        if (sourceParentId === targetParentId && sourceIndex === targetIndex)
          return;

        set((state) => {
          Object.values(state.nodes)
            .filter(
              (n) =>
                n.pageId === currentPageId &&
                n.parentId === sourceParentId &&
                n.order > sourceIndex,
            )
            .forEach((n) => {
              n.order--;
            });

          Object.values(state.nodes)
            .filter(
              (n) =>
                n.pageId === currentPageId &&
                n.parentId === targetParentId &&
                n.order >= targetIndex &&
                n.id !== nodeId,
            )
            .forEach((n) => {
              n.order++;
            });

          state.nodes[nodeId].parentId = targetParentId;
          state.nodes[nodeId].order = targetIndex;

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
              set((s) => {
                Object.values(s.nodes)
                  .filter(
                    (n) =>
                      n.pageId === currentPageId &&
                      n.parentId === targetParentId &&
                      n.order > targetIndex,
                  )
                  .forEach((n) => {
                    n.order--;
                  });

                Object.values(s.nodes)
                  .filter(
                    (n) =>
                      n.pageId === currentPageId &&
                      n.parentId === sourceParentId &&
                      n.order >= sourceIndex,
                  )
                  .forEach((n) => {
                    n.order++;
                  });

                s.nodes[nodeId].parentId = sourceParentId;
                s.nodes[nodeId].order = sourceIndex;
              });
            },
            redo: () => {
              set((s) => {
                Object.values(s.nodes)
                  .filter(
                    (n) =>
                      n.pageId === currentPageId &&
                      n.parentId === sourceParentId &&
                      n.order > sourceIndex,
                  )
                  .forEach((n) => {
                    n.order--;
                  });

                Object.values(s.nodes)
                  .filter(
                    (n) =>
                      n.pageId === currentPageId &&
                      n.parentId === targetParentId &&
                      n.order >= targetIndex,
                  )
                  .forEach((n) => {
                    n.order++;
                  });

                s.nodes[nodeId].parentId = targetParentId;
                s.nodes[nodeId].order = targetIndex;
              });
            },
          };

          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(command);
          state.historyIndex++;
          state.canUndo = true;
          state.canRedo = false;
        });
      },

      duplicateNode: (nodeId) => {
        const { nodes, currentPageId } = get();
        const node = nodes[nodeId];
        if (!node || !currentPageId) return null;

        // Clone the node with new ID
        const newNode = cloneNode(node);

        // Find next order
        const siblings = Object.values(nodes).filter(
          (n) => n.pageId === currentPageId && n.parentId === node.parentId,
        );
        newNode.order = node.order + 1;

        // Increment order of siblings after the insertion point
        set((state) => {
          Object.values(state.nodes)
            .filter(
              (n) =>
                n.pageId === currentPageId &&
                n.parentId === node.parentId &&
                n.order > node.order,
            )
            .forEach((n) => {
              n.order++;
            });

          state.nodes[newNode.id] = newNode;
          state.selectedNodeId = newNode.id;
          state.selection.selectedIds = [newNode.id];
          state.selection.lastSelectedId = newNode.id;

          const command: Command = {
            type: 'ADD_NODE',
            payload: { nodeId: newNode.id },
            undo: () => {
              set((s) => {
                delete s.nodes[newNode.id];
                if (s.selectedNodeId === newNode.id) {
                  s.selectedNodeId = null;
                }
                s.selection.selectedIds = s.selection.selectedIds.filter(
                  (id) => id !== newNode.id,
                );

                Object.values(s.nodes)
                  .filter(
                    (n) =>
                      n.pageId === currentPageId &&
                      n.parentId === node.parentId &&
                      n.order > node.order + 1,
                  )
                  .forEach((n) => {
                    n.order--;
                  });
              });
            },
            redo: () => {
              set((s) => {
                s.nodes[newNode.id] = newNode;
                s.selectedNodeId = newNode.id;
                s.selection.selectedIds = [newNode.id];

                Object.values(s.nodes)
                  .filter(
                    (n) =>
                      n.pageId === currentPageId &&
                      n.parentId === node.parentId &&
                      n.order > node.order,
                  )
                  .forEach((n) => {
                    n.order++;
                  });
              });
            },
          };

          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(command);
          state.historyIndex++;
          state.canUndo = true;
          state.canRedo = false;
        });

        return newNode.id;
      },

      // ========================================
      // Node Updates
      // ========================================

      updateNodeProps: (nodeId, props) => {
        const { nodes } = get();
        const node = nodes[nodeId];
        if (!node) return;

        const oldProps = { ...node.props };

        set((state) => {
          state.nodes[nodeId].props = {
            ...state.nodes[nodeId].props,
            ...props,
          };

          const command: Command = {
            type: 'UPDATE_PROPS',
            payload: { nodeId, oldProps, newProps: props },
            undo: () => {
              set((s) => {
                s.nodes[nodeId].props = oldProps;
              });
            },
            redo: () => {
              set((s) => {
                s.nodes[nodeId].props = { ...s.nodes[nodeId].props, ...props };
              });
            },
          };

          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(command);
          state.historyIndex++;
          state.canUndo = true;
          state.canRedo = false;
        });
      },

      updateNodeStyles: (nodeId, styles, viewport = 'base') => {
        set((state) => {
          if (viewport === 'base') {
            state.nodes[nodeId].styles = {
              ...state.nodes[nodeId].styles,
              ...styles,
            };
          } else {
            if (!state.nodes[nodeId].styles.responsive) {
              state.nodes[nodeId].styles.responsive = {};
            }
            state.nodes[nodeId].styles.responsive![viewport] = {
              ...state.nodes[nodeId].styles.responsive![viewport],
              ...styles.base,
            };
          }
        });
      },

      updateStyleValue: (nodeId, styleState, property, value) => {
        set((state) => {
          if (!state.nodes[nodeId].styles[styleState]) {
            state.nodes[nodeId].styles[styleState] = {};
          }

          if (value === null) {
            delete state.nodes[nodeId].styles[styleState]![property];
          } else {
            state.nodes[nodeId].styles[styleState]![property] = value;
          }
        });
      },

      updateResponsiveStyle: (nodeId, breakpoint, property, value) => {
        set((state) => {
          if (!state.nodes[nodeId].styles.responsive) {
            state.nodes[nodeId].styles.responsive = {};
          }
          if (!state.nodes[nodeId].styles.responsive[breakpoint]) {
            state.nodes[nodeId].styles.responsive[breakpoint] = {};
          }

          if (value === null) {
            delete state.nodes[nodeId].styles.responsive[breakpoint]![property];
          } else {
            state.nodes[nodeId].styles.responsive[breakpoint]![property] =
              value;
          }
        });
      },

      // ========================================
      // Interactions
      // ========================================

      addInteraction: (nodeId, interaction) => {
        set((state) => {
          const newInteraction: InteractionConfig = {
            ...interaction,
            id: generateId(),
            order: state.nodes[nodeId].interactions.length,
          };
          state.nodes[nodeId].interactions.push(newInteraction);
        });
      },

      removeInteraction: (nodeId, interactionId) => {
        set((state) => {
          state.nodes[nodeId].interactions = state.nodes[nodeId].interactions
            .filter((i) => i.id !== interactionId)
            .map((i, idx) => ({ ...i, order: idx }));
        });
      },

      updateInteraction: (nodeId, interactionId, updates) => {
        set((state) => {
          const interaction = state.nodes[nodeId].interactions.find(
            (i) => i.id === interactionId,
          );
          if (interaction) {
            Object.assign(interaction, updates);
          }
        });
      },

      // ========================================
      // Selection
      // ========================================

      selectNode: (nodeId) => {
        set((state) => {
          state.selectedNodeId = nodeId;
          state.selection.selectedIds = nodeId ? [nodeId] : [];
          state.selection.lastSelectedId = nodeId;
        });
      },

      toggleNodeSelection: (nodeId, multi = false) => {
        set((state) => {
          if (multi) {
            const index = state.selection.selectedIds.indexOf(nodeId);
            if (index === -1) {
              state.selection.selectedIds.push(nodeId);
              state.selection.lastSelectedId = nodeId;
            } else {
              state.selection.selectedIds.splice(index, 1);
            }
            state.selectedNodeId = state.selection.lastSelectedId;
          } else {
            state.selection.selectedIds = [nodeId];
            state.selectedNodeId = nodeId;
            state.selection.lastSelectedId = nodeId;
          }
        });
      },

      selectMultipleNodes: (nodeIds) => {
        set((state) => {
          state.selection.selectedIds = nodeIds;
          state.selectedNodeId =
            nodeIds.length > 0 ? nodeIds[nodeIds.length - 1] : null;
          state.selection.lastSelectedId = state.selectedNodeId;
        });
      },

      clearSelection: () => {
        set((state) => {
          state.selectedNodeId = null;
          state.selection.selectedIds = [];
          state.selection.lastSelectedId = null;
        });
      },

      startSelectionBox: (point) => {
        set((state) => {
          state.selection.selectionBox.start = point;
          state.selection.selectionBox.end = point;
          state.selection.selectionBox.isSelecting = true;
        });
      },

      updateSelectionBox: (point) => {
        set((state) => {
          state.selection.selectionBox.end = point;
        });
      },

      endSelectionBox: () => {
        set((state) => {
          state.selection.selectionBox.isSelecting = false;
          state.selection.selectionBox.start = null;
          state.selection.selectionBox.end = null;
        });
      },

      toggleExpanded: (nodeId) => {
        set((state) => {
          const index = state.expandedNodeIds.indexOf(nodeId);
          if (index === -1) {
            state.expandedNodeIds.push(nodeId);
          } else {
            state.expandedNodeIds.splice(index, 1);
          }
        });
      },

      // ========================================
      // Viewport Actions
      // ========================================

      setActiveViewport: (viewportType) => {
        set((state) => {
          state.viewport.activeViewport = viewportType;
        });
      },

      setDisplayMode: (mode) => {
        set((state) => {
          state.viewport.displayMode = mode;
          // Auto-adjust visibility based on mode
          if (mode === 'single') {
            Object.keys(state.viewport.viewports).forEach((key) => {
              state.viewport.viewports[key as ViewportType].visible =
                key === state.viewport.activeViewport;
            });
          } else if (mode === 'triple') {
            Object.keys(state.viewport.viewports).forEach((key) => {
              state.viewport.viewports[key as ViewportType].visible = true;
            });
          }
        });
      },

      toggleViewportVisibility: (viewport) => {
        set((state) => {
          state.viewport.viewports[viewport].visible =
            !state.viewport.viewports[viewport].visible;
        });
      },

      setViewportScale: (viewport, scale) => {
        set((state) => {
          state.viewport.viewports[viewport].scale = Math.max(
            0.2,
            Math.min(2, scale),
          );
        });
      },

      toggleSyncViewports: () => {
        set((state) => {
          state.viewport.syncViewports = !state.viewport.syncViewports;
        });
      },

      // ========================================
      // Code Sync Actions
      // ========================================

      setCodeEditorMode: (mode) => {
        set((state) => {
          state.codeSync.mode = mode;
        });
      },

      updateGeneratedCode: (code) => {
        set((state) => {
          state.codeSync.generatedCode = code;
        });
      },

      markSynced: (source) => {
        set((state) => {
          state.codeSync.isSynced = true;
          state.codeSync.lastEditSource = source;
          state.codeSync.lastEditTime = Date.now();
        });
      },

      // ========================================
      // UI Actions
      // ========================================

      toggleLeftPanel: () => {
        set((state) => {
          state.ui.leftPanelOpen = !state.ui.leftPanelOpen;
        });
      },

      toggleRightPanel: () => {
        set((state) => {
          state.ui.rightPanelOpen = !state.ui.rightPanelOpen;
        });
      },

      toggleBottomPanel: () => {
        set((state) => {
          state.ui.bottomPanelOpen = !state.ui.bottomPanelOpen;
        });
      },

      setActiveLeftTab: (tab) => {
        set((state) => {
          state.ui.activeLeftTab = tab;
        });
      },

      setActiveRightTab: (tab) => {
        set((state) => {
          state.ui.activeRightTab = tab;
        });
      },

      setZoom: (zoom) => {
        set((state) => {
          state.ui.zoom = Math.max(0.1, Math.min(3, zoom));
          state.zoom = state.ui.zoom;
        });
      },

      resetZoom: () => {
        set((state) => {
          state.ui.zoom = 1;
          state.zoom = 1;
        });
      },

      toggleGrid: () => {
        set((state) => {
          state.ui.showGrid = !state.ui.showGrid;
        });
      },

      toggleRulers: () => {
        set((state) => {
          state.ui.showRulers = !state.ui.showRulers;
        });
      },

      toggleSnapToGrid: () => {
        set((state) => {
          state.ui.snapToGrid = !state.ui.snapToGrid;
        });
      },

      // ========================================
      // Drag & Drop
      // ========================================

      startDrag: (payload) => {
        set((state) => {
          state.isDragging = true;
          state.dragPayload = payload;
        });
      },

      endDrag: () => {
        set((state) => {
          state.isDragging = false;
          state.dragPayload = null;
        });
      },

      // ========================================
      // History
      // ========================================

      undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex < 0) return;

        const command = history[historyIndex];
        command.undo();

        set((state) => {
          state.historyIndex--;
          state.canUndo = state.historyIndex >= 0;
          state.canRedo = state.historyIndex < state.history.length - 1;
        });
      },

      redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex >= history.length - 1) return;

        const command = history[historyIndex + 1];
        command.redo();

        set((state) => {
          state.historyIndex++;
          state.canUndo = state.historyIndex >= 0;
          state.canRedo = state.historyIndex < state.history.length - 1;
        });
      },

      clearHistory: () => {
        set((state) => {
          state.history = [];
          state.historyIndex = -1;
          state.canUndo = false;
          state.canRedo = false;
        });
      },

      // ========================================
      // Utils
      // ========================================

      getRootNodes: () => {
        const { nodes, currentPageId } = get();
        if (!currentPageId) return [];

        return Object.values(nodes)
          .filter((n) => n.pageId === currentPageId && n.parentId === null)
          .sort((a, b) => a.order - b.order);
      },

      getChildNodes: (parentId) => {
        const { nodes, currentPageId } = get();
        if (!currentPageId) return [];

        return Object.values(nodes)
          .filter((n) => n.pageId === currentPageId && n.parentId === parentId)
          .sort((a, b) => a.order - b.order);
      },

      getNodePath: (nodeId) => {
        const { nodes } = get();
        const path: ComponentNode[] = [];

        let current: ComponentNode | undefined = nodes[nodeId];
        while (current) {
          path.unshift(current);
          current = current.parentId ? nodes[current.parentId] : undefined;
        }

        return path;
      },

      getSelectedNodes: () => {
        const { nodes, selection } = get();
        return selection.selectedIds.map((id) => nodes[id]).filter(Boolean);
      },

      canMoveTo: (nodeId, targetParentId) => {
        const { nodes } = get();
        const node = nodes[nodeId];
        if (!node) return false;

        // Cannot move to itself
        if (nodeId === targetParentId) return false;

        // Cannot move to its own descendant
        let current = targetParentId ? nodes[targetParentId] : null;
        while (current) {
          if (current.id === nodeId) return false;
          current = current.parentId ? nodes[current.parentId] : null;
        }

        return true;
      },
    })),
    { name: 'CanvasStore' },
  ),
);

// ========================================
// Selectors
// ========================================

export const useSelectedNode = () => {
  return useCanvasStore((state) =>
    state.selectedNodeId ? state.nodes[state.selectedNodeId] : null,
  );
};

export const useCurrentPage = () => {
  return useCanvasStore(
    (state) => state.pages.find((p) => p.id === state.currentPageId) || null,
  );
};

export const useSelectedNodes = () => {
  return useCanvasStore((state) =>
    state.selection.selectedIds.map((id) => state.nodes[id]).filter(Boolean),
  );
};

export const useActiveViewport = () => {
  return useCanvasStore((state) => state.viewport.activeViewport);
};

export const useViewportConfig = (type: ViewportType) => {
  return useCanvasStore((state) => state.viewport.viewports[type]);
};

export const useIsMultiSelect = () => {
  return useCanvasStore((state) => state.selection.selectedIds.length > 1);
};
