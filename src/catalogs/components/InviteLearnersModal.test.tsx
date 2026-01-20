import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { renderWrapper } from '@src/setupTest';
import * as hooks from '@src/catalogs/data/hooks';
import InviteLearnersModal from './InviteLearnersModal';

jest.mock('@src/catalogs/data/hooks', () => ({
  useInviteLearners: jest.fn(),
}));

const mockUseInviteLearners = hooks.useInviteLearners as jest.Mock;

describe('InviteLearnersModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseInviteLearners.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it('renders modal when isOpen is true', () => {
    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    expect(screen.getByText(/invite learners/i)).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWrapper(
      <InviteLearnersModal
        isOpen={false}
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    expect(screen.queryByText(/invite learners/i)).not.toBeInTheDocument();
  });

  it('displays manual invite section', () => {
    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    expect(screen.getByText(/manually/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
  });

  it('displays bulk upload section', () => {
    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    expect(screen.getByText(/bulk/i)).toBeInTheDocument();
  });

  it('allows entering email addresses manually', async () => {
    const user = userEvent.setup();

    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await user.type(emailInput, 'test@example.com, another@example.com');

    expect(emailInput).toHaveValue('test@example.com, another@example.com');
  });

  it('disables email input when CSV file is uploaded', async () => {
    const user = userEvent.setup();
    const mockMutate = jest.fn();
    mockUseInviteLearners.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    // Create a mock file
    const file = new File(['email, name'], 'test.csv', { type: 'text/csv' });

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const dropzone = screen.getByTestId('dropzone-container');
    const fileInput = dropzone.querySelector('input[type="file"]') as HTMLInputElement;

    expect(emailInput).not.toBeDisabled();
    expect(fileInput).not.toBeDisabled();

    await user.upload(fileInput, file);
    expect(emailInput).toBeDisabled();
    const fileName = screen.getByText('test.csv');
    expect(fileName).toBeInTheDocument();
    const removeButton = screen.getByRole('button', { name: /remove file/i });
    await user.click(removeButton);
    expect(emailInput).not.toBeDisabled();
    expect(fileInput).not.toBeDisabled();
    expect(fileName).not.toBeInTheDocument();
  });

  it('submits form with email addresses', async () => {
    const user = userEvent.setup();
    const mockMutate = jest.fn();
    mockUseInviteLearners.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /send invitations/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          catalogId: 'test-catalog',
          data: expect.objectContaining({
            emails: ['test@example.com'],
          }),
        }),
        expect.any(Object),
      );
    });
  });

  it('calls onClose when modal is closed', async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn();

    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={onCloseMock}
        catalogId="test-catalog"
      />,
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('resets form when modal is closed', async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn();

    const { rerender } = renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={onCloseMock}
        catalogId="test-catalog"
      />,
    );

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await user.type(emailInput, 'test@example.com');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Modal closed
    rerender(
      <IntlProvider locale="en">
        <InviteLearnersModal
          isOpen={false}
          onClose={onCloseMock}
          catalogId="test-catalog"
        />
      </IntlProvider>,
    );

    // Modal reopened
    rerender(
      <IntlProvider locale="en">
        <InviteLearnersModal
          isOpen
          onClose={onCloseMock}
          catalogId="test-catalog"
        />
      </IntlProvider>,
    );

    const newEmailInput = screen.getByPlaceholderText(/enter email/i);
    expect(newEmailInput).toHaveValue('');
  });

  it('disables submit button when form is invalid', () => {
    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    const submitButton = screen.getByRole('button', { name: /send invitations/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when mutation is pending', () => {
    mockUseInviteLearners.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    const submitButton = screen.getByRole('button', { name: /send invitations/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();

    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={jest.fn()}
        catalogId="test-catalog"
      />,
    );

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });

  it('closes modal and resets form on successful submission', async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn();
    const mockMutate = jest.fn((_, options) => {
      options.onSuccess();
    });

    mockUseInviteLearners.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    renderWrapper(
      <InviteLearnersModal
        isOpen
        onClose={onCloseMock}
        catalogId="test-catalog"
      />,
    );

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await user.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /send invitations/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
