'use client'

import { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import { useCanvasStore, useCurrentPage } from '../../stores/canvas-store'
import { generatePreviewFiles } from '../../codegen/tsx-preview-generator'
import { cn } from '@/lib/utils'
import {
	IconCopy,
	IconCheck,
	IconFile,
	IconFileTypeTsx,
	IconFileTypeCss,
	IconBraces,
} from '@tabler/icons-react'

// ========================================
// Code View Panel
// ========================================

export function CodeViewPanel() {
	const nodes = useCanvasStore(state => state.nodes)
	const currentPage = useCurrentPage()
	const currentPageId = useCanvasStore(state => state.currentPageId)

	const [activeFileIdx, setActiveFileIdx] = useState(0)
	const [copied, setCopied] = useState(false)
	const codeRef = useRef<HTMLPreElement>(null)

	const files = useMemo(
		() => generatePreviewFiles(currentPage ?? null, nodes, currentPageId),
		[currentPage, nodes, currentPageId],
	)

	const activeFile = files[activeFileIdx] ?? files[0]

	const handleCopy = useCallback(async () => {
		if (!activeFile) return
		await navigator.clipboard.writeText(activeFile.content)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}, [activeFile])

	// Scroll to top when file changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll on file change
	useEffect(() => {
		codeRef.current?.scrollTo(0, 0)
	}, [activeFileIdx])

	if (!activeFile) {
		return (
			<div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
				No page selected
			</div>
		)
	}

	return (
		<div className='flex flex-col h-full bg-[#1e1e2e] text-gray-100 overflow-hidden'>
			{/* File tabs */}
			<div className='flex items-center border-b border-gray-700/50 bg-[#181825] overflow-x-auto shrink-0'>
				{files.map((file, idx) => (
					<button
						key={file.path}
						type='button'
						onClick={() => setActiveFileIdx(idx)}
						className={cn(
							'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-r border-gray-700/50 whitespace-nowrap transition-colors',
							idx === activeFileIdx
								? 'bg-[#1e1e2e] text-gray-100 border-b-2 border-b-blue-500'
								: 'text-gray-500 hover:text-gray-300 hover:bg-[#1e1e2e]/50',
						)}
					>
						<FileIcon language={file.language} />
						{file.name}
					</button>
				))}

				{/* Copy button */}
				<div className='ml-auto px-2 shrink-0'>
					<button
						type='button'
						onClick={handleCopy}
						className='p-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded'
						title='Copy code'
					>
						{copied ? (
							<IconCheck className='h-3.5 w-3.5 text-green-400' />
						) : (
							<IconCopy className='h-3.5 w-3.5' />
						)}
					</button>
				</div>
			</div>

			{/* File path */}
			<div className='px-3 py-1.5 text-[10px] text-gray-500 border-b border-gray-700/30 bg-[#181825] shrink-0'>
				{activeFile.path}
			</div>

			{/* Code content */}
			<pre
				ref={codeRef}
				className='flex-1 overflow-auto p-4 text-[13px] leading-6 font-mono'
			>
				<code>
					<SyntaxHighlight
						code={activeFile.content}
						language={activeFile.language}
					/>
				</code>
			</pre>
		</div>
	)
}

// ========================================
// Minimal file icon
// ========================================

function FileIcon({ language }: { language: string }) {
	if (language === 'tsx')
		return <IconFileTypeTsx className='h-3.5 w-3.5 text-blue-400' />
	if (language === 'css')
		return <IconFileTypeCss className='h-3.5 w-3.5 text-purple-400' />
	if (language === 'json')
		return <IconBraces className='h-3.5 w-3.5 text-yellow-400' />
	return <IconFile className='h-3.5 w-3.5 text-gray-400' />
}

// ========================================
// Lightweight syntax highlighter (no deps)
// ========================================

function SyntaxHighlight({
	code,
	language,
}: {
	code: string
	language: string
}) {
	const lines = code.split('\n')

	return (
		<>
			{lines.map((line, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: lines are stable
				<div key={i} className='flex'>
					<span className='inline-block w-8 shrink-0 text-right pr-4 text-gray-600 select-none'>
						{i + 1}
					</span>
					<span className='flex-1'>
						{language === 'tsx'
							? highlightTSX(line)
							: language === 'css'
								? highlightCSS(line)
								: highlightJSON(line)}
					</span>
				</div>
			))}
		</>
	)
}

// ---- TSX/JSX highlighting ----
function highlightTSX(line: string): React.ReactNode {
	// Simple regex-based tokenization
	const tokens: { text: string; cls: string }[] = []
	let remaining = line

	const patterns: [RegExp, string][] = [
		// Comments
		[/^(\/\/.*)/, 'text-gray-500 italic'],
		[/^(\/\*.*?\*\/)/, 'text-gray-500 italic'],
		// JSX tags
		[/^(<\/?)([a-zA-Z][a-zA-Z0-9]*)/, ''],
		// Strings
		[/^("[^"]*"|'[^']*'|`[^`]*`)/, 'text-green-400'],
		// Keywords
		[
			/^(import|export|default|function|return|const|let|type|interface|from|as|if|else|for|of|in|new|typeof|extends|implements)\b/,
			'text-purple-400',
		],
		// JSX className
		[/^(className)(?==)/, 'text-sky-300'],
		// JSX prop names
		[/^([a-z][a-zA-Z0-9]*)(?==)/, 'text-sky-300'],
		// Types
		[
			/^(React|Metadata|string|number|boolean|void|null|undefined)\b/,
			'text-yellow-300',
		],
		// Component names (PascalCase)
		[/^([A-Z][a-zA-Z0-9]+)/, 'text-teal-300'],
		// Numbers
		[/^(\d+\.?\d*)/, 'text-orange-300'],
		// Operators
		[/^([=<>!&|?:]+)/, 'text-sky-200'],
		// Braces
		[/^([{}()\[\]])/, 'text-yellow-200'],
		// Whitespace
		[/^(\s+)/, ''],
		// Other
		[/^(.)/, 'text-gray-200'],
	]

	let iters = 0
	while (remaining.length > 0 && iters < 500) {
		iters++
		let matched = false
		for (const [re, cls] of patterns) {
			const m = remaining.match(re)
			if (m) {
				// Special handling for JSX tags
				if (re.source === '^(<\\/?)([a-zA-Z][a-zA-Z0-9]*)') {
					tokens.push({ text: m[1], cls: 'text-gray-400' })
					tokens.push({ text: m[2], cls: 'text-red-400' })
					remaining = remaining.slice(m[0].length)
				} else {
					tokens.push({ text: m[1] || m[0], cls })
					remaining = remaining.slice((m[1] || m[0]).length)
				}
				matched = true
				break
			}
		}
		if (!matched) {
			tokens.push({ text: remaining[0], cls: 'text-gray-200' })
			remaining = remaining.slice(1)
		}
	}

	return (
		<>
			{tokens.map((t, i) =>
				t.cls ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: tokens stable per line
					<span key={i} className={t.cls}>
						{t.text}
					</span>
				) : (
					t.text
				),
			)}
		</>
	)
}

// ---- CSS highlighting ----
function highlightCSS(line: string): React.ReactNode {
	const commentMatch = line.match(/^(\s*)(\/\*.*)/)
	if (commentMatch) {
		return (
			<>
				{commentMatch[1]}
				<span className='text-gray-500 italic'>{commentMatch[2]}</span>
			</>
		)
	}

	const importMatch = line.match(
		/^(@import|@tailwind|@layer|@theme|@apply)\b(.*)/,
	)
	if (importMatch) {
		return (
			<>
				<span className='text-purple-400'>{importMatch[1]}</span>
				<span className='text-gray-200'>{importMatch[2]}</span>
			</>
		)
	}

	const propMatch = line.match(/^(\s+)([\w-]+)(\s*:\s*)(.+)(;?)$/)
	if (propMatch) {
		return (
			<>
				{propMatch[1]}
				<span className='text-sky-300'>{propMatch[2]}</span>
				<span className='text-gray-400'>{propMatch[3]}</span>
				<span className='text-green-400'>{propMatch[4]}</span>
				<span className='text-gray-400'>{propMatch[5]}</span>
			</>
		)
	}

	const selectorMatch = line.match(
		/^(\s*)([.#:a-zA-Z*[][\w\s,.#:*\[\]=~^$|"-]*)(\s*\{?)$/,
	)
	if (selectorMatch) {
		return (
			<>
				{selectorMatch[1]}
				<span className='text-red-400'>{selectorMatch[2]}</span>
				<span className='text-yellow-200'>{selectorMatch[3]}</span>
			</>
		)
	}

	return <span className='text-gray-200'>{line}</span>
}

// ---- JSON highlighting ----
function highlightJSON(line: string): React.ReactNode {
	const keyMatch = line.match(/^(\s*)"([^"]+)"(\s*:\s*)/)
	if (keyMatch) {
		const rest = line.slice(keyMatch[0].length)
		return (
			<>
				{keyMatch[1]}
				<span className='text-sky-300'>&quot;{keyMatch[2]}&quot;</span>
				<span className='text-gray-400'>{keyMatch[3]}</span>
				<span className='text-green-400'>{rest}</span>
			</>
		)
	}

	return <span className='text-gray-200'>{line}</span>
}
