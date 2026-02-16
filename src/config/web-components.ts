/**
 * Web-specific component configuration.
 * Re-exports web components from the central component registry.
 */

import { getComponentsByPlatform } from '@/lib/codegen/component-registry'

export const webComponents = getComponentsByPlatform('web')

export const webComponentTypes = webComponents.map(c => c.type)

export const webContainerTypes = webComponents
	.filter(c => c.isContainer)
	.map(c => c.type)
