# 📋 ПЛАН: Идеальный Visual Builder для Shakel

> Дата создания: 2026-02-16  
> Статус: Концепт / Roadmap

---

## 🎯 Архитектура: 5 Ключевых Направлений

```
┌─────────────────────────────────────────────────────────────┐
│                    VISUAL BUILDER v2.0                      │
├─────────────┬─────────────┬─────────────┬───────────────────┤
│  RESPONSIVE │   DRAG &    │  CODE SYNC  │   AI INTEGRATION  │
│   SYSTEM    │    DROP     │             │                   │
├─────────────┴─────────────┴─────────────┴───────────────────┤
│                  PERFORMANCE & UX LAYER                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. 🖥️ УЛЬТИМАТИВНАЯ АДАПТИВНОСТЬ (Responsive System)

### 1.1 Мульти-Viewport Canvas

```typescript
// Новая архитектура Viewport
interface ViewportState {
  // Текущий активный viewport для редактирования
  activeViewport: 'mobile' | 'tablet' | 'desktop';
  
  // Синхронное отображение всех viewport'ов
  showAllViewports: boolean;
  
  // Конфигурация каждого viewport
  viewports: {
    mobile:  { width: 375,  height: 812,  scale: 0.5, visible: true };
    tablet:  { width: 768,  height: 1024, scale: 0.4, visible: true };
    desktop: { width: 1280, height: 800,  scale: 0.3, visible: true };
  };
  
  // Breakpoint'ы (настраиваемые)
  breakpoints: {
    xs: 0;      // Mobile first
    sm: 640;    // Large phones
    md: 768;    // Tablets
    lg: 1024;   // Small laptops
    xl: 1280;   // Desktops
    '2xl': 1536; // Large screens
  };
}
```

### 1.2 Режимы отображения

| Режим | Описание | Use Case |
|-------|----------|----------|
| **Single** | Один viewport на весь экран | Фокус на конкретном устройстве |
| **Side-by-Side** | 2 viewport'а рядом | Сравнение tablet vs desktop |
| **Triple** | Все 3 viewport'а | Общий обзор всех версий |
| **Fluid** | Ресайзабельная ширина | Тестирование кастомных размеров |

### 1.3 Device-Specific Styles

```typescript
// Расширенная структура стилей
interface ResponsiveStyleConfig {
  base: StyleSet;           // Базовые стили (mobile-first)
  
  // Breakpoint overrides
  responsive: {
    sm?: StyleSet;          // >= 640px
    md?: StyleSet;          // >= 768px
    lg?: StyleSet;          // >= 1024px
    xl?: StyleSet;          // >= 1280px
    '2xl'?: StyleSet;       // >= 1536px
  };
  
  // Container queries (новое!)
  container: {
    '@container (min-width: 400px)'?: StyleSet;
    '@container (min-width: 600px)'?: StyleSet;
  };
  
  // Device-specific (опционально)
  device: {
    touch?: StyleSet;       // Только тач-устройства
    hover?: StyleSet;       // Только с мышью
    reducedMotion?: StyleSet; // Для accessibility
  };
}
```

### 1.4 Реализация в UI

- **Viewport Switcher**: Переключатели с визуальными иконками устройств
- **Breakpoint Indicator**: Полоска с маркерами breakpoints над canvas
- **Sync Toggle**: Возможность редактировать стили для всех viewport'ов одновременно или по отдельности
- **Visual Diff**: Подсветка свойств, которые отличаются между viewport'ами

---

## 2. 🎯 IDEAL DRAG & DROP

### 2.1 Гибридная система позиционирования

```typescript
// Поддержка двух режимов для каждого компонента
type PositioningMode = 'flow' | 'absolute';

interface NodePositioning {
  mode: PositioningMode;
  
  // Для flow режима (автоматическое позиционирование)
  flow: {
    order: number;           // Порядок в parent container
    span: 'full' | 'auto' | number;  // Grid span
    alignSelf: 'auto' | 'start' | 'center' | 'end' | 'stretch';
  };
  
