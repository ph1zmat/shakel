import { createMistral } from '@ai-sdk/mistral';
import { generateText } from 'ai';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import type { NodeExecutor } from '@/features/executions/types';
import { mistralChannel } from '@/inngest/channels/mistral';
import prisma from '@/lib/db';
import { decrypt } from '@/lib/excryption';
import { AVAILABLE_MODELS } from './dialog';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type MistralData = {
  variableName?: string;
  model?: (typeof AVAILABLE_MODELS)[number];
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const mistralExecutor: NodeExecutor<MistralData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await publish(
    mistralChannel().status({
      nodeId,
      status: 'loading',
    }),
  );

  if (!data.variableName) {
    await publish(
      mistralChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError('Variable name is required.');
  }

  if (!data.credentialId) {
    await publish(
      mistralChannel().status({
        nodeId,
        status: 'error',
      }),
    );
    throw new NonRetriableError('Credential is required.');
  }

  if (!data.userPrompt) {
    await publish(
      mistralChannel().status({
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
    throw new NonRetriableError('Mistral node: Credential not found.');
  }

  const mistral = createMistral({
    apiKey: decrypt(credential.value),
  });

  try {
    const { steps } = await step.ai.wrap(
      'mistral-generate-text',
      generateText,
      {
        model: mistral(data.model || AVAILABLE_MODELS[0]),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

    await publish(
      mistralChannel().status({
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
      mistralChannel().status({
        nodeId,
        status: 'error',
      }),
    );

    throw new NonRetriableError(
      `Failed to generate text with Mistral API: ${error instanceof Error ? error.message : String(error)}`,
      error as Error,
    );
  }
};
