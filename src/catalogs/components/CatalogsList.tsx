import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable, TextFilter } from '@openedx/paragon';

import { Catalog, CellValue } from '@src/types';
import { ActionItem, TableFooter } from '@src/components/Table/';
import { paths } from '@src/constants';
import { useNavigate, usePagination } from '@src/hooks';

import messages from '../messages';
import { usePartnerCatalogs } from '../data/hooks';

type CatalogCell = CellValue<Catalog>;

interface CatalogsListProps {
  partnerId: number;
  partnerSlug: string;
}

const CatalogsList = ({ partnerId, partnerSlug }: CatalogsListProps) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const { partnerCatalogs, isLoadingCatalogs } = usePartnerCatalogs({
    partnerId,
    pageIndex: pageIndex + 1,
    pageSize,
  });

  const tableActions = [{
    type: 'view',
    onClick: (catalog: Catalog) => navigate(paths.courses.buildPath(partnerSlug, catalog.slug)),
  }];

  return (
    <DataTable
      isLoading={isLoadingCatalogs}
      isPaginated
      isFilterable
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize,
        pageIndex,
      }}
      manualPagination
      fetchData={onPaginationChange}
      pageCount={partnerCatalogs.numPages}
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
      itemCount={partnerCatalogs.count}
      data={partnerCatalogs.results}
      columns={[
        {
          Header: intl.formatMessage(messages['corporate.catalog.table.header.name']),
          accessor: 'name',

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
