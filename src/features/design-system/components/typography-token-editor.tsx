'use client'

import { useTRPC } from '@/trpc/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IconPlus, IconTrash, IconTypography } from '@tabler/icons-react'

interface TypographyTokenEditorProps {
	projectId: string
}

export function TypographyTokenEditor({
	projectId,
}: TypographyTokenEditorProps) {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const queryOpts = trpc.designSystem.getByProjectId.queryOptions({ projectId })
	const { data: designSystem } = useQuery(queryOpts)

	const createTypography = useMutation(
		trpc.designSystem.createTypographyToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	const updateTypography = useMutation(
		trpc.designSystem.updateTypographyToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	const deleteTypography = useMutation(
		trpc.designSystem.deleteTypographyToken.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries(queryOpts),
		}),
	)

	if (!designSystem) return null

	const typographies = designSystem.typography ?? []

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-sm font-semibold flex items-center gap-2'>
					<IconTypography className='h-4 w-4' />
					Typography Tokens
				</h3>
				<button
					type='button'
					onClick={() =>
						createTypography.mutate({
							designSystemId: designSystem.id,
							name: `font-${typographies.length + 1}`,
							family: 'Inter',
							weights: [400, 500, 700],
							fallback: 'system-ui, sans-serif',
							minSize: 1,
							maxSize: 1.5,
							lineHeight: 1.5,
						})
					}
					className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800'
				>
					<IconPlus className='h-4 w-4' />
				</button>
			</div>

			<div className='space-y-3'>
				{typographies.map(typo => (
					<div
						key={typo.id}
						className='p-3 rounded-lg bg-gray-50 dark:bg-gray-900 space-y-2'
					>
						<div className='flex items-center justify-between'>
							<input
								type='text'
								value={typo.name}
								onChange={e =>
									updateTypography.mutate({ id: typo.id, name: e.target.value })
								}
								className='text-xs font-medium px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
							/>
							<button
								type='button'
								onClick={() => deleteTypography.mutate({ id: typo.id })}
								className='p-1 text-gray-400 hover:text-red-500'
							>
								<IconTrash className='h-3.5 w-3.5' />
							</button>
						</div>

						{/* Font preview */}
						<p
							className='text-lg'
							style={{
								fontFamily: `'${typo.family}', ${typo.fallback}`,
								fontSize: `${typo.maxSize}rem`,
								lineHeight: typo.lineHeight,
							}}
						>
							The quick brown fox
						</p>

						<div className='grid grid-cols-2 gap-2'>
							<div className='space-y-1'>
								<span className='text-[10px] text-gray-500'>Family</span>
								<input
									type='text'
									value={typo.family}
									onChange={e =>
										updateTypography.mutate({
											id: typo.id,
											family: e.target.value,
										})
									}
									className='w-full text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								/>
							</div>
							<div className='space-y-1'>
								<span className='text-[10px] text-gray-500'>Fallback</span>
								<input
									type='text'
									value={typo.fallback}
									onChange={e =>
										updateTypography.mutate({
											id: typo.id,
											fallback: e.target.value,
										})
									}
									className='w-full text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								/>
							</div>
							<div className='space-y-1'>
								<span className='text-[10px] text-gray-500'>
									Min Size (rem)
								</span>
								<input
									type='number'
									step={0.125}
									value={typo.minSize}
									onChange={e =>
										updateTypography.mutate({
											id: typo.id,
											minSize: Number(e.target.value),
										})
									}
									className='w-full text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								/>
							</div>
							<div className='space-y-1'>
								<span className='text-[10px] text-gray-500'>
									Max Size (rem)
								</span>
								<input
									type='number'
									step={0.125}
									value={typo.maxSize}
									onChange={e =>
										updateTypography.mutate({
											id: typo.id,
											maxSize: Number(e.target.value),
										})
									}
									className='w-full text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								/>
							</div>
							<div className='space-y-1'>
								<span className='text-[10px] text-gray-500'>Line Height</span>
								<input
									type='number'
									step={0.1}
									value={typo.lineHeight}
									onChange={e =>
										updateTypography.mutate({
											id: typo.id,
											lineHeight: Number(e.target.value),
										})
									}
									className='w-full text-xs px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-700'
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
