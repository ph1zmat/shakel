import { checkout, polar, portal } from '@polar-sh/better-auth'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './db'
import { polarClient } from './polar'

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	baseURL: process.env.BETTER_AUTH_URL,
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
})
