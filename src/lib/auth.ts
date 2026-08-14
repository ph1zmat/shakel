import { checkout, polar, portal } from '@polar-sh/better-auth';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './db';
import { polarClient } from './polar';

const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('[Auth] Base URL:', baseURL);
  console.log(
    '[Auth] GitHub Client ID:',
    process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
  );
  console.log(
    '[Auth] Google Client ID:',
    process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
  );
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: '0ffa97e3-f2fc-4a84-9b33-98f9230e0c1b',
              slug: 'Shakel',
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || 'http://localhost:3000',
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
