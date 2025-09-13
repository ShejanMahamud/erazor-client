'use client';
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems
} from '@/components/ui/resizable-navbar';
import { UserButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';

export function MainNavbar() {
  const navItems = [
    {
      name: 'How to use',
      link: '/how-to-use'
    },
    {
      name: 'Tools & API',
      link: '/tools-api'
    },
    {
      name: 'Pricing',
      link: '/pricing'
    },
    {
      name: 'Contact',
      link: '/contact'
    }
  ];

  const DotIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 512 512'
        fill='currentColor'
      >
        <path d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z' />
      </svg>
    );
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useUser();

  return (
    <div className='absolute z-50 w-full'>
      <Navbar className='my-4'>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className='flex items-center gap-4'>
            {user.isSignedIn ? (
              <UserButton.MenuItems>
                <UserButton.Link
                  label='Dashboard'
                  labelIcon={<DotIcon />}
                  href='/dashboard/overview'
                />
              </UserButton.MenuItems>
            ) : (
              <div className='flex items-center gap-4'>
                <NavbarButton variant='secondary' href='/auth/sign-in'>
                  Log In
                </NavbarButton>
                <NavbarButton variant='primary' href='/auth/sign-up'>
                  Sign Up
                </NavbarButton>
              </div>
            )}
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

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className='relative text-neutral-600 dark:text-neutral-300'
              >
                <span className='block'>{item.name}</span>
              </a>
            ))}
            <div className='flex w-full flex-col gap-4'>
              {user.isSignedIn ? (
                <UserButton.MenuItems>
                  <UserButton.Link
                    label='Dashboard'
                    labelIcon={<DotIcon />}
                    href='/dashboard/overview'
                  />
                </UserButton.MenuItems>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant='secondary'
                    className='w-full'
                    href='/auth/sign-in'
                  >
                    Log In
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant='primary'
                    className='w-full'
                    href='/auth/sign-up'
                  >
                    Sign Up
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
