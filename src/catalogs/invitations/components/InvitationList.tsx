import { useState, useMemo, useRef } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { DataTable, useToggle } from '@openedx/paragon';

import { CatalogInvitation } from '@src/types';
import { FilterStatus, SearchFilter, TableFooter } from '@src/components/Table/';
import { usePagination, useTableSortFilter } from '@src/hooks';
import { useNotification } from '@src/notification';
import { DownloadReportButton } from '@src/catalogs/components';
import { dateFormat } from '@src/catalogs/utils';
import { useCatalogInvitations, useResendInvitation } from '../data/hooks';
import InviteAction from './InviteAction';
import InvitationCancelModal from './InvitationCancelModal';
import {
  INVITATION_STATUS, InvitationActionCell, InvitationNameCell, InvitationStatus, InvitationStatusFilter,
} from './InvitationCells';
import messages from '../messages';

const INVITATIONS_REPORT_CONFIG = (catalogId: string) => ({
  endpoint: `manage/catalogs/${catalogId}/invitations/`,
  filename: 'invitations_report.csv',
});

const searchIds = ['email', 'username'];
const filterMappings = {
  ...searchIds.reduce((prev, curr) => ({ ...prev, [curr]: 'search' }), {}),
  status: 'status',
};

const InvitationList = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();
  const { showNotification } = useNotification();

  const [isCancelModalOpen, openCancelModal, closeCancelModal] = useToggle(false);
  const [selectedInvitation, setSelectedInvitation] = useState<CatalogInvitation | null>(null);
  const { pageIndex, pageSize, onPaginationChange } = usePagination();

  const tableConfig = useMemo(() => ({
    sortMappings: {
      invitedAt: 'invited_at',
      acceptedAt: 'accepted_at',
      cancelledAt: 'cancelled_at',
    },
    filterMappings,
    onPaginationChange,
  }), [onPaginationChange]);

  const { ordering, searchParams, fetchData } = useTableSortFilter(tableConfig);

  const { data, isLoading } = useCatalogInvitations({
    catalogId,
    pageIndex: pageIndex + 1,
    pageSize,
    ordering,
    search: searchParams.search,
    status: searchParams.status === undefined ? undefined : Number(searchParams.status),
  });

  const resendMutation = useResendInvitation();
  // `isPending` only disables the button after a re-render, so a fast double click
  // would still reach mutate twice and send two emails; the ref blocks it synchronously.
  const isResendingRef = useRef(false);

  const handleResend = (invitation: CatalogInvitation) => {
    if (isResendingRef.current) { return; }
    isResendingRef.current = true;
    resendMutation.mutate({ catalogId, invitationId: invitation.id }, {
      onSettled: () => { isResendingRef.current = false; },
      onSuccess: () => showNotification(
        intl.formatMessage(messages['corporate.catalog.invitations.resend.success']),
        'success',
      ),
      onError: () => showNotification(
        intl.formatMessage(messages['corporate.catalog.invitations.resend.error']),
        'error',
      ),
    });
  };

  const handleCancel = (invitation: CatalogInvitation) => {
    setSelectedInvitation(invitation);
    openCancelModal();
  };

  return (
    <>
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
          filters: [{ id: 'status', value: INVITATION_STATUS.pending.code }],
        }}
        manualPagination
        manualSortBy
        manualFilters
        fetchData={fetchData}
        pageCount={data?.numPages || 0}
        tableActions={[
          <DownloadReportButton {...INVITATIONS_REPORT_CONFIG(catalogId)} />,
          <InviteAction catalogId={catalogId} />,
        ]}
        additionalColumns={[
          {
            id: 'action',
            Header: intl.formatMessage(messages['corporate.catalog.table.header.action']),
            onResend: handleResend,
            onCancel: handleCancel,
            isResending: resendMutation.isPending,
            Cell: InvitationActionCell,
          },
        ]}
        itemCount={data?.count || 0}
        data={data?.results || []}
        columns={[
          {
            Header: intl.formatMessage(messages['corporate.catalog.invitations.table.header.email']),
            accessor: 'inviteEmail',
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.invitations.table.header.name']),
            accessor: 'username',
            disableFilters: false,
            Filter: SearchFilter,
            meta: { searchIds },
            Cell: InvitationNameCell,
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.invitations.table.header.status']),
            accessor: 'status',
            disableFilters: false,
            Cell: InvitationStatus,
            Filter: InvitationStatusFilter,
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.invitations.table.header.invited.at']),
            accessor: 'invitedAt',
            disableSortBy: false,
            Cell: ({ row }) => dateFormat(row.original.invitedAt),
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.invitations.table.header.accepted.at']),
            accessor: 'acceptedAt',
            disableSortBy: false,
            Cell: ({ row }) => dateFormat(row.original.acceptedAt),
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.invitations.table.header.cancelled.at']),
            accessor: 'cancelledAt',
            disableSortBy: false,
            Cell: ({ row }) => dateFormat(row.original.cancelledAt),
          },
          {
            Header: intl.formatMessage(messages['corporate.catalog.invitations.table.header.invited.by']),
            accessor: 'invitedBy',
          },
        ]}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.EmptyTable content={intl.formatMessage(messages['corporate.catalog.invitations.table.empty.content'])} />
        <TableFooter />
      </DataTable>
      <InvitationCancelModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        catalogId={catalogId}
        invitation={selectedInvitation}
      />
    </>
  );
};

export default InvitationList;
