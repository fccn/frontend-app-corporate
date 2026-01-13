import {
  createContext, useContext, useMemo, useState,
} from 'react';
import { Toast } from '@openedx/paragon';

type ToastType = 'success' | 'error';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  visible: boolean;
}
const NotificationContext = createContext<{
  showNotification:(message: string, type?: ToastType) => void;
} | null>(null);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [counter, setCounter] = useState(0);

  const notificationValue = useMemo(() => ({
    showNotification: (message: string, type: ToastType = 'success') => {
      setCounter(prev => prev + 1);
      const id = `notification-${Date.now()}-${counter}`;
      setToasts(prev => [...prev, {
        id, message, type, visible: true,
      }]);
    },
  }), [counter]);

  const closeToast = (id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, visible: false } : t)));

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000); // Match the Toast hide animation duration
  };

  return (
    <NotificationContext.Provider value={notificationValue}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          show={toast.visible}
          onClose={() => closeToast(toast.id)}
        >
          {toast.message}
        </Toast>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): { showNotification: (message: string, type?: 'success' | 'error') => void } => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
