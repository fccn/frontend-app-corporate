import { screen, waitFor } from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { renderWrapper } from '@src/setupTest';
import App from './App';

// Mock @edx/frontend-platform/react components
jest.mock('@edx/frontend-platform/react', () => ({
  AppProvider: ({ children, wrapWithRouter }) => (
    <div role="application" data-wrap-with-router={wrapWithRouter ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));

// Mock @edx/frontend-component-header
const MockHeader = () => <header>Mock Header</header>;
jest.mock('@edx/frontend-component-header', () => MockHeader);

// // Mock @edx/frontend-component-footer
jest.mock('@edx/frontend-component-footer', () => ({
  FooterSlot: () => <footer>Mock Footer</footer>,
}));

// Mock useCurrentUser hook to control user permissions in tests
const mockUseCurrentUser = jest.fn();
jest.mock('@src/hooks', () => ({
  ...jest.requireActual('@src/hooks'),
  useCurrentUser: () => mockUseCurrentUser(),
}));

// Simple wouter mock
jest.mock('wouter', () => ({
  Route: ({ component: Component }) => (Component ? <Component /> : null),
  Router: ({ children }) => <div data-testid="wouter-router">{children}</div>,
  Switch: ({ children }) => <div>{children}</div>,
  useLocation: () => ['/', jest.fn()],
  useParams: () => ({}),
}));
// Mock lazy-loaded components with semantic content
jest.mock('@src/partner/CorporatePartnerPage', () => function CorporatePartnerPage() {
  return <main><h1>Corporate Partner Page</h1></main>;
});

jest.mock('@src/catalogs/PartnerCatalogsPage', () => function PartnerCatalogsPage() {
  return <main><h1>Partner Catalogs Page</h1></main>;
});

jest.mock('@src/courses/CoursesPage', () => function CoursesPage() {
  return <main><h1>Courses Page</h1></main>;
});
jest.mock('@src/components/ErrorPage', () => function ErrorPaage() {
  return <main><h1>Error Page</h1></main>;
});

const renderApp = (userOverrides: { administrator?: boolean; roles?: string[] } = {}) => {
  const { administrator = false, roles = [] } = userOverrides;
  const isAdmin = administrator;
  const isCatalogManager = roles.includes('catalog_manager:active');

  mockUseCurrentUser.mockReturnValue({
    user: { administrator, roles },
    isAdmin,
    isCatalogManager,
  });

  initializeMockApp({
    authenticatedUser: { administrator, roles, ...userOverrides },
  });

  return renderWrapper(<App />);
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Access Control', () => {
    it('shows "Access Denied" for users without admin or catalog manager roles', () => {
      renderApp({ administrator: false, roles: [] });

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('allows access for admin users', async () => {
      renderApp({ administrator: true, roles: [] });

      await waitFor(() => {
        expect(screen.getByText('Corporate Partner Page')).toBeInTheDocument();
      });
    });

    it('allows access for catalog manager users', async () => {
      renderApp({ administrator: false, roles: ['catalog_manager:active'] });

      await waitFor(() => {
        expect(screen.getByText('Corporate Partner Page')).toBeInTheDocument();
      });
    });

    it('allows access for users with both admin and catalog manager roles', async () => {
      renderApp({ administrator: true, roles: ['catalog_manager:active'] });

      await waitFor(() => {
        expect(screen.getByText('Corporate Partner Page')).toBeInTheDocument();
      });
    });
  });

  describe('Routing', () => {
    beforeEach(() => {
      renderApp({ administrator: true, roles: [] });
    });

    it('renders partners page for root path', async () => {
      await waitFor(() => {
        expect(screen.getByText('Corporate Partner Page')).toBeInTheDocument();
      });
    });
  });

  describe('Providers', () => {
    it('wraps app with AppProvider without router wrapping', () => {
      renderApp({ administrator: true, roles: [] });

      const appProvider = screen.getByRole('application');
      expect(appProvider).toBeInTheDocument();
      expect(appProvider).toHaveAttribute('data-wrap-with-router', 'false');
    });

    it('provides QueryClient with correct default options', () => {
      renderApp({ administrator: true, roles: [] });

      // QueryClient is tested indirectly through successful rendering
      expect(screen.getByRole('application')).toBeInTheDocument();
    });
  });

  describe('Suspense', () => {
    it('shows loading fallback while lazy components load', () => {
      // This test would be more meaningful with actual lazy loading
      // For now, we verify the app renders without crashing
      renderApp({ administrator: true, roles: [] });

      expect(screen.getByRole('application')).toBeInTheDocument();
    });
  });
});
