import { channel, topic } from '@inngest/realtime';

export const OLLAMA_CHANNEL_NAME = 'ollama';

export const ollamaChannel = channel(OLLAMA_CHANNEL_NAME).addTopic(
  topic('status').type<{
    nodeId: string;
    status: 'loading' | 'success' | 'error';
  }>(),
);
