'use server';

import { getSubscriptionToken, type Realtime } from '@inngest/realtime';
import { ollamaChannel } from '@/inngest/channels/ollama';
import { inngest } from '@/inngest/client';

export type OllamaToken = Realtime.Token<typeof ollamaChannel, ['status']>;

export async function fetchOllamaRealtimeToken(): Promise<OllamaToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: ollamaChannel(),
    topics: ['status'],
  });
  return token;
}
