import { screen } from '@testing-library/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { renderWrapper } from '@src/setupTest';
import CorporatePartnerPage from './CorporatePartnerPage';

jest.mock('@tanstack/react-query');
jest.mock('wouter', () => ({
  useLocation: () => jest.fn(),
}));
jest.mock('./data/api');

const mockPartners = {
  count: 2,
  numPages: 1,
  currentPage: 1,
  start: 0,
  results: [{
    id: 1,
    name: 'Example University',
    slug: 'example-university',
    homepageUrl: 'https://exampleu.com',
    logo: 'https://exampleu.com/logo.png',
    catalogs: 5,
    courses: 12,
    enrollments: 1000,
    certified: 400,
  }],
};

describe('CorporatePartnerPage', () => {
  beforeEach(() => {
    (useSuspenseQuery as jest.Mock).mockReturnValue({
      data: mockPartners,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders page with title', () => {
    renderWrapper(<CorporatePartnerPage />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders CorporatePartnerList component', () => {
    renderWrapper(<CorporatePartnerPage />);

    // The list should render (checking for table structure)
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('uses AppLayout wrapper', () => {
    renderWrapper(<CorporatePartnerPage />);

    // AppLayout should be present (header will be rendered)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
