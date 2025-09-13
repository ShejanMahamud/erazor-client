import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SingleUserApiResponse } from '@/types/user';
import { auth } from '@clerk/nextjs/server';
import { CheckCircle2, Mail, User as UserIcon, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Dashboard: User Details'
};

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    throw new Error('Unauthorized');
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${params.userId}`,
    {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${currentUserId}`
      }
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch user details');
  }

  const data: SingleUserApiResponse = await res.json();
  const user = data.data;

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <Heading
            title='User Details'
            description={`View details for ${user.firstName} ${user.lastName}`}
          />
          <Button asChild variant="outline">
            <Link href="/dashboard/user-management">
              Back to Users
            </Link>
          </Button>
        </div>
        <Separator />

        <div className='grid gap-4 md:grid-cols-2'>
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-3'>
                <div className='relative h-12 w-12'>
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className='rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-12 w-12 bg-muted rounded-full flex items-center justify-center'>
                      <UserIcon className='h-6 w-6 text-muted-foreground' />
                    </div>
                  )}
                </div>
                <div>
                  <div className='font-semibold'>{user.firstName} {user.lastName}</div>
                  <div className='text-sm text-muted-foreground'>@{user.username}</div>
                </div>
              </CardTitle>
              <CardDescription>
                User profile information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span>{user.email}</span>
              </div>

              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Verification Status:</span>
                <Badge variant={
                  user.verified === 'verified' ? 'default' :
                    user.verified === 'transferable' ? 'secondary' :
                      user.verified === 'expired' || user.verified === 'failed' ? 'destructive' :
                        'outline'
                }>
                  {user.verified === 'verified' || user.verified === 'transferable' ? (
                    <CheckCircle2 className='mr-1 h-3 w-3' />
                  ) : (
                    <XCircle className='mr-1 h-3 w-3' />
                  )}
                  {user.verified}
                </Badge>
              </div>


            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Technical details and account metadata
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <span className='text-sm font-medium'>User ID:</span>
                <code className='ml-2 text-xs bg-muted px-1 py-0.5 rounded'>
                  {user.id}
                </code>
              </div>

              <div>
                <span className='text-sm font-medium'>Clerk ID:</span>
                <code className='ml-2 text-xs bg-muted px-1 py-0.5 rounded'>
                  {user.clerkId}
                </code>
              </div>

              <div>
                <span className='text-sm font-medium'>Account Created:</span>
                <div className='ml-2 text-sm text-muted-foreground'>
                  {new Date(user.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <span className='text-sm font-medium'>Last Updated:</span>
                <div className='ml-2 text-sm text-muted-foreground'>
                  {new Date(user.updatedAt).toLocaleString()}
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Account Status:</span>
                <Badge variant={user.isDeleted ? 'destructive' : 'default'}>
                  {user.isDeleted ? 'Deleted' : 'Active'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
