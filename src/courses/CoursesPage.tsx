import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import HeaderDescription from '@src/app/HeaderDescription';
import { useCatalogDetails } from '@src/catalogs/hooks';
import { usePartnerDetails } from '@src/partner/hooks';
import { IconButton } from '@openedx/paragon';
import { LmsEditSquare } from '@openedx/paragon/icons';
import CoursesList from './components/CoursesList';
import AppLayout from '../app/AppLayout';

const CoursesPage = () => {
  const intl = useIntl();
  const { partnerId, catalogId } = useParams<{ partnerId: string, catalogId: string }>();
  const { catalogDetails } = useCatalogDetails({ partnerId, catalogId });
  const { partnerDetails } = usePartnerDetails({ partnerId });

  return (
    <AppLayout>
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

          <IconButton src={LmsEditSquare} alt="edit catalog" />
        </HeaderDescription>
        )}
      <CoursesList catalogId={catalogId} partnerId={partnerId} />
    </AppLayout>
  );
};

export default CoursesPage;
