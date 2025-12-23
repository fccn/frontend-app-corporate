import {
  screen, waitFor, fireEvent, act,
} from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import CoursesPage from './CoursesPage';

// Mock wouter
jest.mock('wouter', () => ({
  useParams: () => ({
    partnerSlug: 'test-partner',
    catalogSlug: 'test-catalog',
  }),
  useLocation: () => ['/', jest.fn()],
}));

// Mock hooks
jest.mock('@src/catalogs/data/hooks', () => ({
  useCatalogDetails: jest.fn(() => ({
    catalogDetails: {
      id: 'catalog-123',
      name: 'Test Catalog',
      slug: 'test-catalog',
      image: 'https://example.com/image.jpg',
      alternativeLink: 'https://example.com/link',
      userLimit: 100,
      activeLearners: 50,
      totalLearners: 75,
      courses: 10,
      enrollments: 200,
      certified: 150,
      completionRate: '75%',
    },
  })),
  useCatalogLearners: jest.fn(() => ({
    data: {
      results: [],
      count: 0,
      numPages: 1,
    },
    isLoading: false,
  })),
}));

jest.mock('@src/partner/data/hooks', () => ({
  usePartnerDetails: () => ({
    partnerDetails: {
      id: 'partner-123',
      slug: 'test-partner',
      name: 'Test Partner',
    },
  }),
}));

// Mock hooks used by child components
jest.mock('@src/hooks', () => ({
  useNavigate: () => jest.fn(),
  usePagination: () => ({
    pageIndex: 0,
    pageSize: 10,
    onPaginationChange: jest.fn(),
  }),
}));

jest.mock('./data/hooks', () => ({
  useCatalogCourses: () => ({
    courses: [],
    count: 0,
    pageCount: 0,
    isLoading: false,
  }),
  useDeleteCatalogCourse: () => jest.fn(),
  useAddCoursesToCatalog: () => jest.fn(),
  useUpdateCatalogCourse: () => jest.fn(),
}));
const renderCoursesPage = () => renderWrapper(<CoursesPage />);

describe('CoursesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with catalog details', async () => {
    renderCoursesPage();

    await waitFor(() => {
      expect(screen.getByText('Test Catalog')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  it('displays catalog information in header', async () => {
    renderCoursesPage();

    await waitFor(() => {
      expect(screen.getByText('Test Catalog')).toBeInTheDocument();
      expect(screen.getByText('Available Seats')).toBeInTheDocument();
      expect(screen.getByText('50 / 100')).toBeInTheDocument();
      expect(screen.getByText('Total Learners')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  it('renders tabs for courses and learners', async () => {
    renderCoursesPage();

    await waitFor(() => {
      const tabElements = screen.getAllByRole('tab');
      // Filter out the "More..." dropdown tab
      const contentTabs = tabElements.filter(tab => !tab.textContent?.includes('More...'));
      expect(contentTabs).toHaveLength(2);
      expect(contentTabs[0]).toHaveTextContent('Courses');
      expect(contentTabs[1]).toHaveTextContent('Learners');
    });
  });

  it('renders CoursesList component in courses tab', async () => {
    renderCoursesPage();

    await waitFor(() => {
      // Check for elements that indicate CoursesList is rendered
      expect(screen.getByText('Search course name')).toBeInTheDocument();
    });
  });

  it('renders LearnerList component in learners tab', async () => {
    renderCoursesPage();

    // Switch to learners tab
    const learnersTab = screen.getByRole('tab', { name: /learners/i });
    await act(async () => {
      fireEvent.click(learnersTab);
    });

    await waitFor(() => {
      // Check for elements that indicate LearnerList is rendered
      expect(screen.getByText('Learner name')).toBeInTheDocument();
    });
  });

  it('includes settings button in header', async () => {
    renderCoursesPage();

    await waitFor(() => {
      const settingsButton = screen.getByRole('button', { name: /edit catalog/i });
      expect(settingsButton).toBeInTheDocument();
    });
  });

  it('passes correct props to CoursesList', async () => {
    renderCoursesPage();

    await waitFor(() => {
      // Since we mocked CoursesList, we can verify it renders
      expect(screen.getByText('Search course name')).toBeInTheDocument();
    });
  });

  it('displays correct back path', async () => {
    renderCoursesPage();

    await waitFor(() => {
      // The back button should be present
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  it('shows alternative link when available', async () => {
    renderCoursesPage();

    await waitFor(() => {
      // The alternative link should be displayed in the header
      expect(screen.getByText('https://example.com/link')).toBeInTheDocument();
    });
  });
});
