import { useState, useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, DataTable, CheckboxFilter } from '@openedx/paragon';
import { HowToReg, SaveAlt } from '@openedx/paragon/icons';

import {
  TableFooter, FilterStatus, SearchFilter, LearnerName, LearnerEmail, LearnerStatus,
} from '@src/components/Table/';
import { usePagination, useTableSortFilter } from '@src/hooks';
import InviteLearnersModal from './InviteLearnersModal';

import { useCatalogEnrollments } from '../data/hooks';
import { dateFormat } from './utils';

import messages from '../messages';

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

const searchIds = ['fullName', 'email'];
const filterMappings = searchIds.reduce((prev, curr) => ({
  ...prev, [curr]: 'search',
}), { active: 'active' });

const EnrollmentsList = ({ catalogId }) => {
  const intl = useIntl();

  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const tableConfig = useMemo(() => ({
    sortFields: ['invite_sent_at', 'accepted_at', 'last_login_at', 'removed_at'],
    filterMappings,
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
      defaultColumnValues={{ disableFilters: true, disableSortBy: true }}
      FilterStatusComponent={FilterStatus}
      initialState={{
        pageSize,
        pageIndex,
        filters: [{ id: 'active', value: ['true'] }],
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
          disableFilters: false,
          Cell: LearnerName,
          Filter: SearchFilter,
          meta: {
            searchIds,
          },
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.email']),
          accessor: 'email',
          Cell: LearnerEmail,
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.status']),
          accessor: 'active',
          disableFilters: false,
          Cell: LearnerStatus,
          Filter: CheckboxFilter,
          filter: 'includesValue',
          filterChoices: [
            {
              value: 'true',
              name: intl.formatMessage(messages['corporate.catalog.learners.filter.active.only']),
            },
            {
              value: 'false',
              name: intl.formatMessage(messages['corporate.catalog.learners.filter.inactive.only']),
            },
          ],
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.invite.sent.at']),
          accessor: 'inviteSentAt',
          disableSortBy: false,
          Cell: ({ row }) => dateFormat(row.original.inviteSentAt),
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.accept.at']),
          accessor: 'acceptedAt',
          disableSortBy: false,
          Cell: ({ row }) => dateFormat(row.original.acceptedAt),
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.last.login']),
          accessor: 'lastLogin',
          disableSortBy: false,
          Cell: ({ row }) => dateFormat(row.original.user.lastLogin),
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.enrollments']),
          accessor: 'course',
          Cell: CourseNameCell,

        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.enrollments.table.header.progress']),
          accessor: 'progress',
          Cell: ({ row }) => `${row.original.progress}%`,
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.enrollments.table.header.hasCertificate']),
          accessor: 'hasCertificate',
          Cell: ({ row }) => (row.original.hasCertificate
            ? intl.formatMessage(messages['corporate.catalog.enrollments.table.certificate.yes'])
            : intl.formatMessage(messages['corporate.catalog.enrollments.table.certificate.no'])),
        },
        {
          Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.removed.at']),
          accessor: 'removedAt',
          disableSortBy: false,
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
