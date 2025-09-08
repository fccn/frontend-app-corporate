import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import AppLayout from '../app/AppLayout';
import CoursesList from './CoursesList';
import HeaderDescription from '@src/app/HeaderDescription';
import { useCatalogDetails } from '@src/catalogs/hooks';
import { IconButton } from '@openedx/paragon';
import { LmsEditSquare } from '@openedx/paragon/icons';

const CoursesPage = () => {
  const intl = useIntl();
  const { partnerId, catalogId } = useParams();
  const { catalogDetails } = useCatalogDetails({ partnerId: partnerId, catalogId: catalogId });

  return (
    <AppLayout>
      <HeaderDescription
        context={{
          title: catalogDetails?.name,
          imageUrl: catalogDetails?.image,
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
        <IconButton src={LmsEditSquare} alt='edit catalog'/>
      </HeaderDescription>
      <CoursesList catalogId={catalogId} partnerId={partnerId} />
    </AppLayout>
  );
};

export default CoursesPage;
