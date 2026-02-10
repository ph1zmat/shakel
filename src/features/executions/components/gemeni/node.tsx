'use client';

import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { GEMINI_CHANNEL_NAME } from '@/inngest/channels/gemeni';
import { useNodeStatus } from '../../hooks/use-node-status';
import { BaseExecutionNode } from '../base-execution-node';
import { fetchGeminiRealtimeToken } from './actions';
import {
  AVAILABLE_MODELS,
  GeminiDialog,
  type GeminiFormValues,
} from './dialog';

type GeminiNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GEMINI_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchGeminiRealtimeToken,
  });

  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: GeminiFormValues) => {
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

  const nodeData = props.data as GeminiNodeData;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 30)}${
        nodeData.userPrompt.length > 30 ? '...' : ''
      }`
    : 'Not configured';

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        icon={'/logos/gemini.svg'}
        status={nodeStatus}
      />
    </>
  );
});

GeminiNode.displayName = 'GeminiNode';
