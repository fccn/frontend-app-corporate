import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import CatalogsList from './CatalogsList';
import { usePartnerCatalogs } from '../hooks';

// Mock the hooks
jest.mock('../hooks', () => ({
  usePartnerCatalogs: jest.fn(),
}));

jest.mock('@src/hooks', () => ({
  useNavigate: () => jest.fn(),
  usePagination: () => ({
    pageIndex: 0,
    pageSize: 30,
    onPaginationChange: jest.fn(),
  }),
}));

// Mock components to avoid complex rendering
jest.mock('@src/app/TableFooter', () => function TableFooter() {
  return <div data-testid="table-footer" />;
});

// Mock API
jest.mock('../api');

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
  results: mockCatalogs,
  count: 3,
  numPages: 1,
};

describe('CatalogsList', () => {
  beforeEach(() => {
    (usePartnerCatalogs as jest.Mock).mockReturnValue({
      partnerCatalogs: mockPartnerCatalogs,
      isLoadingCatalogs: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a table with catalog data', () => {
    renderWrapper(<CatalogsList partnerId="123" />);

    // Check if catalog data is rendered
    mockCatalogs.forEach(async (catalog) => {
      expect(await screen.findByText(catalog.name)).toBeInTheDocument();
      expect(await screen.findByText(catalog.courses)).toBeInTheDocument();
      expect(await screen.findByText(catalog.enrollments)).toBeInTheDocument();
      expect(await screen.findByText(catalog.certified)).toBeInTheDocument();
      expect(await screen.findByText(catalog.completionRate)).toBeInTheDocument();
    });
  });

  it('shows loading state if data is still loading', () => {
    (usePartnerCatalogs as jest.Mock).mockReturnValue({
      partnerCatalogs: { results: [], count: 0, numPages: 0 },
      isLoadingCatalogs: true,
    });

    renderWrapper(<CatalogsList partnerId="123" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty table message when no catalogs are available', () => {
    (usePartnerCatalogs as jest.Mock).mockReturnValue({
      partnerCatalogs: { results: [], count: 0, numPages: 0 },
      isLoadingCatalogs: false,
    });

    renderWrapper(<CatalogsList partnerId="123" />);

    // Should still render the table structure
    expect(screen.getByTestId('table-footer')).toBeInTheDocument();

    // But no catalog data should be present
    expect(screen.queryByText('No catalogs found')).toBeInTheDocument();
  });

  it('renders correct number of action buttons per row', () => {
    renderWrapper(<CatalogsList partnerId="123" />);

    // Each catalog should have 2 actions (view and edit)
    const viewButtons = screen.getAllByLabelText('view-action');
    const editButtons = screen.getAllByLabelText('edit-action');

    expect(viewButtons).toHaveLength(mockCatalogs.length);
    expect(editButtons).toHaveLength(mockCatalogs.length);
  });

  it('handles pagination data correctly', () => {
    const mockPaginationData = {
      results: [mockCatalogs[0]], // Only first catalog
      count: 1,
      numPages: 1,
    };

    (usePartnerCatalogs as jest.Mock).mockReturnValue({
      partnerCatalogs: mockPaginationData,
      isLoadingCatalogs: false,
    });

    renderWrapper(<CatalogsList partnerId="123" />);

    // Should only render one catalog
    expect(screen.getByText('Python Programming Catalog')).toBeInTheDocument();
    expect(screen.queryByText('Data Science Catalog')).not.toBeInTheDocument();
    expect(screen.queryByText('Web Development Catalog')).not.toBeInTheDocument();

    // Should only have one set of action buttons
    expect(screen.getAllByLabelText('view-action')).toHaveLength(1);
    expect(screen.getAllByLabelText('edit-action')).toHaveLength(1);
  });
});
