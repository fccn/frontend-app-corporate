import { screen, waitFor } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import * as appHooks from '@src/hooks';
import * as hooks from '../data/hooks';

import LearnerList from './LearnerList';

// Mock hooks
jest.mock('@src/hooks', () => ({
  useNavigate: jest.fn(),
  usePagination: jest.fn(),
  useTableSortFilter: jest.fn(),
}));

jest.mock('@src/catalogs/hooks/useDownloadReport', () => ({
  useDownloadReport: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}));

jest.mock('../data/hooks', () => ({
  useCatalogLearners: jest.fn(),
  useRemoveLearners: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
  useBulkInviteTaskStatus: jest.fn(() => ({ data: undefined })),
}));

const mockUseNavigate = appHooks.useNavigate as jest.Mock;
const mockUsePagination = appHooks.usePagination as jest.Mock;
const mockUseCatalogLearners = hooks.useCatalogLearners as jest.Mock;
const mockUseTableSortFilter = appHooks.useTableSortFilter as jest.Mock;

const mockLearners = [
  {
    id: 1,
    active: true,
    user: {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      fullName: 'John Doe',
      lastLogin: '2023-01-15T10:00:00Z',
    },
    inviteSentAt: '2023-01-01T10:00:00Z',
    acceptedAt: '2023-01-02T10:00:00Z',
    removedAt: null,
    enrollments: 3,
    certified: 2,
  },
  {
    id: 2,
    active: false,
    user: {
      id: 2,
      username: 'jane_smith',
      email: 'jane@example.com',
      fullName: 'Jane Smith',
    },
    inviteSentAt: '2023-01-03T10:00:00Z',
    acceptedAt: null,
    removedAt: '2023-01-10T10:00:00Z',
    lastLogin: null,
    enrollments: 1,
    certified: 0,
  },
];

const mockData = {
  count: 2,
  numPages: 1,
  results: mockLearners,
};

const renderLearnerList = (props = {}) => renderWrapper(<LearnerList catalogId="test-catalog" catalogName="Test Catalog" {...props} />);

describe('LearnerList', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNavigate.mockReturnValue(jest.fn());
    mockUsePagination.mockReturnValue({
      pageIndex: 0,
      pageSize: 10,
      onPaginationChange: jest.fn(),
    });
    mockUseTableSortFilter.mockReturnValue({
      ordering: '',
      searchParams: { active: 'true' },
      fetchData: jest.fn(),
    });
  });

  it('renders loading state', () => {
    mockUseCatalogLearners.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderLearnerList();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('renders learner data correctly', async () => {
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('displays active/inactive status badges', async () => {
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  it('formats dates correctly', async () => {
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    await waitFor(() => {
      // Check formatted dates
      expect(screen.getByText('2023-01-01 10:00')).toBeInTheDocument(); // inviteSentAt
      expect(screen.getByText('2023-01-02 10:00')).toBeInTheDocument(); // acceptedAt
      expect(screen.getByText('2023-01-15 10:00')).toBeInTheDocument(); // lastLogin
      expect(screen.getByText('2023-01-10 10:00')).toBeInTheDocument(); // removedAt
    });
  });

  it('displays enrollment and certification counts', async () => {
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // enrollments for John
      expect(screen.getByText('2')).toBeInTheDocument(); // certified for John
      expect(screen.getByText('1')).toBeInTheDocument(); // enrollments for Jane
      expect(screen.getByText('0')).toBeInTheDocument(); // certified for Jane
    });
  });

  it('renders action buttons for each learner', async () => {
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  it('renders table footer', async () => {
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    await waitFor(() => {
      expect(screen.getByTestId('table-footer')).toBeInTheDocument();
    });
  });

  it('handles empty data gracefully', () => {
    mockUseCatalogLearners.mockReturnValue({
      data: {
        count: 0,
        numPages: 0,
        results: [],
      },
      isLoading: false,
    });

    renderLearnerList();

    expect(screen.getByText('No learners found')).toBeInTheDocument();
  });

  it('handles null dates gracefully', async () => {
    const learnerWithNullDates = [{
      id: 3,
      active: true,
      user: {
        id: 3,
        username: 'test_user',
        email: 'test@example.com',
        fullName: 'Test User',
        lastLogin: null,
      },
      inviteSentAt: null,
      acceptedAt: null,
      removedAt: null,
      enrollments: 0,
      certified: 0,
    }];

    mockUseCatalogLearners.mockReturnValue({
      data: {
        count: 1,
        numPages: 1,
        results: learnerWithNullDates,
      },
      isLoading: false,
    });

    renderLearnerList();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Null dates should not render anything
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });

  it('passes correct props to useCatalogLearners hook', () => {
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList({ catalogId: 'custom-catalog' });

    expect(mockUseCatalogLearners).toHaveBeenCalledWith({
      catalogId: 'custom-catalog',
      pageIndex: 1,
      pageSize: 10,
      ordering: '',
      search: undefined,
      active: 'true',
    });
  });

  it('uses pagination hook correctly', () => {
    const mockPagination = {
      pageIndex: 2,
      pageSize: 25,
      onPaginationChange: jest.fn(),
    };

    mockUsePagination.mockReturnValue(mockPagination);
    mockUseTableSortFilter.mockReturnValue({
      ordering: '',
      searchParams: { active: 'true' },
      fetchData: jest.fn(),
    });
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    expect(mockUsePagination).toHaveBeenCalled();
    expect(mockUseTableSortFilter).toHaveBeenCalledWith({
      sortMappings: {
        inviteSentAt: 'invite_sent_at',
        acceptedAt: 'accepted_at',
        lastLogin: 'user__last_login',
        removedAt: 'removed_at',
      },
      filterMappings: { fullName: 'search', email: 'search', active: 'active' },
      onPaginationChange: mockPagination.onPaginationChange,
    });
  });

  it('calls fetchData on table state changes', () => {
    const mockFetchData = jest.fn();
    mockUseTableSortFilter.mockReturnValue({
      ordering: '',
      searchParams: { active: 'true' },
      fetchData: mockFetchData,
    });
    mockUseCatalogLearners.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderLearnerList();

    // Simulate DataTable calling fetchData
    expect(mockFetchData).toHaveBeenCalledTimes(1); // Initial call
  });
});
