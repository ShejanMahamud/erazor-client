import { ImageTable } from '@/features/images/components/image-tables';
import { columns } from '@/features/images/components/image-tables/columns';
import { searchParamsCache } from '@/lib/searchparams';
import { ApiResponse } from '@/types/image';
import { auth } from '@clerk/nextjs/server';

export default async function ImageListingPage() {
  const { userId } = await auth();
  const limit = searchParamsCache.get('perPage') ?? 10;
  const cursor = searchParamsCache.get('cursor');
  const search = searchParamsCache.get('search');
  const originalFileName = searchParamsCache.get('originalFileName');
  const status = searchParamsCache.get('status');

  // Use originalFileName if search is not provided, or combine both
  const searchQuery = search || originalFileName;

  const filters = new URLSearchParams({
    limit: String(limit),
    ...(cursor && { cursor: String(cursor) }),
    ...(searchQuery && { search: String(searchQuery) }),
    ...(status && { status: String(status) })
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/images/user/${userId}?${filters}`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Failed to fetch images');

  const data: ApiResponse = await res.json();

  return (
    <ImageTable
      data={data.data}
      totalItems={data.meta.count}
      columns={columns}
    />
  );
}
