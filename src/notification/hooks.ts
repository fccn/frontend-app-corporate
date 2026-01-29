import { useContext } from 'react';
import { NotificationContext } from './NotificationProvider';

export const useNotification = (): { showNotification: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void } => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
