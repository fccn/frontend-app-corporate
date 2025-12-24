import { useIntl } from '@edx/frontend-platform/i18n';
import { Badge, DataTable, TextFilter } from '@openedx/paragon';

import { CellValue, Learner } from '@src/types';
import { ActionItem, TableFooter } from '@src/components/Table/';
import { usePagination } from '@src/hooks';

import messages from '../messages';
import { useCatalogLearners } from '../data/hooks';

const LearnerName = ({ row }) => (
  <span>{row.original.user.fullName}</span>
);

const LearnerEmail = ({ row }) => (
  <span>{row.original.user.email}</span>
);

const LearnerStatus = ({ row }) => (
  <Badge variant={row.original.active ? 'success' : 'danger'}>{row.original.active ? 'Active' : 'Inactive'}</Badge>
);

const dateFormat = (isoDateString) => {
  if (!isoDateString) {
    return null;
  }
  const date = new Date(isoDateString);
  const pad = n => n.toString().padStart(2, '0');
  const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return formatted;
};

const LearnerList = ({ catalogId, partnerId }) => {
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const { data, isLoading } = useCatalogLearners({
    catalogId,
    partnerId,
  });

  const tableActions = [{
    type: 'delete',
    onClick: (_learner: Learner) => {
      // TODO: Implement delete learner
    },
  }];

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize,
        pageIndex,
      }}
      manualPagination
      fetchData={onPaginationChange}
      pageCount={data?.numPages || 0}
      additionalColumns={[
        {
          id: 'action',
          Header: intl.formatMessage(messages.headerAction),
          Cell: ({ row }: CellValue<Learner>) => tableActions.map(({ type, onClick }) => (
            <ActionItem
              key={`action-${type}-${row.original.id}`}
              type={type}
              disabled={!!row.original.removedAt}
              onClick={() => onClick(row.original)}
            />
          )),
        },
      ]}
      itemCount={data?.count || 0}
      data={data?.results || []}
      columns={[
        {
          Header: 'Learner name',
          accessor: 'fullName',
          Cell: LearnerName,

        },
        {
          Header: 'Invite email',
          accessor: 'email',
          Cell: LearnerEmail,
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: LearnerStatus,
        },
        {
          Header: 'Invite sent at',
          accessor: 'inviteSentAt',
          Cell: ({ row }) => dateFormat(row.original.inviteSentAt),
        },
        {
          Header: 'Accept at',
          accessor: 'acceptedAt',
          Cell: ({ row }) => dateFormat(row.original.acceptedAt),
        },
        {
          Header: 'Last login date',
          accessor: 'lastLogin',
          Cell: ({ row }) => dateFormat(row.original.lastLogin),
        },
        {
          Header: 'Enrollments',
          accessor: 'enrollments',
        },
        {
          Header: 'Certificates',
          accessor: 'certified',
        },
        {
          Header: 'Removed at',
          accessor: 'removedAt',
          Cell: ({ row }) => dateFormat(row.original.removedAt),
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <TableFooter />
    </DataTable>
  );
};

export default LearnerList;
