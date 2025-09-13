export const dynamic = 'force-dynamic';

export default function AdminOnlyPage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <p className='text-muted-foreground'>
        This page is for admin users only.
      </p>
    </div>
  );
}
