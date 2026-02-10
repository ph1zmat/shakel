'use client'
import { useState } from 'react'
import {
	MobileNav,
	MobileNavHeader,
	MobileNavMenu,
	MobileNavToggle,
	NavBody,
	Navbar,
	NavbarLogo,
	NavItems,
} from '@/components/ui/acernity/resizable-navbar'
import { Button } from '@/components/ui/button'

export function Header({ children }: { children: React.ReactNode }) {
	const navItems = [
		{
			name: 'Возможности',
			link: '/features',
		},
		{
			name: 'Цены',
			link: '/pricing',
		},
		{
			name: 'Документация',
			link: '/docs',
		},
		{
			name: 'Контакты',
			link: '/contact',
		},
	]

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	return (
		<div className='relative w-full'>
			<Navbar>
				{/* Desktop Navigation */}
				<NavBody>
					<div className='flex items-center justify-center'>
						<NavbarLogo />
					</div>
					<div className='flex'>
						<NavItems items={navItems} />
					</div>
					<div className='flex flex-1 items-center justify-end gap-3'>
						<Button variant='ghost' size='sm' asChild>
							<a href='/login'>Вход</a>
						</Button>
						<Button variant='gradient' size='sm' asChild>
							<a href='/demo'>Демо</a>
						</Button>
					</div>
				</NavBody>

				{/* Mobile Navigation */}
				<MobileNav>
					<MobileNavHeader>
						<NavbarLogo />
						<MobileNavToggle
							isOpen={isMobileMenuOpen}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						/>
					</MobileNavHeader>

					<MobileNavMenu isOpen={isMobileMenuOpen}>
						{navItems.map(item => (
							<a
								key={item.link}
								href={item.link}
								onClick={() => setIsMobileMenuOpen(false)}
								className='relative text-muted-foreground hover:text-foreground transition-colors'
							>
								<span className='block'>{item.name}</span>
							</a>
						))}
						<div className='flex w-full flex-col gap-3 mt-4'>
							<Button
								variant='outline'
								className='w-full'
								onClick={() => setIsMobileMenuOpen(false)}
								asChild
							>
								<a href='/login'>Вход</a>
							</Button>
							<Button
								variant='gradient'
								className='w-full'
								onClick={() => setIsMobileMenuOpen(false)}
								asChild
							>
								<a href='/demo'>Демо</a>
							</Button>
						</div>
					</MobileNavMenu>
				</MobileNav>
			</Navbar>
			{children}
		</div>
	)
}
