import { Footer } from '@/components/Footer';
import { MainNavbar } from '@/components/MainNavbar';

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNavbar />
      {children}
      <Footer />
    </>
  );
}
