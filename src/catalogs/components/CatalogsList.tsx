import { useSuspenseQuery } from '@tanstack/react-query';
import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable, TextFilter } from '@openedx/paragon';

import { CorporateCatalog } from '@src/app/types';
import TableName from '@src/app/TableName';
import { useNavigate } from '@src/hooks';
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

  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs'],
    queryFn: () => getPartnerCatalogs(),
  });

  const { data: partnerDetails } = useSuspenseQuery({
    queryKey: ['partnerDetails'],
    queryFn: () => getPartnerDetails(),
  });

  const tableActions = [{
    type: 'view',
    onClick: (partner: CorporateCatalog) => navigate(paths.courses.buildPath(String(partner.id))),
  }, {
    type: 'edit',
    onClick: (partner: CorporateCatalog) => {
      setSelectedCatalogId(partner.id);
    },
  }];

  return (
    <>
      <HeaderDescription
        context={{
          title: partnerDetails.name,
          imageUrl: partnerDetails.logo,
          description: partnerDetails.homepage,
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
        itemCount={partnerCatalogs.length}
        data={partnerCatalogs}
        columns={[
          {
            Header: intl.formatMessage(messages.headerName),
            accessor: 'name',
            // eslint-disable-next-line react/no-unstable-nested-components
            Cell: ({ row }: CellValue) => (
              <TableName
                key={`description-view-${row.original.id}`}
                name={row.original.name}
                destination={row.original.homepage}
              />
            ),
          },
          {
            Header: intl.formatMessage(messages.headerCourses),
            accessor: 'courses',
            Cell: ({ row }: CellValue) => (
              <>{row.original.courses.length}</>
            ),
          },
          {
            Header: intl.formatMessage(messages.headerEnrollments),
            accessor: 'enrollments',
          },
          {
            Header: intl.formatMessage(messages.headerCertified),
            accessor: 'certifiedLearners',
          },
          {
            Header: intl.formatMessage(messages.headerCompletion),
            accessor: 'completionRate',
            Cell: ({ row }: CellValue) => (
              <>{row.original.completionRate * 100}%</>
            ),
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
