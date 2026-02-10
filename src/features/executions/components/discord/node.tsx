'use client';

import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { memo, useState } from 'react';
import { DISCORD_CHANNEL_NAME } from '@/inngest/channels/discord';
import { useNodeStatus } from '../../hooks/use-node-status';
import { BaseExecutionNode } from '../base-execution-node';
import { fetchDiscordRealtimeToken } from './actions';
import { DiscordDialog, type DiscordFormValues } from './dialog';

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchDiscordRealtimeToken,
  });

  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: DiscordFormValues) => {
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

  const nodeData = props.data as DiscordNodeData;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 30)}${
        nodeData.content.length > 30 ? '...' : ''
      }`
    : 'Not configured';

  return (
    <>
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="Discord"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        icon={'/logos/discord.svg'}
        status={nodeStatus}
      />
    </>
  );
});

DiscordNode.displayName = 'DiscordNode';
