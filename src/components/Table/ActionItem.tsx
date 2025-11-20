import { ComponentType } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton, OverlayTrigger, Tooltip } from '@openedx/paragon';
import {
  Visibility,
  Delete,
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
    tooltip: messages['table.action.view'],
    icon: Visibility,
    color: 'black',
  },
  delete: {
    tooltip: messages['table.action.delete'],
    icon: Delete,
    color: 'danger',
  },
  analytics: {
    tooltip: messages['table.action.analytics'],
    icon: InsertChartOutlined,
    color: 'black',
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
