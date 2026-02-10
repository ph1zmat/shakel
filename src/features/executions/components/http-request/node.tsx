'use client';

import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { GlobeIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { HTTP_REQUEST_CHANNEL_NAME } from '@/inngest/channels/http-request';
import { useNodeStatus } from '../../hooks/use-node-status';
import { BaseExecutionNode } from '../base-execution-node';
import { fetchHttpRequestRealtimeToken } from '../http-request/actions';
import { HttpRequestDialog, type HttpRequestFormValues } from './dialog';

type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: HTTP_REQUEST_CHANNEL_NAME,
    topic: 'status',
    refreshToken: fetchHttpRequestRealtimeToken,
  });

  const { setNodes } = useReactFlow();

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: HttpRequestFormValues) => {
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

  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData?.endpoint
    ? `${nodeData.method || 'GET'} ${nodeData.endpoint}`
    : 'Not configured';

  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="HTTP Request"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        icon={GlobeIcon}
        status={nodeStatus}
      />
    </>
  );
});

HttpRequestNode.displayName = 'HttpRequestNode';
