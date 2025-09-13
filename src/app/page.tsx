import CTA from '@/components/CTA';
import { Hero } from '@/components/Hero';
import { Pricing } from '@/components/Pricing';
import WhyWe from '@/components/WhyWe';
import MainLayout from '@/components/layout/main-layout';

export default async function Home() {
  return (
    <MainLayout>
      <div className='min-h-screen'>
        <Hero />
        <Pricing />
        <WhyWe />
        <CTA />
      </div>
    </MainLayout>
  );
}
