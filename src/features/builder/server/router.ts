import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import prisma from '@/lib/db'
import { PAGINATION } from '@/config/constants'
import {
	getComponentDefinition,
	validateProps,
} from '@/lib/codegen/component-registry'
import {
	NextJSGenerator,
	NestJSBotGenerator,
} from '../../builder/codegen/nextjs-generator'
import { Project as TsMorphProject, ts } from 'ts-morph'
import { createHash } from 'crypto'
import { inngest } from '@/inngest/client'

// ========================================
// Helper Functions
// ========================================

function hashContent(content: string): string {
	return createHash('md5').update(content).digest('hex')
}

function detectArtifactType(filePath: string): string {
	if (filePath.includes('app/') && filePath.endsWith('page.tsx'))
		return 'NEXTJS_PAGE'
	if (filePath.includes('app/') && filePath.endsWith('layout.tsx'))
		return 'NEXTJS_LAYOUT'
	if (filePath.endsWith('.css')) return 'CSS_STYLESHEET'
	if (filePath.includes('bot/handlers/')) return 'NESTJS_HANDLER'
	if (filePath.includes('bot/') && filePath.endsWith('.module.ts'))
		return 'NESTJS_MODULE'
	if (filePath.includes('bot/') && filePath.endsWith('.service.ts'))
		return 'NESTJS_SERVICE'
	return 'REACT_COMPONENT'
}

