import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import TableName from './TableName';

describe('TableName', () => {
  const defaultProps = {
    name: 'Example Name',
    destination: '/example-destination',
  };

  it('renders name text', () => {
    renderWrapper(<TableName {...defaultProps} />);
    expect(screen.getByText('Example Name')).toBeInTheDocument();
  });

  it('wraps content in a hyperlink with the correct destination', () => {
    renderWrapper(<TableName {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/example-destination');
  });

  it('does not render an image when image prop is null or undefined', () => {
    const { container } = renderWrapper(<TableName {...defaultProps} />);
    const img = container.querySelector('img');
    expect(img).toBeNull();
  });

  it('renders image with correct src and alt text when image is provided', () => {
    const image = 'https://example.com/logo.png';
    renderWrapper(<TableName {...defaultProps} image={image} />);
    const img = screen.getByAltText('Example Name logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', image);
  });
});
