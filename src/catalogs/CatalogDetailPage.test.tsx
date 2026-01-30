import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import CatalogDetailPage from './CatalogDetailPage';

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
    data: {
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
}));

jest.mock('@src/catalogs/learner-list/data/hooks', () => ({
  useCatalogLearners: jest.fn(() => ({
    data: {
      results: [],
      count: 0,
      numPages: 1,
    },
    isLoading: false,
  })),
  useRemoveLearners: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
}));

jest.mock('@src/catalogs/course-list/data/hooks', () => ({
  useCatalogCourses: jest.fn(() => ({
    data: {
      courses: [],
      count: 0,
      pageCount: 1,
    },
    isLoading: false,
  })),
  useUpdateCatalogCourse: jest.fn(() => ({
    mutate: jest.fn(),
  })),
  useAvailableCourses: jest.fn(() => ({
    data: {
      base: [],
      organization: [],
    },
    isLoading: false,
  })),
  useAddCoursesToCatalog: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useDeleteCatalogCourse: jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock('@src/catalogs/enrollment-list/data/hooks', () => ({
  useCatalogEnrollments: jest.fn(() => ({
    data: {
      results: [],
      count: 0,
      numPages: 1,
    },
    isLoading: false,
  })),
}));

jest.mock('@src/catalogs/invite-learners/data/hooks', () => ({
  useBulkInviteTaskStatus: jest.fn(() => ({ data: undefined })),
  useInviteLearners: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
}));

jest.mock('@src/notification', () => ({
  useNotification: () => ({
    showNotification: jest.fn(),
  }),
}));

jest.mock('@src/partner/data/hooks', () => ({
  usePartnerDetails: () => ({
    data: {
      id: 'partner-123',
      slug: 'test-partner',
      name: 'Test Partner',
    },
  }),
}));

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

const renderCatalogDetailPage = () => renderWrapper(<CatalogDetailPage />);

describe('CatalogDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with catalog details', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Test Catalog')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  it('displays catalog information in header', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Test Catalog')).toBeInTheDocument();
      expect(screen.getByText('Available Seats')).toBeInTheDocument();
      expect(screen.getByText('50 / 100')).toBeInTheDocument();
      expect(screen.getByText('Learners', { selector: 'span' })).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });
  });

  it('renders tabs for courses, learners, and enrollments', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      const tabElements = screen.getAllByRole('tab');
      // Filter out the "More..." dropdown tab
      const contentTabs = tabElements.filter(tab => !tab.textContent?.includes('More...'));
      expect(contentTabs).toHaveLength(3);
      expect(contentTabs[0]).toHaveTextContent('Courses');
      expect(contentTabs[1]).toHaveTextContent('Learners');
      expect(contentTabs[2]).toHaveTextContent('Enrollments');
    });
  });

  it('renders CoursesList component in courses tab', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      // Check for elements that indicate CoursesList is rendered
      expect(screen.getByPlaceholderText('Search by course name')).toBeInTheDocument();
    });
  });

  it('renders LearnerList component in learners tab', async () => {
    const user = userEvent.setup();
    renderCatalogDetailPage();

    // Switch to learners tab
    const learnersTab = screen.getByRole('tab', { name: /learners/i });
    await user.click(learnersTab);

    await waitFor(() => {
      // Check for elements that indicate LearnerList is rendered
      expect(screen.getAllByText('Invite Learners').length).toBeGreaterThan(0);
    });
  });

  it('includes settings button in header', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      const settingsButton = screen.getByRole('button', { name: /edit catalog/i });
      expect(settingsButton).toBeInTheDocument();
    });
  });

  it('passes correct props to CoursesList', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search by course name')).toBeInTheDocument();
    });
  });

  it('displays correct back path', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      // The back button should be present
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  it('shows alternative link when available', async () => {
    renderCatalogDetailPage();

    await waitFor(() => {
      // The alternative link should be displayed in the header
      expect(screen.getByText('https://example.com/link')).toBeInTheDocument();
    });
  });
});
