import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import Handlebars from 'handlebars'
import { NonRetriableError } from 'inngest'
import type { NodeExecutor } from '@/features/executions/types'
import { openaiChannel } from '@/inngest/channels/openai'
import prisma from '@/lib/db'
import { decrypt } from '@/lib/encryption'

Handlebars.registerHelper('json', (context: unknown) => {
	const jsonString = JSON.stringify(context, null, 2)
	const safeString = new Handlebars.SafeString(jsonString)

	return safeString
})

export const AVAILABLE_MODELS = [
	'gpt-4o',
	'gpt-4o-mini',
	'gpt-4-turbo',
	'gpt-4',
	'gpt-3.5-turbo',
] as const

type OpenAIData = {
	variableName?: string
	model?: (typeof AVAILABLE_MODELS)[number]
	credentialId?: string
	systemPrompt?: string
	userPrompt?: string
}

export const openaiExecutor: NodeExecutor<OpenAIData> = async ({
	data,
	nodeId,
	userId,
	context,
	step,
	publish,
}) => {
	await publish(
		openaiChannel().status({
			nodeId,
			status: 'loading',
		}),
	)

	if (!data.variableName) {
		await publish(
			openaiChannel().status({
				nodeId,
				status: 'error',
			}),
		)
		throw new NonRetriableError('Variable name is required.')
	}

	if (!data.credentialId) {
		await publish(
			openaiChannel().status({
				nodeId,
				status: 'error',
			}),
		)
		throw new NonRetriableError('Credential is required.')
	}

	if (!data.userPrompt) {
		await publish(
			openaiChannel().status({
				nodeId,
				status: 'error',
			}),
		)
		throw new NonRetriableError('User prompt is required.')
	}

	const systemPrompt = data.systemPrompt
		? Handlebars.compile(data.systemPrompt)(context)
		: 'You are a helpful assistant.'

	const userPrompt = Handlebars.compile(data.userPrompt)(context)

	const credential = await step.run('get-credential', () => {
		return prisma.credential.findUnique({
			where: { id: data.credentialId, userId },
		})
	})

	if (!credential) {
		throw new NonRetriableError('OpenAI node: Credential not found.')
	}

	const openai = createOpenAI({
		apiKey: decrypt(credential.value),
	})

	try {
		const { steps } = await step.ai.wrap('openai-generate-text', generateText, {
			model: openai(data.model || AVAILABLE_MODELS[0]),
			system: systemPrompt,
			prompt: userPrompt,
			experimental_telemetry: {
				isEnabled: true,
				recordInputs: true,
				recordOutputs: true,
			},
		})

		const text =
			steps[0].content[0].type === 'text' ? steps[0].content[0].text : ''

		await publish(
			openaiChannel().status({
				nodeId,
				status: 'success',
			}),
		)

		return {
			...context,
			[data.variableName]: {
				text: text,
			},
		}
	} catch (error) {
		await publish(
			openaiChannel().status({
				nodeId,
				status: 'error',
			}),
		)

		throw new NonRetriableError(
			'Failed to generate text with OpenAI API.',
			error as Error,
		)
	}
}
