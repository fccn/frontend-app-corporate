import { useParams } from 'wouter';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import HeaderDescription from '@src/components/HeaderDescription';
import { useCatalogDetails } from '@src/catalogs/data/hooks';

import AppLayout from '../components/AppLayout';
import { useCatalogCourseDetails } from './data/hooks';
import CourseLernerList from './components/CourseLearnerList';

import messages from './messages';
import { paths } from '@src/constants';

const CourseDetailPage = () => {
  const intl = useIntl();
  const { partnerSlug, catalogSlug, courseId } = useParams<{
    partnerSlug: string | undefined
    catalogSlug: string | undefined
    courseId: string | undefined
  }>();
  const { catalogDetails } = useCatalogDetails({ catalogSlug: catalogSlug! });
  const { data: courseDetails } = useCatalogCourseDetails(catalogDetails?.id || '', courseId || '');

  return (
    <AppLayout withBackButton backPath={paths.courses.buildPath(partnerSlug || '', catalogSlug || '')}>
      {courseDetails
        && (
          <>
            <HeaderDescription
              context={{
                title: courseDetails.courseRun.displayName,
                imageUrl: courseDetails.courseRun.courseImageUrl ? `${getConfig().LMS_BASE_URL}${courseDetails.courseRun.courseImageUrl}` : null,
              }}
              info={[
                { title: intl.formatMessage(messages['corporate.courses.page.enrolledUsers']), value: courseDetails.enrollments },
                { title: intl.formatMessage(messages['corporate.courses.page.certifiedUsers']), value: courseDetails.certified },
                { title: intl.formatMessage(messages['corporate.courses.page.completionRate']), value: `${courseDetails.completionRate}%` },
              ]}
            />

            <CourseLernerList catalogId={catalogDetails?.id || ''} courseId={courseDetails.courseRun.id} />
          </>
        )}
    </AppLayout>
  );
};

export default CourseDetailPage;
