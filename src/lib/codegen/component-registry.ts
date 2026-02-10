// Component Registry - центральный реестр всех доступных компонентов
// для Visual Builder

import { z } from 'zod';

// ========================================
// Types
// ========================================

export interface StyleProperty {
  name: string;
  label: string;
  type: 'color' | 'spacing' | 'typography' | 'dimension' | 'effect';
  defaultValue?: unknown;
}

export interface ComponentCategory {
  id: string;
  label: string;
  icon: string;
}

export interface PropSchema {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json';
  schema: z.ZodType;
  defaultValue: unknown;
  options?: { label: string; value: string }[]; // Для select
}

export interface ComponentDefinition {
  type: string;
  category: 'layout' | 'basic' | 'form' | 'data' | 'media' | 'custom';
  label: string;
  description?: string;
  icon: string;
  
  // Can have children?
  isContainer: boolean;
  
  // Props schema
  props: PropSchema[];
  
  // Style properties которые можно настраивать
  styleProperties: StyleProperty[];
  
  // Default значения
  defaultProps: Record<string, unknown>;
  defaultStyles: StyleConfig;
  
  // Code generation info
  imports: string[];
  componentName: string;
  
  // Platform availability
  platforms: ('web' | 'telegram')[];
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

// ========================================
// Registry
// ========================================

export const componentCategories: ComponentCategory[] = [
  { id: 'layout', label: 'Layout', icon: 'Layout' },
  { id: 'basic', label: 'Basic', icon: 'Type' },
  { id: 'form', label: 'Form', icon: 'FormInput' },
  { id: 'data', label: 'Data', icon: 'Database' },
  { id: 'media', label: 'Media', icon: 'Image' },
];

export const componentRegistry: Record<string, ComponentDefinition> = {
  // ========================================
  // Layout Components
  // ========================================
  
  container: {
    type: 'container',
    category: 'layout',
    label: 'Container',
    description: 'Flexbox container for grouping elements',
    icon: 'Square',
    isContainer: true,
    props: [
      {
        name: 'direction',
        label: 'Direction',
        type: 'select',
        schema: z.enum(['row', 'column']),
        defaultValue: 'column',
        options: [
          { label: 'Vertical', value: 'column' },
          { label: 'Horizontal', value: 'row' },
        ],
      },
      {
        name: 'gap',
        label: 'Gap',
        type: 'select',
        schema: z.string(),
        defaultValue: 'md',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'align',
        label: 'Align Items',
        type: 'select',
        schema: z.enum(['start', 'center', 'end', 'stretch']),
        defaultValue: 'stretch',
        options: [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ],
      },
      {
        name: 'justify',
        label: 'Justify Content',
        type: 'select',
        schema: z.enum(['start', 'center', 'end', 'between', 'around']),
        defaultValue: 'start',
        options: [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Space Between', value: 'between' },
          { label: 'Space Around', value: 'around' },
        ],
      },
    ],
    styleProperties: [
      { name: 'backgroundColor', label: 'Background', type: 'color' },
      { name: 'padding', label: 'Padding', type: 'spacing' },
      { name: 'borderRadius', label: 'Border Radius', type: 'dimension' },
      { name: 'boxShadow', label: 'Shadow', type: 'effect' },
    ],
    defaultProps: {
      direction: 'column',
      gap: 'md',
      align: 'stretch',
      justify: 'start',
    },
    defaultStyles: {
      base: {
        padding: { type: 'token', tokenType: 'spacing', value: 'md' },
      },
    },
    imports: [],
    componentName: 'div',
    platforms: ['web', 'telegram'],
  },

  grid: {
    type: 'grid',
    category: 'layout',
    label: 'Grid',
    description: 'CSS Grid layout',
    icon: 'Grid3x3',
    isContainer: true,
    props: [
      {
        name: 'columns',
        label: 'Columns',
        type: 'select',
        schema: z.number(),
        defaultValue: 2,
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
        ],
      },
      {
        name: 'gap',
        label: 'Gap',
        type: 'select',
        schema: z.string(),
        defaultValue: 'md',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
    ],
    styleProperties: [
      { name: 'backgroundColor', label: 'Background', type: 'color' },
      { name: 'padding', label: 'Padding', type: 'spacing' },
    ],
    defaultProps: {
      columns: 2,
      gap: 'md',
    },
    defaultStyles: {
      base: {},
    },
    imports: [],
    componentName: 'div',
    platforms: ['web'],
  },

  // ========================================
  // Basic Components
  // ========================================

  text: {
    type: 'text',
    category: 'basic',
    label: 'Text',
    description: 'Plain text block',
    icon: 'Type',
    isContainer: false,
    props: [
      {
        name: 'content',
        label: 'Content',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Text content',
      },
      {
        name: 'as',
        label: 'Element',
        type: 'select',
        schema: z.enum(['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
        defaultValue: 'p',
        options: [
          { label: 'Paragraph', value: 'p' },
          { label: 'Span', value: 'span' },
          { label: 'Div', value: 'div' },
          { label: 'Heading 1', value: 'h1' },
          { label: 'Heading 2', value: 'h2' },
          { label: 'Heading 3', value: 'h3' },
          { label: 'Heading 4', value: 'h4' },
        ],
      },
    ],
    styleProperties: [
      { name: 'color', label: 'Color', type: 'color' },
      { name: 'fontSize', label: 'Font Size', type: 'typography' },
      { name: 'fontWeight', label: 'Font Weight', type: 'typography' },
      { name: 'textAlign', label: 'Alignment', type: 'dimension' },
    ],
    defaultProps: {
      content: 'Text content',
      as: 'p',
    },
    defaultStyles: {
      base: {
        color: { type: 'token', tokenType: 'color', value: 'foreground' },
      },
    },
    imports: [],
    componentName: 'span',
    platforms: ['web', 'telegram'],
  },

  button: {
    type: 'button',
    category: 'basic',
    label: 'Button',
    description: 'Clickable button with actions',
    icon: 'MousePointerClick',
    isContainer: false,
    props: [
      {
        name: 'text',
        label: 'Text',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Button',
      },
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        schema: z.enum(['solid', 'outline', 'ghost', 'soft']),
        defaultValue: 'solid',
        options: [
          { label: 'Solid', value: 'solid' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Soft', value: 'soft' },
        ],
      },
      {
        name: 'size',
        label: 'Size',
        type: 'select',
        schema: z.enum(['sm', 'md', 'lg']),
        defaultValue: 'md',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'disabled',
        label: 'Disabled',
        type: 'boolean',
        schema: z.boolean(),
        defaultValue: false,
      },
    ],
    styleProperties: [
      { name: 'backgroundColor', label: 'Background', type: 'color' },
      { name: 'color', label: 'Text Color', type: 'color' },
      { name: 'borderRadius', label: 'Border Radius', type: 'dimension' },
      { name: 'padding', label: 'Padding', type: 'spacing' },
    ],
    defaultProps: {
      text: 'Button',
      variant: 'solid',
      size: 'md',
      disabled: false,
    },
    defaultStyles: {
      base: {
        backgroundColor: { type: 'token', tokenType: 'color', value: 'primary' },
        color: { type: 'token', tokenType: 'color', value: 'primary-foreground' },
        padding: { type: 'token', tokenType: 'spacing', value: 'md' },
        borderRadius: { type: 'token', tokenType: 'spacing', value: 'sm' },
      },
    },
    imports: ['@/components/ui/button'],
    componentName: 'Button',
    platforms: ['web', 'telegram'],
  },

  link: {
    type: 'link',
    category: 'basic',
    label: 'Link',
    description: 'Anchor link',
    icon: 'Link',
    isContainer: false,
    props: [
      {
        name: 'text',
        label: 'Text',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Click here',
      },
      {
        name: 'href',
        label: 'URL',
        type: 'string',
        schema: z.string(),
        defaultValue: '#',
      },
      {
        name: 'external',
        label: 'External',
        type: 'boolean',
        schema: z.boolean(),
        defaultValue: false,
      },
    ],
    styleProperties: [
      { name: 'color', label: 'Color', type: 'color' },
    ],
    defaultProps: {
      text: 'Click here',
      href: '#',
      external: false,
    },
    defaultStyles: {
      base: {
        color: { type: 'token', tokenType: 'color', value: 'primary' },
      },
    },
    imports: ['next/link'],
    componentName: 'Link',
    platforms: ['web'],
  },

  // ========================================
  // Form Components
  // ========================================

  input: {
    type: 'input',
    category: 'form',
    label: 'Input',
    description: 'Text input field',
    icon: 'FormInput',
    isContainer: false,
    props: [
      {
        name: 'name',
        label: 'Name',
        type: 'string',
        schema: z.string(),
        defaultValue: 'field',
      },
      {
        name: 'label',
        label: 'Label',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Label',
      },
      {
        name: 'placeholder',
        label: 'Placeholder',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Enter value...',
      },
      {
        name: 'required',
        label: 'Required',
        type: 'boolean',
        schema: z.boolean(),
        defaultValue: false,
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        schema: z.enum(['text', 'email', 'password', 'number', 'tel']),
        defaultValue: 'text',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Password', value: 'password' },
          { label: 'Number', value: 'number' },
          { label: 'Phone', value: 'tel' },
        ],
      },
    ],
    styleProperties: [
      { name: 'backgroundColor', label: 'Background', type: 'color' },
      { name: 'borderColor', label: 'Border', type: 'color' },
    ],
    defaultProps: {
      name: 'field',
      label: 'Label',
      placeholder: 'Enter value...',
      required: false,
      type: 'text',
    },
    defaultStyles: {
      base: {},
    },
    imports: ['@/components/ui/input'],
    componentName: 'Input',
    platforms: ['web'],
  },

  form: {
    type: 'form',
    category: 'form',
    label: 'Form',
    description: 'Form container with validation',
    icon: 'FormInput',
    isContainer: true,
    props: [
      {
        name: 'submitLabel',
        label: 'Submit Label',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Submit',
      },
      {
        name: 'successMessage',
        label: 'Success Message',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Form submitted successfully!',
      },
    ],
    styleProperties: [
      { name: 'gap', label: 'Gap', type: 'spacing' },
    ],
    defaultProps: {
      submitLabel: 'Submit',
      successMessage: 'Form submitted successfully!',
    },
    defaultStyles: {
      base: {
        gap: { type: 'token', tokenType: 'spacing', value: 'md' },
      },
    },
    imports: ['@/components/ui/form'],
    componentName: 'Form',
    platforms: ['web'],
  },

  // ========================================
  // Media Components
  // ========================================

  image: {
    type: 'image',
    category: 'media',
    label: 'Image',
    description: 'Image with lazy loading',
    icon: 'Image',
    isContainer: false,
    props: [
      {
        name: 'src',
        label: 'Source URL',
        type: 'string',
        schema: z.string(),
        defaultValue: '/placeholder.svg',
      },
      {
        name: 'alt',
        label: 'Alt Text',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Image',
      },
      {
        name: 'aspectRatio',
        label: 'Aspect Ratio',
        type: 'select',
        schema: z.enum(['auto', '1:1', '4:3', '16:9']),
        defaultValue: 'auto',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Square (1:1)', value: '1:1' },
          { label: 'Standard (4:3)', value: '4:3' },
          { label: 'Widescreen (16:9)', value: '16:9' },
        ],
      },
      {
        name: 'objectFit',
        label: 'Object Fit',
        type: 'select',
        schema: z.enum(['cover', 'contain', 'fill']),
        defaultValue: 'cover',
        options: [
          { label: 'Cover', value: 'cover' },
          { label: 'Contain', value: 'contain' },
          { label: 'Fill', value: 'fill' },
        ],
      },
    ],
    styleProperties: [
      { name: 'borderRadius', label: 'Border Radius', type: 'dimension' },
    ],
    defaultProps: {
      src: '/placeholder.svg',
      alt: 'Image',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    defaultStyles: {
      base: {},
    },
    imports: ['next/image'],
    componentName: 'Image',
    platforms: ['web'],
  },

  // ========================================
  // Telegram-specific Components
  // ========================================

  telegramText: {
    type: 'telegramText',
    category: 'basic',
    label: 'Message Text',
    description: 'Text message for Telegram',
    icon: 'MessageSquare',
    isContainer: false,
    props: [
      {
        name: 'content',
        label: 'Message',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Hello!',
      },
      {
        name: 'parseMode',
        label: 'Parse Mode',
        type: 'select',
        schema: z.enum(['HTML', 'Markdown', 'MarkdownV2']),
        defaultValue: 'HTML',
        options: [
          { label: 'HTML', value: 'HTML' },
          { label: 'Markdown', value: 'Markdown' },
          { label: 'MarkdownV2', value: 'MarkdownV2' },
        ],
      },
    ],
    styleProperties: [], // Telegram не поддерживает стилизацию текста
    defaultProps: {
      content: 'Hello!',
      parseMode: 'HTML',
    },
    defaultStyles: { base: {} },
    imports: [],
    componentName: 'TelegramText',
    platforms: ['telegram'],
  },

  telegramKeyboard: {
    type: 'telegramKeyboard',
    category: 'layout',
    label: 'Reply Keyboard',
    description: 'Telegram reply keyboard',
    icon: 'Keyboard',
    isContainer: true,
    props: [
      {
        name: 'resize',
        label: 'Resize Keyboard',
        type: 'boolean',
        schema: z.boolean(),
        defaultValue: true,
      },
      {
        name: 'oneTime',
        label: 'One Time Keyboard',
        type: 'boolean',
        schema: z.boolean(),
        defaultValue: false,
      },
    ],
    styleProperties: [],
    defaultProps: {
      resize: true,
      oneTime: false,
    },
    defaultStyles: { base: {} },
    imports: [],
    componentName: 'ReplyKeyboardMarkup',
    platforms: ['telegram'],
  },

  telegramKeyboardButton: {
    type: 'telegramKeyboardButton',
    category: 'basic',
    label: 'Keyboard Button',
    description: 'Button for reply keyboard',
    icon: 'Square',
    isContainer: false,
    props: [
      {
        name: 'text',
        label: 'Button Text',
        type: 'string',
        schema: z.string(),
        defaultValue: 'Button',
      },
      {
        name: 'requestContact',
        label: 'Request Contact',
        type: 'boolean',
        schema: z.boolean(),
        defaultValue: false,
      },
      {
        name: 'requestLocation',
        label: 'Request Location',
        type: 'boolean',
        schema: z.boolean(),
        defaultValue: false,
      },
    ],
    styleProperties: [],
    defaultProps: {
      text: 'Button',
      requestContact: false,
      requestLocation: false,
    },
    defaultStyles: { base: {} },
    imports: [],
    componentName: 'KeyboardButton',
    platforms: ['telegram'],
  },
};

// ========================================
// Helpers
// ========================================

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentRegistry[type];
}

export function getComponentsByCategory(category: string): ComponentDefinition[] {
  return Object.values(componentRegistry).filter(c => c.category === category);
}

export function getComponentsByPlatform(platform: 'web' | 'telegram'): ComponentDefinition[] {
  return Object.values(componentRegistry).filter(c => c.platforms.includes(platform));
}

export function getDefaultProps(type: string): Record<string, unknown> {
  const def = componentRegistry[type];
  if (!def) return {};
  
  return def.props.reduce((acc, prop) => {
    acc[prop.name] = prop.defaultValue;
    return acc;
  }, {} as Record<string, unknown>);
}

export function validateProps(type: string, props: Record<string, unknown>): { valid: boolean; errors?: string[] } {
  const def = componentRegistry[type];
  if (!def) return { valid: false, errors: [`Unknown component type: ${type}`] };
  
  const errors: string[] = [];
  
  for (const prop of def.props) {
    try {
      prop.schema.parse(props[prop.name]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(`${prop.name}: ${error.errors[0]?.message}`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
}
