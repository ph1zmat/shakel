'use server'

import { getSubscriptionToken, type Realtime } from '@inngest/realtime'
import { aiGenerateChannel } from '@/inngest/channels/ai-generate'
import { inngest } from '@/inngest/client'

export type AiGenerateToken = Realtime.Token<
	typeof aiGenerateChannel,
	['status']
>

export async function fetchAiGenerateRealtimeToken(): Promise<AiGenerateToken> {
	const token = await getSubscriptionToken(inngest, {
		channel: aiGenerateChannel(),
		topics: ['status'],
	})
	return token
}
