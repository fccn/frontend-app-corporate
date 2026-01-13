import '@testing-library/jest-dom';
import { mergeConfig } from '@edx/frontend-platform';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import NotificationProvider from './components/NotificationProvider';

export const renderWrapper = (children) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    // eslint-disable-next-line react/jsx-filename-extension
    <IntlProvider locale="en">
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </QueryClientProvider>
    </IntlProvider>,
  );
};

mergeConfig({
  LEARNING_PATHS_MFE_URL: process.env.LEARNING_PATHS_MFE_URL || null,
  PUBLIC_PATH: process.env.PUBLIC_PATH || '/',
  LMS_BASE_URL: process.env.LMS_BASE_URL || 'http://localhost:8000',
}, 'CorporateManagerConfig');

// Mock ResizeObserver

class ResizeObserver {
  observe() { }

  unobserve() { }

  disconnect() { }
}

global.ResizeObserver = ResizeObserver;
