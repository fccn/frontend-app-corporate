import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch } from 'wouter';
import { AppProvider } from '@edx/frontend-platform/react';

import { paths, STALE_TIME } from './constants';
import { useCurrentUser } from './hooks';
import Loader from './components/Loader';
import ErrorPage from './components/ErrorPage';
import { NotificationProvider } from './notification';

const CorporatePartnerPage = lazy(() => import('@src/partner/CorporatePartnerPage'));
const CatalogsPage = lazy(() => import('@src/catalogs/CatalogsPage'));
const CoursesPage = lazy(() => import('@src/catalogs/CatalogDetailPage'));
const CourseDetailPage = lazy(() => import('@src/catalogs/CourseDetailPage'));

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
    return <ErrorPage status={403} />;
  }

  return (
    <WouterRouter base={paths.base}>
      <Switch>
        <Route path={paths.partners.path} component={CorporatePartnerPage} />
        <Route path={paths.catalogs.path} component={CatalogsPage} />
        <Route path={paths.courses.path} component={CoursesPage} />
        <Route path={paths.courseDetail.path} component={CourseDetailPage} />
        <Route path={paths.notFound.path}>
          <ErrorPage status={404} />
        </Route>
        <Route>
          <ErrorPage status={404} />
        </Route>
      </Switch>
    </WouterRouter>
  );
};

const App = () => (
  <AppProvider wrapWithRouter={false}>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Suspense fallback={<Loader fullPage />}>
          <Router />
        </Suspense>
      </NotificationProvider>
    </QueryClientProvider>
  </AppProvider>
);

export default App;
