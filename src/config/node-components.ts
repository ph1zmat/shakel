/**
 * Node (workflow) component configuration.
 * Maps workflow NodeType to available configurations.
 */

import type { NodeType } from '@/generated/prisma/client'

export interface NodeComponentConfig {
	type: NodeType
	label: string
	description: string
	icon: string
	category: 'trigger' | 'action' | 'ai' | 'integration'
	hasCredential: boolean
	defaultData: Record<string, unknown>
}

export const nodeComponents: NodeComponentConfig[] = [
	{
		type: 'INITIAL',
		label: 'Start',
		description: 'Entry point of the workflow',
		icon: 'Play',
		category: 'trigger',
		hasCredential: false,
		defaultData: {},
	},
	{
		type: 'MANUAL_TRIGGER',
		label: 'Manual Trigger',
		description: 'Triggered manually or by UI interaction',
		icon: 'Hand',
		category: 'trigger',
		hasCredential: false,
		defaultData: {},
	},
	{
		type: 'HTTP_REQUEST',
		label: 'HTTP Request',
		description: 'Make an HTTP request',
		icon: 'Globe',
		category: 'action',
		hasCredential: false,
		defaultData: { method: 'GET', url: '', headers: {}, body: '' },
	},
	{
		type: 'GOOGLE_FORM_TRIGGER',
		label: 'Google Form',
		description: 'Triggered by Google Form submission',
		icon: 'FileText',
		category: 'trigger',
		hasCredential: true,
		defaultData: { formId: '' },
	},
	{
		type: 'STRIPE_TRIGGER',
		label: 'Stripe Webhook',
		description: 'Triggered by Stripe events',
		icon: 'CreditCard',
		category: 'trigger',
		hasCredential: true,
		defaultData: { events: [] },
	},
	{
		type: 'OPENAI',
		label: 'OpenAI',
		description: 'Generate text with OpenAI',
		icon: 'Brain',
		category: 'ai',
		hasCredential: true,
		defaultData: { model: 'gpt-4', prompt: '', temperature: 0.7 },
	},
	{
		type: 'ANTHROPIC',
		label: 'Anthropic',
		description: 'Generate text with Claude',
		icon: 'Brain',
		category: 'ai',
		hasCredential: true,
		defaultData: { model: 'claude-3-opus', prompt: '', temperature: 0.7 },
	},
	{
		type: 'GEMINI',
		label: 'Gemini',
		description: 'Generate text with Google Gemini',
		icon: 'Sparkles',
		category: 'ai',
		hasCredential: true,
		defaultData: { model: 'gemini-pro', prompt: '' },
	},
	{
		type: 'DEEPSEEK',
		label: 'DeepSeek',
		description: 'Generate text with DeepSeek',
		icon: 'Search',
		category: 'ai',
		hasCredential: true,
		defaultData: { model: 'deepseek-chat', prompt: '' },
	},
	{
		type: 'MISTRAL',
		label: 'Mistral',
		description: 'Generate text with Mistral',
		icon: 'Wind',
		category: 'ai',
		hasCredential: true,
		defaultData: { model: 'mistral-medium', prompt: '' },
	},
	{
		type: 'OLLAMA',
		label: 'Ollama',
		description: 'Run local LLM with Ollama',
		icon: 'Server',
		category: 'ai',
		hasCredential: true,
		defaultData: { model: 'llama2', prompt: '' },
	},
	{
		type: 'DISCORD',
		label: 'Discord',
		description: 'Send message to Discord',
		icon: 'MessageCircle',
		category: 'integration',
		hasCredential: true,
		defaultData: { channelId: '', message: '' },
	},
	{
		type: 'SLACK',
		label: 'Slack',
		description: 'Send message to Slack',
		icon: 'Hash',
		category: 'integration',
		hasCredential: true,
		defaultData: { channel: '', message: '' },
	},
]

export function getNodeComponentConfig(
	type: NodeType,
): NodeComponentConfig | undefined {
	return nodeComponents.find(c => c.type === type)
}

export function getNodesByCategory(
	category: NodeComponentConfig['category'],
): NodeComponentConfig[] {
	return nodeComponents.filter(c => c.category === category)
}
