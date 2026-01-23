import {
  createContext, useContext, useMemo, useState,
} from 'react';
import { Toast } from '@openedx/paragon';

type ToastType = 'success' | 'error' | 'info';


interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  visible: boolean;
  duration?: number;
}
const NotificationContext = createContext<{
  showNotification: (message: string, type?: ToastType, duration?: number) => void;
} | null>(null);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [counter, setCounter] = useState(0);

  const notificationValue = useMemo(() => ({
    showNotification: (message: string, type: ToastType = 'success', duration?: number) => {
      setCounter(prev => prev + 1);
      const id = `notification-${Date.now()}-${counter}`;
      setToasts(prev => [...prev, {
        id, message, type, visible: true, duration,
      }]);
    },
  }), [counter]);

  const closeToast = (id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, visible: false } : t)));

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000); // Wait for animation to finish before removing from DOM
  };

  return (
    <NotificationContext.Provider value={notificationValue}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          show={toast.visible}
          onClose={() => closeToast(toast.id)}
          delay={toast.duration ?? 4000}
        >
          {toast.message}
        </Toast>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): { showNotification: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void } => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
