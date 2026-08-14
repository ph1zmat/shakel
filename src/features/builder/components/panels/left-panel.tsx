'use client';

import {
  ChevronDown,
  ChevronRight,
  FileText,
  Layers,
  LayoutGrid,
  Plus,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  componentCategories,
  componentRegistry,
} from '@/lib/codegen/component-registry';
import { cn } from '@/lib/utils';
import { useCanvasStore } from '../../stores/canvas-store';

export function LeftPanel() {
  const { ui, setActiveLeftTab } = useCanvasStore();

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs
        value={ui.activeLeftTab}
        onValueChange={(v) => setActiveLeftTab(v as typeof ui.activeLeftTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-10">
          <TabsTrigger
            value="components"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger
            value="layers"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
          >
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </TabsTrigger>
          <TabsTrigger
            value="pages"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="flex-1 m-0 p-0">
          <ComponentsTab />
        </TabsContent>
        <TabsContent value="layers" className="flex-1 m-0 p-0">
          <LayersTab />
        </TabsContent>
        <TabsContent value="pages" className="flex-1 m-0 p-0">
          <PagesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ========================================
// Components Tab
// ========================================

function ComponentsTab() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addNode } = useCanvasStore();

  const filteredComponents = Object.values(componentRegistry).filter((comp) => {
    const matchesSearch =
      comp.label.toLowerCase().includes(search.toLowerCase()) ||
      comp.type.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('component-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === null ? 'secondary' : 'ghost'}
            size="sm"
            className="h-6 text-xs"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {componentCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 text-xs"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {componentCategories.map((category) => {
            const components = filteredComponents.filter(
              (c) => c.category === category.id,
            );
            if (components.length === 0) return null;

            return (
              <div key={category.id}>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">
                  {category.label}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {components.map((comp) => (
                    <div
                      key={comp.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, comp.type)}
                      onClick={() => addNode(comp.type, null)}
                      className={cn(
                        'p-3 rounded-lg border bg-card cursor-move',
                        'hover:border-primary/50 hover:shadow-sm transition-all',
                        'active:cursor-grabbing',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <span className="text-lg">{comp.icon.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {comp.label}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {comp.isContainer ? 'Container' : 'Element'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ========================================
// Layers Tab
// ========================================

function LayersTab() {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    toggleExpanded,
    expandedNodeIds,
    currentPageId,
  } = useCanvasStore();

  const rootNodes = Object.values(nodes)
    .filter((n) => n.pageId === currentPageId && n.parentId === null)
    .sort((a, b) => a.order - b.order);

  const renderNode = (node: (typeof nodes)[string], depth = 0) => {
    const children = Object.values(nodes)
      .filter((n) => n.parentId === node.id)
      .sort((a, b) => a.order - b.order);

    const hasChildren = children.length > 0;
    const isExpanded = expandedNodeIds.includes(node.id);
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex items-center gap-1 py-1 px-2 cursor-pointer select-none',
            'hover:bg-muted transition-colors',
            isSelected && 'bg-primary/10 text-primary',
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => selectNode(node.id)}
        >
          <button
            className={cn(
              'w-4 h-4 flex items-center justify-center rounded',
              'hover:bg-muted-foreground/20',
              !hasChildren && 'invisible',
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
          <span className="text-xs font-medium">{node.type}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            #{node.order}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>{children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="py-2">
        {rootNodes.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No layers yet
          </div>
        ) : (
          rootNodes.map((node) => renderNode(node))
        )}
      </div>
    </ScrollArea>
  );
}

// ========================================
// Pages Tab
// ========================================

function PagesTab() {
  const { pages, currentPageId, setCurrentPage, addNode } = useCanvasStore();

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <Button variant="outline" className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {pages.map((page) => (
            <button
              key={page.id}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left',
                'hover:bg-muted transition-colors',
                currentPageId === page.id && 'bg-primary/10 text-primary',
              )}
              onClick={() => setCurrentPage(page.id)}
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{page.name}</p>
                <p className="text-xs text-muted-foreground">/{page.slug}</p>
              </div>
              {page.isEntry && (
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                  Entry
                </span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
