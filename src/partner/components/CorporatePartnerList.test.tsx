import { screen } from '@testing-library/react';
import { renderWrapper } from '@src/setupTest';
import CorporatePartnerList from './CorporatePartnerList';

jest.mock('wouter', () => ({
  useLocation: () => jest.fn(),
}));

jest.mock('@src/partner/data/hooks', () => ({
  usePartners: () => ({
    data: {
      partners: [{
        id: 1,
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
      ],
      count: 2,
      numPages: 1,
    },
    isLoading: false,
  }),
}));

describe('CorporatePartnerList', () => {
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
    expect(screen.getAllByLabelText(/view/i)).toHaveLength(2);

    // Footer should be rendered
    expect(screen.getByText(/Rows per page/i)).toBeInTheDocument();
  });
});
