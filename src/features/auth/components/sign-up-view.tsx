import FallingText from '@/components/FallingText';
import { cn } from '@/lib/utils';
import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignUpViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div
          className={cn(
            'absolute inset-0',
            '[background-size:40px_40px]',
            '[background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]'
          )}
        />
        {/* Radial gradient overlay */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>

        <div className='relative z-20 mb-40 flex items-center text-lg font-medium'>
          <Image src='/assets/logo.png' alt='Logo' width={40} height={40} />
          <span className='ml-2'>Erazor AI</span>
        </div>
        <FallingText
          text={`Erazor AI is an AI-powered background removal tool that simplifies image editing and enhances productivity.`}
          highlightWords={[
            'Erazor',
            'AI',
            'background',
            'removal',
            'tool',
            'image',
            'editing',
            'enhances',
            'productivity'
          ]}
          trigger='hover'
          backgroundColor='transparent'
          wireframes={false}
          gravity={0.56}
          fontSize='2rem'
          mouseConstraintStiffness={0.9}
        />
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;This AI-powered background removal tool has revolutionized
              my workflow and helped me deliver stunning images to my clients
              faster than ever before.&rdquo;
            </p>
            <footer className='text-sm'>Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <ClerkSignUpForm />
        </div>
      </div>
    </div>
  );
}
