import { screen } from '@testing-library/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { renderWrapper } from '@src/setupTest';
import CorporatePartnerList from './CorporatePartnerList';

jest.mock('@tanstack/react-query');

jest.mock('@src/hooks', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../api');

// Mock component to avoid Paragon-specific rendering issues
jest.mock('../../app/TableFooter', () => function TableFooter() {
  return <div data-testid="table-footer" />;
});

const mockPartners = [
  {
    code: 1,
    name: 'Example University',
    homepage: 'https://exampleu.com/university',
    logo: 'https://exampleu.com/logo.png',
    catalogs: 5,
    courses: 12,
    enrollments: 1000,
    certified: 400,
  },
  {
    code: 2,
    name: 'Test Institute',
    homepage: 'https://test.com/institute',
    logo: 'https://test.com/logo.png',
    catalogs: 2,
    courses: 8,
    enrollments: 700,
    certified: 300,
  },
];

describe('CorporatePartnerList', () => {
  beforeEach(() => {
    (useSuspenseQuery as jest.Mock).mockReturnValue({
      data: mockPartners,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a table with partner data', () => {
    renderWrapper(<CorporatePartnerList />);

    // Check if partner names are rendered
    expect(screen.getByText('Example University')).toBeInTheDocument();
    expect(screen.getByText('Test Institute')).toBeInTheDocument();

    // Check if courses data is rendered
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    // Check if certified learners data is rendered
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();

    // Check if action button is present (Icon with tooltip)
    expect(screen.getAllByLabelText('view-action')).toHaveLength(2);

    // Footer should be rendered
    expect(screen.getByTestId('table-footer')).toBeInTheDocument();
  });

  it('shows loading state if data is still loading', () => {
    (useSuspenseQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    renderWrapper(<CorporatePartnerList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
