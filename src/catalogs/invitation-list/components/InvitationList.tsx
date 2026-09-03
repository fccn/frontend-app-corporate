import { useState, useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  DataTable, useToggle, CheckboxFilter, IconButton, OverlayTrigger, Tooltip,
} from '@openedx/paragon';
import { Email, Close } from '@openedx/paragon/icons';

import { CatalogInvitation, CellValue } from '@src/types';
import {
  FilterStatus, InvitationStatus, SearchFilter, TableFooter,
} from '@src/components/Table/';
import { usePagination, useTableSortFilter } from '@src/hooks';
import { DownloadReportButton } from '@src/catalogs/components';
import { dateFormat } from '@src/catalogs/utils';
import { useCatalogInvitations, useResendInvitation } from '../data/hooks';
import InvitationCancelModal from './InvitationCancelModal';
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

type ActionCellProps = {
  row: { original: CatalogInvitation };
  column: {
    onResend: (inv: CatalogInvitation) => void;
    onCancel: (inv: CatalogInvitation) => void;
  };
};

const InvitationActionCell = ({ row, column }: ActionCellProps) => {
  const { formatMessage } = useIntl();
  const isPending = row.original.status === 'pending';
  return (
    <>
      <OverlayTrigger
        overlay={<Tooltip id={`resend-${row.original.id}`}>{formatMessage(messages['corporate.catalog.invitations.action.resend'])}</Tooltip>}
      >
        <IconButton
          src={Email}
          alt={formatMessage(messages['corporate.catalog.invitations.action.resend'])}
          disabled={!isPending}
          onClick={isPending ? () => column.onResend(row.original) : undefined}
        />
      </OverlayTrigger>
      <OverlayTrigger
        overlay={<Tooltip id={`cancel-${row.original.id}`}>{formatMessage(messages['corporate.catalog.invitations.action.cancel'])}</Tooltip>}
      >
        <IconButton
          src={Close}
          alt={formatMessage(messages['corporate.catalog.invitations.action.cancel'])}
          variant="danger"
          disabled={!isPending}
          onClick={isPending ? () => column.onCancel(row.original) : undefined}
        />
      </OverlayTrigger>
    </>
  );
};

const InvitationNameCell = ({ row }: CellValue<CatalogInvitation>) => {
  const { formatMessage } = useIntl();
  const { username, fullName, isRegistered } = row.original;
  if (!isRegistered) {
    return <span className="text-muted">{formatMessage(messages['corporate.catalog.invitations.not.registered'])}</span>;
  }
  return (
    <div>
      <span className="d-block truncate-1-line">{username}</span>
      {fullName && fullName !== username && (
        <span className="small text-muted truncate-1-line">{fullName}</span>
      )}
    </div>
  );
};

const InvitationList = ({ catalogId }: { catalogId: string }) => {
  const intl = useIntl();

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
    status: searchParams.status,
  });

  const resendMutation = useResendInvitation();

  const handleResend = (invitation: CatalogInvitation) => {
    resendMutation.mutate({ catalogId, invitationId: invitation.id });
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
          filters: [{ id: 'status', value: ['10'] }],
        }}
        manualPagination
        manualSortBy
        manualFilters
        fetchData={fetchData}
        pageCount={data?.numPages || 0}
        tableActions={[
          <DownloadReportButton {...INVITATIONS_REPORT_CONFIG(catalogId)} />,
        ]}
        additionalColumns={[
          {
            id: 'action',
            Header: intl.formatMessage(messages['corporate.catalog.table.header.action']),
            onResend: handleResend,
            onCancel: handleCancel,
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
            Filter: CheckboxFilter,
            filter: 'includesValue',
            filterChoices: [
              { value: '10', name: intl.formatMessage(messages['corporate.catalog.invitations.filter.pending']) },
              { value: '20', name: intl.formatMessage(messages['corporate.catalog.invitations.filter.accepted']) },
              { value: '30', name: intl.formatMessage(messages['corporate.catalog.invitations.filter.declined']) },
              { value: '40', name: intl.formatMessage(messages['corporate.catalog.invitations.filter.removed']) },
              { value: '50', name: intl.formatMessage(messages['corporate.catalog.invitations.filter.cancelled']) },
            ],
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
