import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch } from 'wouter';
import { AppProvider } from '@edx/frontend-platform/react';
import { CatalogSettingsModalProvider } from './catalogs/components/CatalogSettingsModal';

import { paths, STALE_TIME } from './constants';
import { useCurrentUser } from './hooks';

const CorporatePartnerPage = lazy(() => import('@src/partner/CorporatePartnerPage'));
const PartnerCatalogsPage = lazy(() => import('@src/catalogs/PartnerCatalogsPage'));
const CoursesPage = lazy(() => import('@src/courses/CoursesPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
    },
  },
});

const Router = () => {
  const { isAdmin, isCatalogManager } = useCurrentUser();

  if (!isAdmin && !isCatalogManager) {
    return <h1>Access Denied</h1>;
  }

  return (
    <WouterRouter base={paths.base}>
      <Switch>
        <Route path={paths.partners.path} component={CorporatePartnerPage} />
        <Route path={paths.catalogs.path}>
          <CatalogSettingsModalProvider><PartnerCatalogsPage /></CatalogSettingsModalProvider>
        </Route>
        <Route path={paths.courses.path}>
          <CatalogSettingsModalProvider><CoursesPage /></CatalogSettingsModalProvider>
        </Route>
        <Route path={paths.courseDetail.path}>
          <h1>Course Details</h1>
        </Route>
        <Route>
          <h1>404 Not Found</h1>
        </Route>
      </Switch>
    </WouterRouter>
  );
};

const App = () => (
  <AppProvider wrapWithRouter={false}>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <Router />
      </Suspense>
    </QueryClientProvider>
  </AppProvider>
);

export default App;
