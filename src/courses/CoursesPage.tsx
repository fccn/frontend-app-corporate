import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import HeaderDescription from '@src/components/HeaderDescription';
import { useCatalogDetails } from '@src/catalogs/data/hooks';
import { usePartnerDetails } from '@src/partner/data/hooks';
import { IconButton, Tab, Tabs } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { paths } from '@src/constants';
import { CatalogSettingsModal } from '@src/catalogs/components/CatalogSettingsModal';
import CoursesList from './components/CoursesList';
import AppLayout from '../components/AppLayout';

import messages from './messages';

const CoursesPage = () => {
  const intl = useIntl();
  const { partnerId, catalogId } = useParams<{ partnerId: number, catalogId: string }>();
  const { catalogDetails } = useCatalogDetails({ partnerId, catalogId });
  const { partnerDetails } = usePartnerDetails({ partnerId });

  return (
    <AppLayout withBackButton backPath={paths.catalogs.buildPath(partnerId)}>
      {catalogDetails
        && (
          <HeaderDescription
            context={{
              title: catalogDetails?.name,
              imageUrl: partnerDetails?.logo || null,
              description: catalogDetails?.alternativeLink,
              copyableDescription: true,
            }}
            info={[
              { title: intl.formatMessage(messages['corporate.courses.page.totalCourses']), value: catalogDetails?.courses },
              { title: intl.formatMessage(messages['corporate.courses.page.enrolledUsers']), value: catalogDetails?.enrollments },
              { title: intl.formatMessage(messages['corporate.courses.page.certifiedUsers']), value: catalogDetails?.certified },
              { title: intl.formatMessage(messages['corporate.courses.page.completionRate']), value: catalogDetails?.completionRate },
            ]}
          >
            <CatalogSettingsModal>
              {(openModal) => (
                <IconButton src={Settings} alt="edit catalog" onClick={() => openModal(catalogId, partnerId)} />
              )}
            </CatalogSettingsModal>
          </HeaderDescription>
        )}
      <Tabs defaultActiveKey="courses">
        <Tab eventKey="courses" title={intl.formatMessage(messages['corporate.courses.page.tab.courses'])}>
          <CoursesList catalogId={catalogId} partnerId={partnerId} />
        </Tab>
        <Tab eventKey="learners" title={intl.formatMessage(messages['corporate.courses.page.tab.learners'])} />
      </Tabs>
    </AppLayout>
  );
};

export default CoursesPage;