  // Для absolute режима (свободное позиционирование)
  absolute: {
    x: number;
    y: number;
    width: number | 'auto';
    height: number | 'auto';
    zIndex: number;
  };
  
  // Constraints (как в Figma)
  constraints: {
    horizontal: 'left' | 'right' | 'center' | 'stretch' | 'scale' | 'fixed';
    vertical: 'top' | 'bottom' | 'center' | 'stretch' | 'scale' | 'fixed';
  };
}
```

### 2.2 Продвинутый Drag & Drop Engine

```typescript
// Интеграция @dnd-kit с кастомными расширениями
interface DnDEngineConfig {
  // Auto-scroll при drag к краю
  autoScroll: {
    enabled: true;
    threshold: 50;      // px от края
    speed: 20;          // px/frame
  };
  
  // Smart snapping
  snapping: {
    enabled: true;
    grid: 8;            // px
    spacing: 16;        // Snap to spacing scale
    
    // Snap к другим элементам
    smartGuides: {
      edges: true;      // Края элементов
      centers: true;    // Центры
      spacing: true;    // Равномерное распределение
      threshold: 5;     // px
    };
  };
  
  // Drop zones
  dropZones: {
    highlight: true;    // Подсветка зоны дропа
    expandOnHover: true; // Авто-раскрытие контейнеров
    nested: true;       // Поддержка вложенности
  };
}
```

### 2.3 Multi-Select & Group Operations

| Фича | Описание |
|------|----------|
| **Lasso Select** | Выделение рамкой (уже есть - улучшить) |
| **Cmd+Click** | Добавление/удаление из выделения |
| **Shift+Drag** | Копирование при перетаскивании |
| **Alt+Resize** | Ресайз с сохранением пропорций |
| **Group/Ungroup** | Ctrl+G / Ctrl+Shift+G |
| **Alignment Tools** | Выравнивание выбранных элементов |
| **Distribute** | Равномерное распределение |
| **Arrange** | Bring to front/Send to back |

### 2.4 Gesture Support

- **Pan**: Space + drag / Middle mouse / Two-finger touch
- **Zoom**: Ctrl+Scroll / Pinch / Zoom buttons
- **Rotate**: Alt+drag handles
- **Snap Toggle**: Hold Cmd to temporarily disable snapping

---

## 3. ⚡ CODE SYNC: Двунаправленная синхронизация

### 3.1 Архитектура Code-First

```typescript
// Единый источник правды - AST
interface CodeSyncEngine {
  // Парсинг TSX в Canvas State
  parseTSX(tsxCode: string): CanvasState;
  
  // Генерация TSX из Canvas State
  generateTSX(state: CanvasState): string;
  
  // Инкрементальные обновления
  applyIncrementalChange(
    source: 'canvas' | 'editor',
    change: ASTChange
  ): void;
  
  // Conflict resolution
  resolveConflicts(
    canvasState: CanvasState,
    codeState: ASTNode
  ): MergedState;
}
```

### 3.2 Live Code Generation

```typescript
// Мгновенная генерация кода при изменениях
interface LiveCodeGen {
  // Debounced generation (100ms)
  generate: (state: CanvasState) => GeneratedCode;
  
  // Source maps для отслеживания
  sourceMap: {
    nodeIdToCodeRange: Map<string, Range>;
    codeRangeToNodeId: Map<Range, string>;
  };
  
  // Highlight active element in code
  syncSelection: {
    canvasToCode: (nodeId: string) => CodeRange;
    codeToCanvas: (position: Position) => string | null;
  };
}
```

### 3.3 Code → Canvas (Reverse Engineering)

```typescript
// AST Parser с использованием ts-morph
class TSXToCanvasParser {
  parse(fileContent: string): CanvasState {
    // 1. Парсим AST
    const sourceFile = this.project.createSourceFile('temp.tsx', fileContent);
    
    // 2. Находим JSX элементы
    const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
    
    // 3. Маппим на ComponentNode
    for (const element of jsxElements) {
      const node = this.mapJsxToNode(element);
      // Сохраняем source location для двунаправленной sync
      node.metadata.sourceRange = element.getPos();
    }
    
    return state;
  }
  
