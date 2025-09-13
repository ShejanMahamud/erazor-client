import { Notification } from '@/types/notification';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

// Define the actual API response structure
interface NotificationApiResponse {
  success: boolean;
  message: string;
  data: Notification[];
  meta?: {
    nextCursor?: string;
    limit: number;
    count: number;
    hasNextPage: boolean;
  };
}

let socket: Socket;
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Initial load from DB
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4545/v1/api';
    const fullUrl = `${apiUrl}/notifications/${userId}`;

    axios
      .get<NotificationApiResponse>(fullUrl)
      .then((res) => {
        const notifications = res.data?.data || [];
        const data = Array.isArray(notifications) ? notifications : [];
        setNotifications(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('❌ Failed to fetch notifications from:', fullUrl, error);
        setNotifications([]);
        setError('Failed to load notifications');
        setIsLoading(false);
      });

    // WebSocket connection
    // Connect to backend (adjust URL)
    const wsUrl =
      process.env.NEXT_PUBLIC_NOTIFICATIONS_WS_URL ||
      'http://localhost:4545/notifications';
    socket = io(wsUrl, {
      transports: ['websocket']
    });

    // Join user-specific room
    socket.emit('join', userId);

    socket.on('connect', () => {
      console.log('✅ Connected to notifications WS:', socket.id);
    });

    socket.on('new-notification', (data: Notification) => {
      if (data && typeof data === 'object') {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return () => {
      socket.off('new-notification');
      socket.off('connect');
      socket.disconnect();
      console.log('❌ Disconnected from notifications WS');
    };
  }, [userId]);

  return { notifications, setNotifications, isLoading, error };
}
