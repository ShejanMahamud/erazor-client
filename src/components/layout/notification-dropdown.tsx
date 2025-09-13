'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotificationSocket';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export default function NotificationDropdown() {
  const { userId } = useAuth();
  const { notifications, isLoading, error } = useNotifications(userId || '');
  const [isOpen, setIsOpen] = useState(false);

  // Format time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!userId) return null;

  // Ensure notifications is always an array
  const notificationsList = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs'
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80 p-0' align='end'>
        <div className='flex items-center justify-between p-4'>
          <DropdownMenuLabel className='p-0 text-lg font-semibold'>
            Notifications
          </DropdownMenuLabel>
        </div>
        <Separator />

        <ScrollArea className='h-96'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center p-8 text-center'>
              <div className='border-primary mb-2 h-8 w-8 animate-spin rounded-full border-b-2'></div>
              <p className='text-muted-foreground text-sm'>
                Loading notifications...
              </p>
            </div>
          ) : error ? (
            <div className='flex flex-col items-center justify-center p-8 text-center'>
              <div className='text-destructive mb-2'>⚠️</div>
              <p className='text-destructive text-sm'>{error}</p>
            </div>
          ) : notificationsList.length === 0 ? (
            <div className='flex flex-col items-center justify-center p-8 text-center'>
              <Bell className='text-muted-foreground mb-2 h-12 w-12' />
              <p className='text-muted-foreground text-sm'>
                No notifications yet
              </p>
            </div>
          ) : (
            <div className='space-y-1 p-2'>
              {notificationsList.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start space-x-3 rounded-lg p-3 transition-colors',
                    notification.isRead
                      ? 'hover:bg-muted/50'
                      : 'bg-primary/5 hover:bg-primary/10 border-primary/20 border'
                  )}
                >
                  <div className='flex-shrink-0 text-lg'>🔔</div>
                  <div className='min-w-0 flex-1'>
                    <p
                      className={cn(
                        'text-sm',
                        notification.isRead
                          ? 'text-muted-foreground'
                          : 'text-foreground font-medium'
                      )}
                    >
                      {notification.message}
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full' />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
