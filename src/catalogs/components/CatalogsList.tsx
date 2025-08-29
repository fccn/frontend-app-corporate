import { useSuspenseQuery } from '@tanstack/react-query';
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
import { getPartnerCatalogs, getPartnerDetails } from '../api';

import messages from '../messages';

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

  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs', partnerId, pageIndex, pageSize],
    queryFn: () => getPartnerCatalogs(partnerId, pageIndex, pageSize),
  });

  const { data: partnerDetails } = useSuspenseQuery({
    queryKey: ['partnerDetails'],
    queryFn: () => getPartnerDetails(partnerId),
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
      <HeaderDescription
        context={{
          title: partnerDetails.name,
          imageUrl: partnerDetails.logo,
          description: partnerDetails.homepageUrl,
        }}
        info={[
          { title: 'Catalogs', value: partnerDetails.catalogs },
          { title: 'Courses', value: partnerDetails.courses },
          { title: 'Enrollment', value: partnerDetails.enrollments },
          { title: 'Certified Learners', value: partnerDetails.certified },
        ]}
      />

      <DataTable
        isLoading={isLoadingCatalogs}
        isPaginated
        isFilterable
        defaultColumnValues={{ Filter: TextFilter }}
        initialState={{
          pageSize: 30,
          pageIndex: 0,
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
