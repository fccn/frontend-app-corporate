import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';

import AppLayout from '@src/components/AppLayout';
import { usePartnerDetails } from '@src/partner/data/hooks';
import HeaderDescription from '@src/components/HeaderDescription';

import { useNavigate } from '@src/hooks';
import { paths } from '@src/constants';
import { useEffect } from 'react';
import messages from './messages';
import CatalogsList from './components/CatalogsList';

const PartnerCatalogsPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const { partnerSlug } = useParams<{ partnerSlug: string }>();

  const { data: partnerDetails } = usePartnerDetails({ partnerSlug });

  useEffect(() => {
    if (partnerDetails === null) {
      navigate(paths.notFound.path);
    }
  }, [partnerDetails, navigate]);

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
