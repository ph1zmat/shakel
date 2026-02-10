'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const registerSchema = z
	.object({
		email: z.email('Please enter a valid email address'),
		password: z.string().min(1, 'Password is required'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
	const router = useRouter()

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const signInGithub = async () => {
		await authClient.signIn.social(
			{
				provider: 'github',
			},
			{
				onSuccess: () => {
					router.push('/')
				},
				onError: () => {
					toast.error('Failed to sign in with GitHub')
				},
			},
		)
	}

	const signInGoogle = async () => {
		await authClient.signIn.social(
			{
				provider: 'google',
			},
			{
				onSuccess: () => {
					router.push('/')
				},
				onError: () => {
					toast.error('Failed to sign in with Google')
				},
			},
		)
	}

	const onSubmit = async (data: RegisterFormValues) => {
		await authClient.signUp.email(
			{
				name: data.email,
				email: data.email,
				password: data.password,
				callbackURL: '/',
			},
			{
				onSuccess: () => {
					router.push('/')
				},
				onError: ctx => {
					toast.error(`Failed to register: ${ctx.error.message}`)
				},
			},
		)
	}

	const isPending = form.formState.isSubmitting
	return (
		<div className='flex flex-col gap-6'>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle>Создай свой аккаунт</CardTitle>
					<CardDescription>Создайте свой аккаунт, чтобы начать</CardDescription>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<div className='grid gap-6'>
									<div className='flex flex-col gap-4'>
										<Button
											variant='outline'
											className={cn('w-full', isPending && 'opacity-50')}
											disabled={isPending}
											type='button'
											onClick={signInGithub}
										>
											<Image
												src='/logos/github.svg'
												alt={'GitHub logo'}
												width={20}
												height={20}
											/>
											Продолжить с GitHub
										</Button>
										<div className='flex flex-col gap-4'>
											<Button
												variant='outline'
												className={cn('w-full', isPending && 'opacity-50')}
												disabled={isPending}
												type='button'
												onClick={signInGoogle}
											>
												<Image
													src='/logos/google.svg'
													alt={'Google logo'}
													width={20}
													height={20}
												/>
												Продолжить с Google
											</Button>
											<div className='grid gap-6'>
												<FormField
													control={form.control}
													name='email'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Email</FormLabel>
															<FormControl>
																<Input
																	type='email'
																	placeholder='you@example.com'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name='password'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Password</FormLabel>
															<FormControl>
																<Input
																	type='password'
																	placeholder='********'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name='confirmPassword'
													render={({ field }) => (
														<FormItem>
															<FormLabel>Confirm Password</FormLabel>
															<FormControl>
																<Input
																	type='password'
																	placeholder='********'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Button
													className={cn('w-full', isPending && 'opacity-50')}
													disabled={isPending}
													type='submit'
												>
													{isPending ? 'Signing up...' : 'Sign Up'}
												</Button>
											</div>
											<div className='text-sm text-center'>
												Уже есть аккаунт?{' '}
												<Link
													href='/login'
													className='underline underline-offset-4'
												>
													Войти
												</Link>
											</div>
										</div>
									</div>
								</div>
							</form>
						</Form>
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	)
}