  // Поддержка редактирования кода
  applyCodeEdit(
    oldCode: string,
    newCode: string,
    editRange: Range
  ): CanvasStateDiff {
    // Diff patch -> AST diff -> Canvas diff
  }
}
```

### 3.4 Split View Mode

```
┌──────────────────────────────────────────────────────┐
│  [Design] [Split] [Code]              [Viewport: ▼] │
├────────────────────────┬─────────────────────────────┤
│                        │                             │
│    ┌──────────┐        │   1  │ import { Button }    │
│    │  Canvas  │        │   2  │ from '@/components'  │
│    │          │        │   3  │                      │
│    │  [======]│        │   4  │ export default () => │
│    │  [Button]│        │   5  │   <div>              │
│    │  [======]│        │   6  │     <Button>Click</> │
│    │          │        │   7  │   </div>             │
│    └──────────┘        │   8  │                      │
│                        │                             │
├────────────────────────┴─────────────────────────────┤
│  Status: Synced ✓   Last edit: Canvas (2s ago)      │
└──────────────────────────────────────────────────────┘
```

### 3.5 Code Intelligence Features

| Фича | Описание |
|------|----------|
| **Auto-import** | Автоматический импорт компонентов при drag |
| **Type-checking** | Проверка типов в реальном времени |
| **ESLint** | Линтинг генерируемого кода |
| **Format on save** | Prettier интеграция |
| **IntelliSense** | Автодополнение в Monaco Editor |

---

## 4. 🤖 AI INTEGRATION 2.0

### 4.1 Унифицированная система генерации

```typescript
// AI Engine с поддержкой multiple providers
interface AIGenerationEngine {
  // Провайдеры (по приоритету)
  providers: {
    primary: 'openai' | 'anthropic' | 'mistral';
    fallback: ('ollama' | 'local')[];
  };
  
  // Контекст для генерации
  context: {
    designSystem: DesignSystem;
    existingComponents: ComponentNode[];
    pageContext: PageContext;
    userPreferences: UserPreferences;
  };
  
  // Моды генерации
  modes: {
    'from-scratch': GenerateFullPage;
    'component': GenerateSingleComponent;
    'animate': AddAnimations;
    'responsive': GenerateResponsiveOverrides;
    'refactor': OptimizeStructure;
    'content': GenerateCopy;
  };
}
```

### 4.2 Smart Context Awareness

```typescript
// Контекст для AI с семантическим пониманием
interface AIContextBuilder {
  // Анализ текущей страницы
  buildContext(request: AIGenerateRequest): AIContext {
    return {
      // Существующие компоненты (структурировано)
      currentStructure: this.serializeTree(),
      
      // Design tokens
      designSystem: this.getDesignTokens(),
      
      // Похожие страницы (RAG)
      similarPages: this.findSimilarPages(request.prompt),
      
      // User patterns (обучение)
      userPatterns: this.getUserPatterns(),
      
      // Constraints
      constraints: {
        maxNodes: 20,
        preferredComponents: ['button', 'container', 'text'],
        avoid: ['table', 'iframe'],
      },
    };
  }
}
```

### 4.3 AI Assistants

| Ассистент | Функция | Триггер |
|-----------|---------|---------|
| **Layout AI** | Генерация секций и лейаутов | `/layout hero section` |
| **Style AI** | Применение design tokens | `/style apply brand colors` |
| **Animation AI** | Добавление анимаций | `/animate fade in on scroll` |
| **Content AI** | Генерация текста | `/content write CTA button` |
| **Responsive AI** | Создание адаптивных версий | `/responsive optimize for mobile` |
| **Refactor AI** | Оптимизация кода | `/refactor extract component` |

### 4.4 AI → Code Integration

```typescript
// AI генерирует сразу и в Canvas, и в Code Editor
interface AIGenerationResult {
  // Для Canvas (JSON)
  canvasNodes: ComponentNode[];
  
