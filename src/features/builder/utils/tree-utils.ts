/**
 * Утилиты для Builder.
 * Хелперы для работы с деревом компонентов, стилями и сериализацией.
 */

import type { ComponentNode } from '../stores/canvas-store'

/**
 * Строит дерево из плоского списка нод.
 */
export interface TreeNode {
	node: ComponentNode
	children: TreeNode[]
}

export function buildTree(
	nodes: Record<string, ComponentNode>,
	pageId: string,
): TreeNode[] {
	const rootNodes = Object.values(nodes)
		.filter(n => n.pageId === pageId && n.parentId === null)
		.sort((a, b) => a.order - b.order)

	function buildChildren(parentId: string): TreeNode[] {
		return Object.values(nodes)
			.filter(n => n.parentId === parentId)
			.sort((a, b) => a.order - b.order)
			.map(n => ({
				node: n,
				children: buildChildren(n.id),
			}))
	}

	return rootNodes.map(n => ({
		node: n,
		children: buildChildren(n.id),
	}))
}

/**
 * Проверяет, является ли nodeId потомком ancestorId.
 */
export function isDescendant(
	nodes: Record<string, ComponentNode>,
	nodeId: string,
	ancestorId: string,
): boolean {
	let current = nodes[nodeId]
	while (current) {
		if (current.parentId === ancestorId) return true
		current = current.parentId
			? nodes[current.parentId]
			: (undefined as unknown as ComponentNode)
	}
	return false
}

/**
 * Подсчитывает количество потомков ноды.
 */
export function countDescendants(
	nodes: Record<string, ComponentNode>,
	nodeId: string,
): number {
	const children = Object.values(nodes).filter(n => n.parentId === nodeId)
	return children.reduce(
		(sum, child) => sum + 1 + countDescendants(nodes, child.id),
		0,
	)
}

/**
 * Глубоко клонирует ноду и всех потомков с новыми ID.
 */
export function deepCloneNode(
	nodes: Record<string, ComponentNode>,
	nodeId: string,
	newParentId: string | null,
	generateId: () => string,
): ComponentNode[] {
	const original = nodes[nodeId]
	if (!original) return []

	const newId = generateId()
	const cloned: ComponentNode = {
		...original,
		id: newId,
		parentId: newParentId,
		props: JSON.parse(JSON.stringify(original.props)),
		styles: JSON.parse(JSON.stringify(original.styles)),
		interactions: original.interactions.map(i => ({
			...i,
			id: generateId(),
		})),
	}

	const childClones = Object.values(nodes)
		.filter(n => n.parentId === nodeId)
		.sort((a, b) => a.order - b.order)
		.flatMap(child => deepCloneNode(nodes, child.id, newId, generateId))

	return [cloned, ...childClones]
}

/**
 * Сериализует дерево компонентов в JSON для экспорта.
 */
export function serializeTree(
	nodes: Record<string, ComponentNode>,
	pageId: string,
): unknown {
	const tree = buildTree(nodes, pageId)

	function serializeNode(treeNode: TreeNode): unknown {
		return {
			type: treeNode.node.type,
			props: treeNode.node.props,
			styles: treeNode.node.styles,
			interactions: treeNode.node.interactions,
			children: treeNode.children.map(serializeNode),
		}
	}

	return tree.map(serializeNode)
}
