'use client';

import { useMemo } from 'react';
import { getComponentDefinition } from '@/lib/codegen/component-registry';
import { cn } from '@/lib/utils';
import type { ComponentNode } from '../../stores/canvas-store';
import { useCanvasStore } from '../../stores/canvas-store';

interface CanvasProps {
  pageId: string;
  className?: string;
}

export function Canvas({ pageId, className }: CanvasProps) {
  const { nodes, selectedNodeId, selectNode, ui } = useCanvasStore();

  const rootNodes = useMemo(() => {
    return Object.values(nodes)
      .filter((n) => n.pageId === pageId && n.parentId === null)
      .sort((a, b) => a.order - b.order);
  }, [nodes, pageId]);

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-auto',
        ui.showGrid && 'bg-grid-pattern',
        className,
      )}
      style={{
        backgroundImage: ui.showGrid
          ? 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)'
          : undefined,
        backgroundSize: ui.showGrid ? '20px 20px' : undefined,
      }}
    >
      <div className="min-h-full p-8">
        {rootNodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={() => selectNode(node.id)}
          />
        ))}

        {rootNodes.length === 0 && <EmptyCanvas />}
      </div>
    </div>
  );
}

interface CanvasNodeProps {
  node: ComponentNode;
  isSelected: boolean;
  onSelect: () => void;
}

function CanvasNode({ node, isSelected, onSelect }: CanvasNodeProps) {
  const { nodes, getChildNodes } = useCanvasStore();
  const children = getChildNodes(node.id);

  const def = getComponentDefinition(node.type);
  if (!def) return null;

  // Generate styles from node.styles
  const baseStyles = node.styles.base || {};
  const styleObject: React.CSSProperties = {};

  Object.entries(baseStyles).forEach(([key, value]) => {
    if (value.type === 'static') {
      styleObject[key as keyof React.CSSProperties] = value.value as any;
    }
    // Token values would be resolved to CSS variables
  });

  const Component = def.componentName as any;

  // Render based on component type
  if (def.type === 'text') {
    return (
      <div
        className={cn(
          'relative cursor-pointer transition-all',
          isSelected && 'ring-2 ring-primary ring-offset-2',
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={styleObject}
      >
        <span>{(node.props.content as string) || 'Text'}</span>
        {children.map((child) => (
          <CanvasNode
            key={child.id}
            node={child}
            isSelected={false}
            onSelect={() => {}}
          />
        ))}
      </div>
    );
  }

  if (def.type === 'button') {
    return (
      <button
        className={cn(
          'relative cursor-pointer transition-all px-4 py-2 rounded',
          node.props.variant === 'solid' &&
            'bg-primary text-primary-foreground',
          node.props.variant === 'outline' &&
            'border border-primary text-primary',
          isSelected && 'ring-2 ring-primary ring-offset-2',
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={styleObject}
      >
        {(node.props.text as string) || 'Button'}
      </button>
    );
  }

  if (def.type === 'container' || def.isContainer) {
    const flexDirection =
      node.props.direction === 'row' ? 'flex-row' : 'flex-col';
    const alignItems =
      {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      }[node.props.align as string] || 'items-stretch';

    const justifyContent =
      {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
      }[node.props.justify as string] || 'justify-start';

    const gapClass =
      {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
      }[node.props.gap as string] || 'gap-4';

    return (
      <div
        className={cn(
          'relative flex cursor-pointer transition-all min-h-[60px] p-4 rounded border-2 border-dashed',
          flexDirection,
          alignItems,
          justifyContent,
          gapClass,
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/20 hover:border-muted-foreground/40',
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={styleObject}
      >
        {/* Container label */}
        <div className="absolute -top-3 left-2 px-1.5 py-0.5 bg-background text-[10px] text-muted-foreground border rounded">
          {def.label}
        </div>

        {children.length === 0 ? (
          <div className="text-sm text-muted-foreground/50 italic">
            Drop components here
          </div>
        ) : (
          children.map((child) => (
            <CanvasNode
              key={child.id}
              node={child}
              isSelected={false}
              onSelect={() => {}}
            />
          ))
        )}
      </div>
    );
  }

  // Default render for other components
  return (
    <div
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary ring-offset-2',
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={styleObject}
    >
      <Component {...node.props}>
        {children.map((child) => (
          <CanvasNode
            key={child.id}
            node={child}
            isSelected={false}
            onSelect={() => {}}
          />
        ))}
      </Component>
    </div>
  );
}

function EmptyCanvas() {
  return (
    <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-muted-foreground/20 rounded-lg">
      <p className="text-muted-foreground">
        Drag components here to start building
      </p>
    </div>
  );
}
