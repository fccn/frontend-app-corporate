import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';

import AppLayout from '@src/components/AppLayout';
import { usePartnerDetails } from '@src/partner/data/hooks';
import HeaderDescription from '@src/components/HeaderDescription';

import CatalogsList from './components/CatalogsList';
import messages from './messages';

const PartnerCatalogsPage = () => {
  const intl = useIntl();

  const { partnerSlug } = useParams<{ partnerSlug: string }>();

  const { data: partnerDetails } = usePartnerDetails({ partnerSlug });

  return (
    <AppLayout withBackButton backPath="/">
      {partnerDetails && (
        <>
          <HeaderDescription
            context={{
              title: partnerDetails.name,
              imageUrl: partnerDetails.logo,
            }}
            info={[
              { title: intl.formatMessage(messages['corporate.catalog.header.info.name']), value: partnerDetails.catalogs },
              { title: intl.formatMessage(messages['corporate.catalog.header.info.courses']), value: partnerDetails.courses },
              { title: intl.formatMessage(messages['corporate.catalog.header.info.enrollments']), value: partnerDetails.enrollments },
              { title: intl.formatMessage(messages['corporate.catalog.header.info.certified']), value: partnerDetails.certified },
            ]}
          />

          <CatalogsList partnerId={partnerDetails.id} partnerSlug={partnerSlug} />
        </>
      )}
    </AppLayout>
  );
};

export default PartnerCatalogsPage;
