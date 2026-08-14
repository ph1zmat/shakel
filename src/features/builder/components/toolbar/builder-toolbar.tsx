'use client';

import {
  Code,
  Grid3X3,
  LayoutTemplate,
  Magnet,
  Monitor,
  PanelLeft,
  PanelRight,
  Redo,
  Ruler,
  Undo,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCanvasStore } from '../../stores/canvas-store';
import type { CodeEditorMode } from '../../types';

export function BuilderToolbar() {
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    ui,
    codeSync,
    setZoom,
    resetZoom,
    toggleGrid,
    toggleRulers,
    toggleSnapToGrid,
    toggleLeftPanel,
    toggleRightPanel,
    setCodeEditorMode,
  } = useCanvasStore();

  const zoomPercent = Math.round(ui.zoom * 100);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1">
        {/* History */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canUndo}
                onClick={undo}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canRedo}
                onClick={redo}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(ui.zoom - 0.1)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>

          <span className="text-xs text-muted-foreground w-12 text-center">
            {zoomPercent}%
          </span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(ui.zoom + 0.1)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Canvas Options */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={ui.showGrid ? 'secondary' : 'ghost'}
              size="icon"
              className={cn(
                'h-8 w-8',
                ui.showGrid && 'bg-primary/10 text-primary',
              )}
              onClick={toggleGrid}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle grid (G)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={ui.showRulers ? 'secondary' : 'ghost'}
              size="icon"
              className={cn(
                'h-8 w-8',
                ui.showRulers && 'bg-primary/10 text-primary',
              )}
              onClick={toggleRulers}
            >
              <Ruler className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle rulers</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={ui.snapToGrid ? 'secondary' : 'ghost'}
              size="icon"
              className={cn(
                'h-8 w-8',
                ui.snapToGrid && 'bg-primary/10 text-primary',
              )}
              onClick={toggleSnapToGrid}
            >
              <Magnet className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Snap to grid</TooltipContent>
        </Tooltip>

        <div className="w-px h-4 bg-border mx-1" />

        {/* View Mode */}
        <div className="flex items-center gap-0.5 bg-muted/50 p-0.5 rounded-md">
          <ViewModeButton
            mode="design"
            currentMode={codeSync.mode}
            onClick={setCodeEditorMode}
            icon={LayoutTemplate}
            label="Design"
          />
          <ViewModeButton
            mode="split"
            currentMode={codeSync.mode}
            onClick={setCodeEditorMode}
            icon={Monitor}
            label="Split"
          />
          <ViewModeButton
            mode="code"
            currentMode={codeSync.mode}
            onClick={setCodeEditorMode}
            icon={Code}
            label="Code"
          />
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Panels */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={ui.leftPanelOpen ? 'secondary' : 'ghost'}
              size="icon"
              className={cn(
                'h-8 w-8',
                ui.leftPanelOpen && 'bg-primary/10 text-primary',
              )}
              onClick={toggleLeftPanel}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle left panel</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={ui.rightPanelOpen ? 'secondary' : 'ghost'}
              size="icon"
              className={cn(
                'h-8 w-8',
                ui.rightPanelOpen && 'bg-primary/10 text-primary',
              )}
              onClick={toggleRightPanel}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle right panel</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

interface ViewModeButtonProps {
  mode: CodeEditorMode;
  currentMode: CodeEditorMode;
  onClick: (mode: CodeEditorMode) => void;
  icon: typeof LayoutTemplate;
  label: string;
}

function ViewModeButton({
  mode,
  currentMode,
  onClick,
  icon: Icon,
  label,
}: ViewModeButtonProps) {
  const isActive = currentMode === mode;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size="sm"
          className={cn(
            'h-7 px-2 gap-1.5 text-xs',
            isActive && 'bg-background shadow-sm',
          )}
          onClick={() => onClick(mode)}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label} view</TooltipContent>
    </Tooltip>
  );
}
