'use client'

import { useTRPC } from '@/trpc/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IconPlus, IconTrash, IconRuler } from '@tabler/icons-react'

interface SpacingTokenEditorProps {
	projectId: string
}

export function SpacingTokenEditor({ projectId }: SpacingTokenEditorProps) {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const queryOpts = trpc.designSystem.getByProjectId.queryOptions({ projectId })
	const { data: designSystem } = useQuery(queryOpts)

	const createSpacing = useMutation(
		trpc.designSystem.createSpacingToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	const updateSpacing = useMutation(
		trpc.designSystem.updateSpacingToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	const deleteSpacing = useMutation(
		trpc.designSystem.deleteSpacingToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	if (!designSystem) return null

	const spacings = designSystem.spacing ?? []

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-semibold flex items-center gap-2'>
					<IconRuler className='h-4 w-4' />
					Spacing Tokens
				</h3>
				<button
					type='button'
					onClick={() =>
						createSpacing.mutate({
							designSystemId: designSystem.id,
							name: `space-${spacings.length + 1}`,
							value: 1,
						})
					}
					className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800'
				>
					<IconPlus className='h-4 w-4' />
				</button>
			</div>

			<div className='space-y-2'>
				{spacings.map(spacing => (
					<div
						key={spacing.id}
						className='flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-900'
					>
						{/* Visual preview */}
						<div
							className='h-4 bg-blue-400 rounded shrink-0'
							style={{ width: `${spacing.value * 16}px`, minWidth: '4px' }}
						/>

						{/* Name */}
						<input
							type='text'
							value={spacing.name}
							onChange={e =>
								updateSpacing.mutate({
									id: spacing.id,
									name: e.target.value,
								})
							}
							className='flex-1 text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
						/>

						{/* Value */}
						<div className='flex items-center gap-1'>
							<input
								type='number'
								step={0.125}
								min={0}
								max={10}
								value={spacing.value}
								onChange={e =>
									updateSpacing.mutate({
										id: spacing.id,
										value: Number(e.target.value),
									})
								}
								className='w-16 text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
							/>
							<span className='text-[10px] text-gray-400'>rem</span>
						</div>

						{/* Delete */}
						<button
							type='button'
							onClick={() => deleteSpacing.mutate({ id: spacing.id })}
							className='p-1 text-gray-400 hover:text-red-500'
						>
							<IconTrash className='h-3.5 w-3.5' />
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
