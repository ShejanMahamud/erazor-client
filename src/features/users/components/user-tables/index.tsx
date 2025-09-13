'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface UserTableParams<TData, TValue> {
    data: TData[];
    totalItems: number;
    columns: ColumnDef<TData, TValue>[];
}

export function UserTable<TData, TValue>({
    data,
    totalItems,
    columns
}: UserTableParams<TData, TValue>) {
    const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

    const pageCount = Math.ceil(totalItems / pageSize);

    const { table } = useDataTable({
        data, // user data
        columns, // user columns
        pageCount: pageCount,
        shallow: false, //Setting to false triggers a network request with the updated querystring.
        debounceMs: 500,
        initialState: {
            columnVisibility: {
                search: false // Hide search column from display
            }
        }
    });

    return (
        <DataTable table={table}>
            <DataTableToolbar table={table} />
        </DataTable>
    );
}
