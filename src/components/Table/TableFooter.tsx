import { useContext } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, DataTableContext, Dropdown, TablePaginationMinimal,
} from '@openedx/paragon';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '@src/constants';
import messages from './messages';

type DataTableContextValue = {
  state: {
    pageSize: number;
  };
  setPageSize: (selected: number) => void;
};

type TableFooterProps = {
  pageSizeOptions?: Array<number>;
};

const TableFooter = ({
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: TableFooterProps) => {
  const intl = useIntl();
  const { setPageSize, state } = useContext<DataTableContextValue>(DataTableContext);

  return (
    <DataTable.TableFooter>
      <div className="d-flex justify-content-end align-items-center w-100 small">
        <Dropdown>
          {intl.formatMessage(messages.tableFooterRowSelector)}
          <Dropdown.Toggle
            size="sm"
            id="table-number-rows-selector"
            className="ml-1 p-1"
            variant="ternary"
          >
            {state.pageSize}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {pageSizeOptions.map((num) => (
              <Dropdown.Item
                key={`footer-table-page-size-${num}`}
                className="small"
                eventKey={num}
                onSelect={(value) => setPageSize(Number(value))}
              >
                {num}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <DataTable.RowStatus className="mx-4" />
        <TablePaginationMinimal className="text-base" />
      </div>
    </DataTable.TableFooter>
  );
};

export default TableFooter;
