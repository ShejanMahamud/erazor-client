import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Background Remover',
    url: '/dashboard/background-remover',
    icon: 'media',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Image History',
    url: '/dashboard/image-history',
    icon: 'history',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'User Management',
    url: '/dashboard/user-management',
    icon: 'user',
    shortcut: ['u', 'm'],
    isActive: false,
    items: []
  }
];

export const avatars = [
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/16860528',
    profileUrl: 'https://github.com/dillionverma'
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/20110627',
    profileUrl: 'https://github.com/tomonarifeehan'
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/106103625',
    profileUrl: 'https://github.com/BankkRoll'
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/59228569',
    profileUrl: 'https://github.com/safethecode'
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/59442788',
    profileUrl: 'https://github.com/sanjay-mali'
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/89768406',
    profileUrl: 'https://github.com/itsarghyadas'
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
