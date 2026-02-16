import Image from 'next/image'
import Link from 'next/link'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='bg-muted flex min-h-svh items-center flex-col justify-center gap-6 p-6 md:p-10'>
			<div className='flex w-full max-w-sm flex-col gap-6'>
				<Link
					href={'/'}
					className='w-full flex items-center justify-center gap-2 font-medium'
				>
				<Image src='/logo-white-circle-color.png' alt='Logo' width={30} height={30} />
				Shakel
				</Link>
				{children}
			</div>
		</div>
	)
}
export default AuthLayout
