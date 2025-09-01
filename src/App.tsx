import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@edx/frontend-platform/react';
import Router from './Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60_000, // If cache is up to one hour old, no need to re-fetch
    },
  },
});

const App = () => (
  <AppProvider wrapWithRouter={false}>
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </AppProvider>
);

export default App;
