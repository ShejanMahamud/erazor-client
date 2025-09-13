'use client';

import { Button } from '@/components/ui/button';
import { avatars } from '@/constants/data';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CurvedLoop from './CurvedLoop';
import { AvatarCircles } from './magicui/avatar-circles';
import { AnimatedGradientText } from './ui/animated-gradient-text';
import { AnimatedShinyText } from './ui/animated-shiny-text';
import CircularText from './ui/circular-text';
import { PointerHighlight } from './ui/pointer-highlight';

export const Hero = () => {
  const { isSignedIn } = useAuth();
  const [imageState, setImageState] = useState<'before' | 'after'>('before');

  return (
    <section className='bg-background font-manrope relative min-h-screen overflow-hidden pt-40'>
      {/* Background Effects */}
      <HeroBackground />

      <div className='container mx-auto px-6 pb-16 lg:pl-32'>
        <div className='grid min-h-[80vh] grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          {/* Left Column - Content */}
          <div className='space-y-4'>
            {/* Simple Badge */}
            <div className='flex items-start gap-2'>
              <div className='group relative flex items-start justify-start rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]'>
                <span
                  className={cn(
                    'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]'
                  )}
                  style={{
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'destination-out',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract',
                    WebkitClipPath: 'padding-box'
                  }}
                />
                🎉{' '}
                <AnimatedGradientText className='text-sm font-medium'>
                  {' '}
                  Introducing Erazor AI
                </AnimatedGradientText>
                <ChevronRight className='ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
              </div>
            </div>

            {/* Clean Main Heading */}
            <div className='space-y-4'>
              <h1 className='text-5xl leading-[1.1] font-bold tracking-tight lg:text-7xl'>
                Remove
                <br />
                <PointerHighlight>
                  <span className='bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent'>
                    Backgrounds
                  </span>
                </PointerHighlight>
                {/* <br /> */}
                Instantly
              </h1>

              <p className='text-foreground/70 max-w-lg text-xl leading-relaxed'>
                Professional AI background removal in seconds. Perfect for
                e-commerce, portraits, and creative projects.
              </p>
            </div>

            {/* Simple Features */}
            <div className='text-foreground/60 flex flex-wrap gap-6 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='h-1.5 w-1.5 rounded-full bg-green-500' />
                <AnimatedShinyText>3-second processing</AnimatedShinyText>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-1.5 w-1.5 rounded-full bg-blue-500' />
                <AnimatedShinyText>99.9% accuracy</AnimatedShinyText>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-1.5 w-1.5 rounded-full bg-purple-500' />
                <AnimatedShinyText>4K quality output</AnimatedShinyText>
              </div>
            </div>

            {/* Clean CTAs */}
            <div className='flex flex-col gap-4 pt-4 sm:flex-row'>
              <Button
                asChild
                size='lg'
                className={cn(
                  'h-12 rounded-full px-8 text-base',
                  'bg-gradient-to-r from-orange-500 to-purple-600',
                  'hover:shadow-lg hover:shadow-purple-500/25',
                  'text-white transition-all duration-300 hover:scale-105'
                )}
              >
                <Link
                  href={
                    isSignedIn
                      ? '/dashboard/background-remover'
                      : '/auth/sign-up'
                  }
                >
                  {isSignedIn ? 'Start Now' : 'Try Free'}
                </Link>
              </Button>
            </div>

            <div className='flex flex-col items-start gap-2 lg:flex-row lg:items-center'>
              <AvatarCircles numPeople={99} avatarUrls={avatars} />
              <span className='text-foreground/50 text-sm'>
                Trusted by 10,000+ users worldwide
              </span>
            </div>
          </div>

          {/* Right Column - Interactive Demo */}
          <div className='relative'>
            {/* Minimal Demo Container */}
            <div className='group relative'>
              {/* Main Image Container */}
              <div
                className={`relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl shadow-2xl`}
              >
                <Image
                  src={
                    imageState === 'before'
                      ? '/assets/before.jpg'
                      : '/assets/after.png'
                  }
                  alt={
                    imageState === 'before'
                      ? 'Original image'
                      : 'Background removed'
                  }
                  fill
                  className='object-cover transition-all duration-700 ease-out'
                />

                {/* Subtle overlay for after state */}
                {imageState === 'after' && (
                  <div className='absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5' />
                )}

                {/* Floating Toggle */}
                <div className='absolute top-4 left-1/2 -translate-x-1/2'>
                  <div
                    className={cn(
                      'flex items-center gap-1 rounded-full p-1',
                      'bg-white/80 backdrop-blur-md dark:bg-black/80',
                      'border border-white/20 shadow-lg'
                    )}
                  >
                    <button
                      onClick={() => setImageState('before')}
                      className={cn(
                        'rounded-full px-4 py-2 text-xs font-medium transition-all duration-300',
                        imageState === 'before'
                          ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                          : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                      )}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => setImageState('after')}
                      className={cn(
                        'rounded-full px-4 py-2 text-xs font-medium transition-all duration-300',
                        imageState === 'after'
                          ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                          : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                      )}
                    >
                      After
                    </button>
                  </div>
                </div>
              </div>

              {/* Minimal Action Button */}
              <div className='absolute -bottom-6 left-1/2 -translate-x-1/2'>
                <CircularText
                  text={`${imageState === 'before' ? 'ORIGINAL*IMAGE*' : 'BACKGROUND*REMOVED*'}`}
                  onHover='speedUp'
                  spinDuration={20}
                  className='text-2xl lg:text-xs'
                />
              </div>
            </div>

            {/* Ambient Background Effects */}
            <div className='absolute inset-0 -z-10'>
              <div className='absolute top-1/4 -left-12 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl' />
              <div className='absolute -right-12 bottom-1/4 h-40 w-40 rounded-full bg-purple-600/10 blur-2xl' />
            </div>
          </div>
        </div>
        <CurvedLoop
          marqueeText='Remove ✦ Backgrounds ✦ Instantly ✦'
          speed={3}
          curveAmount={50}
          direction='right'
          interactive={true}
        />
      </div>
    </section>
  );
};

// Background Components
const HeroBackground = () => (
  <div className='absolute inset-0'>
    <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.05),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]' />
    <div className='absolute top-0 left-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl' />
    <div className='absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl' />
  </div>
);
