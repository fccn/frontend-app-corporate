import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from '@edx/frontend-platform/i18n';

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
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        {children}
      </IntlProvider>
    </QueryClientProvider>,
  );
};

class ResizeObserver {
  observe() { }

  unobserve() { }

  disconnect() { }
}

global.ResizeObserver = ResizeObserver;
