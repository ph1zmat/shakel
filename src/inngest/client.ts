import { realtimeMiddleware } from '@inngest/realtime/middleware';
import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'Nodebase Inngest Client',
  middleware: [realtimeMiddleware()],
});
