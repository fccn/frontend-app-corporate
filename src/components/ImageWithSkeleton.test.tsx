import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';
import ImageWithSkeleton from './ImageWithSkeleton';

describe('ImageWithSkeleton', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
    width: 100,
    height: 100,
    className: 'test-class',
  };

  beforeEach(() => {
    // Mock Image.prototype.onload to simulate image loading
    Object.defineProperty(Image.prototype, 'onload', {
      writable: true,
    });
  });

  it('renders skeleton initially', () => {
    render(<ImageWithSkeleton {...defaultProps} />);
    const skeleton = document.querySelector('.react-loading-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
    expect(screen.getByAltText('Test image')).toHaveStyle('display: none');
  });

  it('renders image with correct attributes', () => {
    render(<ImageWithSkeleton {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveClass('test-class');
  });

  it('shows image and hides skeleton when image loads', async () => {
    render(<ImageWithSkeleton {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    const skeleton = document.querySelector('.react-loading-skeleton');
    expect(skeleton).toBeInTheDocument();
    // Simulate image load by firing the onLoad event
    fireEvent.load(image);

    await waitFor(() => {
      expect(image).toHaveStyle('display: block');
      expect(skeleton).not.toBeInTheDocument();
    });
  });

  it('applies correct styles to image', () => {
    render(<ImageWithSkeleton {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    expect(image).toHaveStyle({
      'max-height': '100px',
      width: '100px',
      'object-fit': 'cover',
    });
  });

  it('handles string dimensions', () => {
    const stringProps = {
      ...defaultProps,
      width: '200px',
      height: '150px',
    };

    render(<ImageWithSkeleton {...stringProps} />);

    const image = screen.getByAltText('Test image');
    expect(image).toHaveStyle({
      'max-height': '150px',
      width: '200px',
      'object-fit': 'cover',
    });

    const skeleton = document.querySelector('.react-loading-skeleton');

    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '150px',
    });
  });

  it('handles missing className', () => {
    const { className, ...propsWithoutClass } = defaultProps;
    render(<ImageWithSkeleton {...propsWithoutClass} />);

    const image = screen.getByAltText('Test image');
    expect(image).not.toHaveClass('test-class');
  });

  it('renders both image and skeleton in container', () => {
    render(<ImageWithSkeleton {...defaultProps} />);

    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toBeInTheDocument();
    expect(container?.children).toHaveLength(2); // img and skeleton
  });
});
