import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, TextFilter,
} from '@openedx/paragon';

import { CorporatePartner } from '@src/app/types';
import TableName from '@src/app/TableName';
import { useNavigate } from '@src/hooks';
import { paths } from '@src/constants';
import { useCallback, useState } from 'react';
import TableFooter from '../../app/TableFooter';

import messages from '../messages';
import ActionItem from '../../app/ActionItem';
import { usePartners } from '../hooks';

type CellValue = {
  row: {
    original: CorporatePartner;
  }
};

const tableActions = ['view'];

const CorporatePartnerList = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const {
    partners, isLoading, count, pages,
  } = usePartners({ pageSize, pageIndex: pageIndex + 1 });

  // This function will be called by DataTable when pagination, filters, or sorting change
  const fetchData = useCallback((tableState) => {
    if (pageIndex !== tableState.pageIndex) {
      setPageIndex(tableState.pageIndex);
    }
    if (pageSize !== tableState.pageSize) {
      setPageSize(tableState.pageSize);
    }
  }, [pageIndex, pageSize]);

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize: 10,
        pageIndex,
      }}
      autoResetPageIndex={false} // turn off auto reset of pageIndex
      data={partners}
      itemCount={count}
      pageCount={pages}
      fetchData={fetchData}
      manualPagination
      additionalColumns={[
        {
          id: 'action',
          Header: intl.formatMessage(messages.headerAction),
          Cell: ({ row }: CellValue) => tableActions.map((type) => (
            <ActionItem
              key={`action-${type}-${row.original.code}`}
              type={type}
              onClick={() => navigate(paths.catalogs.buildPath(row.original.code))}
            />
          )),
        },
      ]}
      columns={[
        {
          Header: intl.formatMessage(messages.headerName),
          accessor: 'name',
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: CellValue) => (
            <TableName
              key={`description-view-${row.original.code}`}
              name={row.original.name}
              destination={row.original.homepage}
              image={row.original.logo}
            />
          ),
        },
        {
          Header: intl.formatMessage(messages.headerCatalogs),
          accessor: 'catalogs',
        },
        {
          Header: intl.formatMessage(messages.headerCourses),
          accessor: 'courses',
        },
        {
          Header: intl.formatMessage(messages.headerEnrollments),
          accessor: 'enrollments',
        },
        {
          Header: intl.formatMessage(messages.headerCertified),
          accessor: 'certified',
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <TableFooter />
    </DataTable>
  );
};

export default CorporatePartnerList;
