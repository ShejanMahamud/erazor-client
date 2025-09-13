'use client';

import type { Table } from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Search } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';

interface UserTableToolbarProps<TData> extends React.ComponentProps<'div'> {
    table: Table<TData>;
}

export function UserTableToolbar<TData>({
    table,
    children,
    className,
    ...props
}: UserTableToolbarProps<TData>) {
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
    const isFiltered = table.getState().columnFilters.length > 0;

    const columns = React.useMemo(
        () => table.getAllColumns().filter((column) => column.getCanFilter()),
        [table]
    );

    const onReset = React.useCallback(() => {
        table.resetColumnFilters();
        setSearch('');
    }, [table, setSearch]);

    return (
        <div
            role='toolbar'
            aria-orientation='horizontal'
            className={cn(
                'flex w-full items-center justify-between gap-2 p-1',
                className
            )}
            {...props}
        >
            <div className='flex flex-1 flex-wrap items-center gap-2'>
                {/* Search Input */}
                <div className='relative'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search users by name, email, or username...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='pl-8 h-8 w-64'
                    />
                </div>

                {/* Column Filters */}
                {columns.map((column) => {
                    const columnMeta = column.columnDef.meta;

                    if (!columnMeta?.variant) return null;

                    if (columnMeta.variant === 'select' && columnMeta.options) {
                        return (
                            <DataTableFacetedFilter
                                key={column.id}
                                column={column}
                                title={columnMeta.label}
                                options={columnMeta.options}
                            />
                        );
                    }

                    return null;
                })}

                {(isFiltered || search) && (
                    <Button
                        aria-label='Reset filters'
                        variant='outline'
                        size='sm'
                        className='border-dashed'
                        onClick={onReset}
                    >
                        <Cross2Icon />
                        Reset
                    </Button>
                )}
            </div>
            <div className='flex items-center gap-2'>
                {children}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
