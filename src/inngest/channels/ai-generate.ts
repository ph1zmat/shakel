import { channel, topic } from '@inngest/realtime'

export const AI_GENERATE_CHANNEL_NAME = 'ai-generate'

export const aiGenerateChannel = channel(AI_GENERATE_CHANNEL_NAME).addTopic(
	topic('status').type<{
		jobId: string
		status: 'pending' | 'running' | 'completed' | 'failed'
		explanation?: string
		error?: string
		nodeCount?: number
	}>(),
)
