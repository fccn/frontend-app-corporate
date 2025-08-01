import { useContext } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, DataTableContext, Dropdown, TablePaginationMinimal,
} from '@openedx/paragon';
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
  pageSizeOptions = [10, 20, 30, 40],
}: TableFooterProps) => {
  const intl = useIntl();
  const { setPageSize, state } = useContext<DataTableContextValue>(DataTableContext);

  return (
    <DataTable.TableFooter>
      <div className="row w-100">
        <Dropdown className="col col-6">
          {intl.formatMessage(messages.tableFooterRowSelector)}
          <Dropdown.Toggle
            id="table-number-rows-selector"
            className="small ml-1 p-1"
            variant="ternary"
          >
            {state.pageSize}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {pageSizeOptions.map((num) => (
              <Dropdown.Item
                key={`footer-table-page-size-${num}`}
                eventKey={num}
                onSelect={(value) => setPageSize(Number(value))}
              >
                {num}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="col col-6 d-flex justify-content-end align-items-center">
          <DataTable.RowStatus />
          <TablePaginationMinimal />
        </div>
      </div>
    </DataTable.TableFooter>
  );
};

export default TableFooter;
