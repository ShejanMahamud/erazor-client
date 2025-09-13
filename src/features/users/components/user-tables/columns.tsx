'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { User } from '@/types/user';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  CheckCircle2,
  Mail,
  Shield,
  ShieldOff,
  Text,
  User as UserIcon,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { BLOCKED_OPTIONS, DELETED_OPTIONS, VERIFIED_OPTIONS } from './options';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'AVATAR',
    cell: ({ row }) => {
      const imageUrl = row.getValue<string>('imageUrl');
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;

      return (
        <div className='relative aspect-square h-10 w-10'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${firstName} ${lastName}`}
              fill
              className='rounded-full object-cover'
            />
          ) : (
            <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
              <UserIcon className='text-muted-foreground h-5 w-5' />
            </div>
          )}
        </div>
      );
    }
  },
  {
    id: 'search',
    accessorFn: (row) =>
      `${row.firstName} ${row.lastName} ${row.email} ${row.username}`,
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Search' />
    ),
    cell: () => null, // Hidden column for search only
    meta: {
      label: 'Search',
      placeholder: 'Search users by name, email, or username...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'fullName',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {firstName} {lastName}
          </span>
          <span className='text-muted-foreground text-sm'>
            @{row.original.username}
          </span>
        </div>
      );
    }
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ cell }) => (
      <div className='flex items-center'>
        <Mail className='text-muted-foreground mr-2 h-4 w-4' />
        {cell.getValue<User['email']>()}
      </div>
    )
  },
  {
    id: 'verificationStatus',
    accessorKey: 'verified',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Verification' />
    ),
    cell: ({ cell }) => {
      const verified = cell.getValue<User['verified']>();

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'outline';
      let Icon = XCircle;

      switch (verified) {
        case 'verified':
          variant = 'default';
          Icon = CheckCircle2;
          break;
        case 'transferable':
          variant = 'secondary';
          Icon = CheckCircle2;
          break;
        case 'unverified':
          variant = 'outline';
          Icon = XCircle;
          break;
        case 'expired':
          variant = 'destructive';
          Icon = XCircle;
          break;
        case 'failed':
          variant = 'destructive';
          Icon = XCircle;
          break;
        default:
          variant = 'outline';
          Icon = XCircle;
      }

      return (
        <Badge variant={variant} className='capitalize'>
          <Icon className='mr-1 h-3 w-3' />
          {verified}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Verification Status',
      variant: 'select',
      options: VERIFIED_OPTIONS
    }
  },
  {
    id: 'isBlocked',
    accessorKey: 'isBlocked',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Access' />
    ),
    cell: ({ cell }) => {
      const isBlocked = cell.getValue<User['isBlocked']>();

      return (
        <Badge variant={isBlocked ? 'destructive' : 'outline'}>
          {isBlocked ? (
            <ShieldOff className='mr-1 h-3 w-3' />
          ) : (
            <Shield className='mr-1 h-3 w-3' />
          )}
          {isBlocked ? 'Blocked' : 'Active'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Access Status',
      variant: 'select',
      options: BLOCKED_OPTIONS
    }
  },
  {
    accessorKey: 'clerkId',
    header: 'CLERK ID',
    cell: ({ cell }) => (
      <code className='bg-muted rounded px-1 py-0.5 text-xs'>
        {cell.getValue<User['clerkId']>()}
      </code>
    )
  },
  {
    id: 'isDeleted',
    accessorKey: 'isDeleted',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Account Status' />
    ),
    cell: ({ cell }) => {
      const isDeleted = cell.getValue<User['isDeleted']>();

      return (
        <Badge variant={isDeleted ? 'destructive' : 'default'}>
          {isDeleted ? 'Deleted' : 'Active'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Account Status',
      variant: 'select',
      options: DELETED_OPTIONS
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'JOINED',
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<User['createdAt']>());
      return (
        <div className='flex flex-col'>
          <span>{date.toLocaleDateString()}</span>
          <span className='text-muted-foreground text-xs'>
            {date.toLocaleTimeString()}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'LAST UPDATED',
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<User['updatedAt']>());
      return (
        <div className='flex flex-col'>
          <span>{date.toLocaleDateString()}</span>
          <span className='text-muted-foreground text-xs'>
            {date.toLocaleTimeString()}
          </span>
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
