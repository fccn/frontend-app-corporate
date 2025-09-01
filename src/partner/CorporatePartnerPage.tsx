import { useIntl } from '@edx/frontend-platform/i18n';
import AppLayout from '../app/AppLayout';
import CorporatePartnerList from './components/CorporatePartnerList';
import messages from './messages';

const CorpotatePartnerPage = () => {
  const intl = useIntl();
  return (
    <AppLayout title={intl.formatMessage(messages.titleCorporatePage)}>
      <CorporatePartnerList />
    </AppLayout>
  );
};

export default CorpotatePartnerPage;
