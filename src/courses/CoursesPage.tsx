import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import AppLayout from '../app/AppLayout';
import CoursesList from './CoursesList';
import HeaderDescription from '@src/app/HeaderDescription';
import { useCatalogDetails } from '@src/catalogs/hooks';
import { Icon, IconButton } from '@openedx/paragon';
import { ContentCopy, LmsEditSquare } from '@openedx/paragon/icons';


const DescriptionWithCopy = ({ value }: { value?: string }) => {
  const intl = useIntl();

  if (!value) return null;

  const handleCopy = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(value);
      }
    } catch (err) { 
      // Todo: handle error (e.g., show a notification)
    }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ wordBreak: 'break-all' }}>{value}</span>
      <button
        type="button"
        className="btn btn-link btn-sm p-0"
        title={intl.formatMessage({ id: 'courses.page.copyLink', defaultMessage: 'Copy link' })}
        onClick={handleCopy}
        style={{ marginLeft: 4 }}
      >
        <Icon src={ContentCopy} size="xs" />
      </button>
    </div>
  );
};

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
          description: <DescriptionWithCopy value={catalogDetails?.catalogAlternativeLink} />,
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
