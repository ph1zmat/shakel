import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import prisma from '@/lib/db';

// Default tokens for new DesignSystem
const DEFAULT_COLORS = [
  { name: 'background', hue: 0, saturation: 0, lightness: 100, isSemantic: true, semanticRole: 'background' },
  { name: 'foreground', hue: 0, saturation: 0, lightness: 0, isSemantic: true, semanticRole: 'foreground' },
  { name: 'primary', hue: 217, saturation: 91, lightness: 60, isSemantic: true, semanticRole: 'accent' },
  { name: 'primary-foreground', hue: 0, saturation: 0, lightness: 100, isSemantic: true, semanticRole: 'accent' },
  { name: 'muted', hue: 0, saturation: 0, lightness: 95, isSemantic: true, semanticRole: 'muted' },
  { name: 'muted-foreground', hue: 0, saturation: 0, lightness: 45, isSemantic: true, semanticRole: 'muted' },
  { name: 'danger', hue: 0, saturation: 84, lightness: 60, isSemantic: true, semanticRole: 'danger' },
  { name: 'success', hue: 142, saturation: 71, lightness: 45, isSemantic: true, semanticRole: 'success' },
  { name: 'warning', hue: 38, saturation: 92, lightness: 50, isSemantic: true, semanticRole: 'warning' },
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
  { name: 'heading', family: 'Inter', weights: [400, 500, 600, 700], minSize: 1.5, maxSize: 3, lineHeight: 1.2 },
  { name: 'body', family: 'Inter', weights: [400, 500], minSize: 0.875, maxSize: 1, lineHeight: 1.5 },
  { name: 'mono', family: 'JetBrains Mono', weights: [400, 500], minSize: 0.875, maxSize: 1, lineHeight: 1.5 },
];

