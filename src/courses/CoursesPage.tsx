import { useIntl } from '@edx/frontend-platform/i18n';
import AppLayout from '../app/AppLayout';
import CoursesList from './CoursesList';
import PageHeader from '@src/app/PageHeader';



const CoursesPage = () => {
  const intl = useIntl();
  return (
    <AppLayout>
      <PageHeader
        context={intl.formatMessage({ id: 'courses.page.context', defaultMessage: 'Corporate Training Courses' })}
        title={intl.formatMessage({ id: 'courses.page.title', defaultMessage: 'Corporate Training Courses' })}
        subtitle={intl.formatMessage({ id: 'courses.page.subtitle', defaultMessage: 'Explore our range of corporate training courses designed to enhance employee skills and productivity.' })}
        imageUrl="https://corporatetraining.com/assets/images/courses-header.jpg"
        stats={[
          { title: intl.formatMessage({ id: 'courses.page.totalCourses', defaultMessage: 'Total Courses' }), value: '50' },
          { title: intl.formatMessage({ id: 'courses.page.enrolledEmployees', defaultMessage: 'Enrolled Employees' }), value: '10,000+' },
        ]}
        actions={
          <button className="btn btn-primary">
            {intl.formatMessage({ id: 'courses.page.addCourse', defaultMessage: 'Add New Course' })}
          </button>
        }
      />
      <CoursesList />
    </AppLayout>
  );
};

export default CoursesPage;
