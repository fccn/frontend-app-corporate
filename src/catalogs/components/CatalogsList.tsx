import { FC } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable, TextFilter } from '@openedx/paragon';

import { CorporateCatalog } from '@src/app/types';
import ActionItem from '@src/app/ActionItem';
import TableFooter from '@src/app/TableFooter';
import { paths } from '@src/constants';
import { useNavigate, usePagination } from '@src/hooks';
import { useCatalogFormModal } from '@src/hooks/useCatalogFormModal';

import messages from '../messages';
import { usePartnerCatalogs } from '../hooks';

type CellValue = {
  row: {
    original: CorporateCatalog;
  }
};

interface CatalogsListProps {
  partnerId: string;
}

const CatalogsList: FC<CatalogsListProps> = ({ partnerId }) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { handleChangeSelectedCatalog } = useCatalogFormModal();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const { partnerCatalogs, isLoadingCatalogs } = usePartnerCatalogs({
    partnerId,
    pageIndex: pageIndex + 1,
    pageSize,
  });

  const tableActions = [{
    type: 'view',
    onClick: (catalog: CorporateCatalog) => navigate(paths.courses.buildPath(String(catalog.id))),
  }, {
    type: 'edit',
    onClick: (catalog: CorporateCatalog) => {
      handleChangeSelectedCatalog(catalog.id);
    },
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
          Header: intl.formatMessage(messages.headerAction),
          Cell: ({ row }: CellValue) => tableActions.map(({ type, onClick }) => (
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
          Header: intl.formatMessage(messages.headerName),
          accessor: 'name',

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
        {
          Header: intl.formatMessage(messages.headerCompletion),
          accessor: 'completionRate',
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noCatalogs)} />
      <TableFooter />
    </DataTable>
  );
};

export default CatalogsList;
