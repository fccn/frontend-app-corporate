import { ComponentType } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton, OverlayTrigger, Tooltip } from '@openedx/paragon';
import {
  Visibility,
  Edit,
  DeleteOutline,
  GroupAdd,
  InsertChartOutlined,
} from '@openedx/paragon/icons';
import messages from './messages';

type ActionConfigItem = {
  tooltip: string;
  icon: ComponentType;
  color?: any;
};

export const actionConfig: Record<string, ActionConfigItem> = {
  view: {
    tooltip: messages.tableActionView,
    icon: Visibility,
  },
  edit: {
    tooltip: messages.tableActionEdit,
    icon: Edit,
  },
  delete: {
    tooltip: messages.tableActionDelete,
    icon: DeleteOutline,
    color: 'danger',
  },
  userEdit: {
    tooltip: messages.tableActionUserEdit,
    icon: GroupAdd,
  },
  analytics: {
    tooltip: messages.tableActionAnalytics,
    icon: InsertChartOutlined,
  },
};

type ActionType = keyof typeof actionConfig;

interface ActionItemProps {
  type: ActionType;
  onClick?: () => void;
  ariaLabel?: string;
}

const ActionItem = ({
  type,
  onClick,
  ariaLabel,
}: ActionItemProps) => {
  const intl = useIntl();
  const { tooltip, icon, color } = actionConfig[type];

  return (
    <OverlayTrigger
      overlay={<Tooltip id={`tooltip-${type}`}>{intl.formatMessage(tooltip)}</Tooltip>}
    >
      <IconButton src={icon} onClick={onClick} alt={ariaLabel || `${type}-action`} variant={color} />
    </OverlayTrigger>
  );
};

export default ActionItem;
