import { Route, Router as WouterRouter, Switch } from 'wouter';

import { lazy, Suspense } from 'react';
import { paths } from '@src/constants';

const CorporatePartnerPage = lazy(() => import('@src/partner/CorporatePartnerPage'));

const Router = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <WouterRouter base={paths.base}>
      <Switch>
        <Route path={paths.partners.path} component={CorporatePartnerPage} />

        <Route path={paths.catalogs.path}>
          <h1>Catalogs</h1>
        </Route>
        <Route path={paths.courses.path}>
          <h1>List of Courses</h1>
        </Route>
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
