'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Image } from '@/types/image';
import { Column, ColumnDef } from '@tanstack/react-table';
import { AlertCircle, CheckCircle2, Clock, Text } from 'lucide-react';
import NextImage from 'next/image';
import { CellAction } from './cell-action';
import { STATUS_OPTIONS } from './options';

export const columns: ColumnDef<Image>[] = [
    {
        accessorKey: 'originalImageUrlLQ',
        header: 'IMAGE',
        cell: ({ row }) => {
            return (
                <div className='relative aspect-square h-16 w-16'>
                    <NextImage
                        src={row.getValue('originalImageUrlLQ')}
                        alt={row.getValue('originalFileName')}
                        fill
                        className='rounded-lg object-cover'
                    />
                </div>
            );
        }
    },
    {
        id: 'originalFileName',
        accessorKey: 'originalFileName',
        header: ({ column }: { column: Column<Image, unknown> }) => (
            <DataTableColumnHeader column={column} title='File Name' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Image['originalFileName']>()}</div>,
        meta: {
            label: 'File Name',
            placeholder: 'Search files...',
            variant: 'text',
            icon: Text
        },
        enableColumnFilter: true
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }: { column: Column<Image, unknown> }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ cell }) => {
            const status = cell.getValue<Image['status']>();
            let Icon = Clock;
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';

            switch (status) {
                case 'ready':
                    Icon = CheckCircle2;
                    variant = 'default';
                    break;
                case 'processing':
                    Icon = Clock;
                    variant = 'secondary';
                    break;
                case 'queue':
                    Icon = AlertCircle;
                    variant = 'outline';
                    break;
            }

            return (
                <Badge variant={variant} className='capitalize'>
                    <Icon className='mr-1 h-3 w-3' />
                    {status}
                </Badge>
            );
        },
        enableColumnFilter: true,
        meta: {
            label: 'status',
            variant: 'select',
            options: STATUS_OPTIONS
        }
    },
    {
        accessorKey: 'processId',
        header: 'PROCESS ID',
        cell: ({ cell }) => (
            <code className='text-xs bg-muted px-1 py-0.5 rounded'>
                {cell.getValue<Image['processId']>()}
            </code>
        )
    },
    {
        accessorKey: 'createdAt',
        header: 'CREATED',
        cell: ({ cell }) => {
            const date = new Date(cell.getValue<Image['createdAt']>());
            return <div>{date.toLocaleDateString()}</div>;
        }
    },
    {
        accessorKey: 'bgRemovedImageUrlLQ',
        header: 'PROCESSED',
        cell: ({ row }) => {
            const bgRemovedUrl = row.getValue<Image['bgRemovedImageUrlLQ']>('bgRemovedImageUrlLQ');
            return bgRemovedUrl ? (
                <div className='relative aspect-square h-16 w-16'>
                    <NextImage
                        src={bgRemovedUrl}
                        alt={`Processed ${row.getValue('originalFileName')}`}
                        fill
                        className='rounded-lg object-cover'
                    />
                </div>
            ) : (
                <div className='h-16 w-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-muted-foreground'>
                    N/A
                </div>
            );
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
];
