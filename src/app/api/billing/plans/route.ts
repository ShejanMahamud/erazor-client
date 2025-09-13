import { BillingPlansResponse } from '@/types/billing';
import { NextRequest, NextResponse } from 'next/server';

// Mock data for development/demo purposes
const MOCK_BILLING_PLANS: BillingPlansResponse = {
  success: true,
  message: 'All plans fetched successfully!',
  data: [
    {
      createdAt: '2025-09-05T18:13:19.630Z',
      modifiedAt: '2025-09-05T18:13:20.119Z',
      id: 'a29c140b-d5e4-4c25-b6da-b1b5899755ad',
      name: 'Erazor AI - Free Monthly',
      description:
        'An all-in-one AI background remover with a monthly credit allowance for slow, low-quality image cutouts.',
      recurringInterval: 'month',
      isRecurring: true,
      isArchived: false,
      organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
      metadata: {
        credits: '5',
        interval: 'monthly'
      },
      prices: [
        {
          createdAt: '2025-09-05T18:13:19.636Z',
          modifiedAt: '2025-09-05T18:13:20.124Z',
          id: '29b22b90-2d9c-4b7f-9096-c924dbe9852d',
          amountType: 'free',
          isArchived: false,
          productId: 'a29c140b-d5e4-4c25-b6da-b1b5899755ad',
          type: 'recurring',
          recurringInterval: 'month'
        }
      ],
      benefits: [
        {
          id: 'd086f1fe-a281-4f84-88b0-68bf4028d334',
          createdAt: '2025-09-05T16:00:57.247Z',
          modifiedAt: null,
          type: 'meter_credit',
          description: 'Erazor AI - Free Monthly',
          selectable: true,
          deletable: true,
          organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
          metadata: {},
          properties: {
            units: 5,
            rollover: false,
            meterId: 'f680098b-eabc-4d7f-8a40-b144e66af8e0'
          }
        }
      ],
      medias: [],
      attachedCustomFields: []
    },
    {
      createdAt: '2025-09-05T18:02:36.270Z',
      modifiedAt: '2025-09-05T18:02:36.836Z',
      id: '09f43beb-326a-4d14-9ae3-48839b5df6ed',
      name: 'Erazor AI - Starter Yearly',
      description:
        'An all-in-one AI background remover with a yearly credit allowance for instant, high-quality image cutouts.',
      recurringInterval: 'year',
      isRecurring: true,
      isArchived: false,
      organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
      metadata: {
        credits: '1200',
        interval: 'yearly'
      },
      prices: [
        {
          createdAt: '2025-09-05T18:02:36.273Z',
          modifiedAt: '2025-09-05T18:02:36.839Z',
          id: 'd64dd1ef-bf18-4c3a-b548-17e4a31bf9dd',
          amountType: 'fixed',
          isArchived: false,
          productId: '09f43beb-326a-4d14-9ae3-48839b5df6ed',
          type: 'recurring',
          recurringInterval: 'year',
          priceCurrency: 'usd',
          priceAmount: 19999
        }
      ],
      benefits: [
        {
          id: '0ed1afca-827c-4d7d-9b1d-338fa7f41a95',
          createdAt: '2025-09-05T17:55:01.598Z',
          modifiedAt: null,
          type: 'meter_credit',
          description: 'Erazor AI - Starter Yearly',
          selectable: true,
          deletable: true,
          organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
          metadata: {},
          properties: {
            units: 1200,
            rollover: false,
            meterId: 'f680098b-eabc-4d7f-8a40-b144e66af8e0'
          }
        }
      ],
      medias: [],
      attachedCustomFields: []
    },
    {
      createdAt: '2025-09-05T18:01:13.111Z',
      modifiedAt: '2025-09-05T18:01:13.715Z',
      id: '974b2b0a-15f2-41b1-a9ab-92b49ad1aabe',
      name: 'Erazor AI - Starter Monthly',
      description:
        'An all-in-one AI background remover with a monthly credit allowance for instant, high-quality image cutouts.',
      recurringInterval: 'month',
      isRecurring: true,
      isArchived: false,
      organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
      metadata: {
        credits: '100',
        interval: 'monthly'
      },
      prices: [
        {
          createdAt: '2025-09-05T18:01:13.115Z',
          modifiedAt: '2025-09-05T18:01:13.721Z',
          id: 'bfc1f6fd-3711-449b-bb1b-688b94c227d0',
          amountType: 'fixed',
          isArchived: false,
          productId: '974b2b0a-15f2-41b1-a9ab-92b49ad1aabe',
          type: 'recurring',
          recurringInterval: 'month',
          priceCurrency: 'usd',
          priceAmount: 1999
        }
      ],
      benefits: [
        {
          id: '5f4a5d59-13a2-423e-800b-e275628a8a71',
          createdAt: '2025-09-05T17:54:35.745Z',
          modifiedAt: null,
          type: 'meter_credit',
          description: 'Erazor AI - Starter Monthly',
          selectable: true,
          deletable: true,
          organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
          metadata: {},
          properties: {
            units: 100,
            rollover: false,
            meterId: 'f680098b-eabc-4d7f-8a40-b144e66af8e0'
          }
        }
      ],
      medias: [],
      attachedCustomFields: []
    },
    {
      createdAt: '2025-09-05T17:48:00.322Z',
      modifiedAt: '2025-09-05T17:48:00.842Z',
      id: 'a1e391eb-4a96-405b-a19e-09688bf9472c',
      name: 'Erazor AI - Pro Yearly',
      description:
        'An all-in-one AI background remover with a yearly credit allowance for instant, high-quality image cutouts.',
      recurringInterval: 'year',
      isRecurring: true,
      isArchived: false,
      organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
      metadata: {
        credits: '2400',
        interval: 'yearly'
      },
      prices: [
        {
          createdAt: '2025-09-05T17:48:00.326Z',
          modifiedAt: '2025-09-05T17:48:00.847Z',
          id: 'bd53a3d6-97ab-46a4-821f-210b12e6f69e',
          amountType: 'fixed',
          isArchived: false,
          productId: 'a1e391eb-4a96-405b-a19e-09688bf9472c',
          type: 'recurring',
          recurringInterval: 'year',
          priceCurrency: 'usd',
          priceAmount: 29999
        }
      ],
      benefits: [
        {
          id: 'f9d5b621-5337-4ab2-96a6-1f67170c3762',
          createdAt: '2025-09-05T16:07:57.538Z',
          modifiedAt: '2025-09-05T17:56:04.760Z',
          type: 'meter_credit',
          description: 'Erazor AI - Pro Yearly',
          selectable: true,
          deletable: true,
          organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
          metadata: {},
          properties: {
            units: 2400,
            rollover: false,
            meterId: 'f680098b-eabc-4d7f-8a40-b144e66af8e0'
          }
        }
      ],
      medias: [],
      attachedCustomFields: []
    },
    {
      createdAt: '2025-09-05T16:18:53.422Z',
      modifiedAt: '2025-09-05T18:04:09.838Z',
      id: '22779aa2-0923-4059-8962-a5db64ffcab6',
      name: 'Erazor AI - Pro Monthly',
      description:
        'An all-in-one AI background remover with a monthly credit allowance for instant, high-quality image cutouts.',
      recurringInterval: 'month',
      isRecurring: true,
      isArchived: false,
      organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
      metadata: {
        credits: '200',
        interval: 'monthly'
      },
      prices: [
        {
          createdAt: '2025-09-05T16:18:53.426Z',
          modifiedAt: '2025-09-05T16:18:53.938Z',
          id: '04448732-48af-4e6e-9310-1b521cf8d11a',
          amountType: 'fixed',
          isArchived: false,
          productId: '22779aa2-0923-4059-8962-a5db64ffcab6',
          type: 'recurring',
          recurringInterval: 'month',
          priceCurrency: 'usd',
          priceAmount: 2999
        }
      ],
      benefits: [
        {
          id: 'df9fb12e-19ec-4a6c-b51a-45260eb4740c',
          createdAt: '2025-09-05T16:06:22.846Z',
          modifiedAt: '2025-09-05T17:56:16.799Z',
          type: 'meter_credit',
          description: 'Erazor AI - Pro Monthly',
          selectable: true,
          deletable: true,
          organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
          metadata: {},
          properties: {
            units: 200,
            rollover: false,
            meterId: 'f680098b-eabc-4d7f-8a40-b144e66af8e0'
          }
        }
      ],
      medias: [],
      attachedCustomFields: []
    },
    {
      createdAt: '2025-09-05T16:17:11.471Z',
      modifiedAt: '2025-09-05T16:17:11.996Z',
      id: '6016aa47-8d57-47de-b534-be0da8df4dba',
      name: 'Erazor AI - Basic Yearly',
      description:
        'An all-in-one AI background remover with a yearly credit allowance for instant, high-quality image cutouts.',
      recurringInterval: 'year',
      isRecurring: true,
      isArchived: false,
      organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
      metadata: {
        credits: '600',
        interval: 'yearly'
      },
      prices: [
        {
          createdAt: '2025-09-05T17:50:52.270Z',
          modifiedAt: null,
          id: '778697bc-f08c-41a3-bfd3-c18ccb6a4d5c',
          amountType: 'fixed',
          isArchived: false,
          productId: '6016aa47-8d57-47de-b534-be0da8df4dba',
          type: 'recurring',
          recurringInterval: 'year',
          priceCurrency: 'usd',
          priceAmount: 9999
        }
      ],
      benefits: [
        {
          id: '0c7d824f-7433-45e8-9b35-07de3f7f1a46',
          createdAt: '2025-09-05T16:05:00.267Z',
          modifiedAt: '2025-09-05T16:07:09.495Z',
          type: 'meter_credit',
          description: 'Erazor AI - Basic Yearly',
          selectable: true,
          deletable: true,
          organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
          metadata: {},
          properties: {
            units: 600,
            rollover: false,
            meterId: 'f680098b-eabc-4d7f-8a40-b144e66af8e0'
          }
        }
      ],
      medias: [],
      attachedCustomFields: []
    },
    {
      createdAt: '2025-09-05T16:13:14.654Z',
      modifiedAt: '2025-09-05T16:13:15.167Z',
      id: 'ddf87dba-c5db-4f8f-b555-9e228516afa0',
      name: 'Erazor AI - Basic Monthly',
      description:
        'An all-in-one AI background remover with a monthly credit allowance for instant, high-quality image cutouts.',
      recurringInterval: 'month',
      isRecurring: true,
      isArchived: false,
      organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
      metadata: {
        credits: '50',
        interval: 'monthly'
      },
      prices: [
        {
          createdAt: '2025-09-05T17:50:15.543Z',
          modifiedAt: null,
          id: 'bdd8ce92-b218-41f2-9e88-49f0894c671f',
          amountType: 'fixed',
          isArchived: false,
          productId: 'ddf87dba-c5db-4f8f-b555-9e228516afa0',
          type: 'recurring',
          recurringInterval: 'month',
          priceCurrency: 'usd',
          priceAmount: 999
        }
      ],
      benefits: [
        {
          id: '87996711-0ab7-4f31-8d37-ff00be0d4082',
          createdAt: '2025-09-05T16:03:42.081Z',
          modifiedAt: '2025-09-05T16:06:45.802Z',
          type: 'meter_credit',
          description: 'Erazor AI - Basic Monthly',
          selectable: true,
          deletable: true,
          organizationId: 'c7cac435-3947-42da-bd74-b36d06d9c305',
          metadata: {},
          properties: {
            units: 50,
            rollover: false,
            meterId: 'f680098b-eabc-4d7f-8a40-b144e66af8e0'
          }
        }
      ],
      medias: [],
      attachedCustomFields: []
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL;

    // If no API URL is configured, return mock data for development
    if (!baseUrl) {
      return NextResponse.json(MOCK_BILLING_PLANS);
    }

    const apiUrl = `${baseUrl}/billing/plans`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // Add any authentication headers here if needed
        // 'Authorization': `Bearer ${token}`,
      },
      // Add cache control if needed
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      // Fallback to mock data if API fails
      return NextResponse.json(MOCK_BILLING_PLANS);
    }

    const data: BillingPlansResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    // Fallback to mock data on error
    return NextResponse.json(MOCK_BILLING_PLANS);
  }
}
