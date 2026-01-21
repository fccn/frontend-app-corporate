import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import CourseLearnerList from './CourseLearnerList';
import * as hooks from '../data/hooks';

jest.mock('@src/hooks', () => ({
  usePagination: () => ({
    pageIndex: 0,
    pageSize: 10,
    onPaginationChange: jest.fn(),
  }),
  useTableSortFilter: () => ({
    ordering: '',
    searchParams: {},
    fetchData: jest.fn(),
  }),
}));

jest.mock('../data/hooks', () => ({
  useCourseLearnersStatus: jest.fn().mockReturnValue({
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
          progress: 50,
          hasCertificate: false,
        },
        {
          user: {
            fullName: 'Admin User',
            email: 'admin@example.com',
          },
          completedAssessments: 5,
          assessmentsToComplete: 0,
          progress: 100,
          hasCertificate: true,
        },
      ],
    },
  }),
}));

const mockUseCourseLearnersStatus = hooks.useCourseLearnersStatus as jest.Mock;

describe('CourseLearnerList', () => {
  it('renders learner rows', () => {
    renderWrapper(<CourseLearnerList catalogId="1" courseId="2" />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('renders certificate status correctly', () => {
    renderWrapper(<CourseLearnerList catalogId="1" courseId="2" />);

    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('shows empty table message', () => {
    mockUseCourseLearnersStatus.mockReturnValue({
      isLoading: false,
      data: {
        count: 0,
        numPages: 0,
        results: [],
      },
    });
    renderWrapper(<CourseLearnerList catalogId="1" courseId="2" />);

    expect(
      screen.getByText(/no learners/i),
    ).toBeInTheDocument();
  });
});
