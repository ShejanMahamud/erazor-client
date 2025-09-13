'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, SingleImageApiResponse } from '@/types/image';
import { useAuth } from '@clerk/nextjs';
import { IconAlertCircle, IconArrowLeft, IconCheck, IconClock, IconDownload } from '@tabler/icons-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ImageViewPageProps {
    imageId: string;
}

export default function ImageViewPage({ imageId }: ImageViewPageProps) {
    const { userId } = useAuth();
    const router = useRouter();
    const [image, setImage] = useState<Image | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }

                const data: SingleImageApiResponse = await response.json();
                setImage(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [imageId]);

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusIcon = (status: Image['status']) => {
        switch (status) {
            case 'ready':
                return <IconCheck className="h-4 w-4" />;
            case 'processing':
                return <IconClock className="h-4 w-4" />;
            case 'queue':
                return <IconAlertCircle className="h-4 w-4" />;
            default:
                return <IconClock className="h-4 w-4" />;
        }
    };

    const getStatusVariant = (status: Image['status']) => {
        switch (status) {
            case 'ready':
                return 'default' as const;
            case 'processing':
                return 'secondary' as const;
            case 'queue':
                return 'outline' as const;
            default:
                return 'outline' as const;
        }
    };

    if (loading) {
        return (
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href="/dashboard/image-history">
                            <Button variant="ghost" size="sm">
                                <IconArrowLeft className="mr-2 h-4 w-4" />
                                Back to Images
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="grid gap-6">
                    <Card>
                        <CardContent className="flex items-center justify-center h-64">
                            <div className="text-muted-foreground">Loading image details...</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !image) {
        return (
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Link href="/dashboard/image-history">
                            <Button variant="ghost" size="sm">
                                <IconArrowLeft className="mr-2 h-4 w-4" />
                                Back to Images
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card>
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center space-y-2">
                            <div className="text-destructive">Error: {error || 'Image not found'}</div>
                            <Button onClick={() => router.back()}>Go Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/image-history">
                        <Button variant="ghost" size="sm">
                            <IconArrowLeft className="mr-2 h-4 w-4" />
                            Back to Images
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(image.status)} className="capitalize">
                        {getStatusIcon(image.status)}
                        <span className="ml-1">{image.status}</span>
                    </Badge>
                </div>
            </div>

            {/* Image Details */}
            <div className="grid gap-6">
                {/* Images Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle>Image Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Original Image */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-muted-foreground">Original Image</div>
                                <div className="relative aspect-square w-full max-w-md mx-auto">
                                    <NextImage
                                        src={image.originalImageUrlHQ}
                                        alt={image.originalFileName}
                                        fill
                                        className="rounded-lg object-contain border"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(image.originalImageUrlHQ, image.originalFileName)}
                                    >
                                        <IconDownload className="mr-2 h-4 w-4" />
                                        Download Original
                                    </Button>
                                </div>
                            </div>

                            {/* Processed Image */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-muted-foreground">Processed Image</div>
                                {image.bgRemovedImageUrlHQ ? (
                                    <>
                                        <div className="relative aspect-square w-full max-w-md mx-auto">
                                            <NextImage
                                                src={image.bgRemovedImageUrlHQ}
                                                alt={`Processed ${image.originalFileName}`}
                                                fill
                                                className="rounded-lg object-contain border"
                                            />
                                        </div>
                                        <div className="flex justify-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownload(image.bgRemovedImageUrlHQ!, image.bgRemovedFileName || `processed_${image.originalFileName}`)}
                                            >
                                                <IconDownload className="mr-2 h-4 w-4" />
                                                Download Processed
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="aspect-square w-full max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            <div>No processed image</div>
                                            <div className="text-sm">Processing may be in progress</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Image Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Image Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">File Name</div>
                                    <div className="font-mono text-sm bg-muted p-2 rounded">{image.originalFileName}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Process ID</div>
                                    <div className="font-mono text-sm bg-muted p-2 rounded">{image.processId}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                                    <Badge variant={getStatusVariant(image.status)} className="capitalize">
                                        {getStatusIcon(image.status)}
                                        <span className="ml-1">{image.status}</span>
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
                                    <div className="text-sm">{new Date(image.createdAt).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Updated</div>
                                    <div className="text-sm">{new Date(image.updatedAt).toLocaleString()}</div>
                                </div>
                                {image.bgRemovedFileName && (
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Processed File Name</div>
                                        <div className="font-mono text-sm bg-muted p-2 rounded">{image.bgRemovedFileName}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
