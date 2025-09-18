import { Route, Router as WouterRouter, Switch } from 'wouter';

import { lazy, Suspense } from 'react';
import { paths } from '@src/constants';
import { CatalogEditionModalProvider } from './catalogs/useCatalogEditionModal';

const CorporatePartnerPage = lazy(() => import('@src/partner/CorporatePartnerPage'));
const PartnerCatalogsPage = lazy(() => import('@src/catalogs/PartnerCatalogsPage'));
const CoursesPage = lazy(() => import('@src/courses/CoursesPage'));
const CourseEnrollmentsPage = lazy(() => import('@src/enrollments/CourseEnrollmentsPage'));

const Router = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CatalogEditionModalProvider>
      <WouterRouter base={paths.base}>
        <Switch>
          <Route path={paths.partners.path} component={CorporatePartnerPage} />
          <Route path={paths.catalogs.path} component={PartnerCatalogsPage} />
          <Route path={paths.courses.path} component={CoursesPage} />
          <Route path={paths.courseDetail.path} component={CourseEnrollmentsPage} />
          <Route>
            <h1>404 Not Found</h1>
          </Route>
        </Switch>
      </WouterRouter>
    </CatalogEditionModalProvider>
  </Suspense>
);

export default Router;
