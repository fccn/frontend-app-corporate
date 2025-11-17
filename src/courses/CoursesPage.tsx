import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import HeaderDescription from '@src/components/HeaderDescription';
import { useCatalogDetails } from '@src/catalogs/hooks';
import { usePartnerDetails } from '@src/partner/hooks';
import { IconButton, Tab, Tabs } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { paths } from '@src/constants';
import { useCatalogSettingsModal } from '@src/catalogs/components/CatalogSettingsModal';
import CoursesList from './components/CoursesList';
import AppLayout from '../components/AppLayout';

const CoursesPage = () => {
  const intl = useIntl();
  const { partnerId, catalogId } = useParams<{ partnerId: string, catalogId: string }>();
  const { catalogDetails } = useCatalogDetails({ partnerId, selectedCatalog: catalogId });
  const { partnerDetails } = usePartnerDetails({ partnerId });
  const { handleChangeSelectedCatalog } = useCatalogSettingsModal();

  return (
    <AppLayout withBackButton backPath={paths.catalogs.buildPath(partnerId)}>
      {catalogDetails
        && (
          <HeaderDescription
            context={{
              title: catalogDetails?.name,
              imageUrl: partnerDetails?.logo || null,
              description: catalogDetails?.catalogAlternativeLink,
              copyableDescription: true,
            }}
            info={[
              { title: intl.formatMessage({ id: 'courses.page.totalCourses', defaultMessage: 'Courses' }), value: catalogDetails?.courses },
              { title: intl.formatMessage({ id: 'courses.page.enrolledEmployees', defaultMessage: 'Enrollments' }), value: catalogDetails?.enrollments },
              { title: intl.formatMessage({ id: 'courses.page.totalCourses', defaultMessage: 'Certified Students' }), value: catalogDetails?.certified },
              { title: intl.formatMessage({ id: 'courses.page.enrolledEmployees', defaultMessage: 'Completion Rate' }), value: catalogDetails?.completionRate },
            ]}
          >
            <IconButton src={Settings} alt="edit catalog" onClick={() => handleChangeSelectedCatalog(catalogId)} />
          </HeaderDescription>
        )}
      <Tabs  defaultActiveKey="courses">
        <Tab eventKey="courses" title={intl.formatMessage({ id: 'courses.page.tab.courses', defaultMessage: 'Courses' })}>
          <CoursesList catalogId={catalogId} partnerId={partnerId} />
        </Tab>
        <Tab eventKey="learners" title={intl.formatMessage({ id: 'courses.page.tab.learners', defaultMessage: 'Learners' })}>

        </Tab>
      </Tabs>
    </AppLayout>
  );
};

export default CoursesPage;
