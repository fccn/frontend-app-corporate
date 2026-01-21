import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import { CellName } from './Cells';

describe('CellName', () => {
  const defaultProps = {
    name: 'Example Name',
    destination: '/example-destination',
  };

  it('renders name text', () => {
    renderWrapper(<CellName {...defaultProps} />);
    expect(screen.getByText('Example Name')).toBeInTheDocument();
  });

  it('wraps content in a hyperlink with the correct destination', () => {
    renderWrapper(<CellName {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/example-destination');
  });

  it('does not render an image when image prop is null or undefined', () => {
    const { container } = renderWrapper(<CellName {...defaultProps} />);
    const img = container.querySelector('img');
    expect(img).toBeNull();
  });

  it('renders image with correct src and alt text when image is provided', () => {
    const image = 'https://example.com/logo.png';
    renderWrapper(<CellName {...defaultProps} image={image} />);
    const img = screen.getByAltText('Example Name logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', image);
  });
});
