'use client';

import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { DEEPSEEK_CHANNEL_NAME } from '@/inngest/channels/deepseek';
import { useNodeStatus } from '../../hooks/use-node-status';
import { BaseExecutionNode } from '../base-execution-node';
import { fetchDeepSeekRealtimeToken } from './actions';
import {
  AVAILABLE_MODELS,
  DeepSeekDialog,
  type DeepSeekFormValues,
} from './dialog';

type DeepSeekNodeData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  systemPrompt?: string;
  userPrompt?: string;
};

type DeepSeekNodeType = Node<DeepSeekNodeData>;

export const DeepSeekNode = memo((props: NodeProps<DeepSeekNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DEEPSEEK_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchDeepSeekRealtimeToken,
  });

  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: DeepSeekFormValues) => {
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

  const nodeData = props.data as DeepSeekNodeData;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || AVAILABLE_MODELS[0]}: ${nodeData.userPrompt.slice(0, 30)}${
        nodeData.userPrompt.length > 30 ? '...' : ''
      }`
    : 'Not configured';

  return (
    <>
      <DeepSeekDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="DeepSeek"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        icon={'/logos/deepseek.svg'}
        status={nodeStatus}
      />
    </>
  );
});

DeepSeekNode.displayName = 'DeepSeekNode';
