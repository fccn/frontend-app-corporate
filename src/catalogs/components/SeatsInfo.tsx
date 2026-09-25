import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButtonWithTooltip } from '@openedx/paragon';
import { InfoOutline, WarningFilled } from '@openedx/paragon/icons';

import messages from '../messages';

export interface SeatsInfoProps {
  /** Seat cap for the catalog; 0 means unlimited. */
  userLimit: number;
  /** Learners currently occupying a seat. */
  activeLearners: number;
  /** Invitations sent and not yet accepted, declined or cancelled. */
  pendingInvitations: number;
}

/**
 * Available seats for the catalog header, with the accepted / pending / free
 * breakdown behind an info tooltip.
 *
 * The backend consumes a seat when an invitation is *accepted*, not when it is sent
 * (`has_catalog_capacity`), so pending invitations reserve nothing and inviting is
 * never blocked. Free seats are therefore the limit minus accepted learners, and
 * pending invitations are reported alongside rather than subtracted. More can be
 * outstanding than seats remain, which the soft cap allows because the limit is only
 * enforced at acceptance; the icon then turns into a warning and the tooltip says so.
 */
const SeatsInfo = ({ userLimit, activeLearners, pendingInvitations }: SeatsInfoProps) => {
  const intl = useIntl();

  const unlimited = !userLimit;
  // Active learners can exceed a limit that was lowered after the fact.
  const free = unlimited ? null : Math.max(0, userLimit - activeLearners);
  const oversubscribed = free !== null && pendingInvitations > free;

  const values = {
    accepted: activeLearners,
    pending: pendingInvitations,
    free,
    limit: userLimit,
  };

  let tooltipMessage = messages['corporate.catalog.header.info.seats.tooltip'];
  if (unlimited) {
    tooltipMessage = messages['corporate.catalog.header.info.seats.tooltip.unlimited'];
  } else if (oversubscribed) {
    tooltipMessage = messages['corporate.catalog.header.info.seats.tooltip.oversubscribed'];
  }
  const breakdown = intl.formatMessage(tooltipMessage, values);

  return (
    <span className="d-inline-flex align-items-center justify-content-center">
      {unlimited
        ? intl.formatMessage(messages['corporate.catalog.header.info.seats.value.unlimited'])
        : `${free} / ${userLimit}`}
      {/*
        A real button, so the breakdown is reachable by keyboard and not just on
        hover. `alt` names the control; the breakdown itself is the description,
        so neither is announced twice.
      */}
      <IconButtonWithTooltip
        className="ml-1"
        size="inline"
        variant={oversubscribed ? 'warning' : 'secondary'}
        src={oversubscribed ? WarningFilled : InfoOutline}
        alt={intl.formatMessage(messages['corporate.catalog.header.info.seats.details'])}
        tooltipPlacement="bottom"
        tooltipContent={breakdown}
      />
    </span>
  );
};

export default SeatsInfo;
