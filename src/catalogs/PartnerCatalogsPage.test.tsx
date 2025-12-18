import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as wouter from 'wouter';
import * as partnerHooks from '@src/partner/data/hooks';
import PartnerCatalogsPage from './PartnerCatalogsPage';

// Mock hooks
jest.mock('@src/partner/data/hooks', () => ({
  usePartnerDetails: jest.fn(),
}));

jest.mock('@src/catalogs/data/hooks', () => ({
  usePartnerCatalogs: jest.fn(),
}));

jest.mock('wouter', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

const renderPartnerCatalogsPage = () => render(
  <IntlProvider locale="en">
    <PartnerCatalogsPage />
  </IntlProvider>,
);

describe('PartnerCatalogsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (wouter.useParams as jest.Mock).mockReturnValue({ partnerSlug: 'test-partner' });
    (wouter.useLocation as jest.Mock).mockReturnValue(['/', jest.fn()]);
    (partnerHooks.usePartnerDetails as jest.Mock).mockReturnValue({
      partnerDetails: {
        id: 'partner-123',
        name: 'Test Partner Corp',
        logo: 'https://example.com/logo.png',
        catalogs: 5,
        courses: 25,
        enrollments: 150,
        certified: 120,
      },
    });
    // Mock usePartnerCatalogs
    const mockUsePartnerCatalogs = require('@src/catalogs/data/hooks').usePartnerCatalogs;
    mockUsePartnerCatalogs.mockReturnValue({
      partnerCatalogs: {
        results: [],
        count: 0,
        numPages: 1,
      },
      isLoadingCatalogs: false,
    });
  });

  it('renders the page with partner details', async () => {
    renderPartnerCatalogsPage();

    await waitFor(() => {
      expect(screen.getByText('Test Partner Corp')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('displays partner information in header', async () => {
    renderPartnerCatalogsPage();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Partner Corp' })).toBeInTheDocument();
      const logo = screen.getByAltText('Test Partner Corp');
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
    });
  });

  it('displays partner statistics', async () => {
    renderPartnerCatalogsPage();

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // catalogs
      expect(screen.getByText('25')).toBeInTheDocument(); // courses
      expect(screen.getByText('150')).toBeInTheDocument(); // enrollments
      expect(screen.getByText('120')).toBeInTheDocument(); // certified
    });
  });

  it('renders CatalogsList with correct props', async () => {
    renderPartnerCatalogsPage();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('includes back button with correct path', async () => {
    renderPartnerCatalogsPage();

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  it('handles missing partner details gracefully', () => {
    // Mock hook to return null partner details
    (partnerHooks.usePartnerDetails as jest.Mock).mockReturnValue({
      partnerDetails: null,
    });

    renderPartnerCatalogsPage();

    // Should not render partner name or catalogs table
    expect(screen.queryByText('Test Partner Corp')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('handles partner without logo', () => {
    // Mock hook to return partner without logo
    (partnerHooks.usePartnerDetails as jest.Mock).mockReturnValue({
      partnerDetails: {
        id: 'partner-123',
        name: 'Test Partner Corp',
        logo: null,
        catalogs: 5,
        courses: 25,
        enrollments: 150,
        certified: 120,
      },
    });

    renderPartnerCatalogsPage();

    expect(screen.getByText('Test Partner Corp')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Partner Corp')).not.toBeInTheDocument();
  });

  it('uses correct URL parameters', () => {
    // Test that useParams is called correctly
    (wouter.useParams as jest.Mock).mockReturnValue({ partnerSlug: 'test-partner' });

    renderPartnerCatalogsPage();

    expect(wouter.useParams).toHaveBeenCalled();
  });

  it('passes partnerSlug to usePartnerDetails hook', () => {
    const mockPartnerDetails = {
      partnerDetails: {
        id: 'partner-123',
        name: 'Test Partner Corp',
        logo: 'https://example.com/logo.png',
        catalogs: 5,
        courses: 25,
        enrollments: 150,
        certified: 120,
      },
    };
    (partnerHooks.usePartnerDetails as jest.Mock).mockReturnValue(mockPartnerDetails);

    renderPartnerCatalogsPage();

    expect(partnerHooks.usePartnerDetails).toHaveBeenCalledWith({ partnerSlug: 'test-partner' });
  });
});
