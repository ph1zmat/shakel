'use client'

import { useEffect, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useCanvasStore } from '../stores/canvas-store'
import { useTRPC } from '@/trpc/client'

/**
 * Hook for auto-saving canvas state back to the server.
 * Debounces saves to avoid flooding the API.
 */
export function useBuilderSync() {
	const trpc = useTRPC()

	const updateNode = useMutation(trpc.builder.updateNodeProps.mutationOptions())
	const updateStyles = useMutation(
		trpc.builder.updateNodeStyles.mutationOptions(),
	)

	// Sync single node props
	const syncNodeProps = useCallback(
		async (nodeId: string, props: Record<string, unknown>) => {
			try {
				await updateNode.mutateAsync({ nodeId, props })
			} catch (error) {
				console.error('Failed to sync node props:', error)
			}
		},
		[updateNode],
	)

	// Sync single node styles
	const syncNodeStyles = useCallback(
		async (nodeId: string, styles: Record<string, unknown>) => {
			try {
				await updateStyles.mutateAsync({ nodeId, styles })
			} catch (error) {
				console.error('Failed to sync node styles:', error)
			}
		},
		[updateStyles],
	)

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl+Z / Cmd+Z for undo
			if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
				e.preventDefault()
				useCanvasStore.getState().undo()
			}

			// Ctrl+Shift+Z / Cmd+Shift+Z for redo
			if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
				e.preventDefault()
				useCanvasStore.getState().redo()
			}

			// Delete / Backspace to remove selected node
			if (e.key === 'Delete' || e.key === 'Backspace') {
				const { selectedNodeId } = useCanvasStore.getState()
				// Only delete if not focused on an input
				const activeTag = document.activeElement?.tagName
				if (
					selectedNodeId &&
					activeTag !== 'INPUT' &&
					activeTag !== 'TEXTAREA' &&
					activeTag !== 'SELECT'
				) {
					e.preventDefault()
					useCanvasStore.getState().removeNode(selectedNodeId)
				}
			}

			// Escape to deselect
			if (e.key === 'Escape') {
				useCanvasStore.getState().selectNode(null)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	return {
		syncNodeProps,
		syncNodeStyles,
	}
}
