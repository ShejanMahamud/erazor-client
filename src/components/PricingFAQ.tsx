import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import Link from 'next/link';

const pricingFAQItems = [
  {
    question: 'What happens when I run out of credits?',
    answer: (
      <p className='mb-4 max-w-[580px]'>
        When you run out of credits, you can either upgrade to a higher plan or
        wait until your next billing cycle for credits to renew. You can also
        purchase additional credit packs if needed.
      </p>
    )
  },
  {
    question: 'Can I change my plan anytime?',
    answer: (
      <p className='mb-4 max-w-[580px]'>
        Yes! You can upgrade or downgrade your plan at any time. When you
        upgrade, you&apos;ll be charged the prorated amount immediately. When
        you downgrade, the change will take effect at your next billing cycle.
      </p>
    )
  },
  {
    question: 'Do credits roll over to the next month?',
    answer: (
      <p className='mb-4 max-w-[580px]'>
        Credit rollover is available for Basic, Starter, and Pro plans. Unused
        credits will carry over to the next billing period, but they cannot
        exceed your plan&apos;s monthly limit.
      </p>
    )
  },
  {
    question: 'Is there a free trial?',
    answer: (
      <p className='mb-4 max-w-[580px]'>
        Yes! Our Free plan gives you access to try our AI-powered background
        removal with limited credits. No credit card required to get started.
      </p>
    )
  },
  {
    question: 'What payment methods do you accept?',
    answer: (
      <p className='mb-4 max-w-[580px]'>
        We accept all major credit cards (Visa, Mastercard, American Express)
        and PayPal. All payments are processed securely through our payment
        provider.
      </p>
    )
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: (
      <p className='mb-4 max-w-[580px]'>
        Absolutely! You can cancel your subscription at any time from your
        account settings. You&apos;ll continue to have access to your plan until
        the end of your current billing period.
      </p>
    )
  },
  {
    question: 'Do you offer refunds?',
    answer: (
      <>
        <p className='mb-4 max-w-[580px]'>
          We offer a 14-day money-back guarantee for all paid plans. If
          you&apos;re not satisfied with our service, contact our support team
          within 14 days of your purchase.
        </p>
        <p className='mb-4 max-w-[580px]'>
          For more details, please review our{' '}
          <Link href='/terms' className='text-foreground underline'>
            terms of service
          </Link>{' '}
          and{' '}
          <Link href='/refund-policy' className='text-foreground underline'>
            refund policy
          </Link>
          .
        </p>
      </>
    )
  }
];

export const PricingFAQ = () => {
  return (
    <section className='bg-background py-16'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight sm:text-4xl'>
            Frequently Asked Questions
          </h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            Get answers to common questions about our pricing and plans
          </p>
        </div>

        <div className='mx-auto max-w-3xl'>
          <Accordion type='single' collapsible className='w-full'>
            {pricingFAQItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='text-left'>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className='text-muted-foreground'>{item.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
