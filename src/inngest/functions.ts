import { NonRetriableError } from 'inngest';
import { getExecutor } from '@/features/executions/lib/executor-registry';
import { ExecutionStatus, type NodeType } from '@/generated/prisma/enums';
import { inngest } from '@/inngest/client';
import prisma from '@/lib/db';
import { deepseekChannel } from './channels/deepseek';
import { discordChannel } from './channels/discord';
import { geminiChannel } from './channels/gemeni';
import { googleFormTriggerChannel } from './channels/google-form-trigger';
import { httpRequestChannel } from './channels/http-request';
import { manualTriggerChannel } from './channels/manual-trigger';
import { mistralChannel } from './channels/mistral';
import { ollamaChannel } from './channels/ollama';
import { slackChannel } from './channels/slack';
import { stripeTriggerChannel } from './channels/stripe-trigger';
import { topologicalSort } from './utils';

export const executeWorkflow = inngest.createFunction(
  {
    id: 'execute-workflow',
    retries: process.env.NODE_ENV === 'production' ? 2 : 0,
    onFailure: async ({ event, step }) => {
      return prisma.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  {
    event: 'workflows/execute.workflow',
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      discordChannel(),
      geminiChannel(),
      deepseekChannel(),
      slackChannel(),
      mistralChannel(),
      ollamaChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError('Workflow ID is missing');
    }

    await step.run('create-execution', async () => {
      await prisma.execution.create({
        data: {
          inngestEventId,
          workflowId,
        },
      });
    });

    const sortedNodes = await step.run('prepare-workflow', async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run('find-user-id', async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });

      return workflow.userId;
    });

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });
    }

    await step.run('update-execution', async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return {
      workflowId,
      result: context,
    };
  },
);
