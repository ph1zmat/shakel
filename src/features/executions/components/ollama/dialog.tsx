'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCredentialsByType } from '@/features/credentials/hooks/use-credentials'
import { CredentialType } from '@/generated/prisma/enums'

export const AVAILABLE_MODELS = [
	'athene-v2',
	'athene-v2:72b',
	'aya-expanse',
	'aya-expanse:8b',
	'aya-expanse:32b',
	'codegemma',
	'codegemma:2b',
	'codegemma:7b',
	'codellama',
	'codellama:7b',
	'codellama:13b',
	'codellama:34b',
	'codellama:70b',
	'codellama:code',
	'codellama:python',
	'command-r',
	'command-r:35b',
	'command-r-plus',
	'command-r-plus:104b',
	'command-r7b',
	'command-r7b:7b',
	'deepseek-r1',
	'deepseek-r1:1.5b',
	'deepseek-r1:7b',
	'deepseek-r1:8b',
	'deepseek-r1:14b',
	'deepseek-r1:32b',
	'deepseek-r1:70b',
	'deepseek-r1:671b',
	'deepseek-coder-v2',
	'deepseek-coder-v2:16b',
	'deepseek-coder-v2:236b',
	'deepseek-v3',
	'deepseek-v3:671b',
	'devstral',
	'devstral:24b',
	'dolphin3',
	'dolphin3:8b',
	'exaone3.5',
	'exaone3.5:2.4b',
	'exaone3.5:7.8b',
	'exaone3.5:32b',
	'falcon2',
	'falcon2:11b',
	'falcon3',
	'falcon3:1b',
	'falcon3:3b',
	'falcon3:7b',
	'falcon3:10b',
	'firefunction-v2',
	'firefunction-v2:70b',
	'gemma',
	'gemma:2b',
	'gemma:7b',
	'gemma2',
	'gemma2:2b',
	'gemma2:9b',
	'gemma2:27b',
	'gemma3',
	'gemma3:1b',
	'gemma3:4b',
	'gemma3:12b',
	'gemma3:27b',
	'granite3-dense',
	'granite3-dense:2b',
	'granite3-dense:8b',
	'granite3-guardian',
	'granite3-guardian:2b',
	'granite3-guardian:8b',
	'granite3-moe',
	'granite3-moe:1b',
	'granite3-moe:3b',
	'granite3.1-dense',
	'granite3.1-dense:2b',
	'granite3.1-dense:8b',
	'granite3.1-moe',
	'granite3.1-moe:1b',
	'granite3.1-moe:3b',
	'llama2',
	'llama2:7b',
	'llama2:13b',
	'llama2:70b',
	'llama3',
	'llama3:8b',
	'llama3:70b',
	'llama3-chatqa',
	'llama3-chatqa:8b',
	'llama3-chatqa:70b',
	'llama3-gradient',
	'llama3-gradient:8b',
	'llama3-gradient:70b',
	'llama3.1',
	'llama3.1:8b',
	'llama3.1:70b',
	'llama3.1:405b',
	'llama3.2',
	'llama3.2:1b',
	'llama3.2:3b',
	'llama3.2-vision',
	'llama3.2-vision:11b',
	'llama3.2-vision:90b',
	'llama3.3',
	'llama3.3:70b',
	'llama4',
	'llama4:16x17b',
	'llama4:128x17b',
	'llama-guard3',
	'llama-guard3:1b',
	'llama-guard3:8b',
	'llava',
	'llava:7b',
	'llava:13b',
	'llava:34b',
	'llava-llama3',
	'llava-llama3:8b',
	'llava-phi3',
	'llava-phi3:3.8b',
	'marco-o1',
	'marco-o1:7b',
	'mistral',
	'mistral:7b',
	'mistral-large',
	'mistral-large:123b',
	'mistral-nemo',
	'mistral-nemo:12b',
	'mistral-small',
	'mistral-small:22b',
	'mixtral',
	'mixtral:8x7b',
	'mixtral:8x22b',
	'moondream',
	'moondream:1.8b',
	'openhermes',
	'openhermes:v2.5',
	'nemotron',
	'nemotron:70b',
	'nemotron-mini',
	'nemotron-mini:4b',
	'olmo',
	'olmo:7b',
	'olmo:13b',
	'opencoder',
	'opencoder:1.5b',
	'opencoder:8b',
	'phi3',
	'phi3:3.8b',
	'phi3:14b',
	'phi3.5',
	'phi3.5:3.8b',
	'phi4',
	'phi4:14b',
	'qwen',
	'qwen:7b',
	'qwen:14b',
	'qwen:32b',
	'qwen:72b',
	'qwen:110b',
	'qwen2',
	'qwen2:0.5b',
	'qwen2:1.5b',
	'qwen2:7b',
	'qwen2:72b',
	'qwen2.5',
	'qwen2.5:0.5b',
	'qwen2.5:1.5b',
	'qwen2.5:3b',
	'qwen2.5:7b',
	'qwen2.5:14b',
	'qwen2.5:32b',
	'qwen2.5:72b',
	'qwen2.5-coder',
	'qwen2.5-coder:0.5b',
	'qwen2.5-coder:1.5b',
	'qwen2.5-coder:3b',
	'qwen2.5-coder:7b',
	'qwen2.5-coder:14b',
	'qwen2.5-coder:32b',
	'qwen3',
	'qwen3:0.6b',
	'qwen3:1.7b',
	'qwen3:4b',
	'qwen3:8b',
	'qwen3:14b',
	'qwen3:30b',
	'qwen3:32b',
	'qwen3:235b',
	'qwq',
	'qwq:32b',
	'sailor2',
	'sailor2:1b',
	'sailor2:8b',
	'sailor2:20b',
	'shieldgemma',
	'shieldgemma:2b',
	'shieldgemma:9b',
	'shieldgemma:27b',
	'smallthinker',
	'smallthinker:3b',
	'smollm',
	'smollm:135m',
	'smollm:360m',
	'smollm:1.7b',
	'tinyllama',
	'tinyllama:1.1b',
	'tulu3',
	'tulu3:8b',
	'tulu3:70b',
] as const

