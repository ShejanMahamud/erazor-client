import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import ImageViewPage from '@/features/images/components/image-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Image Details'
};

type PageProps = { params: Promise<{ imageId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ImageViewPage imageId={params.imageId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
