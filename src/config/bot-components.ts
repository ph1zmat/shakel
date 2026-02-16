/**
 * Bot-specific component configuration.
 * Re-exports telegram components from the central component registry.
 */

import { getComponentsByPlatform } from '@/lib/codegen/component-registry'

export const botComponents = getComponentsByPlatform('telegram')

export const botComponentTypes = botComponents.map(c => c.type)

export const botContainerTypes = botComponents
	.filter(c => c.isContainer)
	.map(c => c.type)
