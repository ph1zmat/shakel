'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  defaultDropAnimationSideEffects,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useState } from 'react';
import { getComponentDefinition } from '@/lib/codegen/component-registry';
import { cn } from '@/lib/utils';
import { type ComponentNode, useCanvasStore } from '../../stores/canvas-store';

interface BuilderDndContextProps {
  children: React.ReactNode;
}

export function BuilderDndContext({ children }: BuilderDndContextProps) {
  const { nodes, moveNode, currentPageId, startDrag, endDrag } =
    useCanvasStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id as string);

      const node = nodes[active.id as string];
      if (node) {
        startDrag({
          nodeId: node.id,
          sourceParentId: node.parentId,
          sourceIndex: node.order,
        });
      }
    },
    [nodes, startDrag],
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setOverId(null);
      endDrag();

      if (!over) return;

      const activeNode = nodes[active.id as string];
      const overNode = nodes[over.id as string];

      if (!activeNode || !overNode) return;

      // If dropping on a different parent
      if (
        activeNode.parentId !== overNode.parentId ||
        activeNode.parentId === overNode.id
      ) {
        // Calculate new index
        const targetParentId = overNode.isContainer
          ? overNode.id
          : overNode.parentId;
        const siblings = Object.values(nodes)
          .filter(
            (n) => n.parentId === targetParentId && n.pageId === currentPageId,
          )
          .sort((a, b) => a.order - b.order);

        const targetIndex = overNode.isContainer
          ? siblings.length
          : overNode.order;

        moveNode(activeNode.id, targetParentId, targetIndex);
      } else if (
        activeNode.parentId === overNode.parentId &&
        activeNode.id !== overNode.id
      ) {
        // Reordering within same parent
        const targetIndex = overNode.order;
        moveNode(activeNode.id, activeNode.parentId, targetIndex);
      }
    },
    [nodes, currentPageId, moveNode, endDrag],
  );

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const activeNode = activeId ? nodes[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeNode ? <DragOverlayNode node={activeNode} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function DragOverlayNode({ node }: { node: ComponentNode }) {
  const def = getComponentDefinition(node.type);

  return (
    <div className="opacity-80 rotate-2 scale-105 cursor-grabbing">
      <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-lg">{def?.icon.charAt(0) || '?'}</span>
          <span className="font-medium">{def?.label || node.type}</span>
        </div>
      </div>
    </div>
  );
}

// ========================================
// Sortable Node Component
// ========================================

interface SortableNodeProps {
  node: ComponentNode;
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

export function SortableNode({
  node,
  children,
  isSelected,
  onSelect,
}: SortableNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: node.id,
    data: {
      type: 'node',
      node,
      isContainer: getComponentDefinition(node.type)?.isContainer,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isDragging && 'opacity-50',
        isSelected && 'ring-2 ring-primary ring-offset-2',
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          className="w-4 h-4 text-muted-foreground"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>

      <div onClick={onSelect}>{children}</div>
    </div>
  );
}

// ========================================
// Droppable Container
// ========================================

import { useDroppable } from '@dnd-kit/core';

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
  isContainer?: boolean;
  className?: string;
}

export function DroppableContainer({
  id,
  children,
  isContainer,
  className,
}: DroppableContainerProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: 'container',
      accepts: ['node'],
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-colors',
        isOver &&
          isContainer &&
          'bg-primary/10 ring-2 ring-primary ring-dashed',
        className,
      )}
    >
      {children}
      {isOver && isContainer && (
        <div className="h-1 bg-primary rounded-full mt-2" />
      )}
    </div>
  );
}