export const designSystemRouter = createTRPCRouter({
  // ========================================
  // Design System CRUD
  // ========================================

  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
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
        },
      });

      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
      }

      return project.designSystem;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const designSystem = await prisma.designSystem.findFirst({
        where: {
          id: input.id,
          projects: {
            some: {
              userId: ctx.auth.user.id,
            },
          },
        },
        include: {
          colors: true,
          spacing: true,
          typography: true,
          effects: true,
        },
      });

      if (!designSystem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Design system not found' });
      }

      return designSystem;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
        },
      });

      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
      }

      return prisma.designSystem.create({
        data: {
          name: input.name,
          projects: {
            connect: { id: input.projectId },
          },
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
        include: {
          colors: true,
          spacing: true,
          typography: true,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const designSystem = await prisma.designSystem.findFirst({
        where: {
          id: input.id,
          projects: {
            some: {
              userId: ctx.auth.user.id,
            },
          },
        },
      });

      if (!designSystem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Design system not found' });
      }

      return prisma.designSystem.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const designSystem = await prisma.designSystem.findFirst({
        where: {
          id: input.id,
          projects: {
            some: {
              userId: ctx.auth.user.id,
            },
          },
        },
        include: {
          projects: true,
        },
      });

      if (!designSystem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Design system not found' });
      }

      // Check if it's used by any projects
      if (designSystem.projects.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Cannot delete design system that is used by projects',
        });
      }

      return prisma.designSystem.delete({
        where: { id: input.id },
      });
    }),

  // ========================================
  // Color Tokens
  // ========================================

  createColorToken: protectedProcedure
    .input(z.object({
      designSystemId: z.string(),
      name: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
      hue: z.number().int().min(0).max(360),
      saturation: z.number().int().min(0).max(100),
      lightness: z.number().int().min(0).max(100),
      alpha: z.number().min(0).max(1).default(1),
      isSemantic: z.boolean().default(false),
      semanticRole: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const designSystem = await prisma.designSystem.findFirst({
        where: {
          id: input.designSystemId,
          projects: {
            some: {
              userId: ctx.auth.user.id,
            },
          },
        },
      });

      if (!designSystem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Design system not found' });
      }

      return prisma.colorToken.create({
        data: input,
      });
    }),

  updateColorToken: protectedProcedure
    .input(z.object({
      id: z.string(),
      hue: z.number().int().min(0).max(360).optional(),
      saturation: z.number().int().min(0).max(100).optional(),
      lightness: z.number().int().min(0).max(100).optional(),
      alpha: z.number().min(0).max(1).optional(),
      isSemantic: z.boolean().optional(),
      semanticRole: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.colorToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Color token not found' });
      }

      const { id, ...data } = input;
      return prisma.colorToken.update({
        where: { id },
        data,
      });
    }),

  deleteColorToken: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.colorToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Color token not found' });
      }

      return prisma.colorToken.delete({
        where: { id: input.id },
      });
    }),

  // ========================================
  // Spacing Tokens
  // ========================================

  createSpacingToken: protectedProcedure
    .input(z.object({
      designSystemId: z.string(),
      name: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
      value: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const designSystem = await prisma.designSystem.findFirst({
        where: {
          id: input.designSystemId,
          projects: {
            some: {
              userId: ctx.auth.user.id,
            },
          },
        },
      });

      if (!designSystem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Design system not found' });
      }

      return prisma.spacingToken.create({
        data: input,
      });
    }),

  updateSpacingToken: protectedProcedure
    .input(z.object({
      id: z.string(),
      value: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.spacingToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Spacing token not found' });
      }

      return prisma.spacingToken.update({
        where: { id: input.id },
        data: { value: input.value },
      });
    }),

  deleteSpacingToken: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.spacingToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Spacing token not found' });
      }

      return prisma.spacingToken.delete({
        where: { id: input.id },
      });
    }),

  // ========================================
  // Typography Tokens
  // ========================================

  createTypographyToken: protectedProcedure
    .input(z.object({
      designSystemId: z.string(),
      name: z.string().min(1).max(50),
      family: z.string().min(1),
      weights: z.array(z.number()).default([400]),
      fallback: z.string().default('system-ui, sans-serif'),
      minSize: z.number().positive(),
      maxSize: z.number().positive(),
      lineHeight: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const designSystem = await prisma.designSystem.findFirst({
        where: {
          id: input.designSystemId,
          projects: {
            some: {
              userId: ctx.auth.user.id,
            },
          },
        },
      });

      if (!designSystem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Design system not found' });
      }

      return prisma.typographyToken.create({
        data: input,
      });
    }),

  updateTypographyToken: protectedProcedure
    .input(z.object({
      id: z.string(),
      family: z.string().min(1).optional(),
      weights: z.array(z.number()).optional(),
      fallback: z.string().optional(),
      minSize: z.number().positive().optional(),
      maxSize: z.number().positive().optional(),
      lineHeight: z.number().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.typographyToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Typography token not found' });
      }

      const { id, ...data } = input;
      return prisma.typographyToken.update({
        where: { id },
        data,
      });
    }),

  deleteTypographyToken: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.typographyToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Typography token not found' });
      }

      return prisma.typographyToken.delete({
        where: { id: input.id },
      });
    }),

  // ========================================
  // Effect Tokens
  // ========================================

  createEffectToken: protectedProcedure
    .input(z.object({
      designSystemId: z.string(),
      name: z.string().min(1).max(50),
      type: z.enum(['SHADOW', 'BLUR', 'GLOW', 'BORDER']),
      params: z.any(),
    }))
    .mutation(async ({ ctx, input }) => {
      const designSystem = await prisma.designSystem.findFirst({
        where: {
          id: input.designSystemId,
          projects: {
            some: {
              userId: ctx.auth.user.id,
            },
          },
        },
      });

      if (!designSystem) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Design system not found' });
      }

      return prisma.effectToken.create({
        data: input as any,
      });
    }),

  updateEffectToken: protectedProcedure
    .input(z.object({
      id: z.string(),
      type: z.enum(['SHADOW', 'BLUR', 'GLOW', 'BORDER']).optional(),
      params: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.effectToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Effect token not found' });
      }

      const { id, ...data } = input;
      return prisma.effectToken.update({
        where: { id },
        data: data as any,
      });
    }),

  deleteEffectToken: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.effectToken.findFirst({
        where: {
          id: input.id,
          designSystem: {
            projects: {
              some: {
                userId: ctx.auth.user.id,
              },
            },
          },
        },
      });

      if (!token) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Effect token not found' });
      }

      return prisma.effectToken.delete({
        where: { id: input.id },
      });
    }),
});
