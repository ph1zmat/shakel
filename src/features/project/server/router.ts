import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { PAGINATION } from '@/config/constants';
import { Platform, PublishStatus } from '@/generated/prisma/enums';
import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

// Default tokens for auto-created DesignSystem
const DEFAULT_COLORS = [
  {
    name: 'background',
    hue: 0,
    saturation: 0,
    lightness: 100,
    isSemantic: true,
    semanticRole: 'background',
  },
  {
    name: 'foreground',
    hue: 0,
    saturation: 0,
    lightness: 0,
    isSemantic: true,
    semanticRole: 'foreground',
  },
  {
    name: 'primary',
    hue: 217,
    saturation: 91,
    lightness: 60,
    isSemantic: true,
    semanticRole: 'accent',
  },
  {
    name: 'primary-foreground',
    hue: 0,
    saturation: 0,
    lightness: 100,
    isSemantic: true,
    semanticRole: 'accent',
  },
  {
    name: 'muted',
    hue: 0,
    saturation: 0,
    lightness: 95,
    isSemantic: true,
    semanticRole: 'muted',
  },
  {
    name: 'muted-foreground',
    hue: 0,
    saturation: 0,
    lightness: 45,
    isSemantic: true,
    semanticRole: 'muted',
  },
  {
    name: 'danger',
    hue: 0,
    saturation: 84,
    lightness: 60,
    isSemantic: true,
    semanticRole: 'danger',
  },
  {
    name: 'success',
    hue: 142,
    saturation: 71,
    lightness: 45,
    isSemantic: true,
    semanticRole: 'success',
  },
  {
    name: 'warning',
    hue: 38,
    saturation: 92,
    lightness: 50,
    isSemantic: true,
    semanticRole: 'warning',
  },
];

const DEFAULT_SPACING = [
  { name: 'xs', value: 0.25 },
  { name: 'sm', value: 0.5 },
  { name: 'md', value: 1 },
  { name: 'lg', value: 1.5 },
  { name: 'xl', value: 2 },
  { name: '2xl', value: 3 },
  { name: '3xl', value: 4 },
];

const DEFAULT_TYPOGRAPHY = [
  {
    name: 'heading',
    family: 'Inter',
    weights: [400, 500, 600, 700],
    minSize: 1.5,
    maxSize: 3,
    lineHeight: 1.2,
  },
  {
    name: 'body',
    family: 'Inter',
    weights: [400, 500],
    minSize: 0.875,
    maxSize: 1,
    lineHeight: 1.5,
  },
  {
    name: 'mono',
    family: 'JetBrains Mono',
    weights: [400, 500],
    minSize: 0.875,
    maxSize: 1,
    lineHeight: 1.5,
  },
];

export const projectRouter = createTRPCRouter({
  // ========================================
  // Project CRUD
  // ========================================

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(''),
        platform: z.enum(['WEB', 'TELEGRAM_BOT']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, platform } = input;

      const where = {
        userId: ctx.auth.user.id,
        ...(platform && { platform }),
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }),
      };

      const [items, totalCount] = await Promise.all([
        prisma.project.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          include: {
            designSystem: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                pages: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        }),
        prisma.project.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return project;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
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
          pages: {
            orderBy: {
              order: 'asc',
            },
          },
          workflows: {
            select: {
              id: true,
              name: true,
            },
          },
          webConfig: true,
          botConfig: true,
          _count: {
            select: {
              codeArtifacts: true,
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return project;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        platform: z.enum(['WEB', 'TELEGRAM_BOT']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.$transaction(async (tx) => {
        // Create DesignSystem first
        const designSystem = await tx.designSystem.create({
          data: {
            name: `${input.name} Theme`,
            colors: {
              create: DEFAULT_COLORS,
            },
            spacing: {
              create: DEFAULT_SPACING,
            },
            typography: {
              create: DEFAULT_TYPOGRAPHY,
            },
          },
        });

        // Create Project with DesignSystem
        const project = await tx.project.create({
          data: {
            name: input.name,
            platform: input.platform,
            userId: ctx.auth.user.id,
            designSystemId: designSystem.id,
          },
        });

        // Create default page based on platform
        if (input.platform === 'WEB') {
          // Create Home page
          await tx.page.create({
            data: {
              name: 'Home',
              slug: '/',
              isEntry: true,
              projectId: project.id,
              order: 0,
            },
          });

          // Create WebProjectConfig
          await tx.webProjectConfig.create({
            data: {
              projectId: project.id,
            },
          });
        } else {
          // Create Start page for bot
          await tx.page.create({
            data: {
              name: 'Start',
              slug: 'start',
              isEntry: true,
              projectId: project.id,
              order: 0,
            },
          });

          // Create BotProjectConfig
          await tx.botProjectConfig.create({
            data: {
              projectId: project.id,
              parseMode: 'HTML',
            },
          });
        }

        return tx.project.findUnique({
          where: { id: project.id },
          include: {
            designSystem: {
              include: {
                colors: true,
                spacing: true,
                typography: true,
              },
            },
            pages: true,
          },
        });
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      const { id, ...data } = input;
      return prisma.project.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return prisma.project.delete({
        where: { id: input.id },
      });
    }),

  // ========================================
  // Web Project Config
  // ========================================

  getWebConfig: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
          platform: 'WEB',
        },
        include: {
          webConfig: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Web project not found',
        });
      }

      return project.webConfig;
    }),

  updateWebConfig: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        domain: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        favicon: z.string().optional(),
        basePath: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
          platform: 'WEB',
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Web project not found',
        });
      }

      const { projectId, ...data } = input;

      return prisma.webProjectConfig.upsert({
        where: { projectId },
        create: {
          projectId,
          ...data,
        },
        update: data,
      });
    }),

  // ========================================
  // Bot Project Config
  // ========================================

  getBotConfig: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
          platform: 'TELEGRAM_BOT',
        },
        include: {
          botConfig: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Bot project not found',
        });
      }

      return project.botConfig;
    }),

  updateBotConfig: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        token: z.string().optional(),
        webhookUrl: z.string().optional(),
        parseMode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
        disableWebPagePreview: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
          platform: 'TELEGRAM_BOT',
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Bot project not found',
        });
      }

      const { projectId, ...data } = input;

      return prisma.botProjectConfig.upsert({
        where: { projectId },
        create: {
          projectId,
          ...data,
        },
        update: data,
      });
    }),

  // ========================================
  // Code Generation Status
  // ========================================

  getCodeArtifacts: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return prisma.codeArtifact.findMany({
        where: { projectId: input.projectId },
        orderBy: { generatedAt: 'desc' },
      });
    }),

  getCodeArtifact: protectedProcedure
    .input(z.object({ projectId: z.string(), filePath: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        });
      }

      return prisma.codeArtifact.findUnique({
        where: {
          projectId_filePath: {
            projectId: input.projectId,
            filePath: input.filePath,
          },
        },
      });
    }),
});
