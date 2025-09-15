import { Route, Router as WouterRouter, Switch } from 'wouter';

import { lazy, Suspense } from 'react';
import { paths } from '@src/constants';
import { CatalogEditionModalProvider } from './catalogs/useCatalogEditionModal';

const CorporatePartnerPage = lazy(() => import('@src/partner/CorporatePartnerPage'));
const PartnerCatalogsPage = lazy(() => import('@src/catalogs/PartnerCatalogsPage'));
const CoursesPage = lazy(() => import('@src/courses/CoursesPage'));

const Router = () => (
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
);

export default Router;
