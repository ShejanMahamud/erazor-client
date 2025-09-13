export type User = {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  verified: 'transferable' | 'verified' | 'unverified' | 'expired' | 'failed';
  isDeleted: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserApiResponse = {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    limit: number;
    count: number;
    hasNextPage: boolean;
    nextCursor: string | null;
  };
};

export type SingleUserApiResponse = {
  success: boolean;
  message: string;
  data: User;
};
