'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar,
  NavbarLogo,
  NavItems,
} from '@/components/ui/acernity/resizable-navbar';
import { Button } from '@/components/ui/button';

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
];

export function Header({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <header>
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <div className="flex items-center justify-center">
              <NavbarLogo />
            </div>
            <nav className="flex" aria-label="Main Navigation">
              <NavItems items={navItems} />
            </nav>
            <div className="flex flex-1 items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="active:scale-[0.98] transition-transform duration-150"
              >
                <Link href="/login">Вход</Link>
              </Button>
              <Button
                variant="gradient"
                size="sm"
                asChild
                className="active:scale-[0.98] transition-transform duration-150"
              >
                <Link href="/features">Демо</Link>
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
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              />
            </MobileNavHeader>

            <MobileNavMenu isOpen={isMobileMenuOpen} id="mobile-menu">
              <nav aria-label="Mobile Navigation">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.link}>
                      <Link
                        href={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block relative text-muted-foreground hover:text-foreground transition-colors py-2 focus:outline-none focus:text-primary"
                      >
                        <span className="block">{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex w-full flex-col gap-3 mt-6 pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  className="w-full active:scale-[0.98] transition-transform duration-150"
                  onClick={() => setIsMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="/login">Вход</Link>
                </Button>
                <Button
                  variant="gradient"
                  className="w-full active:scale-[0.98] transition-transform duration-150"
                  onClick={() => setIsMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="/features">Демо</Link>
                </Button>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </header>
      {children}
    </div>
  );
}
