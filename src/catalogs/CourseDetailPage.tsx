import { useEffect } from 'react';
import { useParams } from 'wouter';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useCurrentUser, useNavigate } from '@src/hooks';
import { paths } from '@src/constants';

import HeaderDescription from '@src/components/HeaderDescription';
import { Tab, Tabs } from '@openedx/paragon';
import { useCatalogDetails, useCatalogCourseDetails } from './data/hooks';
import AppLayout from '../components/AppLayout';
import { CourseLearnerList } from './course-detail';

import messages from './messages';
import AnalyticsTab from './analytics-tab';

const CourseDetailPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { partnerSlug, catalogSlug, courseId } = useParams<{
    partnerSlug: string | undefined
    catalogSlug: string | undefined
    courseId: string | undefined
  }>();
  const { data: catalogDetails } = useCatalogDetails({ catalogSlug: catalogSlug! });
  const { data: courseDetails } = useCatalogCourseDetails(catalogDetails?.id || '', courseId || '');
  const { isAdmin } = useCurrentUser();

  useEffect(() => {
    if (catalogDetails === null || courseDetails === null) {
      navigate(paths.notFound.path);
    }
  }, [catalogDetails, courseDetails, navigate]);

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
                { title: intl.formatMessage(messages['corporate.catalog.header.info.enrollments']), value: courseDetails.enrollments },
                { title: intl.formatMessage(messages['corporate.catalog.header.info.certified']), value: courseDetails.certified },
                { title: intl.formatMessage(messages['corporate.catalog.header.info.completionRate']), value: `${courseDetails.completionRate}%` },
              ]}
            />
            <Tabs defaultActiveKey="learners">
              <Tab eventKey="learners" title={intl.formatMessage(messages['corporate.catalog.detail.page.tab.learners'])} alt="Learners Tab">
                <CourseLearnerList catalogId={catalogDetails?.id || ''} courseId={courseDetails.courseRun.id} />
              </Tab>
              {isAdmin && (
              <Tab eventKey="analytics" title={intl.formatMessage(messages['corporate.courses.page.tab.analytics'])} alt="Analytics Tab">
                <AnalyticsTab />
              </Tab>
              )}
            </Tabs>
          </>
        )}
    </AppLayout>
  );
};

export default CourseDetailPage;
