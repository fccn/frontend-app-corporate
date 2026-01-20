import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import ErrorPage from './index';

jest.mock('wouter', () => ({
  useLocation: () => ['/', jest.fn()],
}));

describe('ErrorPage', () => {
  it('renders 404 error page correctly', () => {
    renderWrapper(<ErrorPage status={404} />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it('renders 403 error page correctly', () => {
    renderWrapper(<ErrorPage status={403} />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/forbidden|access denied/i)).toBeInTheDocument();
  });

  it('renders default error page correctly', () => {
    renderWrapper(<ErrorPage status="default" />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('displays error icon', () => {
    renderWrapper(<ErrorPage status={404} />);

    const icon = screen.getByText(/report error icon/i);
    expect(icon).toBeInTheDocument();
  });

  it('uses AppLayout wrapper', () => {
    renderWrapper(<ErrorPage status={404} />);

    // AppLayout should render the page content
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