const formSchema = z.object({
	variableName: z
		.string()
		.min(1, { message: 'Variable name is required' })
		.regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
			message:
				'Variable name must start with a letter or underscore and container only letters, numbers and underscores',
		}),
	model: z.enum(AVAILABLE_MODELS),
	credentialId: z.string().min(1, { message: 'Credential is required' }),
	systemPrompt: z.string().optional(),
	userPrompt: z.string().min(1, { message: 'User prompt is required' }),
})

export type OllamaFormValues = z.infer<typeof formSchema>

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: OllamaFormValues) => void
	defaultValues?: Partial<OllamaFormValues>
}

export const OllamaDialog = ({
	open,
	onOpenChange,
	onSubmit,
	defaultValues = {},
}: Props) => {
	const { data: credentials, isLoading: isLoadingCredentials } =
		useCredentialsByType(CredentialType.OLLAMA)

	const form = useForm<OllamaFormValues>({
		defaultValues: {
			variableName: defaultValues.variableName || '',
			model: defaultValues.model || AVAILABLE_MODELS[0],
			credentialId: defaultValues.credentialId || '',
			systemPrompt: defaultValues.systemPrompt || '',
			userPrompt: defaultValues.userPrompt || '',
		},
		resolver: zodResolver(formSchema),
	})

	useEffect(() => {
		if (open) {
			form.reset({
				variableName: defaultValues.variableName || '',
				model: defaultValues.model || AVAILABLE_MODELS[0],
				credentialId: defaultValues.credentialId || '',
				systemPrompt: defaultValues.systemPrompt || '',
				userPrompt: defaultValues.userPrompt || '',
			})
		}
	}, [open, defaultValues, form])

	const watchVariableName = form.watch('variableName') || 'myApiCall'

	const handleSubmit = (values: OllamaFormValues) => {
		onSubmit(values)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ollama</DialogTitle>
					<DialogDescription>
						Configure settings for the Ollama node.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-8 mt-4'
					>
						<FormField
							control={form.control}
							name='variableName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variable Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder='myApiCall' />
									</FormControl>
									<FormDescription>
										Use this name to reference the result in other nodes:{' '}
										{`{{${watchVariableName}.text}}`}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='credentialId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ollama Credential</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isLoadingCredentials || !credentials?.length}
									>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select a credential' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{credentials?.map(credential => (
												<SelectItem key={credential.id} value={credential.id}>
													<div className='flex items-center gap-2'>
														<Image
															src='/logos/ollama.svg'
															alt={`${credential.name} Logo`}
															width={16}
															height={16}
														/>
														{credential.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='model'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Model</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select a model' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{AVAILABLE_MODELS.map(model => (
												<SelectItem key={model} value={model}>
													{model}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										The Ollama model to use for completion.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='systemPrompt'
							render={({ field }) => (
								<FormItem>
									<FormLabel>System Prompt (Optional)</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder={
												'You are a helpful assistant that provides concise answers.'
											}
											className='min-h-[60px] font-mono text-sm'
										/>
									</FormControl>
									<FormDescription>
										Sets the behavior of the assistant. Use {'{{variables}}'}
										for simple values or {'{{json variables}}'} to stringify
										objects.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='userPrompt'
							render={({ field }) => (
								<FormItem>
									<FormLabel>User Prompt</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder={
												'Summarize this text: {{json httpResponse.data}}'
											}
											className='min-h-[60px] font-mono text-sm'
										/>
									</FormControl>
									<FormDescription>
										The prompt to send to the AI. Use {'{{variables}}'}
										for simple values or {'{{json variables}}'} to stringify
										objects.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className='mt-4'>
							<Button type='submit'>Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
