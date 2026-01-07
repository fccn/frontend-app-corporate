import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import Loader from './Loader';

const renderLoader = (props: any) => renderWrapper(<Loader {...props} />);

describe('Loader', () => {
  it('renders spinner with default props', () => {
    renderLoader({});

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-border', 'text-primary');
    expect(spinner).toHaveTextContent('Loading');
  });

  it('renders small spinner when small prop is true', () => {
    renderLoader({ small: true });

    const spinner = screen.getByRole('status');

    expect(spinner).toHaveClass('spinner-border-sm');
  });

  it('renders normal size spinner when small prop is false', () => {
    renderLoader({ small: false });

    const spinner = screen.getByRole('status');
    expect(spinner).not.toHaveClass('spinner-border-sm');
  });

  it('renders text when provided', () => {
    const testText = 'Please wait...';
    renderLoader({ text: testText });

    expect(screen.getByText(testText)).toBeInTheDocument();
    expect(screen.getByText(testText)).toHaveClass('mt-2', 'text-muted');
  });

  it('does not render text when not provided', () => {
    renderLoader({});

    expect(screen.queryByText('Please wait...')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'my-custom-class';
    renderLoader({ className: customClass });

    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('renders with default styling classes', () => {
    renderLoader({});

    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
  });

  it('renders as full page overlay when fullPage is true', () => {
    renderLoader({ fullPage: true });

    const overlay = screen.getByRole('status').parentElement?.parentElement;
    expect(overlay).toHaveClass(
      'position-fixed',
      'top-0',
      'start-0',
      'w-100',
      'h-100',
      'd-flex',
      'align-items-center',
      'justify-content-center',
      'bg-white',
    );
  });

  it('renders inline when fullPage is false', () => {
    renderLoader({ fullPage: false });

    const container = screen.getByRole('status').parentElement;
    expect(container).not.toHaveClass('position-fixed');
    expect(container?.parentElement).not.toHaveClass('position-fixed');
  });

  it('renders inline by default when no fullPage prop provided', () => {
    renderLoader({});

    const container = screen.getByRole('status').parentElement;
    expect(container).not.toHaveClass('position-fixed');
    expect(container?.parentElement).not.toHaveClass('position-fixed');
  });

  it('renders normal size spinner by default', () => {
    renderLoader({});

    const spinner = screen.getByRole('status');
    expect(spinner).not.toHaveAttribute('data-size');
  });

  it('handles empty className', () => {
    renderLoader({ className: '' });

    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('d-flex', 'flex-column', 'align-items-center', 'justify-content-center');
  });
});
