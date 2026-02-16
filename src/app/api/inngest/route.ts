import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { executeWorkflow } from '@/inngest/functions'
import { processAiGeneration } from '@/inngest/functions/ai-generate'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = serve({
	client: inngest,
	functions: [executeWorkflow, processAiGeneration],
})

export const GET = handler.GET
export const POST = handler.POST
export const PUT = handler.PUT
