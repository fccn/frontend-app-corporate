import AppLayout from '../app/AppLayout';
import CatalogsList from './components/CatalogsList';

const PartnerCatalogsPage = () => (
  <AppLayout withBackButton backPath="/">
    <CatalogsList />
  </AppLayout>
);

export default PartnerCatalogsPage;
