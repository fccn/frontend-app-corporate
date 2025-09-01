import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable, TextFilter } from '@openedx/paragon';

import { CorporateCatalog } from '@src/app/types';
import { useNavigate, usePagination } from '@src/hooks';
import { paths } from '@src/constants';
import HeaderDescription from '@src/app/HeaderDescription';
import TableFooter from '@src/app/TableFooter';
import ActionItem from '@src/app/ActionItem';

import { useParams } from 'wouter';
import { useState } from 'react';

import messages from '../messages';
import { usePartnerCatalogs, usePartnerDetails } from '../hooks';

type CellValue = {
  row: {
    original: CorporateCatalog;
  }
};

const CatalogsList = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { partnerId } = useParams<{ partnerId: string }>();
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | string | null>(null);

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const { partnerDetails, isLoadingPartnerDetails } = usePartnerDetails({ partnerId });
  const { partnerCatalogs, isLoadingCatalogs } = usePartnerCatalogs({
    partnerId,
    pageIndex: pageIndex + 1,
    pageSize,
  });

  const tableActions = [{
    type: 'view',
    onClick: (catalog: CorporateCatalog) => navigate(paths.courses.buildPath(partnerId, catalog.id)),
  }, {
    type: 'edit',
    onClick: (catalog: CorporateCatalog) => {
      setSelectedCatalogId(catalog.id);
    },
  }];

  return (
    <>
      {partnerDetails && (
        <HeaderDescription
          context={{
            title: partnerDetails.name,
            imageUrl: partnerDetails.logo,
            description: partnerDetails.homepageUrl,
          }}
          info={[
            { title: intl.formatMessage(messages.infoCatalog), value: partnerDetails.catalogs },
            { title: intl.formatMessage(messages.headerCourses), value: partnerDetails.courses },
            { title: intl.formatMessage(messages.headerEnrollments), value: partnerDetails.enrollments },
            { title: intl.formatMessage(messages.headerCertified), value: partnerDetails.certified },
          ]}
        />
      )}

      <DataTable
        isLoading={isLoadingCatalogs || isLoadingPartnerDetails}
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
        <TableFooter />
      </DataTable>
    </>
  );
};

export default CatalogsList;
