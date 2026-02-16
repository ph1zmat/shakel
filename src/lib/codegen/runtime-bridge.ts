/**
 * WorkflowRuntimeBridge — встраивается в сгенерированный Next.js код
 * для связи UI-интеракций с Workflow через Inngest.
 */

export interface InteractionRuntime {
	type: string
	config: Record<string, unknown>
	workflowId?: string
}

export interface RuntimeContext {
	formData?: Record<string, unknown>
	pageSlug?: string
	userId?: string
	[key: string]: unknown
}

export class WorkflowRuntimeBridge {
	private baseUrl: string

	constructor(baseUrl = '') {
		this.baseUrl = baseUrl
	}

	async trigger(
		interaction: InteractionRuntime,
		context: RuntimeContext,
	): Promise<void> {
		switch (interaction.type) {
			case 'TRIGGER_WORKFLOW':
				await this.triggerWorkflow(interaction, context)
				break

			case 'NAVIGATE':
				this.navigate(interaction.config)
				break

			case 'OPEN_MODAL':
				this.openModal(interaction.config)
				break

			case 'SHOW_FORM':
				this.toggleFormVisibility(interaction.config, true)
				break

			case 'HIDE_FORM':
				this.toggleFormVisibility(interaction.config, false)
				break

			case 'SET_STATE':
				this.setState(interaction.config)
				break

			case 'SCROLL_TO':
				this.scrollTo(interaction.config)
				break

			default:
				console.warn(
					`[RuntimeBridge] Unknown interaction type: ${interaction.type}`,
				)
		}
	}

	private async triggerWorkflow(
		interaction: InteractionRuntime,
		context: RuntimeContext,
	): Promise<void> {
		const { workflowId } = interaction
		const { inputMapping } = interaction.config as {
			inputMapping?: Record<string, string>
		}

		if (!workflowId) {
			console.error('[RuntimeBridge] No workflowId provided')
			return
		}

		// Map form inputs to workflow inputs
		const input: Record<string, unknown> = {}
		if (inputMapping && context.formData) {
			for (const [formField, workflowInput] of Object.entries(inputMapping)) {
				input[workflowInput] = context.formData[formField]
			}
		}

		try {
			const response = await fetch(`${this.baseUrl}/api/workflows/trigger`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					workflowId,
					input,
					context: {
						pageSlug: context.pageSlug,
						userId: context.userId,
					},
				}),
			})

			if (!response.ok) {
				throw new Error(`Workflow trigger failed: ${response.statusText}`)
			}
		} catch (error) {
			console.error('[RuntimeBridge] Failed to trigger workflow:', error)
			throw error
		}
	}

	private navigate(config: Record<string, unknown>): void {
		const url = config.url as string
		const newTab = config.newTab as boolean

		if (newTab) {
			window.open(url, '_blank')
		} else {
			window.location.href = url
		}
	}

	private openModal(config: Record<string, unknown>): void {
		const modalId = config.modalId as string
		const event = new CustomEvent('runtime:openModal', { detail: { modalId } })
		window.dispatchEvent(event)
	}

	private toggleFormVisibility(
		config: Record<string, unknown>,
		visible: boolean,
	): void {
		const formId = config.formId as string
		const event = new CustomEvent('runtime:toggleForm', {
			detail: { formId, visible },
		})
		window.dispatchEvent(event)
	}

	private setState(config: Record<string, unknown>): void {
		const { key, value } = config
		const event = new CustomEvent('runtime:setState', {
			detail: { key, value },
		})
		window.dispatchEvent(event)
	}

	private scrollTo(config: Record<string, unknown>): void {
		const target = config.target as string
		const element =
			document.getElementById(target) ?? document.querySelector(target)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
	}
}

// Singleton instance for generated code
export const runtimeBridge = new WorkflowRuntimeBridge()
