import { render, screen } from '@testing-library/react';
import { breakpoints, useMediaQuery } from '@openedx/paragon';
import HeaderDescription from './HeaderDescription';

// Mock the ImageWithSkeleton component
jest.mock('./ImageWithSkeleton', () => function ImageWithSkeleton({
  src, alt, width, height,
}: {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
}) {
  return (
    <div data-testid="image-with-skeleton">
      <img src={src} alt={alt} width={width} height={height} />
    </div>
  );
});

// Mock useMediaQuery hook
jest.mock('@openedx/paragon', () => ({
  ...jest.requireActual('@openedx/paragon'),
  useMediaQuery: jest.fn(),
}));

describe('HeaderDescription', () => {
  const mockContext = {
    title: 'Test Organization',
    imageUrl: 'https://example.com/logo.png',
    description: 'This is a test organization description',
  };

  const mockInfo = [
    { title: 'Catalogs', value: '5' },
    { title: 'Courses', value: '25' },
    { title: 'Students', value: '1,250' },
  ];

  beforeEach(() => {
    // Default to desktop view
    (useMediaQuery as jest.Mock).mockImplementation(({ maxWidth }) => {
      if (maxWidth === breakpoints.small.maxWidth) {
        return false; // isSmall = false
      }
      if (maxWidth === breakpoints.medium.maxWidth) {
        return false; // isMedium = false
      }
      return false;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the context title', () => {
      render(<HeaderDescription context={mockContext} info={mockInfo} />);
      expect(screen.getByText(mockContext.title)).toBeInTheDocument();
    });

    it('renders the context description', () => {
      render(<HeaderDescription context={mockContext} info={mockInfo} />);
      expect(screen.getByText(mockContext.description)).toBeInTheDocument();
    });

    it('renders all info items', () => {
      render(<HeaderDescription context={mockContext} info={mockInfo} />);

      expect(screen.getByText('Catalogs')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('Students')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
    });

    it('handles empty info array', () => {
      render(<HeaderDescription context={mockContext} info={[]} />);
      expect(screen.getByText(mockContext.title)).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('renders image when imageUrl is provided', () => {
      render(<HeaderDescription context={mockContext} info={mockInfo} />);
      expect(screen.getByTestId('image-with-skeleton')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', mockContext.imageUrl);
      expect(screen.getByRole('img')).toHaveAttribute('alt', mockContext.title);
    });

    it('does not render image when imageUrl is null', () => {
      const contextWithoutImage = { ...mockContext, imageUrl: null };
      render(<HeaderDescription context={contextWithoutImage} info={mockInfo} />);
      expect(screen.queryByTestId('image-with-skeleton')).not.toBeInTheDocument();
    });
  });

  describe('Optional Props', () => {
    it('handles missing description gracefully', () => {
      const contextWithoutDescription = {
        title: mockContext.title,
        imageUrl: mockContext.imageUrl,
      };

      render(<HeaderDescription context={contextWithoutDescription} info={mockInfo} />);
      expect(screen.getByText(contextWithoutDescription.title)).toBeInTheDocument();
    });

    it('renders children when provided', () => {
      render(
        <HeaderDescription context={mockContext} info={mockInfo}>
          <div data-testid="custom-children">Custom content</div>
        </HeaderDescription>,
      );

      expect(screen.getByTestId('custom-children')).toBeInTheDocument();
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });
  });
});
