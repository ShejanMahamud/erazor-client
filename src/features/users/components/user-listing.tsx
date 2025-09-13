import { searchParamsCache } from '@/lib/searchparams';
import { UserApiResponse } from '@/types/user';
import { auth } from '@clerk/nextjs/server';
import { columns } from './user-tables/columns';
import { UserTable } from './user-tables/index';

export default async function UserListingPage() {
    const { userId, getToken } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    const limit = searchParamsCache.get('perPage') ?? 10;
    const cursor = searchParamsCache.get('cursor');
    const search = searchParamsCache.get('search'); // This comes from the 'search' column filter
    const verificationStatus = searchParamsCache.get('verificationStatus');
    const isBlocked = searchParamsCache.get('isBlocked');
    const isDeleted = searchParamsCache.get('isDeleted');

    // Debug logging
    console.log('Search parameters:', { search, verificationStatus, isBlocked, isDeleted });

    const filters = new URLSearchParams({
        limit: String(limit),
        ...(cursor && { cursor: String(cursor) }),
        ...(search && { search: String(search) }),
        ...(verificationStatus && { verificationStatus: String(verificationStatus) }),
        ...(isBlocked !== null && isBlocked !== undefined && { isBlocked: String(isBlocked === 'true') }),
        ...(isDeleted !== null && isDeleted !== undefined && { isDeleted: String(isDeleted === 'true') }),
    });

    console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/users?${filters}`);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?${filters}`,
        {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${await getToken()}`
            }
        }
    );
    console.log('API Response status:', res.status);
    if (!res.ok) throw new Error('Failed to fetch users');

    const data: UserApiResponse = await res.json();
    console.log('API Response data:', data);

    return (
        <UserTable
            data={data.data}
            totalItems={data.meta.count}
            columns={columns}
        />
    );
}
