import { searchParamsCache } from '@/lib/searchparams';
import { ApiResponse } from '@/types/image';
import { auth } from '@clerk/nextjs/server';
import { toast } from 'sonner';
import { ImageTable } from './image-tables';
import { columns } from './image-tables/columns';

export default async function ImageListingPage() {
  const { userId, getToken } = await auth();
  const token = await getToken();
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
    { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) return toast.error('Failed to fetch images');

  const data: ApiResponse = await res.json();

  return (
    <ImageTable
      data={data.data}
      totalItems={data.meta.count}
      columns={columns}
    />
  );
}
