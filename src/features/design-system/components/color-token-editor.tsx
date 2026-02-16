'use client'

import { useTRPC } from '@/trpc/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IconPlus, IconTrash, IconPalette } from '@tabler/icons-react'

interface ColorTokenEditorProps {
	projectId: string
}

export function ColorTokenEditor({ projectId }: ColorTokenEditorProps) {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const queryOpts = trpc.designSystem.getByProjectId.queryOptions({ projectId })
	const { data: designSystem } = useQuery(queryOpts)

	const createColor = useMutation(
		trpc.designSystem.createColorToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	const updateColor = useMutation(
		trpc.designSystem.updateColorToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	const deleteColor = useMutation(
		trpc.designSystem.deleteColorToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	if (!designSystem) return null

	const colors = designSystem.colors ?? []

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-semibold flex items-center gap-2'>
					<IconPalette className='h-4 w-4' />
					Color Tokens
				</h3>
				<button
					type='button'
					onClick={() =>
						createColor.mutate({
							designSystemId: designSystem.id,
							name: `color-${colors.length + 1}`,
							hue: 217,
							saturation: 91,
							lightness: 60,
						})
					}
					className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800'
				>
					<IconPlus className='h-4 w-4' />
				</button>
			</div>

			<div className='space-y-2'>
				{colors.map(color => (
					<div
						key={color.id}
						className='flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-900'
					>
						{/* Color preview */}
						<div
							className='w-8 h-8 rounded-md border shadow-sm shrink-0'
							style={{
								backgroundColor: `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`,
							}}
						/>

						{/* Name */}
						<input
							type='text'
							value={color.name}
							onChange={e =>
								updateColor.mutate({
									id: color.id,
									name: e.target.value,
								})
							}
							className='flex-1 text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
						/>

						{/* HSL controls */}
						<div className='flex gap-1'>
							<input
								type='number'
								min={0}
								max={360}
								value={color.hue}
								onChange={e =>
									updateColor.mutate({
										id: color.id,
										hue: Number(e.target.value),
									})
								}
								className='w-12 text-xs px-1 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								title='Hue'
							/>
							<input
								type='number'
								min={0}
								max={100}
								value={color.saturation}
								onChange={e =>
									updateColor.mutate({
										id: color.id,
										saturation: Number(e.target.value),
									})
								}
								className='w-12 text-xs px-1 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								title='Saturation'
							/>
							<input
								type='number'
								min={0}
								max={100}
								value={color.lightness}
								onChange={e =>
									updateColor.mutate({
										id: color.id,
										lightness: Number(e.target.value),
									})
								}
								className='w-12 text-xs px-1 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								title='Lightness'
							/>
						</div>

						{/* Semantic role */}
						<select
							value={color.semanticRole ?? ''}
							onChange={e =>
								updateColor.mutate({
									id: color.id,
									semanticRole: e.target.value || null,
									isSemantic: !!e.target.value,
								})
							}
							className='text-[10px] px-1 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
						>
							<option value=''>No role</option>
							<option value='background'>Background</option>
							<option value='foreground'>Foreground</option>
							<option value='accent'>Accent</option>
							<option value='muted'>Muted</option>
							<option value='destructive'>Destructive</option>
						</select>

						{/* Delete */}
						<button
							type='button'
							onClick={() => deleteColor.mutate({ id: color.id })}
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
