'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCanvasStore } from '../../stores/canvas-store';

export function SelectionBox() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    selection,
    startSelectionBox,
    updateSelectionBox,
    endSelectionBox,
    selectMultipleNodes,
    nodes,
    currentPageId,
  } = useCanvasStore();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start selection box on left click and not on interactive elements
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest('[data-node-id]')) return;
      if ((e.target as HTMLElement).closest('button, input, textarea, select'))
        return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      startSelectionBox(point);
    },
    [startSelectionBox],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!selection.selectionBox.isSelecting) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      updateSelectionBox(point);
    },
    [selection.selectionBox.isSelecting, updateSelectionBox],
  );

  const handleMouseUp = useCallback(() => {
    if (!selection.selectionBox.isSelecting) return;

    // Calculate selected nodes based on selection box
    const { start, end } = selection.selectionBox;
    if (start && end) {
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);

      const selectedIds = Object.values(nodes)
        .filter((node) => {
          if (node.pageId !== currentPageId) return false;
          // Get node element position (simplified)
          const nodeEl = document.querySelector(`[data-node-id="${node.id}"]`);
          if (!nodeEl) return false;

          const rect = nodeEl.getBoundingClientRect();
          const canvasRect = canvasRef.current?.getBoundingClientRect();
          if (!canvasRect) return false;

          const nodeX = rect.left - canvasRect.left;
          const nodeY = rect.top - canvasRect.top;
          const nodeW = rect.width;
          const nodeH = rect.height;

          return (
            nodeX < maxX &&
            nodeX + nodeW > minX &&
            nodeY < maxY &&
            nodeY + nodeH > minY
          );
        })
        .map((n) => n.id);

      selectMultipleNodes(selectedIds);
    }

    endSelectionBox();
  }, [
    selection.selectionBox,
    nodes,
    currentPageId,
    selectMultipleNodes,
    endSelectionBox,
  ]);

  useEffect(() => {
    if (selection.selectionBox.isSelecting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [selection.selectionBox.isSelecting, handleMouseMove, handleMouseUp]);

  const boxStyle = (() => {
    const { start, end, isSelecting } = selection.selectionBox;
    if (!isSelecting || !start || !end) return { display: 'none' };

    const left = Math.min(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    return {
      left,
      top,
      width,
      height,
    };
  })();

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0"
      onMouseDown={handleMouseDown}
    >
      {selection.selectionBox.isSelecting && (
        <div
          className={cn(
            'absolute border-2 border-primary bg-primary/10 pointer-events-none',
            'rounded-sm',
          )}
          style={boxStyle}
        />
      )}
    </div>
  );
}
