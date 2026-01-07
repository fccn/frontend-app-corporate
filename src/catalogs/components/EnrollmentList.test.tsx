import { screen, waitFor } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';

import EnrollmentList from './EnrollmentList';

// Mock hooks
jest.mock('@src/hooks', () => ({
  useNavigate: jest.fn(),
  usePagination: jest.fn(),
  useTableSortFilter: jest.fn(),
}));

jest.mock('../data/hooks', () => ({
  useCatalogEnrollments: jest.fn(),
  useInviteLearners: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
}));

const mockUseNavigate = require('@src/hooks').useNavigate;
const mockUsePagination = require('@src/hooks').usePagination;
const mockUseTableSortFilter = require('@src/hooks').useTableSortFilter;
const mockUseCatalogEnrollments = require('../data/hooks').useCatalogEnrollments;

const mockEnrollments = [
  {
    id: 1,
    active: true,
    progress: 75,
    hasCertificate: false,
    user: {
      id: 1,
      email: 'john@example.com',
      fullName: 'John Doe',
      lastLogin: '2023-01-15T10:00:00Z',
    },
    courseOverview: {
      id: 'course-v1:edX+DemoX+Demo_Course',
      displayName: 'Demo Course',
    },
    inviteSentAt: '2023-01-01T10:00:00Z',
    acceptedAt: '2023-01-02T10:00:00Z',
    removedAt: null,
  },
  {
    id: 2,
    active: false,
    progress: 100,
    hasCertificate: true,
    user: {
      id: 2,
      email: 'jane@example.com',
      fullName: 'Jane Smith',
      lastLogin: null,
    },
    courseOverview: {
      id: 'course-v1:edX+TestX+Test_Course',
      displayName: 'Test Course',
    },
    inviteSentAt: '2023-01-03T10:00:00Z',
    acceptedAt: null,
    removedAt: '2023-01-10T10:00:00Z',
  },
];

const mockData = {
  count: 2,
  numPages: 1,
  results: mockEnrollments,
};

const renderEnrollmentList = (props = {}) => renderWrapper(<EnrollmentList catalogId="test-catalog" {...props} />);

describe('EnrollmentList', () => {
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
    mockUseCatalogEnrollments.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderEnrollmentList();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('renders enrollment data correctly', async () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('displays active/inactive status badges', async () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  it('formats dates correctly', async () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    await waitFor(() => {
      expect(screen.getByText('2023-01-01 10:00')).toBeInTheDocument();
      expect(screen.getByText('2023-01-02 10:00')).toBeInTheDocument();
    });
  });

  it('displays enrollment progress and certificate status', async () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });
  });

  it('renders course information correctly', async () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    await waitFor(() => {
      expect(screen.getByText('Demo Course')).toBeInTheDocument();
      expect(screen.getByText('course-v1:edX+DemoX+Demo_Course')).toBeInTheDocument();
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('course-v1:edX+TestX+Test_Course')).toBeInTheDocument();
    });
  });

  it('renders table footer', async () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    await waitFor(() => {
      // Check for pagination elements instead of item count
      expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    });
  });

  it('handles empty data gracefully', () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: { count: 0, numPages: 0, results: [] },
      isLoading: false,
    });

    renderEnrollmentList();

    expect(screen.getByText('No learners found')).toBeInTheDocument();
  });

  it('handles null dates gracefully', async () => {
    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    await waitFor(() => {
      // Should not crash when dates are null
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('passes correct props to useCatalogEnrollments hook', () => {
    const mockOnPaginationChange = jest.fn();
    mockUsePagination.mockReturnValue({
      pageIndex: 1,
      pageSize: 20,
      onPaginationChange: mockOnPaginationChange,
    });
    mockUseTableSortFilter.mockReturnValue({
      ordering: '-invite_sent_at',
      searchParams: { search: 'test', active: 'false' },
      fetchData: jest.fn(),
    });

    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    expect(mockUseCatalogEnrollments).toHaveBeenCalledWith({
      catalogId: 'test-catalog',
      pageIndex: 2, // pageIndex + 1
      pageSize: 20,
      ordering: '-invite_sent_at',
      search: 'test',
      active: 'false',
    });
  });

  it('uses pagination hook correctly', () => {
    const mockOnPaginationChange = jest.fn();
    mockUsePagination.mockReturnValue({
      pageIndex: 0,
      pageSize: 10,
      onPaginationChange: mockOnPaginationChange,
    });

    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    expect(mockUsePagination).toHaveBeenCalled();
  });

  it('calls fetchData on table state changes', () => {
    const mockFetchData = jest.fn();
    mockUseTableSortFilter.mockReturnValue({
      ordering: '',
      searchParams: { active: 'true' },
      fetchData: mockFetchData,
    });

    mockUseCatalogEnrollments.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    renderEnrollmentList();

    expect(mockFetchData).toHaveBeenCalled();
  });
});
