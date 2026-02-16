/**
 * Project Template — шаблоны для генерации полных проектов.
 * Генерирует package.json, tsconfig, tailwind.config и другие конфиги.
 */

export interface ProjectTemplateConfig {
	name: string
	platform: 'WEB' | 'TELEGRAM_BOT'
	hasWorkflows: boolean
}

export interface GeneratedFile {
	path: string
	content: string
}

export function generatePackageJson(
	config: ProjectTemplateConfig,
): GeneratedFile {
	const deps: Record<string, string> = {}
	const devDeps: Record<string, string> = {}

	if (config.platform === 'WEB') {
		Object.assign(deps, {
			next: '^14.0.0',
			react: '^18.0.0',
			'react-dom': '^18.0.0',
		})
		Object.assign(devDeps, {
			typescript: '^5.0.0',
			'@types/node': '^20.0.0',
			'@types/react': '^18.0.0',
		})
	} else {
		Object.assign(deps, {
			'@nestjs/core': '^10.0.0',
			'@nestjs/common': '^10.0.0',
			'@nestjs/platform-express': '^10.0.0',
			'nestjs-telegraf': '^2.0.0',
			telegraf: '^4.0.0',
		})
		Object.assign(devDeps, {
			typescript: '^5.0.0',
			'@types/node': '^20.0.0',
			'@nestjs/cli': '^10.0.0',
		})
	}

	if (config.hasWorkflows) {
		deps.inngest = '^3.0.0'
	}

	const pkg = {
		name: config.name.toLowerCase().replace(/\s+/g, '-'),
		version: '0.1.0',
		private: true,
		scripts:
			config.platform === 'WEB'
				? {
						dev: 'next dev',
						build: 'next build',
						start: 'next start',
					}
				: {
						dev: 'nest start --watch',
						build: 'nest build',
						start: 'node dist/main',
					},
		dependencies: deps,
		devDependencies: devDeps,
	}

	return {
		path: 'package.json',
		content: JSON.stringify(pkg, null, 2),
	}
}

export function generateTsConfig(
	platform: 'WEB' | 'TELEGRAM_BOT',
): GeneratedFile {
	const config =
		platform === 'WEB'
			? {
					compilerOptions: {
						target: 'es5',
						lib: ['dom', 'dom.iterable', 'esnext'],
						allowJs: true,
						skipLibCheck: true,
						strict: true,
						noEmit: true,
						esModuleInterop: true,
						module: 'esnext',
						moduleResolution: 'bundler',
						resolveJsonModule: true,
						isolatedModules: true,
						jsx: 'preserve',
						incremental: true,
						plugins: [{ name: 'next' }],
						paths: { '@/*': ['./src/*'] },
					},
					include: [
						'next-env.d.ts',
						'**/*.ts',
						'**/*.tsx',
						'.next/types/**/*.ts',
					],
					exclude: ['node_modules'],
				}
			: {
					compilerOptions: {
						module: 'commonjs',
						declaration: true,
						removeComments: true,
						emitDecoratorMetadata: true,
						experimentalDecorators: true,
						allowSyntheticDefaultImports: true,
						target: 'ES2021',
						sourceMap: true,
						outDir: './dist',
						baseUrl: './',
						incremental: true,
					},
				}

	return {
		path: 'tsconfig.json',
		content: JSON.stringify(config, null, 2),
	}
}

export function generateDockerfile(
	platform: 'WEB' | 'TELEGRAM_BOT',
): GeneratedFile {
	const content =
		platform === 'WEB'
			? `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
`
			: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
`

	return {
		path: 'Dockerfile',
		content,
	}
}
