'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useCanvasStore } from '../../stores/canvas-store'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useInngestSubscription } from '@inngest/realtime/hooks'
import { cn } from '@/lib/utils'
import {
	IconSparkles,
	IconLoader2,
	IconWand,
	IconLayout,
	IconMovie,
	IconArticle,
	IconCheck,
	IconAlertTriangle,
} from '@tabler/icons-react'
import type { ComponentNode } from '../../stores/canvas-store'
import { fetchAiGenerateRealtimeToken } from '../../server/ai-realtime-actions'
import { AI_GENERATE_CHANNEL_NAME } from '@/inngest/channels/ai-generate'

// ========================================
// Mode selector
// ========================================

const MODES = [
	{
		value: 'auto' as const,
		label: 'Авто',
		icon: IconWand,
		description: 'AI определит тип',
	},
	{
		value: 'interface' as const,
		label: 'Интерфейс',
		icon: IconLayout,
		description: 'UI / лейаут',
	},
	{
		value: 'animation' as const,
		label: 'Анимации',
		icon: IconMovie,
		description: 'С анимациями',
	},
	{
		value: 'content' as const,
		label: 'Контент',
		icon: IconArticle,
		description: 'Текст / статьи',
	},
]

const QUICK_PROMPTS = [
	'Форма регистрации с полями email, пароль и кнопкой',
	'Hero-секция с заголовком, описанием и CTA кнопкой',
	'Карточка товара с изображением, ценой и описанием',
	'Навигационная панель с логотипом и ссылками',
	'Pricing таблица с 3 тарифами',
	'Footer с ссылками и контактами',
]

type JobPhase =
	| 'idle'
	| 'submitting'
	| 'pending'
	| 'running'
	| 'completed'
	| 'failed'

// ========================================
// AI Generate Panel
// ========================================

