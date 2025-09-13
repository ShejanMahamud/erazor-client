import { Pricing } from '@/components/Pricing';
import { PricingFAQ } from '@/components/PricingFAQ';
import { Spotlight } from '@/components/ui/spotlight';

export default function PricingPage() {
  return (
    <>
      <div className='relative flex h-full w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center'>
        <Spotlight
          className='-top-40 left-0 md:-top-20 md:left-60'
          fill='white'
        />
        <Pricing />
      </div>
      <PricingFAQ />
    </>
  );
}
