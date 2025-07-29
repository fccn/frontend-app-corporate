import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTableContext } from '@openedx/paragon';
import TableFooter from './TableFooter';

const mockSetPageSize = jest.fn();

const renderWithContext = (pageSize = 10, pageSizeOptions = [10, 20, 30, 40]) => {
  const contextValue = {
    state: { pageSize, pageIndex: 1 },
    page: 0,
    rows: [{}, {}, {}, {}],
    itemCount: 100,
    previousPage: () => { },
    nextPage: () => { },
    canPreviousPage: true,
    canNextPage: true,
    setPageSize: mockSetPageSize,
  };

  return render(
    <IntlProvider locale="en">
      <DataTableContext.Provider value={contextValue}>
        <TableFooter pageSizeOptions={pageSizeOptions} />
      </DataTableContext.Provider>
    </IntlProvider>,
  );
};

describe('TableFooter', () => {
  beforeEach(() => {
    mockSetPageSize.mockClear();
  });

  it('renders with default page size', () => {
    renderWithContext(20);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('renders all page size options in dropdown', () => {
    const pageOptions = [10, 50, 100];
    renderWithContext(10, pageOptions);
    // Open the dropdown first
    fireEvent.click(screen.getByRole('button', { name: '10' }));
    expect(document.querySelectorAll('a').length).toBe(pageOptions.length);
    pageOptions.forEach((option, index) => {
      expect(document.querySelectorAll('a')[index].textContent).toBe(option.toString());
    });
  });

  it('calls setPageSize with selected value on item click', () => {
    renderWithContext(10);
    fireEvent.click(screen.getByRole('button', { name: '10' }));
    fireEvent.click(screen.getByText('30'));
    expect(mockSetPageSize).toHaveBeenCalledWith(30);
  });

  it('renders RowStatus and Pagination components', () => {
    renderWithContext(10);
    // Since they don't have accessible names, we check by role or fallback to container queries
    expect(screen.getByText(/Rows per page:/i)).toBeInTheDocument();
    expect(screen.getByTestId('row-status')).toBeInTheDocument();
    expect(screen.getByLabelText('table pagination')).toBeInTheDocument();
  });
});
