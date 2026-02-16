'use client'

import { useMemo, useState } from 'react'
import { useCanvasStore, useCurrentPage } from '../../stores/canvas-store'
import { generatePreviewFiles } from '../../codegen/tsx-preview-generator'
import { cn } from '@/lib/utils'
import {
	IconFolder,
	IconFolderOpen,
	IconFileTypeTsx,
	IconFileTypeCss,
	IconBraces,
	IconFile,
	IconChevronRight,
	IconChevronDown,
} from '@tabler/icons-react'

// ========================================
// Types
// ========================================

interface FileTreeNode {
	name: string
	path: string
	isDir: boolean
	children: FileTreeNode[]
	fileIdx?: number // index into files array
}

// ========================================
// File Explorer Panel
// ========================================

interface FileExplorerPanelProps {
	onSelectFile?: (fileIdx: number) => void
	activeFileIdx?: number
}

export function FileExplorerPanel({
	onSelectFile,
	activeFileIdx = 0,
}: FileExplorerPanelProps) {
	const nodes = useCanvasStore(state => state.nodes)
	const currentPage = useCurrentPage()
	const currentPageId = useCanvasStore(state => state.currentPageId)

	const files = useMemo(
		() => generatePreviewFiles(currentPage ?? null, nodes, currentPageId),
		[currentPage, nodes, currentPageId],
	)

	const tree = useMemo(
		() => buildFileTree(files.map((f, i) => ({ ...f, idx: i }))),
		[files],
	)

	return (
		<div className='flex flex-col h-full bg-[#181825] text-gray-300'>
			<div className='px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-700/50'>
				Explorer
			</div>
			<div className='flex-1 overflow-auto py-1'>
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
		</div>
	)
}

// ========================================
// Tree Row
// ========================================

function TreeRow({
	node,
	depth,
	activeFileIdx,
	onSelectFile,
}: {
	node: FileTreeNode
	depth: number
	activeFileIdx: number
	onSelectFile?: (idx: number) => void
}) {
	const [expanded, setExpanded] = useState(true)

	if (node.isDir) {
		return (
			<div>
				<button
					type='button'
					onClick={() => setExpanded(!expanded)}
					className={cn(
						'flex items-center gap-1 w-full px-2 py-0.5 text-[12px] hover:bg-gray-700/40 transition-colors',
					)}
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
					<span className='truncate font-medium'>{node.name}</span>
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
			onClick={() => node.fileIdx !== undefined && onSelectFile?.(node.fileIdx)}
			className={cn(
				'flex items-center gap-1.5 w-full px-2 py-0.5 text-[12px] transition-colors',
				isActive
					? 'bg-blue-600/20 text-blue-300'
					: 'hover:bg-gray-700/40 text-gray-400',
			)}
			style={{ paddingLeft: `${depth * 12 + 22}px` }}
		>
			<FileTypeIcon name={node.name} />
			<span className='truncate'>{node.name}</span>
		</button>
	)
}

// ========================================
// Icons
// ========================================

function FileTypeIcon({ name }: { name: string }) {
	if (name.endsWith('.tsx') || name.endsWith('.ts'))
		return <IconFileTypeTsx className='h-3.5 w-3.5 text-blue-400 shrink-0' />
	if (name.endsWith('.css'))
		return <IconFileTypeCss className='h-3.5 w-3.5 text-purple-400 shrink-0' />
	if (name.endsWith('.json'))
		return <IconBraces className='h-3.5 w-3.5 text-yellow-400 shrink-0' />
	return <IconFile className='h-3.5 w-3.5 text-gray-500 shrink-0' />
}

// ========================================
// Tree builder
// ========================================

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

			if (!isLast) {
				current = existing.children
			}
		}
	}

	// Sort: dirs first, then files
	function sortTree(nodes: FileTreeNode[]) {
		nodes.sort((a, b) => {
			if (a.isDir && !b.isDir) return -1
			if (!a.isDir && b.isDir) return 1
			return a.name.localeCompare(b.name)
		})
		for (const node of nodes) {
			if (node.isDir) sortTree(node.children)
		}
	}
	sortTree(root)

	return root
}
