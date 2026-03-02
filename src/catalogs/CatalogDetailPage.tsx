import { useEffect } from 'react';
import { useParams } from 'wouter';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate } from '@src/hooks';
import { useCatalogDetails } from '@src/catalogs/data/hooks';
import { usePartnerDetails } from '@src/partner/data/hooks';
import HeaderDescription from '@src/components/HeaderDescription';
import { IconButton, Tab, Tabs } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { paths } from '@src/constants';
import AppLayout from '@src/components/AppLayout';
import { CatalogSettingsModal } from './catalog-settings';
import { LearnerList } from './learner-list';
import { EnrollmentList } from './enrollment-list';
import { CourseList } from './course-list';

import messages from './messages';
import AnalyticsTab from './analytics-tab';

const CatalogDetailPage = () => {
  const intl = useIntl();
  const { administrator } = getAuthenticatedUser();
  const navigate = useNavigate();
  const { partnerSlug, catalogSlug } = useParams<{
    partnerSlug: string,
    catalogSlug: string
  }>();
  const { data: partnerDetails } = usePartnerDetails({ partnerSlug });
  const { data: catalogDetails } = useCatalogDetails({ catalogSlug });

  useEffect(() => {
    if (partnerDetails === null || catalogDetails === null) {
      navigate(paths.notFound.path);
    }
  }, [partnerDetails, catalogDetails, navigate]);

  return (
    <AppLayout withBackButton backPath={paths.catalogs.buildPath(partnerSlug)}>
      {catalogDetails
        && (
          <>
            <HeaderDescription
              context={{
                title: catalogDetails.name,
                imageUrl: catalogDetails.image || null,
                description: catalogDetails.alternativeLink || `${getConfig().LEARNING_PATHS_MFE_URL}/${partnerDetails?.slug}/catalog/${catalogDetails?.slug}`,
                copyableDescription: true,
              }}
              info={[
                { title: intl.formatMessage(messages['corporate.catalog.header.info.seats']), value: `${catalogDetails.userLimit - catalogDetails.activeLearners} / ${catalogDetails.userLimit}` },
                { title: intl.formatMessage(messages['corporate.catalog.header.info.learners']), value: catalogDetails.totalLearners },
                { title: intl.formatMessage(messages['corporate.catalog.header.info.courses']), value: catalogDetails.courses },
                { title: intl.formatMessage(messages['corporate.catalog.header.info.enrollments']), value: catalogDetails.enrollments },
                { title: intl.formatMessage(messages['corporate.catalog.header.info.certified']), value: catalogDetails.certified },
                { title: intl.formatMessage(messages['corporate.catalog.header.info.completionRate']), value: `${catalogDetails.completionRate}%` },
              ]}
            >
              <CatalogSettingsModal>
                {(openModal) => (
                  <IconButton src={Settings} alt="edit catalog" onClick={() => openModal(catalogDetails.slug)} />
                )}
              </CatalogSettingsModal>
            </HeaderDescription>
            <Tabs defaultActiveKey="courses">
              <Tab eventKey="courses" title={intl.formatMessage(messages['corporate.catalog.detail.page.tab.courses'])} alt="Courses Tab">
                <CourseList catalogId={catalogDetails.id} catalogName={catalogDetails.name} />
              </Tab>
              <Tab eventKey="learners" title={intl.formatMessage(messages['corporate.catalog.detail.page.tab.learners'])} alt="Learners Tab">
                <LearnerList catalogId={catalogDetails.id} catalogName={catalogDetails.name} />
              </Tab>
              <Tab eventKey="enrollments" title={intl.formatMessage(messages['corporate.catalog.detail.page.tab.enrollments'])} alt="Enrollments Tab">
                <EnrollmentList catalogId={catalogDetails.id} />
              </Tab>
              {administrator && (
              <Tab eventKey="analytics" title={intl.formatMessage(messages['corporate.courses.page.tab.analytics'])} alt="Analytics Tab">
                <AnalyticsTab catalogId={catalogDetails.id} />
              </Tab>
              )}
            </Tabs>
          </>
        )}
    </AppLayout>
  );
};

export default CatalogDetailPage;
