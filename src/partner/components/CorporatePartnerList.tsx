import { useSuspenseQuery } from '@tanstack/react-query';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, TextFilter,
} from '@openedx/paragon';

import { CorporatePartner } from '@src/types';
import { ActionItem, CellName, TableFooter } from '@src/components/Table';
import { useNavigate } from '@src/hooks';
import { paths } from '@src/constants';
import { getPartners } from '../api';

import messages from '../messages';

type CellValue = {
  row: {
    original: CorporatePartner;
  }
};

const tableActions = ['view'];

const CorpotatePartnerList = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['partners'],
    queryFn: () => getPartners(),
  });

  return (
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
          Cell: ({ row }: CellValue) => tableActions.map((type) => (
            <ActionItem
              key={`action-${type}-${row.original.code}`}
              type={type}
              onClick={() => navigate(paths.catalogs.buildPath(row.original.id))}
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
            <CellName
              key={`description-view-${row.original.code}`}
              name={row.original.name}
              destination={row.original.homepageUrl}
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

export default CorpotatePartnerList;
