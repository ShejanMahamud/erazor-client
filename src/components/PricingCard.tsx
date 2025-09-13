import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TransformedPricingTier, UserSubscription } from '@/types/billing';
import { useAuth } from '@clerk/nextjs';
import NumberFlow from '@number-flow/react';
import { ArrowRight, BadgeCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const PricingCard = ({
  tier,
  paymentFrequency,
  userSubscription
}: {
  tier: TransformedPricingTier;
  paymentFrequency: string;
  userSubscription?: UserSubscription | null;
}) => {
  const price = tier.price[paymentFrequency as keyof typeof tier.price];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;
  const { userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is currently subscribed to this plan
  const isCurrentPlan =
    userSubscription &&
    (userSubscription.productId === tier.planIds.monthly ||
      userSubscription.productId === tier.planIds.yearly);

  // Define price mappings for comparison (in cents)
  const getPriceInCents = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'free':
        return 0;
      case 'basic':
        return 999; // $9.99
      case 'starter':
        return 1999; // $19.99
      case 'pro':
        return 2999; // $29.99
      default:
        return 0;
    }
  };

  // Check if this is a higher tier plan (for upgrade functionality)
  const currentTierPrice = getPriceInCents(tier.name);
  const isUpgrade =
    userSubscription &&
    !isCurrentPlan &&
    userSubscription.amount < currentTierPrice &&
    currentTierPrice > 0;

  // Check if this is a downgrade
  const isDowngrade =
    userSubscription &&
    !isCurrentPlan &&
    userSubscription.amount > currentTierPrice &&
    currentTierPrice >= 0;

  // Handle button click - redirect to customer portal for all actions except current plan
  const handleButtonClick = async () => {
    // Don't allow action if it's the current plan
    if (isCurrentPlan) {
      return;
    }

    if (!isSignedIn) {
      router.push('/auth/sign-in');
      return;
    }

    setIsLoading(true);

    try {
      // Redirect to customer portal for all plan changes
      window.location.href = '/api/portal';
    } catch (error) {
      console.error('Error redirecting to portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow',
        isHighlighted
          ? 'bg-foreground text-background'
          : 'bg-background text-foreground',
        isPopular && 'outline outline-[rgba(120,119,198)]'
      )}
    >
      {/* Background Decoration */}
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      {/* Card Header */}
      <h2 className='flex items-center gap-3 text-xl font-medium capitalize'>
        {tier.name}
        {isPopular && (
          <Badge className='mt-1 bg-orange-900 px-1 py-0 text-white hover:bg-orange-900'>
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      {/* Price Section */}
      <div className='relative min-h-12'>
        {typeof price === 'number' ? (
          <>
            {/* Show original price with strike-through if exists */}
            {tier.originalPrice &&
              tier.originalPrice[
                paymentFrequency as keyof typeof tier.originalPrice
              ] && (
                <div className='mb-1'>
                  <span className='text-lg font-medium line-through opacity-60'>
                    $
                    {
                      tier.originalPrice[
                        paymentFrequency as keyof typeof tier.originalPrice
                      ]
                    }
                  </span>
                </div>
              )}

            <div className='flex items-baseline gap-3'>
              <NumberFlow
                format={{
                  style: 'currency',
                  currency: 'USD',
                  trailingZeroDisplay: 'stripIfInteger'
                }}
                value={price}
                className='text-4xl font-medium'
              />

              {/* Show savings percentage for yearly plans */}
              {paymentFrequency === 'yearly' &&
                tier.originalPrice?.yearly &&
                typeof tier.originalPrice.yearly === 'number' &&
                typeof price === 'number' && (
                  <Badge className='bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'>
                    Save{' '}
                    {Math.round(
                      ((tier.originalPrice.yearly - price) /
                        tier.originalPrice.yearly) *
                        100
                    )}
                    %
                  </Badge>
                )}
            </div>

            <p className='-mt-2 text-xs font-medium'>
              Per {paymentFrequency === 'yearly' ? 'year' : 'month'}
            </p>
          </>
        ) : (
          <h1 className='text-4xl font-medium'>{price}</h1>
        )}
      </div>

      {/* Features */}
      <div className='flex-1 space-y-2'>
        <h3 className='text-sm font-medium'>{tier.description}</h3>
        <ul className='space-y-2'>
          {tier.features.map((feature, index) => {
            // Handle dynamic credit display
            if (feature === 'CREDITS_PLACEHOLDER') {
              const credits =
                paymentFrequency === 'yearly'
                  ? tier.credits?.yearly
                  : tier.credits?.monthly;
              const displayFeature = `${credits} credits per ${paymentFrequency === 'yearly' ? 'year' : 'month'}`;

              return (
                <li
                  key={index}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium',
                    isHighlighted ? 'text-background' : 'text-foreground/60'
                  )}
                >
                  <BadgeCheck strokeWidth={1} size={16} />
                  {displayFeature}
                </li>
              );
            }

            return (
              <li
                key={index}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium',
                  isHighlighted ? 'text-background' : 'text-foreground/60'
                )}
              >
                <BadgeCheck strokeWidth={1} size={16} />
                {feature}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Call to Action Button */}
      <Button
        variant='expandIcon'
        Icon={isLoading ? Loader2 : ArrowRight}
        iconPlacement='right'
        onClick={handleButtonClick}
        disabled={isLoading || !!isCurrentPlan}
        className={cn(
          'h-fit w-full rounded-lg',
          isHighlighted && 'bg-accent text-foreground hover:bg-accent/95',
          (isLoading || isCurrentPlan) && 'cursor-not-allowed opacity-50',
          isCurrentPlan && 'bg-green-600 text-white hover:bg-green-600'
        )}
      >
        {isLoading
          ? 'Processing...'
          : isCurrentPlan
            ? 'Current Plan'
            : isDowngrade
              ? 'Manage Plan'
              : isUpgrade
                ? 'Upgrade'
                : tier.cta}
      </Button>
    </div>
  );
};

// Highlighted Background Component
const HighlightedBackground = () => (
  <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-100 dark:opacity-30' />
);

// Popular Background Component
const PopularBackground = () => (
  <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' />
);
