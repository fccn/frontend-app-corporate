import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable } from '@openedx/paragon';

import { Catalog, CellValue } from '@src/types';
import {
  ActionItem, FilterStatus, SearchFilter, TableFooter,
} from '@src/components/Table/';
import { paths } from '@src/constants';
import { useNavigate, usePagination, useTableSortFilter } from '@src/hooks';

import { useMemo } from 'react';
import messages from '../messages';
import { useCatalogs } from '../data/hooks';

type CatalogCell = CellValue<Catalog>;

interface CatalogsListProps {
  partnerId: number;
  partnerSlug: string;
}

const searchIds = ['name'];
const filterMappings = searchIds.reduce((prev, curr) => ({
  ...prev, [curr]: 'search',
}), {});

const CatalogsList = ({ partnerId, partnerSlug }: CatalogsListProps) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const tableConfig = useMemo(() => ({
    sortFilds: ['name'],
    filterMappings,
    onPaginationChange,
  }), [onPaginationChange]);

  const { ordering, searchParams, fetchData } = useTableSortFilter(tableConfig);

  const {
    data:
    { catalogs, count, pageCount }, isLoading,
  } = useCatalogs({
    partnerId,
    pageIndex: pageIndex + 1,
    pageSize,
    ordering,
    search: searchParams.search,
  });

  const tableActions = [{
    type: 'view',
    onClick: (catalog: Catalog) => navigate(paths.courses.buildPath(partnerSlug, catalog.slug)),
  }];

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      isSortable
      defaultColumnValues={{ disableFilters: true, disableSortBy: true }}
      FilterStatusComponent={FilterStatus}
      initialState={{
        pageSize,
        pageIndex,
      }}
      manualPagination
      manualFilters
      manualSortBy
      fetchData={fetchData}
      pageCount={pageCount}
      additionalColumns={[
        {
          id: 'action',
          Header: intl.formatMessage(messages['corporate.catalog.table.header.action']),
          Cell: ({ row }: CatalogCell) => tableActions.map(({ type, onClick }) => (
            <ActionItem
              key={`action-${type}-${row.original.id}`}
              type={type}
              onClick={() => onClick(row.original)}
            />
          )),
        },
      ]}
      itemCount={count}
      data={catalogs}
      columns={[
        {
          Header: intl.formatMessage(messages['corporate.catalog.table.header.name']),
          accessor: 'name',
          disableFilters: false,
          disableSortBy: false,
          Filter: SearchFilter,
          meta: {
            searchIds,
          },
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.table.header.courses']),
          accessor: 'courses',
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.table.header.enrollments']),
          accessor: 'enrollments',
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.table.header.certified']),
          accessor: 'certified',
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.table.header.completion']),
          accessor: 'completionRate',
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages['corporate.catalog.table.empty.content'])} />
      <TableFooter />
    </DataTable>
  );
};

export default CatalogsList;
