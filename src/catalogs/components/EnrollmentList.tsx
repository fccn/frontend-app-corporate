import { useState, useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Badge, Button, DataTable, TextFilter,
  DropdownFilter,
} from '@openedx/paragon';

import { TableFooter } from '@src/components/Table/';
import { usePagination, useTableSortFilter } from '@src/hooks';

import { HowToReg, SaveAlt } from '@openedx/paragon/icons';
import { useCatalogEnrollments } from '../data/hooks';
import InviteLearnersModal from './InviteLearnersModal';

import messages from '../messages';

const LearnerName = ({ row }) => (
  <span>{row.original.user.fullName}</span>
);

const LearnerEmail = ({ row }) => (
  <span>{row.original.user.email}</span>
);

const LearnerStatus = ({ row }) => (
  <Badge variant={row.original.active ? 'success' : 'danger'}>{row.original.active ? 'Active' : 'Inactive'}</Badge>
);

const CourseNameCell = ({ row }) => (
  <div className="text-center small">
    <span className="d-block font-weight-bold truncate-1-line">
      {row.original.courseOverview.displayName}
    </span>
    <span className="text-muted  truncate-1-line">
      {row.original.courseOverview.id}
    </span>
  </div>
);

const TableAction = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button iconBefore={HowToReg} size="sm" onClick={() => setIsModalOpen(true)}>
        {intl.formatMessage(messages['corporate.catalog.enrollments.table.action.preenroll'])}
      </Button>
      <Button iconBefore={SaveAlt} size="sm">
        {intl.formatMessage(messages['corporate.catalog.learners.table.action.download.report'])}
      </Button>
      <InviteLearnersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        catalogId={catalogId}
      />
    </>
  );
};

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

const EnrollmentsList = ({ catalogId }) => {
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const tableConfig = useMemo(() => ({
    sortFields: ['invite_sent_at', 'accepted_at', 'last_login_at', 'removed_at'],
    filterMappings: { fullName: 'search', email: 'search', active: 'active' },
    onPaginationChange,
  }), [onPaginationChange]);

  const {
    ordering,
    searchParams,
    fetchData,
  } = useTableSortFilter(tableConfig);

  const { data, isLoading } = useCatalogEnrollments({
    catalogId,
    pageIndex: pageIndex + 1,
    pageSize,
    ordering,
    search: searchParams.search,
    active: searchParams.active,
  });

  return (
    <DataTable
      isLoading={isLoading}
      isPaginated
      isFilterable
      isSortable
      defaultColumnValues={{ Filter: TextFilter }}
      initialState={{
        pageSize,
        pageIndex,
        filters: [{ id: 'active', value: 'true' }],
      }}
      manualPagination
      manualSortBy
      manualFilters
      fetchData={fetchData}
      pageCount={data?.numPages || 0}
      tableActions={[
        <TableAction catalogId={catalogId!} />,
      ]}
      itemCount={data?.count || 0}
      data={data?.results || []}
      columns={[
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.name']),
          accessor: 'fullName',
          disableSortBy: true,
          Cell: LearnerName,

        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.email']),
          accessor: 'email',
          disableSortBy: true,
          Cell: LearnerEmail,
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.status']),
          accessor: 'active',
          disableSortBy: true,
          Cell: LearnerStatus,
          Filter: DropdownFilter,
          filterChoices: [
            { value: 'true', name: intl.formatMessage(messages['corporate.catalog.learners.filter.active.only']) },
            { value: 'false', name: intl.formatMessage(messages['corporate.catalog.learners.filter.inactive.only']) },
            { value: 'all', name: intl.formatMessage(messages['corporate.catalog.learners.filter.all']) },
          ],
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.invite.sent.at']),
          accessor: 'inviteSentAt',
          Cell: ({ row }) => dateFormat(row.original.inviteSentAt),
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.accept.at']),
          accessor: 'acceptedAt',
          Cell: ({ row }) => dateFormat(row.original.acceptedAt),
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.last.login']),
          accessor: 'lastLogin',
          Cell: ({ row }) => dateFormat(row.original.user.lastLogin),
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.enrollments']),
          accessor: 'course',
          Cell: CourseNameCell,
          disableSortBy: true,

        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.enrollments.table.header.progress']),
          accessor: 'progress',
          Cell: ({ row }) => `${row.original.progress}%`,
          disableSortBy: true,
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.enrollments.table.header.hasCertificate']),
          accessor: 'hasCertificate',
          Cell: ({ row }) => (row.original.hasCertificate ? 'Yes' : 'No'),
          disableSortBy: true,
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.removed.at']),
          accessor: 'removedAt',
          Cell: ({ row }) => dateFormat(row.original.removedAt),
        },
      ]}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages['corporate.catalog.learners.table.empty.content'])} />
      <TableFooter />
    </DataTable>
  );
};

export default EnrollmentsList;
