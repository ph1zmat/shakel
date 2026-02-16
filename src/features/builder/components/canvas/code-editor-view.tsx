'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	useCanvasStore,
	useCurrentPage,
	type ComponentNode,
} from '../../stores/canvas-store'
import {
	generatePreviewFiles,
	type GeneratedPreviewFile,
} from '../../codegen/tsx-preview-generator'
import { cn } from '@/lib/utils'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import {
	IconFile,
	IconFileTypeTsx,
	IconFileTypeCss,
	IconBraces,
	IconFolder,
	IconFolderOpen,
	IconChevronRight,
	IconChevronDown,
	IconCopy,
	IconCheck,
	IconPlayerPlay,
	IconAlertCircle,
	IconCircleCheck,
	IconLoader2,
	IconDownload,
	IconDeviceFloppy,
	IconArrowBackUp,
} from '@tabler/icons-react'
import dynamic from 'next/dynamic'

// Dynamic import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
	ssr: false,
	loading: () => (
		<div className='flex-1 flex items-center justify-center bg-[#1e1e2e]'>
			<IconLoader2 className='h-6 w-6 text-gray-500 animate-spin' />
		</div>
	),
})

// ========================================
// Main CodeEditorView
// ========================================

export function CodeEditorView() {
	const nodes = useCanvasStore(state => state.nodes)
	const currentPage = useCurrentPage()
	const currentPageId = useCanvasStore(state => state.currentPageId)
	const project = useCanvasStore(state => state.project)
	const updateNodeProps = useCanvasStore(state => state.updateNodeProps)
	const trpc = useTRPC()

	const [activeFileIdx, setActiveFileIdx] = useState(0)
	const [copied, setCopied] = useState(false)
	const [editedContent, setEditedContent] = useState<Record<number, string>>({})
	const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
	const [compileStatus, setCompileStatus] = useState<
		'idle' | 'compiling' | 'success' | 'error'
	>('idle')
	const [saveStatus, setSaveStatus] = useState<
		'idle' | 'saving' | 'saved' | 'error'
	>('idle')

	// Generate files from canvas state
	const generatedFiles = useMemo(
		() => generatePreviewFiles(currentPage ?? null, nodes, currentPageId),
		[currentPage, nodes, currentPageId],
	)

	// Merge generated with user edits
	const files: GeneratedPreviewFile[] = useMemo(
		() =>
			generatedFiles.map((f, i) => ({
				...f,
				content: editedContent[i] ?? f.content,
			})),
		[generatedFiles, editedContent],
	)

	const activeFile = files[activeFileIdx] ?? files[0]

	// Sync newly generated files into editedContent for any NEW files
	// but preserve user edits for existing files
	useEffect(() => {
		setEditedContent(prev => {
			// If there are no user edits yet, nothing to preserve
			if (Object.keys(prev).length === 0) return prev
			// Keep edits only for indices that still exist
			const cleaned: Record<number, string> = {}
			for (const [key, value] of Object.entries(prev)) {
				const idx = Number(key)
				if (idx < generatedFiles.length) {
					cleaned[idx] = value
				}
			}
			return cleaned
		})
	}, [generatedFiles])

	const handleEditorChange = useCallback(
		(value: string | undefined) => {
			if (value === undefined) return
			setEditedContent(prev => ({
				...prev,
				[activeFileIdx]: value,
			}))
		},
		[activeFileIdx],
	)

	const hasEdits = Object.keys(editedContent).length > 0

	// Save to DB mutation
	const saveMutation = useMutation(
		trpc.builder.saveEditedCode.mutationOptions({
			onMutate: () => setSaveStatus('saving'),
			onSuccess: () => {
				setSaveStatus('saved')
				setTimeout(() => setSaveStatus('idle'), 2500)
			},
			onError: () => setSaveStatus('error'),
		}),
	)

	// Compile / type-check mutation
	const compileMutation = useMutation(
		trpc.builder.compileCode.mutationOptions({
			onMutate: () => {
				setCompileStatus('compiling')
				setDiagnostics([])
			},
			onSuccess: data => {
				setDiagnostics(data.diagnostics)
				setCompileStatus(
					data.diagnostics.some(d => d.severity === 'error')
						? 'error'
						: 'success',
				)
			},
			onError: () => {
				setCompileStatus('error')
				setDiagnostics([
					{
						file: 'compiler',
						line: 0,
						column: 0,
						message: 'Compilation failed',
						severity: 'error',
					},
				])
			},
		}),
	)

	const handleCompile = useCallback(() => {
		compileMutation.mutate({
			files: files.map(f => ({
				path: f.path,
				content: f.content,
			})),
		})
	}, [files, compileMutation])

	const handleSave = useCallback(() => {
		if (!project) return
		saveMutation.mutate({
			projectId: project.id,
			files: files.map(f => ({
				path: f.path,
				content: f.content,
			})),
		})
	}, [files, project, saveMutation])

	const handleApplyToCanvas = useCallback(() => {
		// Find the page.tsx file among edited files
		const pageFileIdx = files.findIndex(f => f.name === 'page.tsx')
		if (pageFileIdx === -1 || editedContent[pageFileIdx] === undefined) return

		const editedTsx = editedContent[pageFileIdx]
		const pageNodes = Object.values(nodes).filter(
			n => n.pageId === currentPageId,
		)

		// Extract text changes from the edited TSX and apply to canvas nodes
		for (const node of pageNodes) {
			const propUpdates = extractPropsFromTSX(editedTsx, node)
			if (propUpdates && Object.keys(propUpdates).length > 0) {
				updateNodeProps(node.id, { ...node.props, ...propUpdates })
			}
		}

		// Clear edits after applying
		setEditedContent({})
		setSaveStatus('saved')
		setTimeout(() => setSaveStatus('idle'), 2500)
	}, [files, editedContent, nodes, currentPageId, updateNodeProps])

	const handleResetEdits = useCallback(() => {
		setEditedContent({})
	}, [])

	const handleCopy = useCallback(async () => {
		if (!activeFile) return
		await navigator.clipboard.writeText(activeFile.content)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}, [activeFile])

	const handleDownloadAll = useCallback(() => {
		const blob = new Blob(
			files.map(f => `// === ${f.path} ===\n${f.content}\n\n`),
			{ type: 'text/plain' },
		)
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'generated-code.txt'
		a.click()
		URL.revokeObjectURL(url)
	}, [files])

	// Language map for Monaco
	const monacoLanguage =
		activeFile?.language === 'tsx'
			? 'typescript'
			: activeFile?.language === 'css'
				? 'css'
				: 'json'

	if (!activeFile) {
		return (
			<div className='flex-1 flex items-center justify-center bg-[#1e1e2e] text-gray-400 text-sm'>
				Нет выбранной страницы
			</div>
		)
	}

	return (
		<div className='flex-1 flex bg-[#1e1e2e] overflow-hidden rounded-b-lg'>
			{/* File Explorer Sidebar */}
			<div className='w-[200px] border-r border-gray-700/50 bg-[#181825] flex flex-col shrink-0'>
				<div className='px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-700/50'>
					Explorer
				</div>
				<div className='flex-1 overflow-y-auto py-1'>
					<FileTree
						files={files}
						activeFileIdx={activeFileIdx}
						onSelectFile={setActiveFileIdx}
					/>
				</div>
			</div>

			{/* Editor area */}
			<div className='flex-1 flex flex-col overflow-hidden'>
				{/* Tab bar */}
				<div className='flex items-center bg-[#181825] border-b border-gray-700/50 shrink-0'>
					<div className='flex-1 flex overflow-x-auto'>
						{files.map((file, idx) => (
							<button
								key={file.path}
								type='button'
								onClick={() => setActiveFileIdx(idx)}
								className={cn(
									'flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium border-r border-gray-700/30 whitespace-nowrap transition-colors',
									idx === activeFileIdx
										? 'bg-[#1e1e2e] text-gray-100'
										: 'text-gray-500 hover:text-gray-300 hover:bg-[#1e1e2e]/50',
									idx === activeFileIdx && 'border-b-2 border-b-blue-500',
								)}
							>
								<FileTypeIcon language={file.language} />
								{file.name}
								{editedContent[idx] !== undefined && (
									<span className='ml-1 w-1.5 h-1.5 rounded-full bg-orange-400' />
								)}
							</button>
						))}
					</div>

					{/* Actions */}
					<div className='flex items-center gap-1 px-2 shrink-0'>
						{/* Reset edits */}
						{hasEdits && (
							<button
								type='button'
								onClick={handleResetEdits}
								className='p-1.5 text-gray-500 hover:text-orange-400 transition-colors rounded'
								title='Сбросить изменения'
							>
								<IconArrowBackUp className='h-3.5 w-3.5' />
							</button>
						)}

						{/* Apply to canvas */}
						{hasEdits && (
							<button
								type='button'
								onClick={handleApplyToCanvas}
								className='flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors text-blue-400 hover:bg-blue-500/10 hover:text-blue-300'
								title='Применить изменения текста к визуальному редактору'
							>
								<IconCheck className='h-3.5 w-3.5' />
								Apply
							</button>
						)}

						<div className='h-4 w-px bg-gray-700/50 mx-0.5' />

						{/* Save to DB */}
						<button
							type='button'
							onClick={handleSave}
							disabled={saveStatus === 'saving' || !project}
							className={cn(
								'flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors',
								saveStatus === 'saving'
									? 'text-gray-500 cursor-wait'
									: saveStatus === 'saved'
										? 'text-green-400'
										: saveStatus === 'error'
											? 'text-red-400'
											: 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200',
							)}
							title='Сохранить код в проект'
						>
							{saveStatus === 'saving' ? (
								<IconLoader2 className='h-3.5 w-3.5 animate-spin' />
							) : saveStatus === 'saved' ? (
								<IconCheck className='h-3.5 w-3.5' />
							) : (
								<IconDeviceFloppy className='h-3.5 w-3.5' />
							)}
							{saveStatus === 'saved' ? 'Saved' : 'Save'}
						</button>

						{/* Copy */}
						<button
							type='button'
							onClick={handleCopy}
							className='p-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded'
							title='Копировать'
						>
							{copied ? (
								<IconCheck className='h-3.5 w-3.5 text-green-400' />
							) : (
								<IconCopy className='h-3.5 w-3.5' />
							)}
						</button>

						{/* Download */}
						<button
							type='button'
							onClick={handleDownloadAll}
							className='p-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded'
							title='Скачать все файлы'
						>
							<IconDownload className='h-3.5 w-3.5' />
						</button>

						{/* Compile */}
						<button
							type='button'
							onClick={handleCompile}
							disabled={compileStatus === 'compiling'}
							className={cn(
								'flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded transition-colors',
								compileStatus === 'compiling'
									? 'text-gray-500 cursor-wait'
									: 'text-green-400 hover:bg-green-500/10 hover:text-green-300',
							)}
							title='Компилировать (проверка типов)'
						>
							{compileStatus === 'compiling' ? (
								<IconLoader2 className='h-3.5 w-3.5 animate-spin' />
							) : (
								<IconPlayerPlay className='h-3.5 w-3.5' />
							)}
							Compile
						</button>
					</div>
				</div>

				{/* File path */}
				<div className='flex items-center justify-between px-3 py-1 text-[10px] text-gray-500 border-b border-gray-700/30 bg-[#1e1e2e] shrink-0'>
					<span>{activeFile.path}</span>
					<CompileStatusBadge
						status={compileStatus}
						errorCount={diagnostics.filter(d => d.severity === 'error').length}
					/>
				</div>

				{/* Monaco Editor */}
				<div className='flex-1 overflow-hidden'>
					<MonacoEditor
						height='100%'
						language={monacoLanguage}
						value={activeFile.content}
						onChange={handleEditorChange}
						theme='vs-dark'
						options={{
							fontSize: 13,
							fontFamily:
								"'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
							fontLigatures: true,
							minimap: { enabled: true, scale: 2 },
							scrollBeyondLastLine: false,
							padding: { top: 12, bottom: 12 },
							lineNumbers: 'on',
							renderWhitespace: 'selection',
							bracketPairColorization: { enabled: true },
							autoClosingBrackets: 'always',
							autoClosingQuotes: 'always',
							tabSize: 2,
							wordWrap: 'on',
							suggest: {
								showKeywords: true,
								showSnippets: true,
							},
							quickSuggestions: true,
							formatOnPaste: true,
							formatOnType: true,
							smoothScrolling: true,
							cursorBlinking: 'smooth',
							cursorSmoothCaretAnimation: 'on',
						}}
						beforeMount={monaco => {
							// Configure TypeScript/JSX support
							monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
								{
									target: monaco.languages.typescript.ScriptTarget.ESNext,
									jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
									module: monaco.languages.typescript.ModuleKind.ESNext,
									moduleResolution:
										monaco.languages.typescript.ModuleResolutionKind.NodeJs,
									allowNonTsExtensions: true,
									allowJs: true,
									strict: true,
									esModuleInterop: true,
									skipLibCheck: true,
									forceConsistentCasingInFileNames: true,
								},
							)

							// Add React types
							monaco.languages.typescript.typescriptDefaults.addExtraLib(
								`
declare module 'react' {
  export type ReactNode = string | number | boolean | null | undefined | React.ReactElement | React.ReactFragment | React.ReactPortal;
  export interface ReactElement<P = any> { type: any; props: P; key: string | null; }
  export type FC<P = {}> = (props: P) => ReactElement | null;
  export function useState<T>(init: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(init: T): { current: T };
}
declare module 'next' {
  export interface Metadata { title?: string; description?: string; }
}
declare module 'next/font' {
  export function Inter(opts: { subsets: string[] }): { className: string; };
}
								`,
								'ts:react.d.ts',
							)
						}}
					/>
				</div>

				{/* Diagnostics panel */}
				{diagnostics.length > 0 && (
					<div className='max-h-[180px] overflow-auto border-t border-gray-700/50 bg-[#181825] shrink-0'>
						<div className='flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-gray-400 border-b border-gray-700/30'>
							<span>Проблемы</span>
							<span
								className={cn(
									'px-1.5 py-0.5 rounded text-[10px] font-bold',
									diagnostics.some(d => d.severity === 'error')
										? 'bg-red-500/20 text-red-400'
										: 'bg-yellow-500/20 text-yellow-400',
								)}
							>
								{diagnostics.length}
							</span>
						</div>
						{diagnostics.map((d, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: diagnostics list
								key={i}
								className={cn(
									'flex items-start gap-2 px-3 py-1.5 text-[12px] border-b border-gray-700/20 hover:bg-gray-700/20 transition-colors',
									d.severity === 'error' ? 'text-red-400' : 'text-yellow-400',
								)}
							>
								{d.severity === 'error' ? (
									<IconAlertCircle className='h-3.5 w-3.5 mt-0.5 shrink-0' />
								) : (
									<IconAlertCircle className='h-3.5 w-3.5 mt-0.5 shrink-0 text-yellow-400' />
								)}
								<div className='flex-1 min-w-0'>
									<span className='wrap-break-word'>{d.message}</span>
									{d.file && d.line > 0 && (
										<span className='ml-2 text-gray-500'>
											{d.file}:{d.line}:{d.column}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

// ========================================
// Diagnostic type
// ========================================

interface Diagnostic {
	file: string
	line: number
	column: number
	message: string
	severity: 'error' | 'warning' | 'info'
}

// ========================================
// Compile status badge
// ========================================

function CompileStatusBadge({
	status,
	errorCount,
}: {
	status: 'idle' | 'compiling' | 'success' | 'error'
	errorCount: number
}) {
	if (status === 'idle') return null
	if (status === 'compiling') {
		return (
			<span className='flex items-center gap-1 text-[10px] text-gray-400'>
				<IconLoader2 className='h-3 w-3 animate-spin' />
				Компиляция...
			</span>
		)
	}
	if (status === 'success') {
		return (
			<span className='flex items-center gap-1 text-[10px] text-green-400'>
				<IconCircleCheck className='h-3 w-3' />
				Успешно
			</span>
		)
	}
	return (
		<span className='flex items-center gap-1 text-[10px] text-red-400'>
			<IconAlertCircle className='h-3 w-3' />
			{errorCount} {errorCount === 1 ? 'ошибка' : 'ошибок'}
		</span>
	)
}

// ========================================
// File Tree
// ========================================

interface FileTreeNode {
	name: string
	path: string
	isDir: boolean
	children: FileTreeNode[]
	fileIdx?: number
}

function FileTree({
	files,
	activeFileIdx,
	onSelectFile,
}: {
	files: GeneratedPreviewFile[]
	activeFileIdx: number
	onSelectFile: (idx: number) => void
}) {
	const tree = useMemo(
		() => buildFileTree(files.map((f, i) => ({ path: f.path, idx: i }))),
		[files],
	)

	return (
		<div>
			<div className='px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
				my-app
			</div>
			{tree.map(node => (
				<TreeRow
					key={node.path}
					node={node}
					depth={0}
					activeFileIdx={activeFileIdx}
					onSelectFile={onSelectFile}
				/>
			))}
		</div>
	)
}

function TreeRow({
	node,
	depth,
	activeFileIdx,
	onSelectFile,
}: {
	node: FileTreeNode
	depth: number
	activeFileIdx: number
	onSelectFile: (idx: number) => void
}) {
	const [expanded, setExpanded] = useState(true)

	if (node.isDir) {
		return (
			<div>
				<button
					type='button'
					onClick={() => setExpanded(!expanded)}
					className='flex items-center gap-1 w-full px-2 py-0.5 text-[12px] hover:bg-gray-700/40 transition-colors'
					style={{ paddingLeft: `${depth * 12 + 8}px` }}
				>
					{expanded ? (
						<IconChevronDown className='h-3 w-3 text-gray-500 shrink-0' />
					) : (
						<IconChevronRight className='h-3 w-3 text-gray-500 shrink-0' />
					)}
					{expanded ? (
						<IconFolderOpen className='h-3.5 w-3.5 text-yellow-500 shrink-0' />
					) : (
						<IconFolder className='h-3.5 w-3.5 text-yellow-500 shrink-0' />
					)}
					<span className='truncate font-medium text-gray-300'>
						{node.name}
					</span>
				</button>
				{expanded && (
					<div>
						{node.children.map(child => (
							<TreeRow
								key={child.path}
								node={child}
								depth={depth + 1}
								activeFileIdx={activeFileIdx}
								onSelectFile={onSelectFile}
							/>
						))}
					</div>
				)}
			</div>
		)
	}

	const isActive = node.fileIdx === activeFileIdx

	return (
		<button
			type='button'
			onClick={() => node.fileIdx !== undefined && onSelectFile(node.fileIdx)}
			className={cn(
				'flex items-center gap-1.5 w-full px-2 py-0.5 text-[12px] transition-colors',
				isActive
					? 'bg-blue-600/20 text-blue-300'
					: 'hover:bg-gray-700/40 text-gray-400',
			)}
			style={{ paddingLeft: `${depth * 12 + 22}px` }}
		>
			<FileTypeIcon language={getLanguageFromName(node.name)} />
			<span className='truncate'>{node.name}</span>
		</button>
	)
}

// ========================================
// Icons & Helpers
// ========================================

function FileTypeIcon({ language }: { language: string }) {
	if (language === 'tsx' || language === 'typescript')
		return <IconFileTypeTsx className='h-3.5 w-3.5 text-blue-400 shrink-0' />
	if (language === 'css')
		return <IconFileTypeCss className='h-3.5 w-3.5 text-purple-400 shrink-0' />
	if (language === 'json')
		return <IconBraces className='h-3.5 w-3.5 text-yellow-400 shrink-0' />
	return <IconFile className='h-3.5 w-3.5 text-gray-500 shrink-0' />
}

function getLanguageFromName(name: string): string {
	if (name.endsWith('.tsx') || name.endsWith('.ts')) return 'tsx'
	if (name.endsWith('.css')) return 'css'
	if (name.endsWith('.json')) return 'json'
	return 'text'
}

function buildFileTree(
	files: Array<{ path: string; idx: number }>,
): FileTreeNode[] {
	const root: FileTreeNode[] = []
	for (const file of files) {
		const parts = file.path.split('/')
		let current = root
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i]
			const isLast = i === parts.length - 1
			const existingPath = parts.slice(0, i + 1).join('/')
			let existing = current.find(n => n.name === part)
			if (!existing) {
				existing = {
					name: part,
					path: existingPath,
					isDir: !isLast,
					children: [],
					fileIdx: isLast ? file.idx : undefined,
				}
				current.push(existing)
			}
			if (!isLast) current = existing.children
		}
	}
	sortTree(root)
	return root
}

function sortTree(nodes: FileTreeNode[]) {
	nodes.sort((a, b) => {
		if (a.isDir && !b.isDir) return -1
		if (!a.isDir && b.isDir) return 1
		return a.name.localeCompare(b.name)
	})
	for (const n of nodes) {
		if (n.isDir) sortTree(n.children)
	}
}

// ========================================
// TSX → Canvas Prop Extractor
// ========================================

/**
 * Extract text-level prop updates from the edited TSX source for a given node.
 * Matches patterns like: <button ...>New Text</button>, <p ...>Content</p>,
 * placeholder="...", href="...", etc.
 *
 * This is intentionally lightweight — it handles the 80% case of text/content edits.
 * For structural changes (adding/removing nodes), full re-parse is needed.
 */
function extractPropsFromTSX(
	tsxSource: string,
	node: ComponentNode,
): Record<string, unknown> | null {
	const updates: Record<string, unknown> = {}

	switch (node.type) {
		case 'text': {
			const as = (node.props.as as string) || 'p'
			const tag = [
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'span',
				'div',
				'p',
			].includes(as)
				? as
				: 'p'
			// Match <tag className="...">Content</tag>
			const regex = new RegExp(
				`<${tag}\\s+className="[^"]*">(.*?)</${tag}>`,
				'g',
			)
			const oldContent = (node.props.content as string) || 'Text content'
			for (const match of tsxSource.matchAll(regex)) {
				const content = match[1].trim()
				// Only update if content changed vs original
				if (content !== oldContent && content.length > 0) {
					updates.content = content
					break
				}
			}
			break
		}

		case 'button': {
			const regex = /<button\s+[^>]*>(.*?)<\/button>/g
			const oldText = (node.props.text as string) || 'Button'
			for (const match of tsxSource.matchAll(regex)) {
				const text = match[1].trim()
				if (text !== oldText && text.length > 0) {
					updates.text = text
					break
				}
			}
			break
		}

		case 'link': {
			const hrefRegex = /<a\s+href="([^"]*)"/g
			const textRegex = /<a\s+[^>]*>(.*?)<\/a>/g
			const oldHref = (node.props.href as string) || '#'
			const oldText = (node.props.text as string) || 'Click here'

			for (const match of tsxSource.matchAll(hrefRegex)) {
				if (match[1] !== oldHref) {
					updates.href = match[1]
					break
				}
			}
			for (const match of tsxSource.matchAll(textRegex)) {
				const text = match[1].trim()
				if (text !== oldText && text.length > 0) {
					updates.text = text
					break
				}
			}
			break
		}

		case 'input': {
			const placeholderRegex = /placeholder="([^"]*)"/g
			const labelRegex = /<label\s+[^>]*>(.*?)<\/label>/g
			const oldPlaceholder =
				(node.props.placeholder as string) || 'Enter value...'
			const oldLabel = (node.props.label as string) || 'Label'

			for (const match of tsxSource.matchAll(placeholderRegex)) {
				if (match[1] !== oldPlaceholder) {
					updates.placeholder = match[1]
					break
				}
			}
			for (const match of tsxSource.matchAll(labelRegex)) {
				const label = match[1].replace(/\s*\*$/, '').trim()
				if (label !== oldLabel && label.length > 0) {
					updates.label = label
					break
				}
			}
			break
		}

		case 'image': {
			const srcRegex = /src="([^"]*)"/g
			const altRegex = /alt="([^"]*)"/g
			const oldSrc = (node.props.src as string) || ''
			const oldAlt = (node.props.alt as string) || ''

			for (const match of tsxSource.matchAll(srcRegex)) {
				if (match[1] !== oldSrc) {
					updates.src = match[1]
					break
				}
			}
			for (const match of tsxSource.matchAll(altRegex)) {
				if (match[1] !== oldAlt) {
					updates.alt = match[1]
					break
				}
			}
			break
		}
	}

	return Object.keys(updates).length > 0 ? updates : null
}
