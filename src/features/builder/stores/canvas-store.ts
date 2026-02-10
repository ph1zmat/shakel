// Canvas Store - Zustand + Immer для управления состоянием редактора
// Поддержка undo/redo через паттерн Command

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getDefaultProps } from '@/lib/codegen/component-registry';

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
}

export interface StyleConfig {
  base: Record<string, StyleValue>;
  hover?: Record<string, StyleValue>;
  focus?: Record<string, StyleValue>;
  responsive?: {
    sm?: Record<string, StyleValue>;
    md?: Record<string, StyleValue>;
    lg?: Record<string, StyleValue>;
  };
}

export interface StyleValue {
  type: 'token' | 'static';
  tokenType?: 'color' | 'spacing' | 'typography' | 'effect';
  value: string | number;
  unit?: string;
}

export interface InteractionConfig {
  id: string;
  trigger: 'onClick' | 'onSubmit' | 'onHover' | 'onMount' | 'onMessage';
  type: 'NAVIGATE' | 'OPEN_MODAL' | 'TRIGGER_WORKFLOW' | 'SEND_MESSAGE';
  config: Record<string, unknown>;
  order: number;
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
  platform: 'WEB' | 'TELEGRAM_BOT';
  designSystemId: string;
}

// Command для undo/redo
interface Command {
  type: 'ADD_NODE' | 'REMOVE_NODE' | 'MOVE_NODE' | 'UPDATE_PROPS' | 'UPDATE_STYLES' | 'REORDER_NODES';
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
  
  // UI State
  selectedNodeId: string | null;
  expandedNodeIds: string[];
  zoom: number;
  viewport: { x: number; y: number };
  isDragging: boolean;
  dragPayload: { nodeId: string; sourceParentId: string | null; sourceIndex: number } | null;
  
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
  moveNode: (nodeId: string, targetParentId: string | null, targetIndex: number) => void;
  
  // Node updates
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void;
  updateNodeStyles: (nodeId: string, styles: Partial<StyleConfig>) => void;
  updateStyleValue: (nodeId: string, state: 'base' | 'hover' | 'focus', property: string, value: StyleValue | null) => void;
  
  // Interactions
  addInteraction: (nodeId: string, interaction: Omit<InteractionConfig, 'id' | 'order'>) => void;
  removeInteraction: (nodeId: string, interactionId: string) => void;
  updateInteraction: (nodeId: string, interactionId: string, updates: Partial<InteractionConfig>) => void;
  
  // Selection
  selectNode: (nodeId: string | null) => void;
  toggleExpanded: (nodeId: string) => void;
  
  // Drag & Drop
  startDrag: (payload: { nodeId: string; sourceParentId: string | null; sourceIndex: number }) => void;
  endDrag: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  
  // Utils
  getRootNodes: () => ComponentNode[];
  getChildNodes: (parentId: string | null) => ComponentNode[];
  getNodePath: (nodeId: string) => ComponentNode[];
}

