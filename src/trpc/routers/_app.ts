import { builderRouter } from '@/features/builder/server/router';
import { credentialsRouter } from '@/features/credentials/server/router';
import { designSystemRouter } from '@/features/design-system/server/router';
import { executionsRouter } from '@/features/executions/server/router';
import { projectRouter } from '@/features/project/server/router';
import { workflowsRouter } from '@/features/workflows/server/router';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
  designSystem: designSystemRouter,
  projects: projectRouter,
  builder: builderRouter,
});

export type AppRouter = typeof appRouter;
