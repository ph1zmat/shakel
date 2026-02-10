import { generateText } from 'ai';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import { createOllama } from 'ollama-ai-provider-v2';
import type { NodeExecutor } from '@/fetures/executions/types';
import { ollamaChannel } from '@/inngest/channels/ollama';
import prisma from '@/lib/db';
import { AVAILABLE_MODELS } from './dialog';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type OllamaData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const ollamaExecutor: NodeExecutor<OllamaData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await publish(
    ollamaChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableName) {
    await publish(
      ollamaChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError('Variable name is required.');
  }

  if (!data.credentialId) {
    await publish(
      ollamaChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError('Credential is required.');
  }

  if (!data.userPrompt) {
    await publish(
      ollamaChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError('User prompt is required.');
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : 'You are a helpful assistant.';

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run('get-credential', () => {
    return prisma.credential.findUnique({
      where: { id: data.credentialId, userId },
    });
  });

  if (!credential) {
    throw new NonRetriableError('Ollama node: Credential not found.');
  }

  // credential.value should be the Ollama server URL, e.g., http://localhost:11434
  const ollama = createOllama({
    baseURL: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap('ollama-generate-text', generateText, {
      model: ollama(data.model || AVAILABLE_MODELS[0]),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

    await publish(
      ollamaChannel().status({
        nodeId,
        status: 'success',
      }),
    );

    return {
      ...context,
      [data.variableName]: {
        text: text,
      },
    };
  } catch (error) {
    await publish(
      ollamaChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError(
      `Failed to generate text with Ollama API: ${error instanceof Error ? error.message : String(error)}`,
      error as Error,
    );
  }
};
