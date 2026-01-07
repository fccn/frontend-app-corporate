import { screen, fireEvent } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import * as appHooks from '@src/hooks';
import AppLayout from './AppLayout';
// Mock the hooks
jest.mock('@src/hooks', () => ({
  useNavigate: jest.fn(),
}));

// Mock Header component
jest.mock('@edx/frontend-component-header', () => function MockHeader() {
  return <div>Header</div>;
});

// Mock FooterSlot component
jest.mock('@edx/frontend-component-footer', () => ({
  FooterSlot: function MockFooterSlot() {
    return <div>Footer</div>;
  },
}));

const mockUseNavigate = appHooks.useNavigate as jest.Mock;

const renderAppLayout = (props: any) => renderWrapper(
  <AppLayout {...props} />,
);

describe('AppLayout', () => {
  const mockNavigate = jest.fn();
  const defaultProps = {
    children: <div>Test Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
    // Mock window.history.back
    Object.defineProperty(window, 'history', {
      value: { back: jest.fn() },
      writable: true,
    });
  });

  it('renders header, children, and footer by default', () => {
    renderAppLayout(defaultProps);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    renderAppLayout({ ...defaultProps, title: 'Test Title' });

    expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    renderAppLayout(defaultProps);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders back button when withBackButton is true', () => {
    renderAppLayout({ ...defaultProps, withBackButton: true });

    expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/Back/)).toBeInTheDocument();
  });

  it('does not render back button when withBackButton is false', () => {
    renderAppLayout({ ...defaultProps, withBackButton: false });

    expect(screen.queryByRole('button', { name: /Back/ })).not.toBeInTheDocument();
  });

  it('calls window.history.back when back button is clicked without backPath', () => {
    renderAppLayout({ ...defaultProps, withBackButton: true });

    const backButton = screen.getByRole('button', { name: /Back/ });
    fireEvent.click(backButton);

    expect(window.history.back).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls navigate with backPath when back button is clicked with backPath', () => {
    const backPath = '/test-path';
    renderAppLayout({ ...defaultProps, withBackButton: true, backPath });

    const backButton = screen.getByRole('button', { name: /Back/ });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(backPath);
    expect(window.history.back).not.toHaveBeenCalled();
  });

  it('renders footer when withFooter is true', () => {
    renderAppLayout({ ...defaultProps, withFooter: true });

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('does not render footer when withFooter is false', () => {
    renderAppLayout({ ...defaultProps, withFooter: false });

    expect(screen.queryByText('Footer')).not.toBeInTheDocument();
  });

  it('renders children in container with correct size', () => {
    renderAppLayout(defaultProps);

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('container-mw-xl');
    expect(container).toHaveClass('container-fluid');
    expect(container).toHaveClass('p-4');
  });

  it('renders back button with correct styling', () => {
    renderAppLayout({ ...defaultProps, withBackButton: true });

    const backButton = screen.getByRole('button', { name: /Back/ });
    expect(backButton).toHaveClass('btn');
    expect(backButton).toHaveClass('btn-link');
    expect(backButton).toHaveClass('d-flex');
    expect(backButton).toHaveClass('align-items-center');
  });

  it('renders back button text with correct styling', () => {
    renderAppLayout({ ...defaultProps, withBackButton: true });

    const backText = screen.getByText('Back');
    expect(backText).toHaveClass('text-primary');
  });

  it('renders title with correct styling', () => {
    renderAppLayout({ ...defaultProps, title: 'Test Title' });

    const title = screen.getByRole('heading', { name: 'Test Title' });
    expect(title).toHaveClass('my-4');
  });
});
