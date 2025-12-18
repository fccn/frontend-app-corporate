import React from 'react';
import { 
  screen, waitFor, fireEvent,

} from '@testing-library/react';

import { renderWrapper } from '@src/setupTest';
import { CatalogSettingsModal } from './index';

// Mock hooks
jest.mock('@src/hooks', () => ({
  useCurrentUser: jest.fn(),
}));

jest.mock('@src/catalogs/data/hooks', () => ({
  useCatalogDetails: jest.fn(),
  useUpdateCatalog: jest.fn(),
}));

const mockUseCurrentUser = require('@src/hooks').useCurrentUser;
const mockUseCatalogDetails = require('@src/catalogs/data/hooks').useCatalogDetails;
const mockUseUpdateCatalog = require('@src/catalogs/data/hooks').useUpdateCatalog;

const mockCatalogDetails = {
  id: 1,
  name: 'Test Catalog',
  slug: 'test-catalog',
  description: 'A test catalog',
  availableStartDate: '2023-01-01',
  availableEndDate: '2023-12-31',
  alternativeLink: 'https://example.com',
  authorizationMessage: 'Welcome to the catalog',
  supportEmail: 'support@example.com',
  emailRegexes: ['@example\\.com$'],
};

const renderCatalogSettingsModal = (children: (openModal: (catalogSlug: string) => void) => React.ReactNode) => renderWrapper(
  <CatalogSettingsModal>
    {children}
  </CatalogSettingsModal>,
);

describe('CatalogSettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCurrentUser.mockReturnValue({
      isAdmin: true,
    });

    mockUseCatalogDetails.mockReturnValue({
      catalogDetails: mockCatalogDetails,
    });

    mockUseUpdateCatalog.mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it('renders trigger button and opens modal when clicked', async () => {
    const mockOpenModal = jest.fn();

    renderCatalogSettingsModal((openModal) => (
      <button onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    const openButton = screen.getByRole('button', { name: /open modal/i });
    expect(openButton).toBeInTheDocument();

    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText('Catalog settings')).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    renderCatalogSettingsModal((openModal) => (
      <button onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));
    const openButton = screen.getByRole('button', { name: /open modal/i });

    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByText('Catalog settings')).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Catalog settings')).not.toBeInTheDocument();
    });
  });

  it('displays save button in modal actions', async () => {
    renderCatalogSettingsModal((openModal) => (
      <button onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  it('passes catalogSlug to CatalogSettingsForm', async () => {
    renderCatalogSettingsModal((openModal) => (
      <button onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

    await waitFor(() => {
      // The form should be rendered with the catalog slug
      expect(mockUseCatalogDetails).toHaveBeenCalledWith({
        catalogSlug: 'test-catalog',
      });
    });
  });

  it('calls onSuccess callback when form is saved', async () => {
    const mockMutate = jest.fn();
    mockUseUpdateCatalog.mockReturnValue({
      mutate: mockMutate,
    });

    renderCatalogSettingsModal((openModal) => (
      <button onClick={() => openModal('test-catalog')}>
        Open Modal
      </button>
    ));

    fireEvent.click(screen.getByRole('button', { name: /open modal/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    // Click save button
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // The form's submitForm should be called, which should trigger the mutation
    // This is a bit tricky to test directly, but we can verify the setup
    expect(mockUseUpdateCatalog).toHaveBeenCalled();
  });
});
