'use client';

import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { OLLAMA_CHANNEL_NAME } from '@/inngest/channels/ollama';
import { useNodeStatus } from '../../hooks/use-node-status';
import { BaseExecutionNode } from '../base-execution-node';
import { fetchOllamaRealtimeToken } from './actions';
import {
  AVAILABLE_MODELS,
  OllamaDialog,
  type OllamaFormValues,
} from './dialog';

type OllamaNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type OllamaNodeType = Node<OllamaNodeData>;

export const OllamaNode = memo((props: NodeProps<OllamaNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OLLAMA_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchOllamaRealtimeToken,
  });

  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: OllamaFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const nodeData = props.data as OllamaNodeData;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 30)}${
        nodeData.userPrompt.length > 30 ? '...' : ''
      }`
    : 'Not configured';

  return (
    <>
      <OllamaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Ollama"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        icon={'/logos/ollama.svg'}
        status={nodeStatus}
      />
    </>
  );
});

OllamaNode.displayName = 'OllamaNode';
