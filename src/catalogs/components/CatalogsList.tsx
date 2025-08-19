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

import { getPartnerCatalogs } from '../api';

import messages from '../messages';

type CellValue = {
  row: {
    original: CorporatePartner;
  }
};

const CatalogsList = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['partnerCatalogs'],
    queryFn: () => getPartnerCatalogs(),
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
          title: 'Centro Nacional de Cibersegurança PORTUGAL',
          imageUrl: 'https://www.uc.pt/site/assets/files/545679/cncs_2.1685x774-cropx1314-is.1082x0-is-pid619177.jpg',
        //   description: 'Manage your catalogs effectively.',
        }}
        info={[
          { title: 'Catalogs', value: 14 },
          { title: 'Courses', value: 120 },
          { title: 'Enrollment', value: 2503 },
          { title: 'Certified Learners', value: 260 },
        ]}
      />

      <DataTable
        isLoading={isLoading}
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
        itemCount={data.length}
        data={data}
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
            Cell: ({ row }: CellValue) => (
              <>{row.original.courses.length}</>
            ),
          },
          {
            Header: intl.formatMessage(messages.headerEnrollments),
            accessor: 'userLimit',
          },
          {
            Header: intl.formatMessage(messages.headerCertified),
            accessor: 'certified',
          },
          {
            Header: intl.formatMessage(messages.headerCompletion),
            accessor: 'completion',
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
