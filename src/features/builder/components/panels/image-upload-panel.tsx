'use client'

import { useState, useCallback, useRef } from 'react'
import { useSelectedNode, useCanvasStore } from '../../stores/canvas-store'
import { cn } from '@/lib/utils'
import { IconUpload, IconPhoto, IconX, IconLink } from '@tabler/icons-react'

// ========================================
// Image Upload Panel
// ========================================

export function ImageUploadPanel() {
	const node = useSelectedNode()
	const updateNodeProps = useCanvasStore(s => s.updateNodeProps)
	const [mode, setMode] = useState<'url' | 'upload'>('url')
	const [urlInput, setUrlInput] = useState('')
	const [preview, setPreview] = useState<string | null>(null)
	const [isDragOver, setIsDragOver] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	if (!node || node.type !== 'image') {
		return (
			<div className='p-4 text-gray-500 dark:text-gray-400 text-sm text-center'>
				Select an image component to upload
			</div>
		)
	}

	const currentSrc = (node.props.src as string) ?? ''

	const applyImage = (src: string) => {
		updateNodeProps(node.id, { ...node.props, src })
		setPreview(src)
	}

	const handleUrlSubmit = () => {
		if (urlInput.trim()) {
			applyImage(urlInput.trim())
			setUrlInput('')
		}
	}

	const handleFileSelect = (file: File) => {
		if (!file.type.startsWith('image/')) return

		const reader = new FileReader()
		reader.onload = e => {
			const dataUrl = e.target?.result as string
			if (dataUrl) {
				applyImage(dataUrl)
			}
		}
		reader.readAsDataURL(file)
	}

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(false)

		const file = e.dataTransfer.files[0]
		if (file) handleFileSelect(file)
	}, [])

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragOver(true)
	}, [])

	const handleDragLeave = useCallback(() => {
		setIsDragOver(false)
	}, [])

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) handleFileSelect(file)
	}

	const clearImage = () => {
		updateNodeProps(node.id, { ...node.props, src: '' })
		setPreview(null)
	}

	return (
		<div className='p-4 space-y-3'>
			<h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5'>
				<IconPhoto className='h-3.5 w-3.5' />
				Image Source
			</h3>

			{/* Mode switcher */}
			<div className='flex gap-1'>
				<button
					type='button'
					onClick={() => setMode('url')}
					className={cn(
						'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] rounded-md transition-colors',
						mode === 'url'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
							: 'bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200',
					)}
				>
					<IconLink className='h-3 w-3' />
					URL
				</button>
				<button
					type='button'
					onClick={() => setMode('upload')}
					className={cn(
						'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] rounded-md transition-colors',
						mode === 'upload'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
							: 'bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200',
					)}
				>
					<IconUpload className='h-3 w-3' />
					Upload
				</button>
			</div>

			{/* URL mode */}
			{mode === 'url' && (
				<div className='space-y-2'>
					<div className='flex gap-1'>
						<input
							type='text'
							value={urlInput}
							onChange={e => setUrlInput(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
							placeholder='https://example.com/image.png'
							className='flex-1 px-2 py-1.5 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
						/>
						<button
							type='button'
							onClick={handleUrlSubmit}
							disabled={!urlInput.trim()}
							className='px-2 py-1.5 text-[10px] bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
						>
							Set
						</button>
					</div>
				</div>
			)}

			{/* Upload mode */}
			{mode === 'upload' && (
				<div className='space-y-2'>
					{/* biome-ignore lint/a11y/noStaticElementInteractions: Drop zone */}
					<div
						className={cn(
							'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
							isDragOver
								? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-300 dark:border-gray-700 hover:border-blue-300',
						)}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onClick={() => fileInputRef.current?.click()}
					>
						<IconUpload className='h-6 w-6 mx-auto text-gray-400 mb-1' />
						<p className='text-[10px] text-gray-500'>
							Drag & drop image or click to browse
						</p>
						<p className='text-[9px] text-gray-400 mt-0.5'>
							PNG, JPG, SVG, WebP
						</p>
					</div>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						onChange={handleFileInputChange}
						className='hidden'
					/>
				</div>
			)}

			{/* Current image preview */}
			{(currentSrc || preview) && (
				<div className='space-y-1.5'>
					<div className='flex items-center justify-between'>
						<span className='text-[10px] text-gray-400'>Current Image</span>
						<button
							type='button'
							onClick={clearImage}
							className='p-0.5 rounded text-gray-400 hover:text-red-500'
						>
							<IconX className='h-3 w-3' />
						</button>
					</div>
					<div className='w-full h-24 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900'>
						{/* biome-ignore lint/a11y/useAltText: preview thumbnail */}
						<img
							src={currentSrc || preview || ''}
							className='w-full h-full object-contain'
							alt=''
						/>
					</div>
					<p className='text-[9px] text-gray-400 truncate font-mono'>
						{(currentSrc || preview || '').substring(0, 80)}
					</p>
				</div>
			)}

			{/* Alt text */}
			<div className='space-y-1'>
				<label className='text-[10px] font-medium text-gray-500'>
					Alt Text
				</label>
				<input
					type='text'
					value={(node.props.alt as string) ?? ''}
					onChange={e =>
						updateNodeProps(node.id, { ...node.props, alt: e.target.value })
					}
					placeholder='Describe the image...'
					className='w-full px-2 py-1.5 text-[11px] border rounded-md bg-white dark:bg-gray-900 dark:border-gray-700'
				/>
			</div>

			{/* Object fit */}
			<div className='space-y-1'>
				<label className='text-[10px] font-medium text-gray-500'>
					Object Fit
				</label>
				<div className='flex gap-1'>
					{(['cover', 'contain', 'fill', 'none'] as const).map(fit => (
						<button
							key={fit}
							type='button'
							onClick={() =>
								updateNodeProps(node.id, { ...node.props, objectFit: fit })
							}
							className={cn(
								'flex-1 px-1 py-1 text-[10px] rounded-md transition-colors capitalize',
								(node.props.objectFit ?? 'cover') === fit
									? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40'
									: 'bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200',
							)}
						>
							{fit}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
