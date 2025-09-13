'use client';

import { PricingCard } from '@/components/PricingCard';
import { PricingHeader } from '@/components/PricingHeader';
import { PAYMENT_FREQUENCIES } from '@/config';
import {
  BillingPlan,
  BillingPlansResponse,
  SubscriptionResponse,
  TransformedPricingTier
} from '@/types/billing';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export const Pricing = () => {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState(
    PAYMENT_FREQUENCIES[0]
  );
  const [tiers, setTiers] = useState<TransformedPricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const { userId, isSignedIn } = useAuth();

  const transformPlansToTiers = (
    plans: BillingPlan[]
  ): TransformedPricingTier[] => {
    // Filter out archived plans
    const activePlans = plans.filter((plan) => !plan.isArchived);

    // Group plans by base name (removing AI, Monthly, Yearly suffixes)
    const planGroups = activePlans.reduce(
      (groups, plan) => {
        // Extract base name: "Erazor AI - Free Monthly" -> "Free"
        let baseName = plan.name
          .replace(/^Erazor\s*(AI)?\s*-\s*/, '') // Remove "Erazor AI -" prefix
          .replace(/\s*(Monthly|Yearly)$/, '') // Remove Monthly/Yearly suffix
          .trim();

        if (!groups[baseName]) {
          groups[baseName] = {};
        }
        groups[baseName][plan.recurringInterval] = plan;
        return groups;
      },
      {} as Record<string, Record<string, BillingPlan>>
    );

    const transformedPlans = Object.entries(planGroups)
      .map(([baseName, plansByInterval]) => {
        const monthlyPlan = plansByInterval.month;
        const yearlyPlan = plansByInterval.year;

        // Use monthly plan as primary, fallback to yearly
        const primaryPlan = monthlyPlan || yearlyPlan;

        if (!primaryPlan) return null;

        // Determine the plan type first for pricing logic
        let planType = 'other';
        let displayName = baseName;

        if (
          baseName.toLowerCase().includes('free') ||
          monthlyPlan?.prices[0]?.amountType === 'free' ||
          yearlyPlan?.prices[0]?.amountType === 'free'
        ) {
          displayName = 'Free';
          planType = 'free';
        } else if (baseName.toLowerCase().includes('starter')) {
          displayName = 'Starter';
          planType = 'starter';
        } else if (baseName.toLowerCase().includes('basic')) {
          displayName = 'Basic';
          planType = 'basic';
        } else if (baseName.toLowerCase().includes('pro')) {
          displayName = 'Pro';
          planType = 'pro';
        }

        // Calculate prices with original and discounted values
        const isFree = planType === 'free';

        let monthlyPrice: string | number;
        let yearlyPrice: string | number;
        let originalMonthlyPrice: string | number | null = null;
        let originalYearlyPrice: string | number | null = null;

        if (isFree) {
          // For free plans, show "Free" for both monthly and yearly
          monthlyPrice = 'Free';
          yearlyPrice = 'Free';
        } else {
          // Set pricing based on plan type with original (struck-through) prices
          if (planType === 'basic') {
            originalMonthlyPrice = 14.99;
            monthlyPrice = 9.99;
            originalYearlyPrice = 179.99;
            yearlyPrice = 99.99;
          } else if (planType === 'starter') {
            originalMonthlyPrice = 29.99;
            monthlyPrice = 19.99;
            originalYearlyPrice = 359.99;
            yearlyPrice = 199.99;
          } else if (planType === 'pro') {
            originalMonthlyPrice = 49.99;
            monthlyPrice = 29.99;
            originalYearlyPrice = 599.99;
            yearlyPrice = 299.99;
          } else {
            // Fallback to API prices if available
            monthlyPrice = monthlyPlan?.prices[0]?.priceAmount
              ? monthlyPlan.prices[0].priceAmount / 100
              : 'Custom';

            yearlyPrice = yearlyPlan?.prices[0]?.priceAmount
              ? yearlyPlan.prices[0].priceAmount / 100
              : 'Custom';
          }
        }

        // Get credits from metadata or benefits
        const monthlyCredits = monthlyPlan?.metadata.credits
          ? parseInt(monthlyPlan.metadata.credits)
          : monthlyPlan?.benefits[0]?.properties.units || 0;

        const yearlyCredits = yearlyPlan?.metadata.credits
          ? parseInt(yearlyPlan.metadata.credits)
          : yearlyPlan?.benefits[0]?.properties.units || 0;

        // Generate features based on credits and benefits
        const features = [];

        // Handle credits - for Free plan, use monthly credits for both tabs since no yearly version exists
        let effectiveMonthlyCredits = monthlyCredits;
        let effectiveYearlyCredits = yearlyCredits;

        if (isFree && monthlyCredits && !yearlyCredits) {
          // For free plans with only monthly version, use same credits for yearly display
          effectiveYearlyCredits = monthlyCredits;
        }

        // Add credits information - show based on selected frequency
        if (effectiveMonthlyCredits && effectiveYearlyCredits) {
          // Will be handled dynamically in the component
          features.push('CREDITS_PLACEHOLDER');
        } else if (effectiveMonthlyCredits) {
          features.push(`${effectiveMonthlyCredits} credits per month`);
        } else if (effectiveYearlyCredits) {
          features.push(`${effectiveYearlyCredits} credits per year`);
        }

        // Add rollover feature if applicable
        const hasRollover = primaryPlan.benefits.some(
          (benefit) => benefit.properties?.rollover
        );
        if (hasRollover && !isFree) {
          features.push('Credit rollover');
        }

        // Add basic features based on plan type
        features.push('AI-powered background removal');

        if (planType === 'free') {
          features.push('Standard quality output');
          features.push('Standard processing speed');
          features.push('Community support');
        } else {
          features.push('High-quality output');
          features.push('Fast processing');

          if (planType === 'starter') {
            features.push('Email support');
            features.push('Instant processing');
          } else if (planType === 'basic') {
            features.push('Email support');
            features.push('Instant processing');
          } else if (planType === 'pro') {
            features.push('Priority support');
            features.push('Advanced features');
            features.push('Bulk processing');
            features.push('Instant processing');
          }
        }

        return {
          id: primaryPlan.id,
          planIds: {
            monthly: monthlyPlan?.id,
            yearly: yearlyPlan?.id
          },
          name: displayName,
          planType, // Add this for sorting
          price: {
            monthly: monthlyPrice,
            yearly: yearlyPrice
          },
          originalPrice:
            originalMonthlyPrice || originalYearlyPrice
              ? {
                  monthly: originalMonthlyPrice,
                  yearly: originalYearlyPrice
                }
              : undefined,
          description: primaryPlan.description,
          features,
          cta: planType === 'free' ? 'Get Started' : 'Subscribe',
          popular: planType === 'pro',
          highlighted: planType === 'enterprise',
          credits: {
            monthly: effectiveMonthlyCredits,
            yearly: effectiveYearlyCredits
          }
        } as TransformedPricingTier & { planType: string };
      })
      .filter(Boolean) as (TransformedPricingTier & { planType: string })[];

    // Sort plans: Free → Basic → Starter → Pro
    return (
      transformedPlans
        .sort((a, b) => {
          const order = { free: 0, basic: 1, starter: 2, pro: 3, other: 4 };
          const aOrder = order[a.planType as keyof typeof order] ?? 4;
          const bOrder = order[b.planType as keyof typeof order] ?? 4;

          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }

          // If same type, sort alphabetically
          return a.name.localeCompare(b.name);
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ planType, ...tier }) => tier)
    ); // Remove planType from final result
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/billing/plans');

        if (!response.ok) {
          throw new Error(`Failed to fetch plans: ${response.statusText}`);
        }

        const data: BillingPlansResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch plans');
        }

        const transformedTiers = transformPlansToTiers(data.data);
        setTiers(transformedTiers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Error logged to error state
      } finally {
        setLoading(false);
      }
    };

    const fetchUserSubscription = async () => {
      if (!isSignedIn || !userId) return;

      try {
        const response = await fetch(`/api/billing/subscription/${userId}`);
        if (response.ok) {
          const data: SubscriptionResponse = await response.json();
          if (data.success) {
            setUserSubscription(data.data);
          }
        }
        // If the request fails (like 404), we just continue without subscription data
      } catch (err) {
        // Continue without subscription data - error is non-critical
      }
    };

    fetchPlans();
    fetchUserSubscription();
  }, [isSignedIn, userId]);

  if (loading) {
    return (
      <section className='my-32 flex flex-col items-center gap-10 px-10 py-10'>
        {/* Header Skeleton */}
        <div className='animate-pulse text-center'>
          <div className='mx-auto mb-4 h-8 w-64 rounded-lg bg-gray-200 dark:bg-gray-700'></div>
          <div className='bg-gray-150 mx-auto h-4 w-96 rounded dark:bg-gray-600'></div>
        </div>

        {/* Frequency Toggle Skeleton */}
        <div className='animate-pulse'>
          <div className='h-12 w-48 rounded-full bg-gray-200 dark:bg-gray-700'></div>
        </div>

        {/* Pricing Cards Skeleton */}
        <div className='flex w-full max-w-6xl justify-center'>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='bg-background relative flex min-h-[400px] animate-pulse flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow'
              >
                {/* Card Header Skeleton */}
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-16 rounded bg-gray-200 dark:bg-gray-700'></div>
                  {i === 2 && (
                    <div className='h-5 w-20 rounded-full bg-orange-200 dark:bg-orange-800'></div>
                  )}
                </div>

                {/* Price Section Skeleton */}
                <div className='space-y-2'>
                  <div className='bg-gray-150 h-4 w-20 rounded dark:bg-gray-600'></div>
                  <div className='flex items-baseline gap-3'>
                    <div className='h-12 w-24 rounded bg-gray-200 dark:bg-gray-700'></div>
                    {i > 0 && (
                      <div className='h-6 w-16 rounded-full bg-green-200 dark:bg-green-800'></div>
                    )}
                  </div>
                  <div className='bg-gray-150 h-3 w-16 rounded dark:bg-gray-600'></div>
                </div>

                {/* Description Skeleton */}
                <div className='bg-gray-150 h-4 w-32 rounded dark:bg-gray-600'></div>

                {/* Features List Skeleton */}
                <div className='flex-1 space-y-3'>
                  {[...Array(5)].map((_, featureIndex) => (
                    <div key={featureIndex} className='flex items-center gap-2'>
                      <div className='h-4 w-4 rounded bg-gray-200 dark:bg-gray-700'></div>
                      <div
                        className={`bg-gray-150 h-3 rounded dark:bg-gray-600 ${
                          featureIndex === 0
                            ? 'w-28'
                            : featureIndex === 1
                              ? 'w-24'
                              : featureIndex === 2
                                ? 'w-32'
                                : featureIndex === 3
                                  ? 'w-20'
                                  : 'w-16'
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* CTA Button Skeleton */}
                <div className='h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-700'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='my-32 flex flex-col items-center gap-10 py-10'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold text-red-600'>
            Error loading plans
          </h2>
          <p className='text-gray-600'>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className='my-24 flex flex-col items-center gap-10 px-5 py-10'>
      {/* Section Header */}
      <PricingHeader
        title='Plans and Pricing'
        subtitle='Receive unlimited credits when you pay yearly, and save on your plan.'
        frequencies={PAYMENT_FREQUENCIES}
        selectedFrequency={selectedPaymentFreq}
        onFrequencyChange={setSelectedPaymentFreq}
      />

      {/* Pricing Cards */}
      <div className='flex w-full max-w-6xl justify-center'>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              paymentFrequency={selectedPaymentFreq}
              userSubscription={userSubscription}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
