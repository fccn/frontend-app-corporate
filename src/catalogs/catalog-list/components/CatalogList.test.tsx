import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import { paths } from '@src/constants';
import * as hooks from '@src/hooks';
import CatalogsList from './CatalogList';
import { useCatalogs } from '../data/hooks';

// Mock hooks
jest.mock('../data/hooks', () => ({
  useCatalogs: jest.fn(),
}));

jest.mock('@src/hooks', () => ({
  useNavigate: jest.fn(),
  usePagination: jest.fn(),
  useTableSortFilter: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockUseNavigate = hooks.useNavigate as jest.Mock;
const mockUsePagination = hooks.usePagination as jest.Mock;
const mockUseTableSortFilter = hooks.useTableSortFilter as jest.Mock;

const mockCatalogs = [
  {
    id: 1,
    name: 'Python Programming Catalog',
    slug: 'python-catalog',
    courses: 15,
    enrollments: 250,
    certified: 180,
    completionRate: 72,
  },
  {
    id: 2,
    name: 'Data Science Catalog',
    slug: 'data-science',
    courses: 8,
    enrollments: 120,
    certified: 90,
    completionRate: 75,
  },
];

const mockPartnerCatalogs = {
  catalogs: mockCatalogs,
  count: 2,
  pageCount: 1,
};

const mockUseCatalogs = useCatalogs as jest.Mock;

describe('CatalogsList', () => {
  const defaultPartnerId = 1;
  const defaultPartnerSlug = 'test-partner';

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNavigate.mockReturnValue(mockNavigate);

    // Default hooks implementations
    mockUsePagination.mockReturnValue({
      pageIndex: 0,
      pageSize: 10,
      onPaginationChange: jest.fn(),
    });

    mockUseTableSortFilter.mockReturnValue({
      ordering: undefined,
      searchParams: {},
      fetchData: jest.fn(),
    });

    mockUseCatalogs.mockReturnValue({
      data: mockPartnerCatalogs,
      isLoading: false,
    });
  });

  describe('UI Rendering & Initial State', () => {
    it('renders the table with correct headers', () => {
      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);

      expect(screen.getByText('Catalog Name')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
      expect(screen.getByText('Enrollments')).toBeInTheDocument();
      expect(screen.getByText('Certified Learners')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    });

    it('shows loading state if data is still loading', () => {
      mockUseCatalogs.mockReturnValue({
        data: { catalogs: [], count: 0, pageCount: 0 },
        isLoading: true,
      });

      renderWrapper(<CatalogsList partnerId={1} partnerSlug="test-partner" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders empty state message when no results', () => {
      mockUseCatalogs.mockReturnValue({
        data: { catalogs: [], count: 0, pageCount: 0 },
        isLoading: false,
      });

      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);
      expect(screen.getByText('No catalogs found')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('renders catalog data in rows', async () => {
      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);

      expect(await screen.findByText('Python Programming Catalog')).toBeInTheDocument();
      expect(await screen.findByText('15')).toBeInTheDocument(); // courses
      expect(await screen.findByText('250')).toBeInTheDocument(); // enrollments
      expect(await screen.findByText('180')).toBeInTheDocument(); // certified
      expect(await screen.findByText('72')).toBeInTheDocument(); // completion
    });

    it('renders View action button for each row', () => {
      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);
      const viewButtons = screen.getAllByRole('button', { name: /View/i });
      expect(viewButtons).toHaveLength(mockCatalogs.length);
    });
  });

  describe('Searching & Filtering', () => {
    it('passes search params to useCatalogs', () => {
      mockUseTableSortFilter.mockReturnValue({
        ordering: undefined,
        searchParams: { search: 'Python' },
        fetchData: jest.fn(),
      });

      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);

      expect(mockUseCatalogs).toHaveBeenCalledWith(expect.objectContaining({
        search: 'Python',
      }));
    });
  });

  describe('Sorting', () => {
    it('passes ordering params to useCatalogs when sorted by name', () => {
      mockUseTableSortFilter.mockReturnValue({
        ordering: 'name',
        searchParams: {},
        fetchData: jest.fn(),
      });

      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);

      expect(mockUseCatalogs).toHaveBeenCalledWith(expect.objectContaining({
        ordering: 'name',
      }));
    });

    it('passes descending ordering params', () => {
      mockUseTableSortFilter.mockReturnValue({
        ordering: '-name',
        searchParams: {},
        fetchData: jest.fn(),
      });

      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);

      expect(mockUseCatalogs).toHaveBeenCalledWith(expect.objectContaining({
        ordering: '-name',
      }));
    });
  });

  describe('Pagination', () => {
    it('handles pagination correctly (converts 0-based to 1-based)', () => {
      mockUsePagination.mockReturnValue({
        pageIndex: 2, // 0-based index means page 3
        pageSize: 20,
        onPaginationChange: jest.fn(),
      });

      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);

      expect(mockUseCatalogs).toHaveBeenCalledWith(expect.objectContaining({
        pageIndex: 3, // Expects 1-based
        pageSize: 20,
      }));
    });
  });

  describe('Navigation', () => {
    it('navigates to course list when View button is clicked', async () => {
      const user = userEvent.setup();
      renderWrapper(<CatalogsList partnerId={defaultPartnerId} partnerSlug={defaultPartnerSlug} />);

      const viewButtons = screen.getAllByRole('button', { name: /View/i });
      await user.click(viewButtons[0]);

      const expectedPath = paths.courses.buildPath(defaultPartnerSlug, mockCatalogs[0].slug);
      expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
    });
  });
});
