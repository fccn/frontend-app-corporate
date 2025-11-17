import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch } from 'wouter';
import { AppProvider } from '@edx/frontend-platform/react';
import { CatalogEditionModalProvider } from './catalogs/useCatalogEditionModal';

import { paths, STALE_TIME } from './constants';

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

const App = () => (
  <AppProvider wrapWithRouter={false}>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
          <WouterRouter base={paths.base}>
            <Switch>
              <Route path={paths.partners.path} component={CorporatePartnerPage} />
              <CatalogEditionModalProvider>
                <Route path={paths.catalogs.path} component={PartnerCatalogsPage} />
                <Route path={paths.courses.path} component={CoursesPage} />
              </CatalogEditionModalProvider>
              <Route path={paths.courseDetail.path}>
                <h1>Course Details</h1>
              </Route>
              <Route>
                <h1>404 Not Found</h1>
              </Route>
            </Switch>
          </WouterRouter>
        </Suspense>
    </QueryClientProvider>
  </AppProvider>
);

export default App;
