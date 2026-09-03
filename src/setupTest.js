import '@testing-library/jest-dom';
import { mergeConfig } from '@edx/frontend-platform';
import { render, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { NotificationProvider } from './notification';

// ---------------------------------------------------------------------------
// Targeted console noise suppression
// These are known third-party warnings that cannot be fixed at the source:
//   • Paragon function components still use defaultProps (React 18 deprecation)
//   • react-bootstrap uses findDOMNode internally
//   • React Router v6 future-flag warnings surfaced by AppProvider
// ---------------------------------------------------------------------------
/* eslint-disable no-console */
const origConsoleError = console.error.bind(console);
const origConsoleWarn = console.warn.bind(console);

console.error = (...args) => {
  const msg = String(args[0] ?? '');
  if (
    msg.includes('Support for defaultProps will be removed from function components')
    || msg.includes('findDOMNode is deprecated')
    || msg.includes('forwardRef render functions do not support propTypes or defaultProps')
  ) {
    return;
  }
  origConsoleError(...args);
};

console.warn = (...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('React Router Future Flag Warning')) {
    return;
  }
  origConsoleWarn(...args);
};
/* eslint-enable no-console */

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

export const renderHookWrapper = (hook) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </QueryClientProvider>
      </IntlProvider>
    ),
  });
};

mergeConfig({
  LEARNING_PATHS_MFE_URL: process.env.LEARNING_PATHS_MFE_URL || null,
  PUBLIC_PATH: process.env.PUBLIC_PATH || '/',
  LMS_BASE_URL: process.env.LMS_BASE_URL || 'http://localhost:8000',
  BASE_URL: process.env.LMS_BASE_URL || 'http://apps.localhost:8080',
  // Required by @edx/frontend-platform Auth service (silences LOGIN_URL warnings)
  LOGIN_URL: process.env.LOGIN_URL || 'http://localhost:8000/login',
  LOGOUT_URL: process.env.LOGOUT_URL || 'http://localhost:8000/logout',
  REFRESH_ACCESS_TOKEN_ENDPOINT: process.env.REFRESH_ACCESS_TOKEN_ENDPOINT || 'http://localhost:8000/login_refresh',
  ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME || 'edx-jwt-cookie-header-payload',
  CSRF_TOKEN_API_PATH: process.env.CSRF_TOKEN_API_PATH || '/csrf/api/v1/token',
}, 'CorporateManagerConfig');

// Mock ResizeObserver

class ResizeObserver {
  observe() { }

  unobserve() { }

  disconnect() { }
}

global.ResizeObserver = ResizeObserver;
