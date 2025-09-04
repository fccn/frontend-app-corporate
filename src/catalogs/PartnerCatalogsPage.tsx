import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';

import AppLayout from '@src/app/AppLayout';
import { usePartnerDetails } from '@src/partner/hooks';
import HeaderDescription from '@src/app/HeaderDescription';

import CatalogsList from './components/CatalogsList';
import messages from './messages';

const PartnerCatalogsPage = () => {
  const intl = useIntl();

  const { partnerId } = useParams<{ partnerId: string }>();

  const { partnerDetails } = usePartnerDetails({ partnerId });

  return (
    <AppLayout withBackButton backPath="/">
      {partnerDetails && (
      <HeaderDescription
        context={{
          title: partnerDetails.name,
          imageUrl: partnerDetails.logo,
        }}
        info={[
          { title: intl.formatMessage(messages.infoCatalog), value: partnerDetails.catalogs },
          { title: intl.formatMessage(messages.headerCourses), value: partnerDetails.courses },
          { title: intl.formatMessage(messages.headerEnrollments), value: partnerDetails.enrollments },
          { title: intl.formatMessage(messages.headerCertified), value: partnerDetails.certified },
        ]}
      />
      )}

      <CatalogsList partnerId={partnerId} />
    </AppLayout>
  );
};

export default PartnerCatalogsPage;
