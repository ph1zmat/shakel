// ========================================
// Visual Builder Types v2.0
// ========================================

import type {
  ComponentNode,
  InteractionConfig,
  StyleConfig,
  StyleValue,
} from '../stores/canvas-store';

// ========================================
// Viewport System
// ========================================

export type ViewportType = 'mobile' | 'tablet' | 'desktop';

export interface ViewportConfig {
  width: number;
  height: number;
  scale: number;
  visible: boolean;
  deviceFrame: string; // 'iphone', 'ipad', 'desktop'
  label: string;
}

export interface ViewportState {
  // Текущий активный viewport для редактирования
  activeViewport: ViewportType;
  // Режим отображения
  displayMode: 'single' | 'side-by-side' | 'triple' | 'fluid';
  // Синхронное редактирование всех viewport'ов
  syncViewports: boolean;
  // Конфигурация каждого viewport
  viewports: Record<ViewportType, ViewportConfig>;
}

export interface BreakpointConfig {
  xs: number; // 0 - Mobile first
  sm: number; // 640px - Large phones
  md: number; // 768px - Tablets
  lg: number; // 1024px - Small laptops
  xl: number; // 1280px - Desktops
  '2xl': number; // 1536px - Large screens
}

export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const DEFAULT_VIEWPORT_CONFIG: ViewportState = {
  activeViewport: 'desktop',
  displayMode: 'single',
  syncViewports: false,
  viewports: {
    mobile: {
      width: 375,
      height: 812,
      scale: 0.85,
      visible: true,
      deviceFrame: 'iphone',
      label: 'iPhone 14',
    },
    tablet: {
      width: 768,
      height: 1024,
      scale: 0.7,
      visible: true,
      deviceFrame: 'ipad',
      label: 'iPad Mini',
    },
    desktop: {
      width: 1280,
      height: 800,
      scale: 0.6,
      visible: true,
      deviceFrame: 'desktop',
      label: 'Desktop',
    },
  },
};

// ========================================
// Extended Responsive Styles
// ========================================

export interface ResponsiveStyleConfig extends StyleConfig {
  responsive?: {
    sm?: Record<string, StyleValue>;
    md?: Record<string, StyleValue>;
    lg?: Record<string, StyleValue>;
    xl?: Record<string, StyleValue>;
    '2xl'?: Record<string, StyleValue>;
  };
  container?: {
    [key: string]: Record<string, StyleValue>; // '@container (min-width: 400px)'
  };
  device?: {
    touch?: Record<string, StyleValue>;
    hover?: Record<string, StyleValue>;
    reducedMotion?: Record<string, StyleValue>;
  };
}

export interface ViewportStyleDiff {
  property: string;
  baseValue?: StyleValue;
  mobileValue?: StyleValue;
  tabletValue?: StyleValue;
  desktopValue?: StyleValue;
  hasDiff: boolean;
}

// ========================================
// Node Positioning Modes
// ========================================

export type PositioningMode = 'flow' | 'absolute' | 'fixed';

export interface NodePositioning {
  mode: PositioningMode;
  // Для flow режима
  flow?: {
    order: number;
    span: 'full' | 'auto' | number;
    alignSelf: 'auto' | 'start' | 'center' | 'end' | 'stretch';
  };
  // Для absolute режима
  absolute?: {
    x: number;
    y: number;
    width: number | 'auto';
    height: number | 'auto';
    zIndex: number;
  };
  // Constraints как в Figma
  constraints?: {
    horizontal: 'left' | 'right' | 'center' | 'stretch' | 'scale' | 'fixed';
    vertical: 'top' | 'bottom' | 'center' | 'stretch' | 'scale' | 'fixed';
  };
}

// ========================================
// DnD Engine
// ========================================

export interface DnDEngineConfig {
  autoScroll: {
    enabled: boolean;
    threshold: number;
    speed: number;
  };
  snapping: {
    enabled: boolean;
    grid: number;
    spacing: number;
    smartGuides: {
      edges: boolean;
      centers: boolean;
      spacing: boolean;
      threshold: number;
    };
  };
  dropZones: {
    highlight: boolean;
    expandOnHover: boolean;
    nested: boolean;
  };
}

