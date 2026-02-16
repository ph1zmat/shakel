'use client'

import { useSelectedNode, useCanvasStore } from '../../stores/canvas-store'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { IconPlus, IconTrash, IconChevronDown } from '@tabler/icons-react'

const TRIGGERS = [
	{ value: 'onClick', label: 'On Click' },
	{ value: 'onSubmit', label: 'On Submit' },
	{ value: 'onHover', label: 'On Hover' },
	{ value: 'onMount', label: 'On Mount' },
	{ value: 'onMessage', label: 'On Message (Bot)' },
] as const

const ACTION_TYPES = [
	{ value: 'NAVIGATE', label: 'Navigate', description: 'Go to another page' },
	{
		value: 'OPEN_MODAL',
		label: 'Open Modal',
		description: 'Show a modal dialog',
	},
	{
		value: 'TRIGGER_WORKFLOW',
		label: 'Trigger Workflow',
		description: 'Run an automation workflow',
	},
	{
		value: 'SEND_MESSAGE',
		label: 'Send Message',
		description: 'Send a bot message',
	},
] as const

export function InteractionsInspector() {
	const trpc = useTRPC()
	const node = useSelectedNode()
	const addInteraction = useCanvasStore(state => state.addInteraction)
	const removeInteraction = useCanvasStore(state => state.removeInteraction)
	const updateInteraction = useCanvasStore(state => state.updateInteraction)
	const project = useCanvasStore(state => state.project)

	const [isAdding, setIsAdding] = useState(false)
	const [newTrigger, setNewTrigger] = useState<string>('onClick')
	const [newType, setNewType] = useState<string>('NAVIGATE')
	const [newWorkflowId, setNewWorkflowId] = useState<string>('')

	const { data: workflows } = useQuery({
		...trpc.workflows.getAvailableForProject.queryOptions({
			projectId: project?.id ?? '',
		}),
		enabled: !!project?.id,
	})

	if (!node) {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select a component to manage interactions
			</div>
		)
	}

	const handleAdd = () => {
		const config: Record<string, unknown> = {}

		if (newType === 'TRIGGER_WORKFLOW' && newWorkflowId) {
			config.workflowId = newWorkflowId
		}

		addInteraction(node.id, {
			trigger: newTrigger as
				| 'onClick'
				| 'onSubmit'
				| 'onHover'
				| 'onMount'
				| 'onMessage',
			type: newType as
				| 'NAVIGATE'
				| 'OPEN_MODAL'
				| 'TRIGGER_WORKFLOW'
				| 'SEND_MESSAGE',
			config,
		})

		setIsAdding(false)
		setNewTrigger('onClick')
		setNewType('NAVIGATE')
		setNewWorkflowId('')
	}

	return (
		<div className='p-4 space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
					Interactions
				</h3>
				<button
					type='button'
					onClick={() => setIsAdding(!isAdding)}
					className='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
				>
					<IconPlus className='h-4 w-4' />
				</button>
			</div>

			{/* Existing interactions */}
			{node.interactions.length === 0 && !isAdding && (
				<div className='text-xs text-gray-400 text-center py-2'>
					No interactions yet
				</div>
			)}

			{node.interactions.map(interaction => (
				<InteractionCard
					key={interaction.id}
					interaction={interaction}
					workflows={workflows ?? []}
					onUpdate={updates =>
						updateInteraction(node.id, interaction.id, updates)
					}
					onRemove={() => removeInteraction(node.id, interaction.id)}
				/>
			))}

			{/* Add new interaction */}
			{isAdding && (
				<div className='p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 space-y-3'>
					<h4 className='text-xs font-medium text-gray-600 dark:text-gray-400'>
						New Interaction
					</h4>

					<div className='space-y-1.5'>
						<span className='text-[10px] text-gray-500'>Trigger</span>
						<select
							value={newTrigger}
							onChange={e => setNewTrigger(e.target.value)}
							className='w-full px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700'
						>
							{TRIGGERS.map(t => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>
					</div>

					<div className='space-y-1.5'>
						<span className='text-[10px] text-gray-500'>Action</span>
						<select
							value={newType}
							onChange={e => setNewType(e.target.value)}
							className='w-full px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700'
						>
							{ACTION_TYPES.map(a => (
								<option key={a.value} value={a.value}>
									{a.label}
								</option>
							))}
						</select>
					</div>

					{newType === 'TRIGGER_WORKFLOW' && (
						<div className='space-y-1.5'>
							<span className='text-[10px] text-gray-500'>Workflow</span>
							<select
								value={newWorkflowId}
								onChange={e => setNewWorkflowId(e.target.value)}
								className='w-full px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700'
							>
								<option value=''>Select workflow...</option>
								{workflows?.map(wf => (
									<option key={wf.id} value={wf.id}>
										{wf.name}
									</option>
								))}
							</select>
						</div>
					)}

					{newType === 'NAVIGATE' && (
						<div className='space-y-1.5'>
							<span className='text-[10px] text-gray-500'>URL</span>
							<input
								type='text'
								placeholder='/about'
								className='w-full px-2 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700'
							/>
						</div>
					)}

					<div className='flex gap-2'>
						<button
							type='button'
							onClick={handleAdd}
							className='flex-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600'
						>
							Add
						</button>
						<button
							type='button'
							onClick={() => setIsAdding(false)}
							className='px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-300'
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

function InteractionCard({
	interaction,
	workflows,
	onUpdate,
	onRemove,
}: {
	interaction: {
		id: string
		trigger: string
		type: string
		config: Record<string, unknown>
		order: number
	}
	workflows: Array<{ id: string; name: string }>
	onUpdate: (updates: Record<string, unknown>) => void
	onRemove: () => void
}) {
	const [isExpanded, setIsExpanded] = useState(false)

	const triggerLabel =
		TRIGGERS.find(t => t.value === interaction.trigger)?.label ??
		interaction.trigger
	const actionLabel =
		ACTION_TYPES.find(a => a.value === interaction.type)?.label ??
		interaction.type

	const workflowName =
		interaction.type === 'TRIGGER_WORKFLOW' && interaction.config.workflowId
			? (workflows.find(w => w.id === interaction.config.workflowId)?.name ??
				'Unknown')
			: null

	return (
		<div className='border rounded-lg overflow-hidden dark:border-gray-700'>
			{/* biome-ignore lint/a11y/useSemanticElements: expandable section header */}
			<div
				role='button'
				tabIndex={0}
				className='flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900 cursor-pointer'
				onClick={() => setIsExpanded(!isExpanded)}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						setIsExpanded(!isExpanded)
					}
				}}
			>
				<div className='flex-1 min-w-0'>
					<div className='text-xs font-medium text-gray-700 dark:text-gray-300'>
						{triggerLabel}
					</div>
					<div className='text-[10px] text-gray-500 truncate'>
						{actionLabel}
						{workflowName && ` → ${workflowName}`}
					</div>
				</div>

				<div className='flex items-center gap-1'>
					<button
						type='button'
						onClick={e => {
							e.stopPropagation()
							onRemove()
						}}
						className='p-1 text-gray-400 hover:text-red-500'
					>
						<IconTrash className='h-3.5 w-3.5' />
					</button>
					<IconChevronDown
						className={cn(
							'h-3.5 w-3.5 text-gray-400 transition-transform',
							isExpanded && 'rotate-180',
						)}
					/>
				</div>
			</div>

			{isExpanded && (
				<div className='p-2.5 border-t dark:border-gray-700 space-y-2'>
					<div className='space-y-1'>
						<span className='text-[10px] text-gray-500'>Trigger</span>
						<select
							value={interaction.trigger}
							onChange={e => onUpdate({ trigger: e.target.value })}
							className='w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
						>
							{TRIGGERS.map(t => (
								<option key={t.value} value={t.value}>
									{t.label}
								</option>
							))}
						</select>
					</div>

					<div className='space-y-1'>
						<span className='text-[10px] text-gray-500'>Action</span>
						<select
							value={interaction.type}
							onChange={e => onUpdate({ type: e.target.value })}
							className='w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
						>
							{ACTION_TYPES.map(a => (
								<option key={a.value} value={a.value}>
									{a.label}
								</option>
							))}
						</select>
					</div>

					{interaction.type === 'TRIGGER_WORKFLOW' && (
						<div className='space-y-1'>
							<span className='text-[10px] text-gray-500'>Workflow</span>
							<select
								value={(interaction.config.workflowId as string) ?? ''}
								onChange={e =>
									onUpdate({
										config: {
											...interaction.config,
											workflowId: e.target.value,
										},
									})
								}
								className='w-full px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
							>
								<option value=''>Select workflow...</option>
								{workflows.map(wf => (
									<option key={wf.id} value={wf.id}>
										{wf.name}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
