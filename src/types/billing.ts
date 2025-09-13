export interface BillingPlanPrice {
  createdAt: string;
  modifiedAt: string | null;
  id: string;
  amountType: 'free' | 'fixed';
  isArchived: boolean;
  productId: string;
  type: 'recurring';
  recurringInterval: 'month' | 'year';
  priceCurrency?: string;
  priceAmount?: number;
}

export interface BillingPlanBenefit {
  id: string;
  createdAt: string;
  modifiedAt: string | null;
  type: string;
  description: string;
  selectable: boolean;
  deletable: boolean;
  organizationId: string;
  metadata: Record<string, any>;
  properties: {
    units: number;
    rollover: boolean;
    meterId: string;
  };
}

export interface BillingPlan {
  createdAt: string;
  modifiedAt: string | null;
  id: string;
  name: string;
  description: string;
  recurringInterval: 'month' | 'year';
  isRecurring: boolean;
  isArchived: boolean;
  organizationId: string;
  metadata: {
    credits?: string;
    interval?: string;
  };
  prices: BillingPlanPrice[];
  benefits: BillingPlanBenefit[];
  medias: any[];
  attachedCustomFields: any[];
}

export interface BillingPlansResponse {
  success: boolean;
  message: string;
  data: BillingPlan[];
}

export interface UserSubscription {
  id: string;
  createdAt: string;
  modifiedAt: string;
  customFieldData: Record<string, any>;
  metadata: Record<string, any>;
  status: string;
  amount: number;
  currency: string;
  recurringInterval: 'month' | 'year';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  startedAt: string;
  endsAt: string | null;
  productId: string;
  discountId: string | null;
  meters: any[];
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: UserSubscription;
}

export interface TransformedPricingTier {
  id: string;
  planIds: {
    monthly?: string;
    yearly?: string;
  };
  name: string;
  price: {
    monthly: number | string;
    yearly: number | string;
  };
  originalPrice?: {
    monthly: number | string | null;
    yearly: number | string | null;
  };
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
  credits: {
    monthly?: number;
    yearly?: number;
  };
}
