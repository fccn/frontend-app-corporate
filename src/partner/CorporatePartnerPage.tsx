import { useIntl } from '@edx/frontend-platform/i18n';
import AppLayout from '../components/AppLayout';
import CorpotatePartnerList from './components/CorporatePartnerList';
import messages from './messages';

const CorpotatePartnerPage = () => {
  const intl = useIntl();
  return (
    <AppLayout title={intl.formatMessage(messages['corporate.partner.page.title'])}>
      <CorpotatePartnerList />
    </AppLayout>
  );
};

export default CorpotatePartnerPage;
