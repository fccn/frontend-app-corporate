import { screen, within } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import * as hooks from '../data/hooks';
import CoursesList from './CourseList';

jest.mock('@src/hooks', () => ({
  useNavigate: () => jest.fn(),
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

jest.mock('wouter', () => ({
  useParams: () => ({ partnerSlug: 'partner1', catalogSlug: 'catalog1' }),
}));

jest.mock('../data/hooks');

const mockCourses = [
  {
    id: 1,
    courseRun: { id: 'run1', displayName: 'Course 1' },
    position: 1,
    courseDates: '2025-01-01',
    enrollmentDates: '2025-01-01',
    enrollments: 10,
    certified: 5,
    completionRate: 0.5,
  },
  {
    id: 2,
    courseRun: { id: 'run2', displayName: 'Course 2' },
    position: 2,
    courseDates: '2025-02-01',
    enrollmentDates: '2025-02-01',
    enrollments: 20,
    certified: 10,
    completionRate: 0.7,
  },
];

const mockuseCatalogCourses = hooks.useCatalogCourses as jest.Mock;
const mockuseDeleteCatalogCourse = hooks.useDeleteCatalogCourse as jest.Mock;
const mockuseAvailableCourses = hooks.useAvailableCourses as jest.Mock;
const mockuseAddCoursesToCatalog = hooks.useAddCoursesToCatalog as jest.Mock;
const mockuseUpdateCatalogCourse = hooks.useUpdateCatalogCourse as jest.Mock;

describe('CoursesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockuseCatalogCourses.mockReturnValue({
      data: {
        courses: mockCourses,
        count: mockCourses.length,
        pageCount: 1,
      },
      isLoading: false,
    });
    mockuseDeleteCatalogCourse.mockReturnValue(jest.fn());
    mockuseAvailableCourses.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockuseAddCoursesToCatalog.mockReturnValue(jest.fn());
    mockuseUpdateCatalogCourse.mockReturnValue(jest.fn());
  });

  it('renders a table with course data', () => {
    renderWrapper(<CoursesList catalogId="c1" catalogName="Catalog 1" />);
    // Check if course names are rendered
    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
    // Check if enrollments and certified data are rendered in the correct row
    const course1Row = screen.getByText('Course 1').closest('tr');
    expect(course1Row).not.toBeNull();
    expect(within(course1Row as HTMLElement).getByText('10')).toBeInTheDocument(); // enrollments
    expect(within(course1Row as HTMLElement).getByText('5')).toBeInTheDocument(); // certified
    const course2Row = screen.getByText('Course 2').closest('tr');
    expect(course2Row).not.toBeNull();
    expect(within(course2Row as HTMLElement).getByText('20')).toBeInTheDocument(); // enrollments
    expect(within(course2Row as HTMLElement).getByText('10')).toBeInTheDocument(); // certified
  });

  it('renders action buttons for each course', () => {
    renderWrapper(<CoursesList catalogId="c1" catalogName="Catalog 1" />);
    // There should be at least one button for each action per course
    expect(screen.getAllByRole('button', { name: /view|delete/i }).length).toBeGreaterThanOrEqual(2);
  });

  it('shows loading state if data is still loading', () => {
    mockuseCatalogCourses.mockReturnValue({
      data: {
        courses: [],
        count: 0,
        pageCount: 0,
      },
      isLoading: true,
    });
    renderWrapper(<CoursesList catalogId="c1" catalogName="Catalog 1" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
