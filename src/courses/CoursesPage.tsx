import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import AppLayout from '../app/AppLayout';
import CoursesList from './CoursesList';
import PageHeader from '@src/app/PageHeader';



const CoursesPage = () => {
  const intl = useIntl();
  const { catalogId } = useParams<{ catalogId?: string }>();
  const queryClient = useQueryClient();
  const courseContext = queryClient.getQueryData(['catalogs', catalogId]);
  
  return (
    <AppLayout>
      <PageHeader
        title={'courseContext.name'}
        subtitle={'courseContext.name'}
        imageUrl={'courseContext.logo'}
        stats={[
          { title: intl.formatMessage({ id: 'courses.page.totalCourses', defaultMessage: 'Courses' }), value: '50' },
          { title: intl.formatMessage({ id: 'courses.page.enrolledEmployees', defaultMessage: 'Enrollments' }), value: '10,000+' },
          { title: intl.formatMessage({ id: 'courses.page.totalCourses', defaultMessage: 'Certified Students' }), value: '50' },
          { title: intl.formatMessage({ id: 'courses.page.enrolledEmployees', defaultMessage: 'Completion Rate' }), value: '10,000+' },
        ]}
        actions={
          <button className="btn btn-primary">
            {intl.formatMessage({ id: 'courses.page.addCourse', defaultMessage: 'Add New Course' })}
          </button>
        }
      />
      <CoursesList catalog={catalogId}/>
    </AppLayout>
  );
};

export default CoursesPage;
