'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/user';
import { useAuth } from '@clerk/nextjs';
import { IconDotsVertical, IconEye, IconShield, IconShieldOff, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CellActionProps {
    data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [blockLoading, setBlockLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { getToken } = useAuth();

    const updateUser = async (updateData: Partial<User>) => {
        try {
            const token = await getToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${data.clerkId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                // Refresh the page to show updated data
                router.refresh();
            } else {
                throw new Error(result.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update user');
        }
    };

    const onConfirm = async () => {
        setLoading(true);
        try {
            await updateUser({ isDeleted: true });
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async () => {
        setBlockLoading(true);
        try {
            await updateUser({ isBlocked: !data.isBlocked });
        } finally {
            setBlockLoading(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <IconDotsVertical className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/user-management/${data.id}`)}
                    >
                        <IconEye className='mr-2 h-4 w-4' /> View Details
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />


                    <DropdownMenuItem
                        onClick={handleBlockUser}
                        disabled={blockLoading}
                    >
                        {blockLoading ? (
                            <>
                                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                Updating...
                            </>
                        ) : data.isBlocked ? (
                            <>
                                <IconShield className='mr-2 h-4 w-4' /> Unblock User
                            </>
                        ) : (
                            <>
                                <IconShieldOff className='mr-2 h-4 w-4' /> Block User
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="text-red-600 focus:text-red-600"
                        disabled={loading}
                    >
                        <IconTrash className='mr-2 h-4 w-4' /> Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
