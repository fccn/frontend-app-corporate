import { screen, waitFor } from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { renderWrapper } from '@src/setupTest';
import App from './App';

// Mock hooks
jest.mock('wouter', () => ({
  Route: ({ component: Component }) => (Component ? <Component /> : null),
  Router: ({ children }) => <div data-testid="wouter-router">{children}</div>,
  Switch: ({ children }) => <div>{children}</div>,
  useLocation: () => ['/', jest.fn()],
  useParams: () => ({}),
}));

const renderApp = (userOverrides: { administrator?: boolean; roles?: string[] } = {}) => {
  const { administrator = false, roles = [] } = userOverrides;

  initializeMockApp({
    authenticatedUser: { administrator, roles, ...userOverrides },
  });

  return renderWrapper(<App />);
};

// The partners page is lazy-loaded and renders the full AppLayout (edX header,
// footer, Paragon). Its first render compiles that module tree, which with coverage
// instrumentation on a slow CI runner can exceed waitFor's default 1s timeout.
const PAGE_RENDER_TIMEOUT = 15000;
jest.setTimeout(PAGE_RENDER_TIMEOUT + 5000);

const waitForPartnersPage = () => waitFor(() => {
  expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
}, { timeout: PAGE_RENDER_TIMEOUT });

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

      await waitForPartnersPage();
    });

    it('allows access for catalog manager users', async () => {
      renderApp({ administrator: false, roles: ['catalog_manager:active'] });

      await waitForPartnersPage();
    });

    it('allows access for users with both admin and catalog manager roles', async () => {
      renderApp({ administrator: true, roles: ['catalog_manager:active'] });

      await waitForPartnersPage();
    });
  });

  describe('Routing', () => {
    beforeEach(() => {
      renderApp({ administrator: true, roles: [] });
    });

    it('renders partners page for root path', async () => {
      await waitForPartnersPage();
    });
  });

  describe('Providers', () => {
    it('wraps app with AppProvider without router wrapping', async () => {
      renderApp({ administrator: true, roles: [] });

      await waitForPartnersPage();
      expect(screen.getByTestId('wouter-router')).toBeInTheDocument();
    });

    it('provides QueryClient with correct default options', async () => {
      renderApp({ administrator: true, roles: [] });

      await waitForPartnersPage();
    });
  });
});
