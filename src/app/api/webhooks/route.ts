import { serverBaseUrl } from '@/config';

import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === 'user.created') {
      const payload = {
        id: evt.data.id,
        email: evt.data.email_addresses.map((email) => email.email_address)[0],
        username: evt.data.username,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        imageUrl: evt.data.image_url,
        verified: evt.data.email_addresses.map(
          (email) => email.verification?.status
        )[0]
      };

      const res = await fetch(`${serverBaseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (
          errorText.includes('User already exists') ||
          errorText.includes('Unique constraint')
        ) {
          return NextResponse.json({ message: 'User already exists' });
        }

        return new Response('Failed to create user', { status: 500 });
      }

      const data = await res.json();
      return NextResponse.json(data);
    }
    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    return new Response('Error verifying webhook', { status: 400 });
  }
}
