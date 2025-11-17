import { useSuspenseQuery } from '@tanstack/react-query';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, TextFilter,
} from '@openedx/paragon';

import { Partner, CellValue } from '@src/types';
import { ActionItem, CellName, TableFooter } from '@src/components/Table';
import { useNavigate } from '@src/hooks';
import { paths } from '@src/constants';
import { getPartners } from '../data/api';

import messages from '../messages';

type PartnersTableCell = CellValue<Partner>;

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
          Cell: ({ row }: PartnersTableCell) => tableActions.map((type) => (
            <ActionItem
              key={`action-${type}-${row.original.slug}`}
              type={type}
              onClick={() => navigate(paths.catalogs.buildPath(row.original.id))}
            />
          )),
        },
      ]}
      itemCount={data?.count || 0}
      data={data?.results}
      pageCount={data?.numPages || 0}
      columns={[
        {
          Header: intl.formatMessage(messages.headerName),
          accessor: 'name',
          // eslint-disable-next-line react/no-unstable-nested-components
          Cell: ({ row }: PartnersTableCell) => (
            <CellName
              key={`description-view-${row.original.slug}`}
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
