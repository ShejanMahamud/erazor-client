import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Phone,
  Twitter
} from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className='bg-background relative py-16'>
      {/* Main Footer Container */}
      <div className='container mx-auto px-6'>
        {/* Newsletter Section - Similar to PricingCard highlighted style */}
        <div
          className={cn(
            'relative mb-12 flex flex-col gap-8 overflow-hidden rounded-2xl border p-8 shadow',
            'bg-foreground text-background'
          )}
        >
          {/* Background Decoration - Same as PricingCard */}
          <HighlightedBackground />

          <div className='relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row'>
            <div className='flex-1 text-center md:text-left'>
              <div className='mb-4 flex items-center justify-center gap-3 md:justify-start'>
                <h3 className='text-2xl font-medium'>Stay Updated</h3>
                <Badge className='bg-orange-900 px-2 py-1 text-white hover:bg-orange-900'>
                  🚀 Latest News
                </Badge>
              </div>
              <p className='text-background/80 max-w-md'>
                Get the latest updates, features, and tips delivered straight to
                your inbox.
              </p>
            </div>

            <div className='flex w-full flex-col gap-3 sm:flex-row md:w-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='bg-background text-foreground flex-1 rounded-lg border px-4 py-2 md:min-w-[300px]'
              />
              <Button
                variant='expandIcon'
                Icon={ArrowRight}
                iconPlacement='right'
                className='bg-accent text-foreground hover:bg-accent/95 rounded-lg'
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-foreground flex h-8 w-8 items-center justify-center rounded-lg'>
                <span className='text-background font-bold'>E</span>
              </div>
              <h3 className='text-xl font-semibold'>Erazor</h3>
            </div>
            <p className='text-foreground/60 text-sm leading-relaxed'>
              Advanced background removal and image editing tools powered by AI.
              Transform your images with professional quality.
            </p>
            <div className='flex gap-3'>
              <SocialButton href='#' icon={Twitter} />
              <SocialButton href='#' icon={Github} />
              <SocialButton href='#' icon={Linkedin} />
              <SocialButton href='#' icon={Mail} />
            </div>
          </div>

          {/* Product Links */}
          <div className='space-y-4'>
            <h4 className='text-foreground font-medium'>Product</h4>
            <ul className='space-y-2'>
              <FooterLink href='/dashboard'>Dashboard</FooterLink>
              <FooterLink href='/dashboard/background-remover'>
                Background Remover
              </FooterLink>
              <FooterLink href='/dashboard/image-history'>
                Image History
              </FooterLink>
              <FooterLink href='/pricing'>Pricing</FooterLink>
            </ul>
          </div>

          {/* Company Links */}
          <div className='space-y-4'>
            <h4 className='text-foreground font-medium'>Company</h4>
            <ul className='space-y-2'>
              <FooterLink href='/about'>About Us</FooterLink>
              <FooterLink href='/contact'>Contact</FooterLink>
              <FooterLink href='/blog'>Blog</FooterLink>
              <FooterLink href='/careers'>Careers</FooterLink>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className='space-y-4'>
            <h4 className='text-foreground font-medium'>Support</h4>
            <ul className='space-y-2'>
              <FooterLink href='/help'>Help Center</FooterLink>
              <FooterLink href='/privacy'>Privacy Policy</FooterLink>
              <FooterLink href='/terms'>Terms of Service</FooterLink>
            </ul>

            <div className='space-y-2 pt-2'>
              <div className='text-foreground/60 flex items-center gap-2 text-sm'>
                <Mail size={14} />
                <span>support@erazor.com</span>
              </div>
              <div className='text-foreground/60 flex items-center gap-2 text-sm'>
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={cn(
            'relative flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 md:flex-row',
            'bg-background/50 backdrop-blur-sm'
          )}
        >
          <PopularBackground />
          <div className='text-foreground/60 relative z-10 text-sm'>
            © 2025 Erazor. All rights reserved.
          </div>
          <div className='relative z-10 flex items-center gap-4 text-sm'>
            <Link
              href='/privacy'
              className='text-foreground/60 hover:text-foreground transition-colors'
            >
              Privacy
            </Link>
            <Link
              href='/terms'
              className='text-foreground/60 hover:text-foreground transition-colors'
            >
              Terms
            </Link>
            <Link
              href='/cookies'
              className='text-foreground/60 hover:text-foreground transition-colors'
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social Button Component
const SocialButton = ({
  href,
  icon: Icon
}: {
  href: string;
  icon: React.ComponentType<any>;
}) => (
  <Link
    href={href}
    className={cn(
      'bg-background/10 h-10 w-10 rounded-lg border backdrop-blur-sm',
      'text-foreground/60 flex items-center justify-center',
      'hover:text-foreground hover:bg-background/20 transition-all duration-200',
      'hover:scale-105'
    )}
  >
    <Icon size={18} />
  </Link>
);

// Footer Link Component
const FooterLink = ({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className='text-foreground/60 hover:text-foreground text-sm transition-colors duration-200'
    >
      {children}
    </Link>
  </li>
);

// Background Components - Same as PricingCard
const HighlightedBackground = () => (
  <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-100 dark:opacity-30' />
);

const PopularBackground = () => (
  <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' />
);
