import { useId } from 'react';
import { MessageDescriptor, useIntl } from '@edx/frontend-platform/i18n';
import { Badge, Form, IconButtonWithTooltip } from '@openedx/paragon';
import { Cancel, Replay } from '@openedx/paragon/icons';

import { CatalogInvitation, CellValue } from '@src/types';
import { dateFormat } from '@src/catalogs/utils';
import messages from '../messages';

type InvitationStatusKey = CatalogInvitation['status'];

/**
 * Single source of truth for the invitation status vocabulary. Keyed by the slug
 * the API returns, so adding a status to `CatalogInvitation` without deciding its
 * filter code, badge, label and whether it can be resent or cancelled is a compile error.
 */
export const INVITATION_STATUS: Record<InvitationStatusKey, {
  code: number;
  variant: string;
  actionable: boolean;
  label: MessageDescriptor;
}> = {
  pending: {
    code: 10, variant: 'warning', actionable: true, label: messages['corporate.catalog.invitations.status.pending'],
  },
  accepted: {
    code: 20, variant: 'success', actionable: false, label: messages['corporate.catalog.invitations.status.accepted'],
  },
  declined: {
    code: 30, variant: 'danger', actionable: false, label: messages['corporate.catalog.invitations.status.declined'],
  },
  removed: {
    code: 40, variant: 'danger', actionable: false, label: messages['corporate.catalog.invitations.status.removed'],
  },
  cancelled: {
    code: 50, variant: 'light', actionable: false, label: messages['corporate.catalog.invitations.status.cancelled'],
  },
};

const statusKeys = Object.keys(INVITATION_STATUS) as InvitationStatusKey[];

export const InvitationStatus = ({ row }: CellValue<CatalogInvitation>) => {
  const { formatMessage } = useIntl();
  const { variant, label } = INVITATION_STATUS[row.original.status];
  return <Badge variant={variant}>{formatMessage(label)}</Badge>;
};

/**
 * Single-select status filter. The endpoint filters on one status code at a time,
 * so a multi-select control would send values it cannot accept.
 *
 * Paragon's DropdownFilter is uncontrolled and would show the placeholder while the
 * default `pending` filter is applied, so the select is bound to the column's filter value.
 */
export const InvitationStatusFilter = ({ column: { Header, filterValue, setFilter } }) => {
  const { formatMessage } = useIntl();
  const labelId = useId();

  return (
    <Form.Group>
      <Form.Label id={labelId} className="sr-only">{Header}</Form.Label>
      <Form.Control
        as="select"
        value={filterValue ?? ''}
        onChange={(e) => setFilter(e.target.value === '' ? undefined : Number(e.target.value))}
        aria-labelledby={labelId}
      >
        <option value="">{formatMessage(messages['corporate.catalog.invitations.filter.all'])}</option>
        {statusKeys.map((key) => (
          <option key={key} value={INVITATION_STATUS[key].code}>
            {formatMessage(INVITATION_STATUS[key].label)}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export const InvitationNameCell = ({ row }: CellValue<CatalogInvitation>) => {
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

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

/** Largest whole unit for a past moment, as `formatRelativeTime` expects it (negative = ago). */
const relativeTimeParts = (date: string): [number, Intl.RelativeTimeFormatUnit] => {
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000);
  const match = RELATIVE_TIME_UNITS.find(([, size]) => Math.abs(seconds) >= size);
  return match ? [Math.round(seconds / match[1]), match[0]] : [seconds, 'second'];
};

/**
 * The original invite date, with the resend history under it. invitedAt is never
 * moved by a resend, so the age of a pending invitation stays readable.
 */
export const InvitationInvitedAtCell = ({ row }: CellValue<CatalogInvitation>) => {
  const { formatMessage, formatRelativeTime } = useIntl();
  const { invitedAt, resendCount, lastResentAt } = row.original;
  return (
    <div>
      <span className="d-block">{dateFormat(invitedAt)}</span>
      {resendCount > 0 && lastResentAt && (
        <span className="x-small text-muted">
          {formatMessage(messages['corporate.catalog.invitations.table.resent'], {
            count: resendCount,
            when: formatRelativeTime(...relativeTimeParts(lastResentAt), { numeric: 'auto' }),
          })}
        </span>
      )}
    </div>
  );
};

// Paragon's IconButton props extend HTMLAttributes rather than ButtonHTMLAttributes, so
// `disabled` is missing from its types even though it is forwarded to the <button>.
const ActionButton = IconButtonWithTooltip as React.FC<
React.ComponentProps<typeof IconButtonWithTooltip> & { disabled?: boolean }
>;

type ActionCellProps = CellValue<CatalogInvitation> & {
  column: {
    onResend: (invitation: CatalogInvitation) => void;
    onCancel: (invitation: CatalogInvitation) => void;
    isResending: boolean;
  };
};

export const InvitationActionCell = ({ row, column }: ActionCellProps) => {
  const { formatMessage } = useIntl();
  const { actionable } = INVITATION_STATUS[row.original.status];
  return (
    <>
      <ActionButton
        src={Replay}
        alt={formatMessage(messages['corporate.catalog.invitations.action.resend'])}
        tooltipContent={formatMessage(messages['corporate.catalog.invitations.action.resend'])}
        variant="black"
        disabled={!actionable || column.isResending}
        onClick={() => column.onResend(row.original)}
      />
      <ActionButton
        src={Cancel}
        alt={formatMessage(messages['corporate.catalog.invitations.action.cancel'])}
        tooltipContent={formatMessage(messages['corporate.catalog.invitations.action.cancel'])}
        variant="danger"
        disabled={!actionable}
        onClick={() => column.onCancel(row.original)}
      />
    </>
  );
};
