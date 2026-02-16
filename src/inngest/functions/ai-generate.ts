import { NonRetriableError } from 'inngest'
import { inngest } from '@/inngest/client'
import prisma from '@/lib/db'
import { generateWithMistral } from '@/features/builder/server/ai-generate'
import { aiGenerateChannel } from '@/inngest/channels/ai-generate'
import type { AIGenerateRequest } from '@/features/builder/server/ai-generate'

export const processAiGeneration = inngest.createFunction(
	{
		id: 'process-ai-generation',
		retries: 2,
		onFailure: async ({ event }) => {
			const jobId = event.data.event.data.jobId as string
			if (!jobId) return

			await prisma.aiGenerationJob.update({
				where: { id: jobId },
				data: {
					status: 'FAILED',
					error: event.data.error.message,
					completedAt: new Date(),
				},
			})
		},
	},
	{
		event: 'builder/ai.generate',
		channels: [aiGenerateChannel()],
	},
	async ({ event, step, publish }) => {
		const { jobId, prompt, mode, pageId, originX, originY } = event.data as {
			jobId: string
			prompt: string
			mode: AIGenerateRequest['mode']
			pageId: string
			originX: number
			originY: number
		}

		if (!jobId) {
			throw new NonRetriableError('Job ID is missing')
		}

		// Step 1: Mark job as running
		await step.run('mark-running', async () => {
			await prisma.aiGenerationJob.update({
				where: { id: jobId },
				data: { status: 'RUNNING', inngestEventId: event.id },
			})
		})

		await publish(
			aiGenerateChannel().status({
				jobId,
				status: 'running' as const,
			}),
		)

		// Step 2: Call Mistral API
		const result = await step.run('call-mistral', async () => {
			return generateWithMistral({
				prompt,
				pageId,
				origin: { x: originX, y: originY },
				mode,
			})
		})

		// Step 3: Save results to DB
		await step.run('save-results', async () => {
			await prisma.aiGenerationJob.update({
				where: { id: jobId },
				data: {
					status: 'COMPLETED',
					resultNodes: JSON.parse(JSON.stringify(result.nodes)),
					explanation: result.explanation,
					completedAt: new Date(),
				},
			})
		})

		await publish(
			aiGenerateChannel().status({
				jobId,
				status: 'completed' as const,
				explanation: result.explanation,
				nodeCount: result.nodes.length,
			}),
		)

		return { jobId, nodeCount: result.nodes.length }
	},
)
