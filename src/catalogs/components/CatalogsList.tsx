import { useSuspenseQuery } from '@tanstack/react-query';
import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable, TextFilter } from '@openedx/paragon';

import { CorporatePartner } from '@src/app/types';
import TableName from '@src/app/TableName';
import { useNavigate } from '@src/hooks';
import { paths } from '@src/constants';
import HeaderDescription from '@src/app/HeaderDescription';
import TableFooter from '@src/app/TableFooter';
import ActionItem from '@src/app/ActionItem';

import { useParams } from 'wouter';
import { getPartnerCatalogs, getPartnerDetails } from '../api';

import messages from '../messages';

type CellValue = {
  row: {
    original: CorporatePartner;
  }
};

const CatalogsList = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { partnerId } = useParams<{ partnerId: string }>();

  const { data: partnerCatalogs, isLoading: isLoadingCatalogs } = useSuspenseQuery({
    queryKey: ['partnerCatalogs'],
    queryFn: () => getPartnerCatalogs(),
  });

  const { data: partnerDetails, isLoading: isLoadingDetails } = useSuspenseQuery({
    queryKey: ['partnerDetails'],
    queryFn: () => getPartnerDetails(),
  });

  const tableActions = [{
    type: 'view',
    onClick: (partner: CorporatePartner) => navigate(paths.courses.buildPath(partner.code)),
  }, {
    type: 'edit',
    onClick: (partner: CorporatePartner) => navigate(paths.catalogs.buildPath(partner.code)),
  }];

  return (
    <>
      <HeaderDescription
        context={{
          title: partnerDetails.name,
          imageUrl: partnerDetails.image,
          description: partnerDetails.description,
        }}
        info={[
          { title: 'Catalogs', value: partnerDetails.catalogsQuantity },
          { title: 'Courses', value: partnerDetails.coursesQuantity },
          { title: 'Enrollment', value: partnerDetails.enrollmentsQuantity },
          { title: 'Certified Learners', value: partnerDetails.certifiedLearnersQuantity },
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
                key={`action-${type}-${row.original.code}`}
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
                key={`description-view-${row.original.code}`}
                name={row.original.name}
                destination={row.original.homepage}
                image={row.original.logo}
              />
            ),
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
