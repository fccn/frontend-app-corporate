import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import InvitationCancelModal from './InvitationCancelModal';
import * as hooks from '../data/hooks';

jest.mock('../data/hooks', () => ({
  useCancelInvitation: jest.fn(),
}));

const mockUseCancelInvitation = hooks.useCancelInvitation as jest.Mock;

const mockInvitation = {
  id: 1,
  inviteEmail: 'to_cancel@example.com',
  status: 'pending' as const,
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

describe('InvitationCancelModal', () => {
  const mockOnClose = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate.mockImplementation((_vars, options) => {
      if (options?.onSuccess) { options.onSuccess(); }
    });
    mockUseCancelInvitation.mockReturnValue({ mutate: mockMutate, isPending: false });
  });

  it('renders modal when isOpen is true', () => {
    renderWrapper(
      <InvitationCancelModal
        isOpen
        onClose={mockOnClose}
        catalogId="test-catalog"
        invitation={mockInvitation}
      />,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Cancel Invitation');
  });

  it('shows confirmation message with email', () => {
    renderWrapper(
      <InvitationCancelModal
        isOpen
        onClose={mockOnClose}
        catalogId="test-catalog"
        invitation={mockInvitation}
      />,
    );
    expect(screen.getByText(/to_cancel@example\.com/)).toBeInTheDocument();
  });

  it('calls cancelInvitation on confirm', async () => {
    const user = userEvent.setup();
    renderWrapper(
      <InvitationCancelModal
        isOpen
        onClose={mockOnClose}
        catalogId="test-catalog"
        invitation={mockInvitation}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel Invitation' }));

    expect(mockMutate).toHaveBeenCalledWith(
      { catalogId: 'test-catalog', invitationId: 1 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    renderWrapper(
      <InvitationCancelModal
        isOpen={false}
        onClose={mockOnClose}
        catalogId="test-catalog"
        invitation={mockInvitation}
      />,
    );
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });
});
