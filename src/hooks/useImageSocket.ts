import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let imageSocketInstance: Socket | null = null;

export const useImageSocket = (clerkId: string) => {
  const [imageUpdates, setImageUpdates] = useState<any[]>([]);

  const clearImageUpdates = useCallback(() => {
    setImageUpdates([]);
  }, []);

  useEffect(() => {
    if (!clerkId) return;

    // Clean up existing connection if any
    if (imageSocketInstance) {
      imageSocketInstance.disconnect();
    }

    imageSocketInstance = io(
      process.env.NEXT_PUBLIC_IMAGES_WS_URL || 'http://localhost:4545/images',
      {
        transports: ['websocket']
      }
    );

    imageSocketInstance.on('connect', () => {
      console.log(
        '✅ Connected to image socket server:',
        imageSocketInstance?.id
      );
      // Join user-specific room
      imageSocketInstance?.emit('join', clerkId);
    });

    imageSocketInstance.on('connect_error', (error) => {
      console.error('❌ Image socket connection error:', error);
    });

    // Listen for updates
    imageSocketInstance.on('image-status-update', (update) => {
      setImageUpdates((prev) => [...prev, update]);
    });

    return () => {
      if (imageSocketInstance) {
        imageSocketInstance.off('connect');
        imageSocketInstance.off('connect_error');
        imageSocketInstance.off('image-status-update');
        imageSocketInstance.disconnect();
        imageSocketInstance = null;
      }
    };
  }, [clerkId]);

  return { imageUpdates, clearImageUpdates };
};
