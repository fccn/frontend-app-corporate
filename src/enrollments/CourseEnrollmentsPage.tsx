import { useParams } from 'wouter';
import { useIntl } from '@edx/frontend-platform/i18n';
import { usePartnerDetails } from '@src/partner/hooks';
import HeaderDescription from '@src/app/HeaderDescription';
import { paths } from '@src/constants';
import { useCourseDetails } from '@src/courses/hooks';
import AppLayout from '../app/AppLayout';
import CourseEnrollmentsList from './components/CourseEnrollmentsList';
import messages from './messages';

const CourseEnrollmentsPage = () => {
  const intl = useIntl();
  const { partnerId, catalogId, courseId } = useParams<{ partnerId: string, catalogId: string, courseId: string }>();
  const { partnerDetails } = usePartnerDetails({ partnerId });
  const { courseDetails } = useCourseDetails({ partnerId, catalogId, courseId });

  return (
    <AppLayout withBackButton backPath={paths.courses.buildPath(partnerId, catalogId)}>
      {courseDetails && (
      <HeaderDescription
        context={{
          title: courseDetails.courseRun.displayName,
          imageUrl: partnerDetails?.logo || null,
          description: courseDetails.courseRun.id,
        }}
        info={[
          { title: intl.formatMessage(messages.infoEnrollments), value: courseDetails.enrollments },
          { title: intl.formatMessage(messages.infoCertified), value: courseDetails.certified },
          { title: intl.formatMessage(messages.infoCompletion), value: `${courseDetails.completionRate}%` },
        ]}
      />
      )}
      <CourseEnrollmentsList />
    </AppLayout>
  );
};

export default CourseEnrollmentsPage;
