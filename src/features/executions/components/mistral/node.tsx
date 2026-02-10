'use client';

import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { MISTRAL_CHANNEL_NAME } from '@/inngest/channels/mistral';
import { useNodeStatus } from '../../hooks/use-node-status';
import { BaseExecutionNode } from '../base-execution-node';
import { fetchMistralRealtimeToken } from './actions';
import {
  AVAILABLE_MODELS,
  MistralDialog,
  type MistralFormValues,
} from './dialog';

type MistralNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type MistralNodeType = Node<MistralNodeData>;

export const MistralNode = memo((props: NodeProps<MistralNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MISTRAL_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchMistralRealtimeToken,
  });

  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: MistralFormValues) => {
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

  const nodeData = props.data as MistralNodeData;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 30)}${
        nodeData.userPrompt.length > 30 ? '...' : ''
      }`
    : 'Not configured';

  return (
    <>
      <MistralDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Mistral"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        icon={'/logos/mistral.svg'}
        status={nodeStatus}
      />
    </>
  );
});

MistralNode.displayName = 'MistralNode';
