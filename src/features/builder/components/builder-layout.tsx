'use client';

import { useEffect, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { useCanvasStore } from '../stores/canvas-store';
import type { ViewportType } from '../types';
import { Canvas } from './canvas/canvas';
import { CodeEditorPanel } from './code-editor/code-editor-panel';
import { BuilderDndContext } from './dnd/dnd-context';
import { LeftPanel } from './panels/left-panel';
import { RightPanel } from './panels/right-panel';
import { AlignmentToolbar } from './toolbar/alignment-toolbar';
import { BuilderToolbar } from './toolbar/builder-toolbar';
import { DeviceFrame } from './viewport/device-frame';
import { ViewportSwitcher } from './viewport/viewport-switcher';

interface BuilderLayoutProps {
  projectId: string;
}

export function BuilderLayout({ projectId }: BuilderLayoutProps) {
  const {
    viewport,
    codeSync,
    ui,
    currentPageId,
    toggleLeftPanel,
    toggleRightPanel,
  } = useCanvasStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <BuilderSkeleton />;
  }

  // Determine layout based on display mode
  const visibleViewports = (
    Object.keys(viewport.viewports) as ViewportType[]
  ).filter((v) => viewport.viewports[v].visible);

  const showCodePanel = codeSync.mode === 'split' || codeSync.mode === 'code';
  const showCanvas = codeSync.mode === 'design' || codeSync.mode === 'split';

  return (
    <BuilderDndContext>
      <div className="h-screen flex flex-col bg-muted/30 overflow-hidden">
        {/* Top Toolbar */}
        <header className="h-14 border-b bg-background flex items-center px-4 gap-4 shrink-0">
          <BuilderToolbar />
          <div className="flex-1 flex justify-center">
            <AlignmentToolbar />
          </div>
          <ViewportSwitcher />
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Components/Layers */}
          {ui.leftPanelOpen && (
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel
                defaultSize={20}
                minSize={15}
                maxSize={30}
                className="border-r"
              >
                <LeftPanel />
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Center - Canvas / Code */}
              <ResizablePanel defaultSize={showCodePanel ? 40 : 60}>
                {showCanvas && currentPageId && (
                  <div className="h-full overflow-auto p-4">
                    <MultiViewportCanvas
                      visibleViewports={visibleViewports}
                      currentPageId={currentPageId}
                    />
                  </div>
                )}
              </ResizablePanel>

              {/* Code Editor Panel (when in split mode) */}
              {showCodePanel && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={40}>
                    <CodeEditorPanel />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          )}

          {/* Right Panel - Properties */}
          {ui.rightPanelOpen && (
            <div className="w-80 border-l bg-background">
              <RightPanel />
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <footer className="h-7 border-t bg-background flex items-center px-4 gap-4 text-xs text-muted-foreground shrink-0">
          <span>{visibleViewports.length} viewport(s)</span>
          <span className="text-border">|</span>
          <span
            className={cn(
              'flex items-center gap-1',
              codeSync.isSynced ? 'text-green-600' : 'text-amber-600',
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                codeSync.isSynced ? 'bg-green-600' : 'bg-amber-600',
              )}
            />
            {codeSync.isSynced ? 'Synced' : 'Syncing...'}
          </span>
          {codeSync.lastEditSource && (
            <>
              <span className="text-border">|</span>
              <span>Last edit: {codeSync.lastEditSource}</span>
            </>
          )}
        </footer>
      </div>
    </BuilderDndContext>
  );
}

interface MultiViewportCanvasProps {
  visibleViewports: ViewportType[];
  currentPageId: string;
}

function MultiViewportCanvas({
  visibleViewports,
  currentPageId,
}: MultiViewportCanvasProps) {
  const { viewport } = useCanvasStore();

  if (visibleViewports.length === 1) {
    const vp = visibleViewports[0];
    const config = viewport.viewports[vp];

    return (
      <div className="h-full flex items-center justify-center">
        <DeviceFrame
          type={vp}
          width={config.width}
          height={config.height}
          scale={config.scale}
        >
          <Canvas pageId={currentPageId} />
        </DeviceFrame>
      </div>
    );
  }

  // Multiple viewports side by side
  return (
    <div className="h-full flex items-center justify-center gap-8 overflow-auto">
      {visibleViewports.map((vp) => {
        const config = viewport.viewports[vp];
        return (
          <DeviceFrame
            key={vp}
            type={vp}
            width={config.width}
            height={config.height}
            scale={config.scale * 0.8} // Scale down for multi-viewport
          >
            <Canvas pageId={currentPageId} />
          </DeviceFrame>
        );
      })}
    </div>
  );
}

function BuilderSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-muted/30 animate-pulse">
      <header className="h-14 border-b bg-background flex items-center px-4">
        <div className="w-32 h-6 bg-muted rounded" />
      </header>
      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-background" />
        <main className="flex-1" />
        <aside className="w-80 border-l bg-background" />
      </div>
    </div>
  );
}
