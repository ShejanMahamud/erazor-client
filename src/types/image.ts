export type Image = {
    id: string;
    userId: string;
    clerkId: string;
    processId: string;
    originalFileName: string;
    originalImageUrlLQ: string;
    originalImageUrlHQ: string;
    bgRemovedFileName: string | null;
    bgRemovedImageUrlLQ: string | null;
    bgRemovedImageUrlHQ: string | null;
    status: 'queue' | 'processing' | 'ready';
    createdAt: string;
    updatedAt: string;
};

export type ApiResponse = {
    success: boolean;
    message: string;
    data: Image[];
    meta: {
        limit: number;
        count: number;
        hasNextPage: boolean;
        nextCursor: string | null;
    };
};

export type SingleImageApiResponse = {
    success: boolean;
    message: string;
    data: Image;
};
