import { screen, waitFor } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import * as appHooks from '@src/hooks';
import * as hooks from '../data/hooks';

import InvitationList from './InvitationList';

jest.mock('@src/hooks', () => ({
  useNavigate: jest.fn(),
  usePagination: jest.fn(),
  useTableSortFilter: jest.fn(),
}));

jest.mock('@src/catalogs/components', () => ({
  DownloadReportButton: jest.fn(() => <button type="button">Download Report</button>),
}));

jest.mock('../data/hooks', () => ({
  useCatalogInvitations: jest.fn(),
  useResendInvitation: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  useCancelInvitation: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

const mockUsePagination = appHooks.usePagination as jest.Mock;
const mockUseTableSortFilter = appHooks.useTableSortFilter as jest.Mock;
const mockUseCatalogInvitations = hooks.useCatalogInvitations as jest.Mock;

const mockPendingInvitation = {
  id: 1,
  inviteEmail: 'pending@example.com',
  status: 'pending',
  statusDisplay: 'Sent',
  isRegistered: false,
  username: null,
  fullName: null,
  invitedAt: '2024-01-01T10:00:00Z',
  acceptedAt: null,
  declinedAt: null,
  cancelledAt: null,
  removedAt: null,
  invitedBy: 'manager_user',
};

const mockAcceptedInvitation = {
  id: 2,
  inviteEmail: 'accepted@example.com',
  status: 'accepted',
  statusDisplay: 'Accepted',
  isRegistered: true,
  username: 'accepted_user',
  fullName: 'Accepted User',
  invitedAt: '2024-01-01T10:00:00Z',
  acceptedAt: '2024-01-05T10:00:00Z',
  declinedAt: null,
  cancelledAt: null,
  removedAt: null,
  invitedBy: 'manager_user',
};

const mockData = {
  count: 2,
  numPages: 1,
  results: [mockPendingInvitation, mockAcceptedInvitation],
};

const renderInvitationList = (props = {}) => renderWrapper(
  <InvitationList catalogId="test-catalog" catalogName="Test Catalog" {...props} />,
);

describe('InvitationList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePagination.mockReturnValue({
      pageIndex: 0,
      pageSize: 10,
      onPaginationChange: jest.fn(),
    });
    mockUseTableSortFilter.mockReturnValue({
      ordering: '',
      searchParams: { status: '10' },
      fetchData: jest.fn(),
    });
  });

  it('renders loading state', () => {
    mockUseCatalogInvitations.mockReturnValue({ data: undefined, isLoading: true });
    renderInvitationList();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders invitation data correctly', async () => {
    mockUseCatalogInvitations.mockReturnValue({ data: mockData, isLoading: false });
    renderInvitationList();

    await waitFor(() => {
      expect(screen.getByText('pending@example.com')).toBeInTheDocument();
      expect(screen.getByText('accepted@example.com')).toBeInTheDocument();
    });
  });

  it('shows "Not registered yet" for unregistered invitees', async () => {
    mockUseCatalogInvitations.mockReturnValue({ data: mockData, isLoading: false });
    renderInvitationList();

    await waitFor(() => {
      expect(screen.getByText('Not registered yet')).toBeInTheDocument();
    });
  });

  it('shows username for registered invitees', async () => {
    mockUseCatalogInvitations.mockReturnValue({ data: mockData, isLoading: false });
    renderInvitationList();

    await waitFor(() => {
      expect(screen.getByText('accepted_user')).toBeInTheDocument();
    });
  });

  it('displays Pending status badge for pending invitations', async () => {
    mockUseCatalogInvitations.mockReturnValue({
      data: { count: 1, numPages: 1, results: [mockPendingInvitation] },
      isLoading: false,
    });
    renderInvitationList();

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('displays Accepted status badge for accepted invitations', async () => {
    mockUseCatalogInvitations.mockReturnValue({
      data: { count: 1, numPages: 1, results: [mockAcceptedInvitation] },
      isLoading: false,
    });
    renderInvitationList();

    await waitFor(() => {
      expect(screen.getByText('Accepted')).toBeInTheDocument();
    });
  });

  it('uses pending filter as default', () => {
    mockUseCatalogInvitations.mockReturnValue({ data: undefined, isLoading: false });
    renderInvitationList();

    expect(mockUseCatalogInvitations).toHaveBeenCalledWith(
      expect.objectContaining({ status: '10' }),
    );
  });

  it('disables resend and cancel for non-pending rows', async () => {
    mockUseCatalogInvitations.mockReturnValue({
      data: { count: 1, numPages: 1, results: [mockAcceptedInvitation] },
      isLoading: false,
    });
    renderInvitationList();

    await waitFor(() => {
      const resendBtn = screen.getByRole('button', { name: 'Resend' });
      const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
      expect(resendBtn).toBeDisabled();
      expect(cancelBtn).toBeDisabled();
    });
  });

  it('renders empty state', () => {
    mockUseCatalogInvitations.mockReturnValue({
      data: { count: 0, numPages: 0, results: [] },
      isLoading: false,
    });
    renderInvitationList();
    expect(screen.getByText('No invitations found')).toBeInTheDocument();
  });

  it('renders download report button', async () => {
    mockUseCatalogInvitations.mockReturnValue({ data: mockData, isLoading: false });
    renderInvitationList();
    expect(screen.getByText('Download Report')).toBeInTheDocument();
  });
});