export function AIGeneratePanel() {
	const [prompt, setPrompt] = useState('')
	const [mode, setMode] = useState<
		'auto' | 'interface' | 'animation' | 'content'
	>('auto')
	const [explanation, setExplanation] = useState('')
	const [phase, setPhase] = useState<JobPhase>('idle')
	const [errorMsg, setErrorMsg] = useState('')
	const [activeJobId, setActiveJobId] = useState<string | null>(null)
	const nodesAppliedRef = useRef<string | null>(null)

	const currentPageId = useCanvasStore(s => s.currentPageId)
	const addBulkNodes = useCanvasStore(s => s.addBulkNodes)

	const trpc = useTRPC()

	// ---- Inngest Realtime subscription ----
	const { data: realtimeData } = useInngestSubscription({
		refreshToken: fetchAiGenerateRealtimeToken,
		enabled: !!activeJobId,
	})

	// React to realtime events
	useEffect(() => {
		if (!realtimeData?.length || !activeJobId) return

		const relevantMessages = realtimeData
			.filter(
				msg =>
					msg.kind === 'data' &&
					msg.channel === AI_GENERATE_CHANNEL_NAME &&
					msg.topic === 'status' &&
					msg.data.jobId === activeJobId,
			)
			.sort((a, b) => {
				if (a.kind === 'data' && b.kind === 'data') {
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					)
				}
				return 0
			})

		const latest = relevantMessages[0]
		if (latest?.kind !== 'data') return

		const status = latest.data.status as string
		if (status === 'running') {
			setPhase('running')
		} else if (status === 'completed') {
			setPhase('completed')
			if (latest.data.explanation) {
				setExplanation(latest.data.explanation as string)
			}
		} else if (status === 'failed') {
			setPhase('failed')
			setErrorMsg((latest.data.error as string) ?? 'Ошибка генерации')
		}
	}, [realtimeData, activeJobId])

	// ---- Polling fallback for result nodes ----
	const statusQuery = useQuery(
		trpc.builder.aiGenerateStatus.queryOptions(
			{ jobId: activeJobId! },
			{
				enabled:
					!!activeJobId &&
					(phase === 'pending' || phase === 'running' || phase === 'completed'),
				refetchInterval: phase === 'completed' ? false : 2000,
			},
		),
	)

	// Apply nodes when job completed
	useEffect(() => {
		if (!statusQuery.data || !activeJobId) return

		const { status, nodes, explanation: expl, error } = statusQuery.data

		// Update phase from polling (realtime might have already set it)
		if (status === 'running' && phase === 'pending') setPhase('running')
		if (status === 'failed') {
			setPhase('failed')
			setErrorMsg(error ?? 'Ошибка генерации')
		}

		if (status === 'completed' && nodesAppliedRef.current !== activeJobId) {
			nodesAppliedRef.current = activeJobId
			setPhase('completed')
			if (expl) setExplanation(expl)

			if (Array.isArray(nodes) && nodes.length > 0) {
				addBulkNodes(nodes as ComponentNode[])
			}
		}
	}, [statusQuery.data, activeJobId, phase, addBulkNodes])

	// ---- Start mutation ----
	const startMutation = useMutation(
		trpc.builder.aiGenerate.mutationOptions({
			onSuccess: (data: { jobId: string }) => {
				setActiveJobId(data.jobId)
				nodesAppliedRef.current = null
				setPhase('pending')
			},
			onError: err => {
				setPhase('failed')
				setErrorMsg(err.message)
			},
		}),
	)

	const handleGenerate = useCallback(() => {
		if (!prompt.trim() || !currentPageId) return

		setPhase('submitting')
		setExplanation('')
		setErrorMsg('')

		startMutation.mutate({
			prompt: prompt.trim(),
			pageId: currentPageId,
			originX: 100,
			originY: 100,
			mode,
		})
	}, [prompt, currentPageId, mode, startMutation])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				handleGenerate()
			}
		},
		[handleGenerate],
	)

	const isLoading =
		phase === 'submitting' || phase === 'pending' || phase === 'running'

	const phaseLabel = {
		idle: null,
		submitting: 'Отправка задачи...',
		pending: 'В очереди...',
		running: 'AI генерирует...',
		completed: null,
		failed: null,
	}[phase]

	return (
		<div className='w-64 p-3 space-y-3'>
			{/* Header */}
			<div className='flex items-center gap-2'>
				<IconSparkles className='h-4 w-4 text-purple-500' />
				<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
					AI Генерация
				</h3>
				<span className='ml-auto text-[9px] text-gray-400 uppercase tracking-wider'>
					via Inngest
				</span>
			</div>

			{/* Mode selector */}
			<div className='grid grid-cols-2 gap-1'>
				{MODES.map(m => {
					const Icon = m.icon
					return (
						<button
							key={m.value}
							type='button'
							onClick={() => setMode(m.value)}
							className={cn(
								'flex items-center gap-1.5 px-2 py-1.5 text-[10px] rounded-md border transition-colors',
								mode === m.value
									? 'border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-600'
									: 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-purple-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/10',
							)}
						>
							<Icon className='h-3 w-3 shrink-0' />
							{m.label}
						</button>
					)
				})}
			</div>

			{/* Prompt input */}
			<div className='relative'>
				<textarea
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder='Опишите что нужно сгенерировать...'
					rows={3}
					disabled={isLoading}
					className={cn(
						'w-full px-3 py-2 text-xs border rounded-lg resize-none bg-white dark:bg-gray-900',
						'dark:border-gray-700 placeholder:text-gray-400',
						'focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none',
						isLoading && 'opacity-60',
					)}
				/>
			</div>

			{/* Generate button */}
			<button
				type='button'
				onClick={handleGenerate}
				disabled={isLoading || !prompt.trim() || !currentPageId}
				className={cn(
					'w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all',
					'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
					'hover:from-purple-700 hover:to-blue-700',
					'disabled:opacity-50 disabled:cursor-not-allowed',
				)}
			>
				{isLoading ? (
					<>
						<IconLoader2 className='h-3.5 w-3.5 animate-spin' />
						{phaseLabel ?? 'Генерация...'}
					</>
				) : (
					<>
						<IconSparkles className='h-3.5 w-3.5' />
						Сгенерировать
					</>
				)}
			</button>

			{/* Error */}
			{phase === 'failed' && errorMsg && (
				<div className='flex items-start gap-1.5 p-2 text-[10px] text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md'>
					<IconAlertTriangle className='h-3 w-3 shrink-0 mt-0.5' />
					<span>{errorMsg}</span>
				</div>
			)}

			{/* Success */}
			{phase === 'completed' && explanation && (
				<div className='flex items-start gap-1.5 p-2 text-[10px] text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 rounded-md'>
					<IconCheck className='h-3 w-3 shrink-0 mt-0.5' />
					<span>{explanation}</span>
				</div>
			)}

			{/* Quick prompts */}
			<div className='space-y-1.5'>
				<h4 className='text-[10px] font-medium text-gray-400 uppercase tracking-wider'>
					Быстрые шаблоны
				</h4>
				<div className='space-y-1'>
					{QUICK_PROMPTS.map(qp => (
						<button
							key={qp}
							type='button'
							onClick={() => setPrompt(qp)}
							disabled={isLoading}
							className='w-full text-left px-2 py-1.5 text-[10px] text-gray-500 dark:text-gray-400 rounded-md border border-gray-100 dark:border-gray-800 hover:border-purple-200 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors truncate'
						>
							{qp}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
