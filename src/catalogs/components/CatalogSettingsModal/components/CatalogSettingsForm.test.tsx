import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWrapper } from '@src/setupTest';
import * as appHooks from '@src/hooks';
import * as hooks from '@src/catalogs/data/hooks';
import CatalogSettingsForm from './CatalogSettingsForm';

jest.mock('@src/hooks', () => ({
  useCurrentUser: jest.fn(),
}));

jest.mock('@src/catalogs/data/hooks', () => ({
  useCatalogDetails: jest.fn(),
  useUpdateCatalog: jest.fn(),
}));

jest.mock('@src/components/NotificationProvider', () => ({
  useNotification: jest.fn(() => ({
    showNotification: jest.fn(),
  })),
}));

const mockUseCurrentUser = appHooks.useCurrentUser as jest.Mock;
const mockUseCatalogDetails = hooks.useCatalogDetails as jest.Mock;
const mockUseUpdateCatalog = hooks.useUpdateCatalog as jest.Mock;

const mockCatalogDetails = {
  id: '1',
  slug: 'test-catalog',
  name: 'Test Catalog',
  alternativeLink: 'https://example.com',
  supportEmail: 'support@example.com',
  availableStartDate: '2023-01-01T00:00:00Z',
  availableEndDate: '2023-12-31T23:59:59Z',
  courseEnrollmentsLimit: 10,
  userLimit: 100,
  authorizationMessage: 'Welcome message',
  emailRegexes: ['@example\\.com$'],
  isSelfEnrollment: false,
};

const TestWrapper = ({ catalogSlug, onSuccess }: { catalogSlug: string; onSuccess?: () => void }) => {
  const formRef = React.useRef<{ submitForm:() => void }>(null);

  return (
    <div>
      <CatalogSettingsForm ref={formRef} catalogSlug={catalogSlug} onSuccess={onSuccess} />
      <button type="button" onClick={() => formRef.current?.submitForm()}>Submit Form</button>
    </div>
  );
};

describe('CatalogSettingsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCurrentUser.mockReturnValue({
      isAdmin: true,
    });

    mockUseCatalogDetails.mockReturnValue({
      data: mockCatalogDetails,
    });

    mockUseUpdateCatalog.mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it('renders form fields with catalog data', async () => {
    renderWrapper(<CatalogSettingsForm catalogSlug="test-catalog" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Catalog')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('support@example.com')).toBeInTheDocument();
    });
  });

  it('displays all form sections', async () => {
    renderWrapper(<CatalogSettingsForm catalogSlug="test-catalog" />);

    await waitFor(() => {
      expect(screen.getByText(/general information/i)).toBeInTheDocument();
      expect(screen.getByText(/enrollment settings/i)).toBeInTheDocument();
      expect(screen.getByText(/^authorization$/i)).toBeInTheDocument();
      expect(screen.getByText(/advanced settings/i)).toBeInTheDocument();
    });
  });

  it('allows admin to edit all fields', async () => {
    mockUseCurrentUser.mockReturnValue({
      isAdmin: true,
    });

    renderWrapper(<CatalogSettingsForm catalogSlug="test-catalog" />);

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('Test Catalog');
      expect(nameInput).not.toBeDisabled();
    });
  });

  it('restricts non-admin to limited fields only', async () => {
    mockUseCurrentUser.mockReturnValue({
      isAdmin: false,
    });

    renderWrapper(<CatalogSettingsForm catalogSlug="test-catalog" />);

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('Test Catalog');
      expect(nameInput).toBeDisabled();

      // Limited fields should be editable
      const alternativeLinkInput = screen.getByDisplayValue('https://example.com');
      expect(alternativeLinkInput).not.toBeDisabled();
    });
  });

  it('submits form with updated data', async () => {
    const user = userEvent.setup();
    const mockMutate = jest.fn();
    mockUseUpdateCatalog.mockReturnValue({
      mutate: mockMutate,
    });

    renderWrapper(<TestWrapper catalogSlug="test-catalog" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Catalog')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Catalog');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Catalog Name');

    const submitButton = screen.getByText('Submit Form');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('calls onSuccess callback after successful update', async () => {
    const user = userEvent.setup();
    const onSuccessMock = jest.fn();
    const mockMutate = jest.fn((_, options) => {
      options.onSuccess();
    });

    mockUseUpdateCatalog.mockReturnValue({
      mutate: mockMutate,
    });

    renderWrapper(<TestWrapper catalogSlug="test-catalog" onSuccess={onSuccessMock} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Catalog')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit Form');
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup();

    renderWrapper(<CatalogSettingsForm catalogSlug="test-catalog" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Catalog')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Catalog');
    await user.clear(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/catalog name must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('renders email regexes input', async () => {
    renderWrapper(<CatalogSettingsForm catalogSlug="test-catalog" />);

    await waitFor(() => {
      expect(screen.getByText(/allowed email domains/i)).toBeInTheDocument();
    });
  });

  it('handles date fields correctly', async () => {
    renderWrapper(<CatalogSettingsForm catalogSlug="test-catalog" />);

    await waitFor(() => {
      const startDateInput = screen.getByLabelText(/start date/i);
      const endDateInput = screen.getByLabelText(/end date/i);

      expect(startDateInput).toBeInTheDocument();
      expect(endDateInput).toBeInTheDocument();
    });
  });
});