// ========================================
// Helpers
// ========================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function createNode(type: string, pageId: string, parentId: string | null, order: number): ComponentNode {
  return {
    id: generateId(),
    type,
    parentId,
    pageId,
    order,
    props: getDefaultProps(type),
    styles: { base: {} },
    interactions: [],
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
      selectedNodeId: null,
      expandedNodeIds: [],
      zoom: 1,
      viewport: { x: 0, y: 0 },
      isDragging: false,
      dragPayload: null,
      history: [],
      historyIndex: -1,
      canUndo: false,
      canRedo: false,
      
      // Project
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
        });
      },
      
      // Node CRUD
      addNode: (type, parentId) => {
        const { currentPageId, nodes } = get();
        if (!currentPageId) throw new Error('No current page');
        
        // Calculate order
        const siblings = Object.values(nodes).filter(
          n => n.pageId === currentPageId && n.parentId === parentId
        );
        const order = siblings.length;
        
        const newNode = createNode(type, currentPageId, parentId, order);
        
        set((state) => {
          state.nodes[newNode.id] = newNode;
          state.selectedNodeId = newNode.id;
          
          // Add to history
          const command: Command = {
            type: 'ADD_NODE',
            payload: { nodeId: newNode.id },
            undo: () => {
              set((s) => {
                delete s.nodes[newNode.id];
                if (s.selectedNodeId === newNode.id) {
                  s.selectedNodeId = null;
                }
              });
            },
            redo: () => {
              set((s) => {
                s.nodes[newNode.id] = newNode;
                s.selectedNodeId = newNode.id;
              });
            },
          };
          
          // Truncate redo history
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
        
        // Collect all descendants
        const collectDescendants = (id: string): string[] => {
          const children = Object.values(nodes).filter(n => n.parentId === id);
          const childIds = children.map(c => c.id);
          const descendantIds = children.flatMap(c => collectDescendants(c.id));
          return [...childIds, ...descendantIds];
        };
        
        const descendants = collectDescendants(nodeId);
        const allIds = [nodeId, ...descendants];
        const snapshot = allIds.map(id => ({ id, node: nodes[id] }));
        
        set((state) => {
          // Remove node and descendants
          allIds.forEach(id => {
            delete state.nodes[id];
          });
          
          // Reorder siblings
          Object.values(state.nodes)
            .filter(n => n.pageId === node.pageId && n.parentId === node.parentId && n.order > node.order)
            .forEach(n => {
              n.order--;
            });
          
          if (state.selectedNodeId && allIds.includes(state.selectedNodeId)) {
            state.selectedNodeId = null;
          }
          
          // Add to history
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
                allIds.forEach(id => {
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
        
        if (sourceParentId === targetParentId && sourceIndex === targetIndex) return;
        
        set((state) => {
          // Reorder source siblings
          Object.values(state.nodes)
            .filter(n => n.pageId === currentPageId && n.parentId === sourceParentId && n.order > sourceIndex)
            .forEach(n => {
              n.order--;
            });
          
          // Reorder target siblings
          Object.values(state.nodes)
            .filter(n => 
              n.pageId === currentPageId && 
              n.parentId === targetParentId && 
              n.order >= targetIndex &&
              n.id !== nodeId
            )
            .forEach(n => {
              n.order++;
            });
          
          // Update node
          state.nodes[nodeId].parentId = targetParentId;
          state.nodes[nodeId].order = targetIndex;
          
          // Add to history
          const command: Command = {
            type: 'MOVE_NODE',
            payload: { nodeId, sourceParentId, sourceIndex, targetParentId, targetIndex },
            undo: () => {
              set((s) => {
                // Restore original positions
                Object.values(s.nodes)
                  .filter(n => n.pageId === currentPageId && n.parentId === targetParentId && n.order > targetIndex)
                  .forEach(n => {
                    n.order--;
                  });
                
                Object.values(s.nodes)
                  .filter(n => n.pageId === currentPageId && n.parentId === sourceParentId && n.order >= sourceIndex)
                  .forEach(n => {
                    n.order++;
                  });
                
                s.nodes[nodeId].parentId = sourceParentId;
                s.nodes[nodeId].order = sourceIndex;
              });
            },
            redo: () => {
              set((s) => {
                Object.values(s.nodes)
                  .filter(n => n.pageId === currentPageId && n.parentId === sourceParentId && n.order > sourceIndex)
                  .forEach(n => {
                    n.order--;
                  });
                
                Object.values(s.nodes)
                  .filter(n => n.pageId === currentPageId && n.parentId === targetParentId && n.order >= targetIndex)
                  .forEach(n => {
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
      
      // Node updates
      updateNodeProps: (nodeId, props) => {
        const { nodes } = get();
        const node = nodes[nodeId];
        if (!node) return;
        
        const oldProps = { ...node.props };
        
        set((state) => {
          state.nodes[nodeId].props = { ...state.nodes[nodeId].props, ...props };
          
          // Add to history (debounced in real implementation)
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
      
      updateNodeStyles: (nodeId, styles) => {
        set((state) => {
          state.nodes[nodeId].styles = { ...state.nodes[nodeId].styles, ...styles };
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
      
      // Interactions
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
            .filter(i => i.id !== interactionId)
            .map((i, idx) => ({ ...i, order: idx }));
        });
      },
      
      updateInteraction: (nodeId, interactionId, updates) => {
        set((state) => {
          const interaction = state.nodes[nodeId].interactions.find(i => i.id === interactionId);
          if (interaction) {
            Object.assign(interaction, updates);
          }
        });
      },
      
      // Selection
      selectNode: (nodeId) => {
        set((state) => {
          state.selectedNodeId = nodeId;
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
      
      // Drag & Drop
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
      
      // History
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
      
      // Utils
      getRootNodes: () => {
        const { nodes, currentPageId } = get();
        if (!currentPageId) return [];
        
        return Object.values(nodes)
          .filter(n => n.pageId === currentPageId && n.parentId === null)
          .sort((a, b) => a.order - b.order);
      },
      
      getChildNodes: (parentId) => {
        const { nodes, currentPageId } = get();
        if (!currentPageId) return [];
        
        return Object.values(nodes)
          .filter(n => n.pageId === currentPageId && n.parentId === parentId)
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
     })),
    { name: 'CanvasStore' }
  )
);

// Selectors
export const useSelectedNode = () => {
  return useCanvasStore((state) => 
    state.selectedNodeId ? state.nodes[state.selectedNodeId] : null
  );
};

export const useCurrentPage = () => {
  return useCanvasStore((state) => 
    state.pages.find(p => p.id === state.currentPageId) || null
  );
};
