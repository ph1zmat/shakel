import type { NodeExecutor } from '@/features/executions/types'

export const stripeTriggerExecutor: NodeExecutor = async ({ context }) => {
	return context
}
