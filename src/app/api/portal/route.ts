// app/api/portal/route.ts
import { auth } from '@clerk/nextjs/server';
import { Polar } from '@polar-sh/sdk';
import { redirect } from 'next/navigation';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: 'sandbox'
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/auth/sign-in');
  }

  try {
    const session = await polar.customerSessions.create({
      externalCustomerId: userId
    });

    return Response.redirect(session.customerPortalUrl);
  } catch (error) {
    return new Response('Error creating portal session', { status: 500 });
  }
}
