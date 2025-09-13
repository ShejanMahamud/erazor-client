import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const { getToken } = await auth();
  const token = await getToken();
  const subscription = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/billing/subscription/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  ).then((res) => res.json());
  return NextResponse.json(subscription);
}
