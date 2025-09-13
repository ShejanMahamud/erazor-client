'use client';
import dynamic from 'next/dynamic';

const KBar = dynamic(() => import('./index'), {
  ssr: false,
  loading: () => null
});

export default function ClientKBar({
  children
}: {
  children: React.ReactNode;
}) {
  return <KBar>{children}</KBar>;
}