export const DEFAULT_DND_CONFIG: DnDEngineConfig = {
  autoScroll: {
    enabled: true,
    threshold: 50,
    speed: 20,
  },
  snapping: {
    enabled: true,
    grid: 8,
    spacing: 16,
    smartGuides: {
      edges: true,
      centers: true,
      spacing: true,
      threshold: 5,
    },
  },
  dropZones: {
    highlight: true,
    expandOnHover: true,
    nested: true,
  },
};

// ========================================
// Multi-Select
// ========================================

export interface SelectionState {
  selectedIds: string[];
  lastSelectedId: string | null;
  selectionBox: {
    start: { x: number; y: number } | null;
    end: { x: number; y: number } | null;
    isSelecting: boolean;
  };
}

// ========================================
// Code Sync
// ========================================

export type CodeEditorMode = 'design' | 'split' | 'code';

export interface CodeSyncState {
  mode: CodeEditorMode;
  isSynced: boolean;
  lastEditSource: 'canvas' | 'editor' | null;
  lastEditTime: number | null;
  generatedCode: string;
  sourceMap: Map<string, CodeRange>; // nodeId -> code range
}

export interface CodeRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface ASTChange {
  type: 'add' | 'remove' | 'update' | 'move';
  nodeId: string;
  parentId: string | null;
  index: number;
  properties?: Record<string, unknown>;
}

// ========================================
// AI Integration
// ========================================

export type AIGenerationMode =
  | 'from-scratch'
  | 'component'
  | 'animate'
  | 'responsive'
  | 'refactor'
  | 'content';

export interface AIAssistantConfig {
  id: string;
  name: string;
  command: string;
  description: string;
  icon: string;
}

export const AI_ASSISTANTS: AIAssistantConfig[] = [
  {
    id: 'layout',
    name: 'Layout AI',
    command: '/layout',
    description: 'Генерация секций и лейаутов',
    icon: 'Layout',
  },
  {
    id: 'style',
    name: 'Style AI',
    command: '/style',
    description: 'Применение design tokens',
    icon: 'Palette',
  },
  {
    id: 'animate',
    name: 'Animation AI',
    command: '/animate',
    description: 'Добавление анимаций',
    icon: 'Sparkles',
  },
  {
    id: 'content',
    name: 'Content AI',
    command: '/content',
    description: 'Генерация текста',
    icon: 'FileText',
  },
  {
    id: 'responsive',
    name: 'Responsive AI',
    command: '/responsive',
    description: 'Оптимизация для мобильных',
    icon: 'Smartphone',
  },
  {
    id: 'refactor',
    name: 'Refactor AI',
    command: '/refactor',
    description: 'Оптимизация кода',
    icon: 'Code',
  },
];

export interface AIGenerationResult {
  canvasNodes: ComponentNode[];
  tsxCode: string;
  sourceMap: Map<string, CodeRange>;
  explanation: string;
  followUp: string[];
}

// ========================================
// Performance
// ========================================

export type LODLevel = 'full' | 'simplified' | 'wireframe';

export interface CanvasVirtualizationConfig {
  enabled: boolean;
  visibleNodeIds: Set<string>;
  lod: LODLevel;
}

export interface OptimizationConfig {
  nodeMemoization: {
    props: 'shallow' | 'deep';
    styles: 'shallow' | 'deep';
    children: 'reference' | 'deep';
  };
  codeGenCache: {
    enabled: boolean;
    maxSize: string;
    ttl: string;
  };
  historyOptimization: {
    maxStackSize: number;
    compressRepeating: boolean;
    debounceMs: number;
  };
}

// ========================================
// Builder UI State
// ========================================

export interface BuilderUIState {
  // Панели
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  activeLeftTab: 'components' | 'layers' | 'pages';
  activeRightTab: 'properties' | 'styles' | 'interactions' | 'ai';

  // Canvas
  zoom: number;
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;

  // AI Panel
  aiPanelOpen: boolean;
  aiCommandInput: string;
}

// ========================================
// Export Types
// ========================================

export interface ExportConfig {
  format: 'nextjs' | 'react' | 'static';
  includeDependencies: boolean;
  minify: boolean;
  targetPath?: string;
}
