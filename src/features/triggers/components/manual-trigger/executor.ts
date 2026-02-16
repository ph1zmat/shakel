import type { NodeExecutor } from '@/features/executions/types'

export const manualTriggerExecutor: NodeExecutor = async ({ context }) => {
	return context
}
