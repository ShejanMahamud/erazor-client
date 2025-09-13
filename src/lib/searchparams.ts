import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  cursor: parseAsString,
  search: parseAsString,
  originalFileName: parseAsString,
  status: parseAsString,
  // User-specific parameters
  verified: parseAsString,
  verificationStatus: parseAsString,
  isBlocked: parseAsString,
  isDeleted: parseAsString,
  username: parseAsString,
  email: parseAsString
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
