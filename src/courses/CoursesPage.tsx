import { useParams } from 'wouter';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import HeaderDescription from '@src/components/HeaderDescription';
import { useCatalogDetails } from '@src/catalogs/data/hooks';
import { usePartnerDetails } from '@src/partner/data/hooks';
import { IconButton, Tab, Tabs } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { paths } from '@src/constants';
import { CatalogSettingsModal } from '@src/catalogs/components/CatalogSettingsModal';
import LearnerList from '@src/catalogs/components/LearnerList';
import CoursesList from './components/CoursesList';
import AppLayout from '../components/AppLayout';

import messages from './messages';

const CoursesPage = () => {
  const intl = useIntl();
  const { partnerSlug, catalogSlug } = useParams<{
    partnerSlug: string | undefined,
    catalogSlug: string | undefined
  }>();
  const { partnerDetails } = usePartnerDetails({ partnerSlug: partnerSlug! });
  const { catalogDetails } = useCatalogDetails({ catalogSlug: catalogSlug! });

  return (
    <AppLayout withBackButton backPath={paths.catalogs.buildPath(partnerSlug!)}>
      {catalogDetails
        && (
          <HeaderDescription
            context={{
              title: catalogDetails.name,
              imageUrl: catalogDetails.image || null,
              description: catalogDetails.alternativeLink || `${getConfig().CORPORATE_CATALOGS_MFE_URL}/${partnerDetails?.slug}/catalog/${catalogDetails?.slug}`,
              copyableDescription: true,
            }}
            info={[
              { title: intl.formatMessage(messages['corporate.courses.page.seats']), value: `${catalogDetails.userLimit - catalogDetails.activeLearners} / ${catalogDetails.userLimit}` },
              { title: intl.formatMessage(messages['corporate.courses.page.learners']), value: catalogDetails.totalLearners },
              { title: intl.formatMessage(messages['corporate.courses.page.totalCourses']), value: catalogDetails.courses },
              { title: intl.formatMessage(messages['corporate.courses.page.enrolledUsers']), value: catalogDetails.enrollments },
              { title: intl.formatMessage(messages['corporate.courses.page.certifiedUsers']), value: catalogDetails.certified },
              { title: intl.formatMessage(messages['corporate.courses.page.completionRate']), value: `${catalogDetails.completionRate}%` },
            ]}
          >
            <CatalogSettingsModal>
              {(openModal) => (
                <IconButton src={Settings} alt="edit catalog" onClick={() => openModal(catalogDetails.slug)} />
              )}
            </CatalogSettingsModal>
          </HeaderDescription>
        )}
      <Tabs defaultActiveKey="courses">
        <Tab eventKey="courses" title={intl.formatMessage(messages['corporate.courses.page.tab.courses'])} alt="Courses Tab">
          <CoursesList catalogId={catalogDetails?.id} catalogName={catalogDetails?.name} />
        </Tab>
        <Tab eventKey="learners" title={intl.formatMessage(messages['corporate.courses.page.tab.learners'])} alt="Learners Tab">
          <LearnerList catalogId={catalogDetails?.id} partnerId={partnerDetails.id} />
        </Tab>
      </Tabs>
    </AppLayout>
  );
};

export default CoursesPage;
