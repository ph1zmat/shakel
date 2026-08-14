'use client';

import { AlertCircle, Check, Copy, FileCode, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { NextJSGenerator } from '../../codegen/nextjs-generator';
import { useCanvasStore } from '../../stores/canvas-store';

export function CodeEditorPanel() {
  const {
    nodes,
    pages,
    project,
    codeSync,
    selectedNodeId,
    updateGeneratedCode,
    markSynced,
  } = useCanvasStore();

  const [copied, setCopied] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  // Generate code when nodes change
  useEffect(() => {
    if (!project || pages.length === 0) return;

    const generator = new NextJSGenerator();
    const currentPage =
      pages.find((p) => p.id === codeSync.lastEditSource) || pages[0];
    const pageNodes = Object.values(nodes).filter(
      (n) => n.pageId === currentPage?.id,
    );

    // Generate preview code for the current page
    const generated = generator.generatePage(currentPage, pageNodes);
    updateGeneratedCode(generated.content);
    markSynced('canvas');
  }, [nodes, pages, project, codeSync.lastEditSource]);

  // Highlight lines for selected node
  useEffect(() => {
    if (!selectedNodeId || !codeSync.sourceMap.has(selectedNodeId)) {
      setHighlightedLines([]);
      return;
    }

    const range = codeSync.sourceMap.get(selectedNodeId);
    if (range) {
      const lines: number[] = [];
      for (let i = range.startLine; i <= range.endLine; i++) {
        lines.push(i);
      }
      setHighlightedLines(lines);
    }
  }, [selectedNodeId, codeSync.sourceMap]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSync.generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    markSynced('canvas');
  };

  // Simple syntax highlighting
  const renderCode = () => {
    const lines = codeSync.generatedCode.split('\n');

    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const isHighlighted = highlightedLines.includes(lineNumber);

      // Basic syntax highlighting
      const highlightedLine = line
        .replace(/(&lt;[\w/]+)/g, '<span class="text-pink-500">$1</span>')
        .replace(/({.*?})/g, '<span class="text-amber-500">$1</span>')
        .replace(/(".*?")/g, '<span class="text-green-500">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
        .replace(
          /\b(import|export|from|const|let|var|function|return|if|else|for|while)\b/g,
          '<span class="text-purple-500">$1</span>',
        );

      return (
        <div
          key={lineNumber}
          className={cn('flex', isHighlighted && 'bg-primary/10')}
        >
          <span className="select-none w-10 text-right pr-3 text-muted-foreground text-xs shrink-0">
            {lineNumber}
          </span>
          <pre
            className="flex-1 text-xs font-mono whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{
              __html: highlightedLine
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;'),
            }}
          />
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <div className="h-10 border-b border-border/20 flex items-center px-4 justify-between bg-[#252526]">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-gray-300">page.tsx</span>
          {codeSync.isSynced ? (
            <Badge
              variant="outline"
              className="text-[10px] border-green-500/50 text-green-400"
            >
              <Check className="h-2.5 w-2.5 mr-1" />
              Synced
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] border-amber-500/50 text-amber-400"
            >
              <AlertCircle className="h-2.5 w-2.5 mr-1" />
              Modified
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <ScrollArea className="flex-1">
        <div className="py-4 font-mono text-sm">
          {codeSync.generatedCode ? (
            renderCode()
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              No code generated yet
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white text-[10px] flex items-center px-3 justify-between">
        <div className="flex items-center gap-3">
          <span>TypeScript React</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {highlightedLines[0] || 1}, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
