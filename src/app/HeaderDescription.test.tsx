import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import HeaderDescription from './HeaderDescription';

jest.mock('@openedx/paragon', () => ({
  ...jest.requireActual('@openedx/paragon'),
  useMediaQuery: jest.fn(),
}));
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Copy to clipboard', () => {
    it('renders copy button if copyableDescription is true', () => {
      render(<HeaderDescription context={{ ...mockContext, copyableDescription: true }} info={mockInfo} />);
      const copyButton = screen.getByRole('button', { name: 'Copy description' });
      expect(copyButton).toBeInTheDocument();
    });

    it('copies description to clipboard when copy button is clicked', async () => {
      render(<HeaderDescription context={{ ...mockContext, copyableDescription: true }} info={mockInfo} />);
      const copyButton = screen.getByRole('button', { name: 'Copy description' });
      fireEvent.click(copyButton);
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockContext.description);
      });
    });
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
    it('renders image when imageUrl is provided', async () => {
      render(<HeaderDescription context={mockContext} info={mockInfo} />);

      const imageContainer = await screen.findByTestId('image-with-skeleton');
      expect(imageContainer).toBeInTheDocument();
      expect(imageContainer.querySelector('img')).toHaveAttribute('src', mockContext.imageUrl);
      expect(imageContainer.querySelector('img')).toHaveAttribute('alt', mockContext.title);
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
