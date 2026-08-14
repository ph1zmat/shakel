'use client';

import {
  Copy,
  Monitor,
  Palette,
  Plus,
  Settings,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getComponentDefinition } from '@/lib/codegen/component-registry';
import { cn } from '@/lib/utils';
import { useCanvasStore, useSelectedNode } from '../../stores/canvas-store';
import type { ViewportType } from '../../types';

const viewportIcons: Record<ViewportType, typeof Smartphone> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

export function RightPanel() {
  const { ui, setActiveRightTab, viewport } = useCanvasStore();
  const selectedNode = useSelectedNode();

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs
        value={ui.activeRightTab}
        onValueChange={(v) => setActiveRightTab(v as typeof ui.activeRightTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-10">
          <TabsTrigger
            value="properties"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Properties
          </TabsTrigger>
          <TabsTrigger
            value="styles"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
          >
            <Palette className="h-4 w-4 mr-2" />
            Styles
          </TabsTrigger>
          <TabsTrigger
            value="interactions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
          >
            <Zap className="h-4 w-4 mr-2" />
            Actions
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 m-0 p-0">
          <PropertiesTab />
        </TabsContent>
        <TabsContent value="styles" className="flex-1 m-0 p-0">
          <StylesTab />
        </TabsContent>
        <TabsContent value="interactions" className="flex-1 m-0 p-0">
          <InteractionsTab />
        </TabsContent>
        <TabsContent value="ai" className="flex-1 m-0 p-0">
          <AITab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ========================================
// Properties Tab
// ========================================

function PropertiesTab() {
  const selectedNode = useSelectedNode();
  const { updateNodeProps, removeNode, duplicateNode } = useCanvasStore();

  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Settings className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm">Select a component to edit properties</p>
      </div>
    );
  }

  const def = getComponentDefinition(selectedNode.type);
  if (!def) return null;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Component Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{def.label}</h3>
            <p className="text-xs text-muted-foreground">{def.type}</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => duplicateNode(selectedNode.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => removeNode(selectedNode.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Props */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Properties
          </h4>
          {def.props.map((prop) => (
            <div key={prop.name} className="space-y-2">
              <Label className="text-xs">{prop.label}</Label>
              {prop.type === 'string' && (
                <Input
                  value={(selectedNode.props[prop.name] as string) || ''}
                  onChange={(e) =>
                    updateNodeProps(selectedNode.id, {
                      [prop.name]: e.target.value,
                    })
                  }
                  className="h-8"
                />
              )}
              {prop.type === 'select' && (
                <Select
                  value={(selectedNode.props[prop.name] as string) || ''}
                  onValueChange={(v) =>
                    updateNodeProps(selectedNode.id, { [prop.name]: v })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prop.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {prop.type === 'boolean' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{prop.label}</span>
                  <Switch
                    checked={
                      (selectedNode.props[prop.name] as boolean) || false
                    }
                    onCheckedChange={(v) =>
                      updateNodeProps(selectedNode.id, { [prop.name]: v })
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

// ========================================
// Styles Tab
// ========================================

function StylesTab() {
  const selectedNode = useSelectedNode();
  const { viewport, updateStyleValue, updateResponsiveStyle } =
    useCanvasStore();
  const [activeStyleViewport, setActiveStyleViewport] = useState<
    ViewportType | 'base'
  >('base');

  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Palette className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm">Select a component to edit styles</p>
      </div>
    );
  }

  const def = getComponentDefinition(selectedNode.type);
  if (!def) return null;

  const styleState = activeStyleViewport === 'base' ? 'base' : 'responsive';
  const currentStyles =
    activeStyleViewport === 'base'
      ? selectedNode.styles.base
      : selectedNode.styles.responsive?.[activeStyleViewport as 'sm' | 'md' | 'lg' | 'xl' | '2xl'] || {};

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Viewport Selector */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={activeStyleViewport === 'base' ? 'secondary' : 'ghost'}
            size="sm"
            className="flex-1 h-7 text-xs"
            onClick={() => setActiveStyleViewport('base')}
          >
            Base
          </Button>
          {(Object.keys(viewport.viewports) as ViewportType[]).map((vp) => {
            const Icon = viewportIcons[vp];
            return (
              <Button
                key={vp}
                variant={activeStyleViewport === vp ? 'secondary' : 'ghost'}
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={() => setActiveStyleViewport(vp)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {vp.charAt(0).toUpperCase() + vp.slice(1)}
              </Button>
            );
          })}
        </div>

        {/* Style Properties */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {activeStyleViewport === 'base'
              ? 'Base Styles'
              : `${activeStyleViewport} Styles`}
          </h4>
          {def.styleProperties.map((prop) => (
            <StyleInput
              key={prop.name}
              prop={prop}
              value={currentStyles[prop.name]}
              onChange={(value) => {
                if (activeStyleViewport === 'base') {
                  updateStyleValue(selectedNode.id, 'base', prop.name, value);
                } else {
                  updateResponsiveStyle(
                    selectedNode.id,
                    activeStyleViewport as 'sm' | 'md' | 'lg' | 'xl' | '2xl',
                    prop.name,
                    value,
                  );
                }
              }}
            />
          ))}
        </div>

        {/* States */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            States
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {['hover', 'focus', 'active', 'disabled'].map((state) => (
              <Button
                key={state}
                variant="outline"
                size="sm"
                className="text-xs capitalize"
              >
                {state}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

interface StyleInputProps {
  prop: { name: string; label: string; type: string };
  value: { type: 'token' | 'static'; value: string | number } | undefined;
  onChange: (
    value: { type: 'token' | 'static'; value: string | number } | null,
  ) => void;
}

function StyleInput({ prop, value, onChange }: StyleInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{prop.label}</Label>
      <div className="flex gap-2">
        {prop.type === 'color' && (
          <div className="flex gap-2 w-full">
            <Input
              type="color"
              value={(value?.value as string) || '#000000'}
              onChange={(e) =>
                onChange({ type: 'static', value: e.target.value })
              }
              className="w-10 h-8 p-1"
            />
            <Input
              value={(value?.value as string) || ''}
              onChange={(e) =>
                onChange({ type: 'static', value: e.target.value })
              }
              className="flex-1 h-8"
              placeholder="Color value"
            />
          </div>
        )}
        {prop.type === 'spacing' && (
          <Select
            value={(value?.value as string) || ''}
            onValueChange={(v) => onChange({ type: 'token', value: v })}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select spacing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="xs">XS (0.25rem)</SelectItem>
              <SelectItem value="sm">SM (0.5rem)</SelectItem>
              <SelectItem value="md">MD (1rem)</SelectItem>
              <SelectItem value="lg">LG (1.5rem)</SelectItem>
              <SelectItem value="xl">XL (2rem)</SelectItem>
            </SelectContent>
          </Select>
        )}
        {prop.type === 'dimension' && (
          <Input
            type="text"
            value={(value?.value as string) || ''}
            onChange={(e) =>
              onChange({ type: 'static', value: e.target.value })
            }
            className="h-8"
            placeholder="e.g., 16px, 1rem"
          />
        )}
      </div>
    </div>
  );
}

// ========================================
// Interactions Tab
// ========================================

function InteractionsTab() {
  const selectedNode = useSelectedNode();
  const { addInteraction, removeInteraction } = useCanvasStore();

  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Zap className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm">Select a component to add interactions</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Interactions</h3>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {selectedNode.interactions.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No interactions yet
          </div>
        ) : (
          <div className="space-y-2">
            {selectedNode.interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="p-3 border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize">
                    {interaction.trigger.replace('on', '')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      removeInteraction(selectedNode.id, interaction.id)
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm">{interaction.type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// ========================================
// AI Tab
// ========================================

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { AI_ASSISTANTS } from '../../types';

function AITab() {
  const [command, setCommand] = useState('');
  const { viewport } = useCanvasStore();

  const handleCommandSubmit = () => {
    // TODO: Implement AI command handling
    console.log('AI Command:', command);
    setCommand('');
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg">
          <h3 className="font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Assistant
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Use AI to generate, style, or modify your design
          </p>
        </div>

        {/* Command Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Describe what you want to create or modify..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button
            className="w-full"
            size="sm"
            onClick={handleCommandSubmit}
            disabled={!command.trim()}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </div>

        {/* Quick Commands */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Commands
          </h4>
          <div className="space-y-1">
            {AI_ASSISTANTS.map((assistant) => (
              <button
                key={assistant.id}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-muted transition-colors"
                onClick={() => setCommand(assistant.command + ' ')}
              >
                <span className="text-sm">{assistant.command}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {assistant.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Responsive AI */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Responsive Optimization
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(viewport.viewports) as ViewportType[]).map((vp) => {
              const Icon = viewportIcons[vp];
              return (
                <Button
                  key={vp}
                  variant="outline"
                  size="sm"
                  className="h-16 flex flex-col gap-1"
                  onClick={() => setCommand(`/responsive optimize for ${vp}`)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] capitalize">{vp}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
