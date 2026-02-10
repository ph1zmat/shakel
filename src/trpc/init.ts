import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjsom from 'superjson';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';

export const createTRPCContext = cache(async () => {
  return { userId: '1234' };
});

const t = initTRPC.create({
  transformer: superjsom,
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User is not authenticated',
    });
  }

  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    console.log('Checking subscription for user:', ctx.auth.user.id);

    try {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });

      console.log('Polar customer state:', JSON.stringify(customer, null, 2));

      if (
        (!customer.activeSubscriptions ||
          customer.activeSubscriptions.length === 0) &&
        (!customer.grantedBenefits || customer.grantedBenefits.length === 0)
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User does not have an active subscription',
        });
      }
      return next({ ctx: { ...ctx, customer } });
    } catch (error) {
      console.error('Polar error:', error);
      throw error;
    }
  },
);
