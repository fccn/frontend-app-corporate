import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

jest.mock('./InviteAction', () => jest.fn(() => <button type="button">Invite Learners</button>));

const mockShowNotification = jest.fn();
jest.mock('@src/notification', () => ({
  useNotification: () => ({ showNotification: mockShowNotification }),
}));

jest.mock('../data/hooks', () => ({
  useCatalogInvitations: jest.fn(),
  useResendInvitation: jest.fn(),
  useCancelInvitation: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
}));

const mockUsePagination = appHooks.usePagination as jest.Mock;
const mockUseTableSortFilter = appHooks.useTableSortFilter as jest.Mock;
const mockUseCatalogInvitations = hooks.useCatalogInvitations as jest.Mock;
const mockUseResendInvitation = hooks.useResendInvitation as jest.Mock;
const mockResend = jest.fn();

const mockPendingInvitation = {
  id: 1,
  inviteEmail: 'pending@example.com',
  status: 'pending',
  statusDisplay: 'Sent',
  isRegistered: false,
  username: null,
  fullName: null,
  invitedAt: '2024-01-01T10:00:00Z',
  resendCount: 0,
  lastResentAt: null,
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
  resendCount: 0,
  lastResentAt: null,
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
  <InvitationList catalogId="test-catalog" {...props} />,
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
      searchParams: { status: 10 },
      fetchData: jest.fn(),
    });
    mockUseResendInvitation.mockReturnValue({ mutate: mockResend, isPending: false });
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
      expect.objectContaining({ status: 10 }),
    );
  });

  it('shows the resend history under the original invitation date', async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    mockUseCatalogInvitations.mockReturnValue({
      data: {
        count: 1,
        numPages: 1,
        results: [{ ...mockPendingInvitation, resendCount: 2, lastResentAt: threeDaysAgo }],
      },
      isLoading: false,
    });
    renderInvitationList();

    const cell = (await screen.findByText('resent 2× · 3 days ago')).parentElement as HTMLElement;
    expect(cell).toHaveTextContent('2024-01-01 10:00');
    expect(screen.getByText('resent 2× · 3 days ago')).toHaveClass('x-small', 'text-muted');
  });

  it('shows only the invitation date when the invitation was never resent', async () => {
    mockUseCatalogInvitations.mockReturnValue({
      data: { count: 1, numPages: 1, results: [mockPendingInvitation] },
      isLoading: false,
    });
    renderInvitationList();

    expect(await screen.findByText('2024-01-01 10:00')).toBeInTheDocument();
    expect(screen.queryByText(/^resent /)).not.toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockUseCatalogInvitations.mockReturnValue({
      data: { count: 0, numPages: 0, results: [] },
      isLoading: false,
    });
    renderInvitationList();
    expect(screen.getByText('No invitations found')).toBeInTheDocument();
  });

  it('renders download report and invite buttons', async () => {
    mockUseCatalogInvitations.mockReturnValue({ data: mockData, isLoading: false });
    renderInvitationList();
    expect(screen.getByText('Download Report')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invite Learners' })).toBeInTheDocument();
  });

  it('filters by a single status and shows the default one as selected', async () => {
    mockUseCatalogInvitations.mockReturnValue({ data: mockData, isLoading: false });
    const user = userEvent.setup();
    renderInvitationList();

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const statusFilter = await screen.findByRole('combobox', { name: 'Status' });
    expect(statusFilter).not.toHaveAttribute('multiple');
    expect(statusFilter).toHaveDisplayValue('Pending');
  });

  it.each([
    ['pending', true],
    ['accepted', false],
    ['declined', false],
    ['removed', false],
    ['cancelled', false],
  ])('enables resend and cancel for %s invitations: %s', async (status, enabled) => {
    mockUseCatalogInvitations.mockReturnValue({
      data: { count: 1, numPages: 1, results: [{ ...mockPendingInvitation, status }] },
      isLoading: false,
    });
    renderInvitationList();

    const resendBtn = await screen.findByRole('button', { name: 'Resend' });
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    expect(resendBtn.hasAttribute('disabled')).toBe(!enabled);
    expect(cancelBtn.hasAttribute('disabled')).toBe(!enabled);
  });

  describe('resend', () => {
    beforeEach(() => {
      mockUseCatalogInvitations.mockReturnValue({
        data: { count: 1, numPages: 1, results: [mockPendingInvitation] },
        isLoading: false,
      });
    });

    it('notifies the manager when the invitation is resent', async () => {
      mockResend.mockImplementation((_vars, options) => options.onSuccess());
      const user = userEvent.setup();
      renderInvitationList();

      await user.click(await screen.findByRole('button', { name: 'Resend' }));

      expect(mockResend).toHaveBeenCalledWith(
        { catalogId: 'test-catalog', invitationId: 1 },
        expect.any(Object),
      );
      expect(mockShowNotification).toHaveBeenCalledWith('Invitation resent successfully.', 'success');
    });

    it('notifies the manager when resending fails', async () => {
      mockResend.mockImplementation((_vars, options) => options.onError(new Error('500')));
      const user = userEvent.setup();
      renderInvitationList();

      await user.click(await screen.findByRole('button', { name: 'Resend' }));

      expect(mockShowNotification).toHaveBeenCalledWith('Failed to resend invitation.', 'error');
    });

    it('sends one resend request for a double click, before the pending state re-renders', async () => {
      // The mock never settles and never flips isPending, like the first frames of a real request.
      const user = userEvent.setup();
      renderInvitationList();

      await user.dblClick(await screen.findByRole('button', { name: 'Resend' }));

      expect(mockResend).toHaveBeenCalledTimes(1);
    });

    it('disables resend while a resend is in flight', async () => {
      mockUseResendInvitation.mockReturnValue({ mutate: mockResend, isPending: true });
      renderInvitationList();

      expect(await screen.findByRole('button', { name: 'Resend' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
    });
  });
});
