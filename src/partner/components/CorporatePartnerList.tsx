import { useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable } from '@openedx/paragon';

import { Partner, CellValue } from '@src/types';
import {
  ActionItem, CellName, FilterStatus, SearchFilter, TableFooter,
} from '@src/components/Table';
import { useNavigate, usePagination, useTableSortFilter } from '@src/hooks';
import { paths } from '@src/constants';
import { usePartners } from '../data/hooks';

import messages from '../messages';

type PartnersTableCell = CellValue<Partner>;

const tableActions = ['view'];

const searchIds = ['name'];
const filterMappings = searchIds.reduce((prev, curr) => ({
  ...prev, [curr]: 'search',
}), {});

const CorpotatePartnerList = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const tableConfig = useMemo(() => ({
    sortMappings: { name: 'organization__name' },
    filterMappings,
    onPaginationChange,
  }), [onPaginationChange]);

  const { ordering, searchParams, fetchData } = useTableSortFilter(tableConfig);

  const {
    data:
    { partners, count, pageCount }, isLoading,
  } = usePartners({
    pageIndex: pageIndex + 1,
    pageSize,
    ordering,
    search: searchParams.search,
  });

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      isSortable
      manualPagination
      manualFilters
      manualSortBy
      fetchData={fetchData}
      defaultColumnValues={{ disableFilters: true, disableSortBy: true }}
      FilterStatusComponent={FilterStatus}
      initialState={{
        pageSize,
        pageIndex,
      }}
      additionalColumns={[
        {
          id: 'action',
          Header: intl.formatMessage(messages['corporate.partner.table.header.action']),
          Cell: ({ row }: PartnersTableCell) => tableActions.map((type) => (
            <ActionItem
              key={`action-${type}-${row.original.slug}`}
              type={type}
              onClick={() => navigate(paths.catalogs.buildPath(row.original.slug))}
            />
          )),
        },
      ]}
      itemCount={count}
      data={partners}
      pageCount={pageCount}
      columns={[
        {
          Header: intl.formatMessage(messages['corporate.partner.table.header.name']),
          accessor: 'name',
          disableFilters: false,
          disableSortBy: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: PartnersTableCell) => (
            <CellName
              key={`description-view-${row.original.slug}`}
              name={row.original.name}
              destination={row.original.homepageUrl}
              image={row.original.logo}
            />
          ),
          Filter: SearchFilter,
          meta: {
            searchIds,
          },
        },
        {
          Header: intl.formatMessage(messages['corporate.partner.table.header.catalogs']),
          accessor: 'catalogs',
        },
        {
          Header: intl.formatMessage(messages['corporate.partner.table.header.courses']),
          accessor: 'courses',
        },
        {
          Header: intl.formatMessage(messages['corporate.partner.table.header.enrollments']),
          accessor: 'enrollments',
        },
        {
          Header: intl.formatMessage(messages['corporate.partner.table.header.certified']),
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

export default CorpotatePartnerList;