  // Для Code Editor (TSX)
  tsxCode: string;
  
  // Source map для sync
  sourceMap: NodeToCodeMap;
  
  // Explanation
  explanation: string;
  
  // Suggested next actions
  followUp: string[];
}
```

---

## 5. 🚀 PERFORMANCE & UX

### 5.1 Оптимизации рендеринга

```typescript
// Virtualization для больших страниц
interface CanvasVirtualization {
  // Рендерим только видимые ноды
  visibleNodes: Set<string>;
  
  // LOD (Level of Detail) для зума
  getLOD(zoom: number): 'full' | 'simplified' | 'wireframe' {
    if (zoom < 0.3) return 'wireframe';
    if (zoom < 0.6) return 'simplified';
    return 'full';
  };
  
  // Offscreen canvas для тяжелых эффектов
  useOffscreen: boolean;
}

// Memoization стратегии
const optimizationConfig = {
  // Canvas nodes
  nodeMemoization: {
    props: 'shallow',
    styles: 'deep',
    children: 'reference',
  };
  
  // Code generation
  codeGenCache: {
    enabled: true,
    maxSize: '100MB',
    ttl: '5m',
  };
  
  // Undo/redo
  historyOptimization: {
    maxStackSize: 100;
    compressRepeating: true;
    debounceMs: 100;
  };
};
```

### 5.2 Progressive Enhancement

| Уровень | Фичи | Fallback |
|---------|------|----------|
| **Core** | Добавление, удаление, перемещение | Всегда доступно |
| **Enhanced** | Анимации, эффекты, сложные interactions | Отключается при низком FPS |
| **Advanced** | AI features, real-time collaboration | Очередь задач |

### 5.3 UX Polish Checklist

- [ ] **Skeleton Loading** при инициализации
- [ ] **Smooth transitions** для всех операций
- [ ] **Haptic feedback** (если доступно)
- [ ] **Keyboard shortcuts** с подсказками
- [ ] **Onboarding** для новых пользователей
- [ ] **Empty states** с CTA
- [ ] **Error boundaries** с recovery
- [ ] **Dark mode** native support

---

## 📊 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (2 недели)

```
□ Улучшить viewport switching (smooth transitions)
□ Реализовать breakpoint indicators
□ Добавить device frames (iPhone, iPad, Desktop)
□ Рефакторинг Canvas для поддержки multi-viewport
```

### Phase 2: DnD Excellence (2 недели)

```
□ Интеграция @dnd-kit с auto-scroll
□ Smart snapping v2 (spacing, alignment)
□ Multi-select with lasso
□ Group/ungroup operations
□ Copy-paste between pages
```

### Phase 3: Code Sync (3 недели)

```
□ ts-morph интеграция
□ AST-based code generation
□ Bidirectional sync architecture
□ Source maps
□ Split view mode
```

### Phase 4: AI 2.0 (2 недели)

```
□ Unified AI engine
□ Context builder
□ AI assistants с командами
□ AI → Code Editor sync
```

### Phase 5: Polish (1 неделя)

```
□ Performance optimizations
□ UX polish
□ Testing & bug fixes
□ Documentation
```

---

## 🔧 ТЕХНИЧЕСКИЕ РЕКОМЕНДАЦИИ

### Dependencies

```json
{
  "@dnd-kit/core": "^6.0.0",      // DnD engine
  "@dnd-kit/sortable": "^7.0.0",   // Sortable lists
  "ts-morph": "^22.0.0",           // AST manipulation
  "monaco-editor": "^0.47.0",      // Code editor
  "@monaco-editor/react": "^4.6.0", // React wrapper
  "react-window": "^1.8.0",        // Virtualization
  "immer": "^10.0.0",              // Immutable updates
  "zustand": "^4.5.0"              // State management (уже есть)
}
```

### Архитектурные принципы

1. **Single Source of Truth** - Canvas State через Zustand
2. **Derived State** - Code генерируется из Canvas, не хранится отдельно
3. **Optimistic Updates** - UI отвечает мгновенно, синхронизация в фоне
4. **Graceful Degradation** - Работает без AI, без анимаций, на слабом железе

---

## 🎨 ВИЗУАЛЬНЫЕ МОКАПЫ

### Multi-Viewport Mode

```
┌──────────────────────────────────────────────────────────────────┐
│  [📱][📲][🖥️]    Mobile | Tablet | Desktop        [Fit][100%]   │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │  iPhone  │  │    iPad      │  │       Desktop            │   │
│  │ ┌──────┐ │  │ ┌──────────┐ │  │ ┌──────────────────────┐ │   │
│  │ │      │ │  │ │          │ │  │ │  [Navbar]            │ │   │
│  │ │ HERO │ │  │ │  HERO    │ │  │ │                     │ │   │
│  │ │      │ │  │ │          │ │  │ │  HERO Section       │ │   │
│  │ └──────┘ │  │ └──────────┘ │  │ │                     │ │   │
│  │ ┌──────┐ │  │ ┌────┬─────┐ │  │ │  [CTA Button]       │ │   │
│  │ │Card 1│ │  │ │Card│Card │ │  │ │                     │ │   │
│  │ └──────┘ │  │ └────┴─────┘ │  │ │  [Features Grid]    │ │   │
│  └──────────┘  └──────────────┘  │ └──────────────────────┘ │   │
│        ▲              ▲                 ▲                       │
│   375x812        768x1024          1280x800                    │
└──────────────────────────────────────────────────────────────────┘
```

### Code-Canvas Sync

```
┌─────────────────────────────────────────────────────────────┐
│  🎨 Design  │  ⚡ Split  │  💻 Code                        │
├───────────────────────────────┬─────────────────────────────┤
│                               │  1  import { Button }       │
│   ┌─────────────────────┐     │  2  import { Card }         │
│   │  ┌───────────────┐  │     │  3                          │
│   │  │  [Card]       │  │◄────┤  4  export default () => {  │
│   │  │  ┌─────────┐  │  │     │  5    return (              │
│   │  │  │ [Button]│  │  │◄────┤  6      <Card>              │
│   │  │  └─────────┘  │  │     │  7        <Button>          │
│   │  └───────────────┘  │     │  8          Click me        │
│   │         ▲           │     │  9        </Button>         │
│   │    Selected         │     │ 10      </Card>             │
│   └─────────────────────┘     │ 11    )                     │
│                               │ 12  }                       │
└───────────────────────────────┴─────────────────────────────┘
```

---

## ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ

### Must Have

- [ ] Мульти-Viewport режим (Mobile/Tablet/Desktop)
- [ ] Breakpoint-specific стили
- [ ] Smart DnD с snapping
- [ ] Multi-select и групповые операции
- [ ] Live code generation
- [ ] AI generation в Canvas + Code

### Should Have

- [ ] Code → Canvas reverse sync
- [ ] Split view mode
- [ ] Container queries support
- [ ] AI assistants с командами
- [ ] Keyboard shortcuts
- [ ] Undo/Redo history

### Nice to Have

- [ ] Collaborative editing
- [ ] Version control integration
- [ ] Custom component library
- [ ] Plugin system
- [ ] Mobile touch gestures

---

> Этот план создаёт фундамент для **профессионального визуального редактора** на уровне Webflow, Framer или Figma, но с уникальной фишкой - **полной синхронизацией с кодом** и **нативной AI интеграцией**.
