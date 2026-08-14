import type { NodeExecutor } from '@/features/executions/types';

export const googleFormTriggerExecutor: NodeExecutor = async ({
  context,
}) => {
  return context;
};
