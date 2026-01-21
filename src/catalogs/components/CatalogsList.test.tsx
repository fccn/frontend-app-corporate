import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import CatalogsList from './CatalogsList';
import { useCatalogs } from '../data/hooks';

jest.mock('../data/hooks', () => ({
  useCatalogs: jest.fn(),
}));

jest.mock('@src/hooks', () => ({
  useNavigate: () => jest.fn(),
  usePagination: () => ({
    pageIndex: 0,
    pageSize: 30,
    onPaginationChange: jest.fn(),
  }),
  useTableSortFilter: () => ({
    ordering: '',
    searchParams: {},
    fetchData: jest.fn(),
  }),
}));

jest.mock('../data/api');

const mockCatalogs = [
  {
    id: 1,
    name: 'Python Programming Catalog',
    courses: 15,
    enrollments: 250,
    certified: 180,
    completionRate: 72,
  },
  {
    id: 2,
    name: 'Data Science Catalog',
    courses: 8,
    enrollments: 120,
    certified: 90,
    completionRate: 75,
  },
  {
    id: 3,
    name: 'Web Development Catalog',
    courses: 12,
    enrollments: 200,
    certified: 150,
    completionRate: 75,
  },
];

const mockPartnerCatalogs = {
  catalogs: mockCatalogs,
  count: 3,
  pageCount: 1,
};

const mockUseCatalogs = useCatalogs as jest.Mock;
describe('CatalogsList', () => {
  beforeEach(() => {
    mockUseCatalogs.mockReturnValue({
      data: mockPartnerCatalogs,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a table with catalog data', () => {
    renderWrapper(<CatalogsList partnerId={1} partnerSlug="test-partner" />);

    mockCatalogs.forEach(async (catalog) => {
      expect(await screen.findByText(catalog.name)).toBeInTheDocument();
      expect(await screen.findByText(catalog.courses)).toBeInTheDocument();
      expect(await screen.findByText(catalog.enrollments)).toBeInTheDocument();
      expect(await screen.findByText(catalog.certified)).toBeInTheDocument();
      expect(await screen.findByText(catalog.completionRate)).toBeInTheDocument();
    });
  });

  it('shows loading state if data is still loading', () => {
    mockUseCatalogs.mockReturnValue({
      data: { catalogs: [], count: 0, pageCount: 0 },
      isLoading: true,
    });

    renderWrapper(<CatalogsList partnerId={1} partnerSlug="test-partner" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty table message when no catalogs are available', () => {
    mockUseCatalogs.mockReturnValue({
      data: { catalogs: [], count: 0, pageCount: 0 },
      isLoading: false,
    });

    renderWrapper(<CatalogsList partnerId={1} partnerSlug="test-partner" />);

    // Should still render the table structure
    expect(screen.queryByText(/Rows per page/i)).toBeInTheDocument();

    // But no catalog data should be present
    expect(screen.queryByText('No catalogs found')).toBeInTheDocument();
  });

  it('renders correct number of action buttons per row', () => {
    renderWrapper(<CatalogsList partnerId={1} partnerSlug="test-partner" />);

    const viewButtons = screen.getAllByLabelText('view-action');

    expect(viewButtons).toHaveLength(mockCatalogs.length);
  });

  it('handles pagination data correctly', () => {
    const mockPaginationData = {
      catalogs: [mockCatalogs[0]], // Only first catalog
      count: 1,
      pageCount: 1,
    };

    mockUseCatalogs.mockReturnValue({
      data: mockPaginationData,
      isLoading: false,
    });

    renderWrapper(<CatalogsList partnerId={1} partnerSlug="test-partner" />);

    // Should only render one catalog
    expect(screen.getByText('Python Programming Catalog')).toBeInTheDocument();
    expect(screen.queryByText('Data Science Catalog')).not.toBeInTheDocument();
    expect(screen.queryByText('Web Development Catalog')).not.toBeInTheDocument();
    expect(screen.getAllByLabelText('view-action')).toHaveLength(1);
  });
});
