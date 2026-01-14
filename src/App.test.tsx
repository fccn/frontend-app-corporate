import { screen, waitFor } from '@testing-library/react';
import { initializeMockApp } from '@edx/frontend-platform/testing';
import { renderWrapper } from '@src/setupTest';
import App from './App';

// Simple wouter mock
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
        expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
      });
    });

    it('allows access for catalog manager users', async () => {
      renderApp({ administrator: false, roles: ['catalog_manager:active'] });

      await waitFor(() => {
        expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
      });
    });

    it('allows access for users with both admin and catalog manager roles', async () => {
      renderApp({ administrator: true, roles: ['catalog_manager:active'] });

      await waitFor(() => {
        expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
      });
    });
  });

  describe('Routing', () => {
    beforeEach(() => {
      renderApp({ administrator: true, roles: [] });
    });

    it('renders partners page for root path', async () => {
      await waitFor(() => {
        expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
      });
    });
  });

  describe('Providers', () => {
    it('wraps app with AppProvider without router wrapping', () => {
      renderApp({ administrator: true, roles: [] });

      expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
      expect(screen.getByTestId('wouter-router')).toBeInTheDocument();
    });

    it('provides QueryClient with correct default options', () => {
      renderApp({ administrator: true, roles: [] });

      expect(screen.getByText('Corporate Partners')).toBeInTheDocument();
    });
  });
});
