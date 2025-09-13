import SignUpViewPage from '@/features/auth/components/sign-up-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Erazor AI | Sign Up',
  description: 'Sign Up page for Erazor AI.'
};

export default async function Page() {
  return <SignUpViewPage />;
}
