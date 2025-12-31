import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Badge, Button, DataTable, TextFilter,
  useToggle,
} from '@openedx/paragon';

import { CellValue, Learner } from '@src/types';
import { ActionItem, TableFooter } from '@src/components/Table/';
import { usePagination } from '@src/hooks';

import { PersonAddAlt, SaveAlt } from '@openedx/paragon/icons';
import { useCatalogLearners } from '../data/hooks';
import InviteLearnersModal from './InviteLearnersModal';

import messages from '../messages';
import LearnerDeleteModal from './LearnerDeleteModal';

const LearnerName = ({ row }) => (
  <span>{row.original.user.fullName}</span>
);

const LearnerEmail = ({ row }) => (
  <span>{row.original.user.email}</span>
);

const LearnerStatus = ({ row }) => (
  <Badge variant={row.original.active ? 'success' : 'danger'}>{row.original.active ? 'Active' : 'Inactive'}</Badge>
);

const TableAction = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button iconBefore={PersonAddAlt} size="sm" onClick={() => setIsModalOpen(true)}>
        {intl.formatMessage(messages['corporate.catalog.learners.table.action.add.learner'])}
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

const BulkAction = ({ selectedFlatRows, setRowsForDelete, openDeleteModal }) => {
  const intl = useIntl();
  return (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => {
        setRowsForDelete(selectedFlatRows.map((row) => row.original.id));
        openDeleteModal();
      }}
    >
      {intl.formatMessage(messages['corporate.catalog.learners.bulk.delete.action'])}
    </Button>
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

const LearnerList = ({ catalogId, catalogName }) => {
  const intl = useIntl();

  const [isdeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<any[]>([]);
  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const { data, isLoading } = useCatalogLearners({
    catalogId,
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
        isSelectable
        defaultColumnValues={{ Filter: TextFilter }}
        initialState={{
          pageSize,
          pageIndex,
        }}
        manualPagination
        fetchData={onPaginationChange}
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
            Cell: LearnerName,

          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.email']),
            accessor: 'email',
            Cell: LearnerEmail,
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.status']),
            accessor: 'status',
            Cell: LearnerStatus,
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
            accessor: 'enrollments',
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.learners.table.header.certified']),
            accessor: 'certified',
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
