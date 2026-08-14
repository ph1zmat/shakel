'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  BringToFront,
  Group,
  SendToBack,
  Space,
  Ungroup,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCanvasStore, useSelectedNodes } from '../../stores/canvas-store';

export function AlignmentToolbar() {
  const selectedNodes = useSelectedNodes();
  const { selection, updateNodeProps } = useCanvasStore();
  const hasSelection = selectedNodes.length > 0;
  const hasMultipleSelection = selectedNodes.length > 1;

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    // Implementation would calculate positions and update nodes
    console.log('Align', alignment, selectedNodes);
  };

  const handleDistribute = () => {
    // Implementation for distributing nodes evenly
    console.log('Distribute', selectedNodes);
  };

  const handleZIndex = (direction: 'front' | 'back') => {
    selectedNodes.forEach((node) => {
      const currentZIndex =
        (node.props.style as { zIndex?: number })?.zIndex || 0;
      updateNodeProps(node.id, {
        style: {
          ...((node.props.style as object) || {}),
          zIndex:
            direction === 'front'
              ? currentZIndex + 1
              : Math.max(0, currentZIndex - 1),
        },
      });
    });
  };

  if (!hasSelection) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 bg-background border rounded-lg p-1 shadow-lg">
        {/* Alignment - Horizontal */}
        <div className="flex gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align right</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Alignment - Vertical */}
        <div className="flex gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!hasMultipleSelection}
              >
                <AlignVerticalJustifyStart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align top</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!hasMultipleSelection}
              >
                <AlignVerticalJustifyCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align middle</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!hasMultipleSelection}
              >
                <AlignVerticalJustifyEnd className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align bottom</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Distribute */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={!hasMultipleSelection}
              onClick={handleDistribute}
            >
              <Space className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Distribute evenly</TooltipContent>
        </Tooltip>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Z-Index */}
        <div className="flex gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleZIndex('front')}
              >
                <BringToFront className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bring to front</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleZIndex('back')}
              >
                <SendToBack className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send to back</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Group/Ungroup */}
        <div className="flex gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={!hasMultipleSelection}
              >
                <Group className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Group (Ctrl+G)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Ungroup className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ungroup (Ctrl+Shift+G)</TooltipContent>
          </Tooltip>
        </div>

        {/* Selection Count */}
        {hasMultipleSelection && (
          <>
            <div className="w-px h-4 bg-border mx-1" />
            <span className="text-xs text-muted-foreground px-2">
              {selectedNodes.length} selected
            </span>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
