import { useState, useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, DataTable, useToggle, CheckboxFilter,
} from '@openedx/paragon';

import { CellValue, Learner } from '@src/types';
import {
  ActionItem, FilterStatus, LearnerEmail, LearnerName, LearnerStatus, SearchFilter, TableFooter,
} from '@src/components/Table/';
import { usePagination, useTableSortFilter } from '@src/hooks';

import { SaveAlt } from '@openedx/paragon/icons';
import { useCatalogLearners } from '../data/hooks';
import { dateFormat } from './utils';
import LearnerDeleteModal from './LearnerDeleteModal';

import messages from '../messages';
import InviteLearnerAction from './InviteTableAction';

const TableAction = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();
  return (
    <>
      <InviteLearnerAction catalogId={catalogId} />
      <Button iconBefore={SaveAlt} size="sm">
        {intl.formatMessage(messages['corporate.catalog.learners.table.action.download.report'])}
      </Button>
    </>
  );
};

type BulkActionProps = {
  selectedFlatRows?: any[];
  setRowsForDelete: (rows: any[]) => void;
  openDeleteModal: () => void;
};

const BulkAction = ({ selectedFlatRows, setRowsForDelete, openDeleteModal }: BulkActionProps) => {
  const intl = useIntl();
  if (!selectedFlatRows?.length) { return null; }
  return (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => {
        setRowsForDelete(selectedFlatRows.map((row) => row.original));
        openDeleteModal();
      }}
    >
      {intl.formatMessage(messages['corporate.catalog.learners.bulk.delete.action'])}
    </Button>
  );
};

const searchIds = ['fullName', 'email'];
const filterMappings = searchIds.reduce((prev, curr) => ({
  ...prev, [curr]: 'search',
}), { active: 'active' });

const LearnerList = ({ catalogId, catalogName }) => {
  const intl = useIntl();

  const [isdeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<Learner[]>([]);
  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const tableConfig = useMemo(() => ({
    sortMappings: {
      inviteSentAt: 'invite_sent_at',
      acceptedAt: 'accepted_at',
      lastLogin: 'user__last_login',
      removedAt: 'removed_at',
    },
    filterMappings,
    onPaginationChange,
  }), [onPaginationChange]);

  const {
    ordering,
    searchParams,
    fetchData,
  } = useTableSortFilter(tableConfig);

  const { data, isLoading } = useCatalogLearners({
    catalogId,
    pageIndex: pageIndex + 1,
    pageSize,
    ordering,
    search: searchParams.search,
    active: searchParams.active,
  });

  const tableActions = [{
    type: 'delete',
    onClick: (learner: Learner) => {
      setSelectedRowsForDelete([learner]);
      openDeleteModal();
    },
  }];

  return (
    <>
      <DataTable
        isLoading={isLoading}
        isPaginated
        isFilterable
        isSortable
        isSelectable
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
        bulkActions={[
          <BulkAction setRowsForDelete={setSelectedRowsForDelete} openDeleteModal={openDeleteModal} />,
        ]}
        additionalColumns={[
          {
            id: 'action',
            Header: intl.formatMessage(messages['corporate.catalog.table.header.action']),
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
            accessor: 'enrollments',
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.certified']),
            accessor: 'certified',
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
      <LearnerDeleteModal
        isOpen={isdeleteModalOpen}
        onClose={closeDeleteModal}
        catalogId={catalogId!}
        catalogName={catalogName}
        selectedLearners={selectedRowsForDelete}
      />
    </>
  );
};

export default LearnerList;
