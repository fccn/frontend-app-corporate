import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import CourseDetailPage from './CourseDetailPage';

jest.mock('wouter', () => ({
  useParams: () => ({
    catalogSlug: 'test-catalog',
    courseId: 'course-1',
  }),
  useLocation: () => ['/', jest.fn()],
}));

jest.mock('@src/catalogs/data/hooks', () => ({
  useCatalogDetails: () => ({
    catalogDetails: { id: 'catalog-1' },
  }),
}));

jest.mock('./data/hooks', () => ({
  useCatalogCourseDetails: () => ({
    data: {
      courseRun: {
        id: 'course-1',
        displayName: 'Test Course',
        courseImageUrl: '/image.png',
      },
      enrollments: 20,
      certified: 4,
      completionRate: 50,
    },
  }),
  useCourseLearnersStatus: () => ({
    isLoading: false,
    data: {
      count: 2,
      numPages: 1,
      results: [
        {
          user: {
            fullName: 'Test User',
            email: 'test@example.com',
          },
          completedAssessments: 3,
          assessmentsToComplete: 2,
          progress: 75,
          hasCertificate: false,
        },
      ],
    },
  }),
}));

describe('CourseDetailPage', () => {
  it('renders course header and learner list', () => {
    renderWrapper(<CourseDetailPage />);

    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});
