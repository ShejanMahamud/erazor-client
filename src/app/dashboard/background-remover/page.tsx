'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useImageSocket } from '@/hooks/useImageSocket';
import { useAuth } from '@clerk/nextjs';
import { gsap } from 'gsap';
import { Download, Loader2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { Suspense, useEffect, useRef, useState } from 'react';

export default function BackgroundRemoverPage() {
  const { userId, getToken } = useAuth();
  const token = getToken();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');

  // GSAP refs
  const containerRef = useRef<HTMLDivElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const beforeImageRef = useRef<HTMLImageElement>(null);
  const afterImageRef = useRef<HTMLImageElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const { imageUpdates, clearImageUpdates } = useImageSocket(userId!);

  useEffect(() => {
    // Only process image updates if we're currently processing or have files
    if (!isProcessing && !files.length) return;

    const readyImages = imageUpdates.filter(
      (img: any) => img.status === 'ready'
    );

    if (readyImages.length > 0 && isProcessing) {
      // Get the most recent image that matches our current upload
      const latestImage = readyImages[readyImages.length - 1];
      setCurrentImage(latestImage);
      setIsProcessing(false);
    }
  }, [imageUpdates, isProcessing, files.length]);

  // GSAP Animation Effects
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (isUploading || isProcessing) {
      if (uploadAreaRef.current) {
        gsap.to(uploadAreaRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (processingRef.current) {
        gsap.fromTo(
          processingRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );

        // Animated loading bar
        const progressBar =
          processingRef.current.querySelector('.progress-bar');
        if (progressBar) {
          gsap.fromTo(
            progressBar,
            { width: '0%' },
            {
              width: isUploading ? '30%' : '70%',
              duration: 1.5,
              ease: 'power2.inOut',
              repeat: -1,
              yoyo: true
            }
          );
        }
      }
    }
  }, [isUploading, isProcessing]);

  useEffect(() => {
    if (currentImage && !isProcessing && !isUploading) {
      // Hide processing view
      if (processingRef.current) {
        gsap.to(processingRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      // Show results with animation
      if (resultsRef.current) {
        gsap.fromTo(
          resultsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
        );
      }

      // Animate buttons
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.5
          }
        );
      }

      // Animate images with reveal effect
      if (beforeImageRef.current) {
        gsap.fromTo(
          beforeImageRef.current,
          { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
          {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.6
          }
        );
      }

      if (afterImageRef.current) {
        gsap.fromTo(
          afterImageRef.current,
          {
            opacity: 0,
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
          },
          {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.8
          }
        );
      }
    }
  }, [currentImage, isProcessing, isUploading]);

  const handleFileUpload = async (file: File[]) => {
    // Clear any previous state first
    setCurrentImage(null);
    clearImageUpdates(); // Clear socket updates

    setFiles([file[0]]);
    setIsUploading(true);

    // Clear previous image URL to prevent memory leaks
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }

    const imageUrl = URL.createObjectURL(file[0]);
    setOriginalImageUrl(imageUrl);

    const formData = new FormData();
    formData.append('file', file[0]);
    formData.append('userId', userId!);
    try {
      setIsProcessing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/images/process`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${await token}`
          }
        }
      );
      if (!res.ok) {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      setIsProcessing(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    // Animate out current content before reset
    if (resultsRef.current) {
      gsap.to(resultsRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          // Clear all state completely
          setFiles([]);
          setCurrentImage(null);
          setOriginalImageUrl('');
          setIsUploading(false);
          setIsProcessing(false);
          clearImageUpdates(); // Clear socket image updates

          // Clear any URLs to prevent memory leaks
          if (originalImageUrl) {
            URL.revokeObjectURL(originalImageUrl);
          }

          // Animate in upload area
          if (uploadAreaRef.current) {
            gsap.fromTo(
              uploadAreaRef.current,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );
          }
        }
      });
    } else {
      // If no results are showing, just clear state immediately
      setFiles([]);
      setCurrentImage(null);
      setOriginalImageUrl('');
      setIsUploading(false);
      setIsProcessing(false);
      clearImageUpdates(); // Clear socket image updates

      // Clear any URLs to prevent memory leaks
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
    }
  };

  const handleDownload = () => {
    if (currentImage?.bgRemovedImageUrlHQ) {
      // Add download animation
      if (buttonsRef.current) {
        const downloadBtn = buttonsRef.current.querySelector('button');
        if (downloadBtn) {
          gsap.to(downloadBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
          });
        }
      }

      const link = document.createElement('a');
      link.href = currentImage.bgRemovedImageUrlHQ;
      link.download = `${currentImage.originalFileName}_no_bg.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Remove Background'
            description='Easily remove backgrounds from images.'
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <div
            ref={containerRef}
            className='mx-auto min-h-96 w-full max-w-4xl rounded-lg border border-dashed border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black'
          >
            {!files.length &&
              !isUploading &&
              !isProcessing &&
              !currentImage && (
                <div
                  ref={uploadAreaRef}
                  className='flex min-h-80 flex-col items-center justify-center'
                >
                  <FileUpload onChange={handleFileUpload} preview={true} />
                  <p className='text-muted-foreground mt-4 text-sm'>
                    Upload an image to remove its background
                  </p>
                </div>
              )}

            {(isUploading || isProcessing) && (
              <div
                ref={processingRef}
                className='flex min-h-80 flex-col items-center justify-center space-y-6'
              >
                <div className='relative'>
                  <Loader2 className='text-primary h-16 w-16 animate-spin' />
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-lg font-semibold'>
                    {isUploading
                      ? 'Uploading image...'
                      : 'Removing background...'}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {isUploading
                      ? 'Please wait while we upload your image'
                      : 'AI is processing your image, this may take a few moments'}
                  </p>
                </div>
                <div className='bg-secondary h-2 w-full max-w-xs rounded-full'>
                  <div
                    className='progress-bar bg-primary h-2 animate-pulse rounded-full'
                    style={{ width: isUploading ? '30%' : '70%' }}
                  ></div>
                </div>
              </div>
            )}

            {currentImage && originalImageUrl && (
              <div ref={resultsRef} className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>
                    Background Removed Successfully!
                  </h3>
                  <div ref={buttonsRef} className='flex gap-2'>
                    <Button
                      onClick={handleDownload}
                      className='flex items-center gap-2'
                    >
                      <Download className='h-4 w-4' />
                      Download
                    </Button>
                    <Button
                      variant='outline'
                      onClick={handleReset}
                      className='flex items-center gap-2 bg-transparent'
                    >
                      <RotateCcw className='h-4 w-4' />
                      New Image
                    </Button>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {/* Before */}
                  <div className='space-y-3'>
                    <h4 className='text-center text-sm font-medium'>Before</h4>
                    <div className='relative flex min-h-80 items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800'>
                      <Image
                        ref={beforeImageRef}
                        src={originalImageUrl || '/placeholder.svg'}
                        alt='Original'
                        width={500}
                        height={400}
                        className='max-h-72 max-w-full rounded-lg object-contain shadow-sm'
                        priority
                      />
                    </div>
                  </div>

                  {/* After */}
                  <div className='space-y-3'>
                    <h4 className='text-center text-sm font-medium'>After</h4>
                    <div
                      className='relative flex min-h-80 items-center justify-center rounded-lg bg-transparent p-4'
                      style={{
                        backgroundImage: `linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)`,
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}
                    >
                      <Image
                        ref={afterImageRef}
                        src={
                          currentImage.bgRemovedImageUrlHQ || '/placeholder.svg'
                        }
                        alt='Background Removed'
                        width={500}
                        height={400}
                        className='max-h-72 max-w-full rounded-lg object-contain shadow-sm'
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className='text-muted-foreground text-center text-sm'>
                  Original filename: {currentImage.originalFileName}
                </div>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </PageContainer>
  );
}
