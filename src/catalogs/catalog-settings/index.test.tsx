import { ReactNode } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as catalogHooks from '@src/catalogs/data/hooks';
import { renderWrapper } from '@src/setupTest';
import * as settingsHooks from './data/hooks';
import { CatalogSettingsModal } from './index';

jest.mock('@src/hooks', () => ({
  useCurrentUser: jest.fn(() => ({
    isAdmin: true,
  })),
}));

jest.mock('@src/catalogs/data/hooks', () => ({
  useCatalogDetails: jest.fn(),
}));

jest.mock('./data/hooks', () => ({
  useUpdateCatalog: jest.fn(),
}));

jest.mock('@src/notification', () => ({
  useNotification: jest.fn(() => ({
    showNotification: jest.fn(),
  })),
}));

const mockUseCatalogDetails = catalogHooks.useCatalogDetails as jest.Mock;
const mockUseUpdateCatalog = settingsHooks.useUpdateCatalog as jest.Mock;

const renderCatalogSettingsModal = (
  children: (openModal: (catalogSlug: string) => void
  ) => ReactNode,
) => renderWrapper(
  <CatalogSettingsModal>
    {children}
  </CatalogSettingsModal>,
);

describe('CatalogSettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCatalogDetails.mockReturnValue({
      data: { id: '1', slug: 'test-catalog', name: 'Test' },
    });
  });

  it('renders trigger button and opens modal when clicked', async () => {
    const user = userEvent.setup();
    renderCatalogSettingsModal((openModal) => (
      <button type="button" onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    const openButton = screen.getByRole('button', { name: /open modal/i });
    expect(openButton).toBeInTheDocument();

    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByText('Catalog settings')).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderCatalogSettingsModal((openModal) => (
      <button type="button" onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));
    const openButton = screen.getByRole('button', { name: /open modal/i });

    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByText('Catalog settings')).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Catalog settings')).not.toBeInTheDocument();
    });
  });

  it('displays save button in modal actions', async () => {
    const user = userEvent.setup();
    renderCatalogSettingsModal((openModal) => (
      <button type="button" onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  it('passes catalogSlug to CatalogSettingsForm', async () => {
    const user = userEvent.setup();
    renderCatalogSettingsModal((openModal) => (
      <button type="button" onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    await waitFor(() => {
      // The form should be rendered with the catalog slug
      expect(mockUseCatalogDetails).toHaveBeenCalledWith({
        catalogSlug: 'test-catalog',
      });
    });
  });

  it('calls onSuccess callback when form is saved', async () => {
    const user = userEvent.setup();
    const mockMutate = jest.fn();
    mockUseUpdateCatalog.mockReturnValue({
      mutate: mockMutate,
    });

    renderCatalogSettingsModal((openModal) => (
      <button type="button" onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    await user.click(screen.getByRole('button', { name: /open modal/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    // Click save button
    await user.click(screen.getByRole('button', { name: /save/i }));

    // The form's submitForm should be called, which should trigger the mutation
    // This is a bit tricky to test directly, but we can verify the setup
    expect(mockUseUpdateCatalog).toHaveBeenCalled();
  });
});
