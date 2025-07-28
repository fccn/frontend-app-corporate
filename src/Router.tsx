import { Route } from 'wouter';
import AppLayout from './app/AppLayout';

const Component = () => <AppLayout title="Corporate Partner"><div>testing</div></AppLayout>;
const Router = () => <Route component={Component} />;

export default Router;