export const builderRouter = createTRPCRouter({
	// ========================================
	// Pages
	// ========================================

	getPages: protectedProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ ctx, input }) => {
			const project = await prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.auth.user.id,
				},
				include: {
					pages: {
						orderBy: { order: 'asc' },
						include: {
							_count: {
								select: {
									nodes: true,
								},
							},
						},
					},
				},
			})

			if (!project) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
			}

			return project.pages
		}),

	getPage: protectedProcedure
		.input(z.object({ pageId: z.string() }))
		.query(async ({ ctx, input }) => {
			const page = await prisma.page.findFirst({
				where: {
					id: input.pageId,
					project: {
						userId: ctx.auth.user.id,
					},
				},
				include: {
					project: true,
				},
			})

			if (!page) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' })
			}

			return page
		}),

	createPage: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				name: z.string().min(1).max(100),
				slug: z
					.string()
					.min(1)
					.max(100)
					.regex(/^[a-z0-9-/]+$/),
				isEntry: z.boolean().default(false),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const project = await prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.auth.user.id,
				},
				include: {
					pages: true,
				},
			})

			if (!project) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
			}

			// Check for unique slug
			const existingPage = await prisma.page.findFirst({
				where: {
					projectId: input.projectId,
					slug: input.slug,
				},
			})

			if (existingPage) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Page with this slug already exists',
				})
			}

			// If isEntry, unset other entry pages
			if (input.isEntry) {
				await prisma.page.updateMany({
					where: { projectId: input.projectId },
					data: { isEntry: false },
				})
			}

			const order = project.pages.length

			return prisma.page.create({
				data: {
					...input,
					order,
				},
			})
		}),

	updatePage: protectedProcedure
		.input(
			z.object({
				pageId: z.string(),
				name: z.string().min(1).max(100).optional(),
				slug: z
					.string()
					.min(1)
					.max(100)
					.regex(/^[a-z0-9-/]+$/)
					.optional(),
				isEntry: z.boolean().optional(),
				background: z.any().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const page = await prisma.page.findFirst({
				where: {
					id: input.pageId,
					project: {
						userId: ctx.auth.user.id,
					},
				},
			})

			if (!page) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' })
			}

			const { pageId, ...data } = input

			// If isEntry is being set, unset other entry pages
			if (input.isEntry) {
				await prisma.page.updateMany({
					where: {
						projectId: page.projectId,
						id: { not: pageId },
					},
					data: { isEntry: false },
				})
			}

			return prisma.page.update({
				where: { id: pageId },
				data: data as any,
			})
		}),

	deletePage: protectedProcedure
		.input(z.object({ pageId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const page = await prisma.page.findFirst({
				where: {
					id: input.pageId,
					project: {
						userId: ctx.auth.user.id,
					},
				},
			})

			if (!page) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' })
			}

			return prisma.page.delete({
				where: { id: input.pageId },
			})
		}),

	reorderPages: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				pageOrders: z.array(
					z.object({
						pageId: z.string(),
						order: z.number(),
					}),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const project = await prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.auth.user.id,
				},
			})

			if (!project) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
			}

			return prisma.$transaction(
				input.pageOrders.map(({ pageId, order }) =>
					prisma.page.update({
						where: { id: pageId },
						data: { order },
					}),
				),
			)
		}),

	// ========================================
	// Component Nodes
	// ========================================

	getPageTree: protectedProcedure
		.input(z.object({ pageId: z.string() }))
		.query(async ({ ctx, input }) => {
			const page = await prisma.page.findFirst({
				where: {
					id: input.pageId,
					project: {
						userId: ctx.auth.user.id,
					},
				},
			})

			if (!page) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' })
			}

			const nodes = await prisma.componentNode.findMany({
				where: { pageId: input.pageId },
				include: {
					interactions: true,
					styleBindings: true,
				},
				orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
			})

			return { nodes }
		}),

	createNode: protectedProcedure
		.input(
			z.object({
				pageId: z.string(),
				parentId: z.string().nullable(),
				type: z.string(),
				order: z.number().default(0),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Validate component type
			const def = getComponentDefinition(input.type)
			if (!def) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: `Unknown component type: ${input.type}`,
				})
			}

			// Verify page ownership
			const page = await prisma.page.findFirst({
				where: {
					id: input.pageId,
					project: {
						userId: ctx.auth.user.id,
					},
				},
			})

			if (!page) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Page not found' })
			}

			// If parentId provided, verify it exists and is a container
			if (input.parentId) {
				const parent = await prisma.componentNode.findFirst({
					where: {
						id: input.parentId,
						pageId: input.pageId,
					},
				})

				if (!parent) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Parent node not found',
					})
				}

				const parentDef = getComponentDefinition(parent.type)
				if (!parentDef?.isContainer) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Parent node is not a container',
					})
				}
			}

			// Reorder siblings
			await prisma.componentNode.updateMany({
				where: {
					pageId: input.pageId,
					parentId: input.parentId,
					order: { gte: input.order },
				},
				data: { order: { increment: 1 } },
			})

			return prisma.componentNode.create({
				data: {
					...input,
					props: def.defaultProps as any,
					styles: def.defaultStyles as any,
				},
				include: {
					interactions: true,
				},
			})
		}),

	updateNodeProps: protectedProcedure
		.input(
			z.object({
				nodeId: z.string(),
				props: z.any(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const node = await prisma.componentNode.findFirst({
				where: {
					id: input.nodeId,
					page: {
						project: {
							userId: ctx.auth.user.id,
						},
					},
				},
			})

			if (!node) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' })
			}

			// Validate props
			const validation = validateProps(node.type, input.props)
			if (!validation.valid) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: `Invalid props: ${validation.errors?.join(', ')}`,
				})
			}

			return prisma.componentNode.update({
				where: { id: input.nodeId },
				data: { props: input.props as any },
			})
		}),

	updateNodeStyles: protectedProcedure
		.input(
			z.object({
				nodeId: z.string(),
				styles: z.any(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const node = await prisma.componentNode.findFirst({
				where: {
					id: input.nodeId,
					page: {
						project: {
							userId: ctx.auth.user.id,
						},
					},
				},
			})

			if (!node) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' })
			}

			return prisma.componentNode.update({
				where: { id: input.nodeId },
				data: { styles: input.styles as any },
			})
		}),

	moveNode: protectedProcedure
		.input(
			z.object({
				nodeId: z.string(),
				parentId: z.string().nullable(),
				order: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const node = await prisma.componentNode.findFirst({
				where: {
					id: input.nodeId,
					page: {
						project: {
							userId: ctx.auth.user.id,
						},
					},
				},
			})

			if (!node) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' })
			}

			const { nodeId, parentId, order } = input
			const sourceParentId = node.parentId
			const sourceOrder = node.order

			// Prevent moving node into itself or its descendants
			if (parentId) {
				let currentParentId: string | null = parentId
				while (currentParentId) {
					if (currentParentId === nodeId) {
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: 'Cannot move node into itself or its descendants',
						})
					}
					const parent: { parentId: string | null } | null =
						await prisma.componentNode.findUnique({
							where: { id: currentParentId },
						})
					currentParentId = parent?.parentId
						? (parent.parentId as string)
						: null
				}
			}

			return prisma.$transaction(async tx => {
				// Reorder old siblings (decrement)
				await tx.componentNode.updateMany({
					where: {
						pageId: node.pageId,
						parentId: sourceParentId,
						order: { gt: sourceOrder },
					},
					data: { order: { decrement: 1 } },
				})

				// Reorder new siblings (increment)
				await tx.componentNode.updateMany({
					where: {
						pageId: node.pageId,
						parentId: parentId,
						order: { gte: order },
						id: { not: nodeId },
					},
					data: { order: { increment: 1 } },
				})

				// Update node
				return tx.componentNode.update({
					where: { id: nodeId },
					data: { parentId: parentId as any, order },
				})
			})
		}),

	deleteNode: protectedProcedure
		.input(z.object({ nodeId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const node = await prisma.componentNode.findFirst({
				where: {
					id: input.nodeId,
					page: {
						project: {
							userId: ctx.auth.user.id,
						},
					},
				},
			})

			if (!node) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' })
			}

			return prisma.$transaction(async tx => {
				// Collect all descendants
				const collectDescendants = async (
					parentId: string,
				): Promise<string[]> => {
					const children = await tx.componentNode.findMany({
						where: { parentId },
						select: { id: true },
					})
					const childIds = children.map(c => c.id)
					const descendantIds: string[] = []
					for (const childId of childIds) {
						descendantIds.push(...(await collectDescendants(childId)))
					}
					return [...childIds, ...descendantIds]
				}

				const descendants = await collectDescendants(input.nodeId)
				const allIds = [input.nodeId, ...descendants]

				// Delete all nodes
				await tx.componentNode.deleteMany({
					where: { id: { in: allIds } },
				})

				// Reorder remaining siblings
				await tx.componentNode.updateMany({
					where: {
						pageId: node.pageId,
						parentId: node.parentId,
						order: { gt: node.order },
					},
					data: { order: { decrement: 1 } },
				})

				return { deletedIds: allIds }
			})
		}),

	duplicateNode: protectedProcedure
		.input(z.object({ nodeId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const node = await prisma.componentNode.findFirst({
				where: {
					id: input.nodeId,
					page: {
						project: {
							userId: ctx.auth.user.id,
						},
					},
				},
				include: {
					interactions: true,
				},
			})

			if (!node) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' })
			}

			return prisma.$transaction(async tx => {
				// Clone function
				const cloneNode = async (
					sourceNode: typeof node,
					newParentId: string | null,
					newOrder: number,
				): Promise<string> => {
					// Create new node
					const newNode = await tx.componentNode.create({
						data: {
							pageId: sourceNode.pageId,
							parentId: newParentId as any,
							type: sourceNode.type,
							order: newOrder,
							props: sourceNode.props as any,
							styles: sourceNode.styles as any,
							interactions: {
								create: sourceNode.interactions.map((i, idx) => ({
									trigger: i.trigger,
									type: i.type,
									config: i.config as any,
									workflowId: i.workflowId,
									order: idx,
								})) as any,
							},
						},
					})

					// Clone children
					const children = await tx.componentNode.findMany({
						where: { parentId: sourceNode.id },
						include: { interactions: true },
						orderBy: { order: 'asc' },
					})

					for (let i = 0; i < children.length; i++) {
						await cloneNode(children[i], newNode.id, i)
					}

					return newNode.id
				}

				// Reorder siblings
				await tx.componentNode.updateMany({
					where: {
						pageId: node.pageId,
						parentId: node.parentId,
						order: { gt: node.order },
					},
					data: { order: { increment: 1 } },
				})

				const newNodeId = await cloneNode(node, node.parentId, node.order + 1)

				return tx.componentNode.findUnique({
					where: { id: newNodeId },
					include: { interactions: true },
				})
			})
		}),

	// ========================================
	// Interactions
	// ========================================

	addInteraction: protectedProcedure
		.input(
			z.object({
				nodeId: z.string(),
				trigger: z.enum([
					'onClick',
					'onSubmit',
					'onHover',
					'onMount',
					'onMessage',
				]),
				type: z.enum([
					'NAVIGATE',
					'OPEN_MODAL',
					'CLOSE_MODAL',
					'SCROLL_TO',
					'SHOW_FORM',
					'HIDE_FORM',
					'SET_STATE',
					'TOGGLE_VISIBILITY',
					'TRIGGER_WORKFLOW',
					'SEND_MESSAGE',
					'EDIT_MESSAGE',
					'SHOW_KEYBOARD',
					'HIDE_KEYBOARD',
				]),
				config: z.any().default({}),
				workflowId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const node = await prisma.componentNode.findFirst({
				where: {
					id: input.nodeId,
					page: {
						project: {
							userId: ctx.auth.user.id,
						},
					},
				},
				include: {
					interactions: true,
					page: true,
				},
			})

			if (!node) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' })
			}

			// If workflowId provided, verify it belongs to user or project
			if (input.workflowId) {
				const workflow = await prisma.workflow.findFirst({
					where: {
						id: input.workflowId,
						OR: [
							{ userId: ctx.auth.user.id },
							{ projectId: (node as any).page.projectId },
						],
					},
				})

				if (!workflow) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Workflow not found',
					})
				}
			}

			return prisma.interaction.create({
				data: {
					nodeId: input.nodeId,
					trigger: input.trigger,
					type: input.type,
					config: input.config,
					workflowId: input.workflowId,
					order: node.interactions.length,
				},
			})
		}),

	updateInteraction: protectedProcedure
		.input(
			z.object({
				interactionId: z.string(),
				trigger: z
					.enum(['onClick', 'onSubmit', 'onHover', 'onMount', 'onMessage'])
					.optional(),
				type: z
					.enum([
						'NAVIGATE',
						'OPEN_MODAL',
						'CLOSE_MODAL',
						'SCROLL_TO',
						'SHOW_FORM',
						'HIDE_FORM',
						'SET_STATE',
						'TOGGLE_VISIBILITY',
						'TRIGGER_WORKFLOW',
						'SEND_MESSAGE',
						'EDIT_MESSAGE',
						'SHOW_KEYBOARD',
						'HIDE_KEYBOARD',
					])
					.optional(),
				config: z.any().optional(),
				workflowId: z.string().optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const interaction = await prisma.interaction.findFirst({
				where: {
					id: input.interactionId,
					node: {
						page: {
							project: {
								userId: ctx.auth.user.id,
							},
						},
					},
				},
			})

			if (!interaction) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Interaction not found',
				})
			}

			const { interactionId, ...data } = input

			return prisma.interaction.update({
				where: { id: interactionId },
				data: data as any,
			})
		}),

	deleteInteraction: protectedProcedure
		.input(z.object({ interactionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const interaction = await prisma.interaction.findFirst({
				where: {
					id: input.interactionId,
					node: {
						page: {
							project: {
								userId: ctx.auth.user.id,
							},
						},
					},
				},
			})

			if (!interaction) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Interaction not found',
				})
			}

			return prisma.$transaction(async tx => {
				// Delete interaction
				await tx.interaction.delete({
					where: { id: input.interactionId },
				})

				// Reorder remaining interactions
				const remaining = await tx.interaction.findMany({
					where: { nodeId: interaction.nodeId },
					orderBy: { order: 'asc' },
				})

				for (let i = 0; i < remaining.length; i++) {
					await tx.interaction.update({
						where: { id: remaining[i].id },
						data: { order: i },
					})
				}

				return { success: true }
			})
		}),

	reorderInteractions: protectedProcedure
		.input(
			z.object({
				nodeId: z.string(),
				interactionOrders: z.array(
					z.object({
						interactionId: z.string(),
						order: z.number(),
					}),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const node = await prisma.componentNode.findFirst({
				where: {
					id: input.nodeId,
					page: {
						project: {
							userId: ctx.auth.user.id,
						},
					},
				},
			})

			if (!node) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Node not found' })
			}

			return prisma.$transaction(
				input.interactionOrders.map(({ interactionId, order }) =>
					prisma.interaction.update({
						where: { id: interactionId },
						data: { order },
					}),
				),
			)
		}),

	// ========================================
	// Code Generation
	// ========================================

	generateCode: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				pageIds: z.array(z.string()).optional(), // Optional: generate only specific pages
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const project = await prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.auth.user.id,
				},
				include: {
					designSystem: {
						include: {
							colors: true,
							spacing: true,
							typography: true,
							effects: true,
						},
					},
					pages: input.pageIds?.length
						? { where: { id: { in: input.pageIds } } }
						: true,
				},
			})

			if (!project) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
			}

			// Get all nodes for the pages
			const pageIds = project.pages.map((p: { id: string }) => p.id)
			const nodes = await prisma.componentNode.findMany({
				where: { pageId: { in: pageIds } },
				include: { interactions: true },
			})

			// Build nodes map
			const nodesMap = nodes.reduce(
				(acc, node) => {
					acc[node.id] = node
					return acc
				},
				{} as Record<string, (typeof nodes)[0]>,
			)

			let files: { path: string; content: string }[] = []

			if (project.platform === 'WEB') {
				const generator = new NextJSGenerator()
				files = generator.generateProject(
					project as any,
					project.pages as any,
					nodesMap as any,
					{
						colors: project.designSystem.colors,
						spacing: project.designSystem.spacing,
						typography: project.designSystem.typography,
					},
				)
			} else {
				const generator = new NestJSBotGenerator()
				files = generator.generateBot(
					project as any,
					project.pages as any,
					nodesMap as any,
				)
			}

			// Save artifacts
			const artifacts = await prisma.$transaction(
				files.map(file =>
					prisma.codeArtifact.upsert({
						where: {
							projectId_filePath: {
								projectId: project.id,
								filePath: file.path,
							},
						},
						create: {
							projectId: project.id,
							type: detectArtifactType(file.path) as any,
							filePath: file.path,
							content: file.content,
							contentHash: hashContent(file.content),
						},
						update: {
							content: file.content,
							contentHash: hashContent(file.content),
							generatedAt: new Date(),
						},
					}),
				),
			)

			return {
				files: files.map(f => ({ path: f.path })),
				artifacts,
			}
		}),

	getArtifacts: protectedProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ ctx, input }) => {
			const project = await prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.auth.user.id,
				},
			})

			if (!project) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
			}

			return prisma.codeArtifact.findMany({
				where: { projectId: input.projectId },
				orderBy: { generatedAt: 'desc' },
			})
		}),

	getArtifact: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				filePath: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const project = await prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.auth.user.id,
				},
			})

			if (!project) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
			}

			return prisma.codeArtifact.findUnique({
				where: {
					projectId_filePath: {
						projectId: input.projectId,
						filePath: input.filePath,
					},
				},
			})
		}),

	saveEditedCode: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				files: z.array(
					z.object({
						path: z.string(),
						content: z.string(),
					}),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const project = await prisma.project.findFirst({
				where: {
					id: input.projectId,
					userId: ctx.auth.user.id,
				},
			})

			if (!project) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
			}

			const artifacts = await prisma.$transaction(
				input.files.map(file =>
					prisma.codeArtifact.upsert({
						where: {
							projectId_filePath: {
								projectId: project.id,
								filePath: file.path,
							},
						},
						create: {
							projectId: project.id,
							type: detectArtifactType(file.path) as any,
							filePath: file.path,
							content: file.content,
							contentHash: hashContent(file.content),
						},
						update: {
							content: file.content,
							contentHash: hashContent(file.content),
							generatedAt: new Date(),
						},
					}),
				),
			)

			return { savedCount: artifacts.length }
		}),

	compileCode: protectedProcedure
		.input(
			z.object({
				files: z.array(
					z.object({
						path: z.string(),
						content: z.string(),
					}),
				),
			}),
		)
		.mutation(async ({ input }) => {
			const project = new TsMorphProject({
				useInMemoryFileSystem: true,
				compilerOptions: {
					target: ts.ScriptTarget.ESNext,
					module: ts.ModuleKind.ESNext,
					moduleResolution: ts.ModuleResolutionKind.Bundler,
					jsx: ts.JsxEmit.ReactJSX,
					esModuleInterop: true,
					strict: true,
					skipLibCheck: true,
					noEmit: true,
					baseUrl: '.',
					paths: { '@/*': ['./src/*'] },
				},
			})

			// Add React type stubs so JSX doesn't error
			project.createSourceFile(
				'node_modules/@types/react/index.d.ts',
				`
declare namespace React {
  type ReactNode = string | number | boolean | null | undefined | React.ReactElement | React.ReactNode[];
  interface ReactElement<P = any> { type: any; props: P; key: string | null; }
  type FC<P = {}> = (props: P) => ReactNode;
  type CSSProperties = Record<string, string | number>;
  type MouseEvent<T = Element> = any;
  type ChangeEvent<T = Element> = any;
  type FormEvent<T = Element> = any;
  type KeyboardEvent<T = Element> = any;
  function useState<T>(init: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useRef<T>(init: T): { current: T };
  function useCallback<T extends (...args: any[]) => any>(cb: T, deps: any[]): T;
  function useMemo<T>(factory: () => T, deps: any[]): T;
  function createElement(type: any, props?: any, ...children: any[]): ReactElement;
}
declare namespace JSX {
  interface Element extends React.ReactElement {}
  interface IntrinsicElements { [elemName: string]: any; }
}
export = React;
export as namespace React;
`,
			)

			project.createSourceFile(
				'node_modules/next/link.d.ts',
				`import React from 'react';
declare const Link: React.FC<{ href: string; className?: string; children?: React.ReactNode; [key: string]: any }>;
export default Link;`,
			)

			project.createSourceFile(
				'node_modules/next/image.d.ts',
				`import React from 'react';
declare const Image: React.FC<{ src: string; alt: string; width?: number; height?: number; className?: string; [key: string]: any }>;
export default Image;`,
			)

			// Add user files
			for (const file of input.files) {
				const filePath = file.path.startsWith('/')
					? file.path.slice(1)
					: file.path
				if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
					project.createSourceFile(filePath, file.content, { overwrite: true })
				}
			}

			const diagnostics = project.getPreEmitDiagnostics()

			return {
				diagnostics: diagnostics.map(d => {
					const sourceFile = d.getSourceFile()
					const start = d.getStart()
					let line = 0
					let column = 0
					if (sourceFile && start !== undefined) {
						const pos = sourceFile.getLineAndColumnAtPos(start)
						line = pos.line
						column = pos.column
					}
					return {
						file: String(sourceFile?.getFilePath() ?? 'unknown'),
						line,
						column,
						message: d.getMessageText().toString(),
						severity:
							d.getCategory() === ts.DiagnosticCategory.Error
								? ('error' as const)
								: d.getCategory() === ts.DiagnosticCategory.Warning
									? ('warning' as const)
									: ('info' as const),
					}
				}),
			}
		}),

	// ========================================
	// AI Generation (Mistral via Inngest)
	// ========================================

	aiGenerate: protectedProcedure
		.input(
			z.object({
				prompt: z.string().min(1).max(2000),
				pageId: z.string(),
				originX: z.number().default(100),
				originY: z.number().default(100),
				mode: z
					.enum(['interface', 'animation', 'content', 'auto'])
					.default('auto'),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// Create a job record
			const job = await prisma.aiGenerationJob.create({
				data: {
					prompt: input.prompt,
					mode: input.mode,
					pageId: input.pageId,
					originX: input.originX,
					originY: input.originY,
					userId: ctx.auth.user.id,
				},
			})

			// Send event to Inngest for background processing
			await inngest.send({
				name: 'builder/ai.generate',
				data: {
					jobId: job.id,
					prompt: input.prompt,
					mode: input.mode,
					pageId: input.pageId,
					originX: input.originX,
					originY: input.originY,
				},
			})

			return { jobId: job.id }
		}),

	aiGenerateStatus: protectedProcedure
		.input(z.object({ jobId: z.string() }))
		.query(async ({ input, ctx }) => {
			const job = await prisma.aiGenerationJob.findUnique({
				where: { id: input.jobId },
			})

			if (!job || job.userId !== ctx.auth.user.id) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Job not found' })
			}

			return {
				status: job.status.toLowerCase() as
					| 'pending'
					| 'running'
					| 'completed'
					| 'failed',
				explanation: job.explanation,
				error: job.error,
				nodes:
					job.status === 'COMPLETED'
						? ((job.resultNodes as unknown[]) ?? [])
						: [],
			}
		}),
})
