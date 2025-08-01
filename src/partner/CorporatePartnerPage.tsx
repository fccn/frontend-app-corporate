import { useIntl } from '@edx/frontend-platform/i18n';
import AppLayout from '../app/AppLayout';
import CorpotatePartnerList from './components/CorporatePartnerList';
import messages from './messages';

const CorpotatePartnerPage = () => {
  const intl = useIntl();
  return (
    <AppLayout title={intl.formatMessage(messages.titleCorporatePage)}>
      <CorpotatePartnerList />
    </AppLayout>
  );
};

export default CorpotatePartnerPage;
