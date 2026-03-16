import { useIntl } from '@edx/frontend-platform/i18n';

import { Button } from '@openedx/paragon';
import { SaveAlt } from '@openedx/paragon/icons';

import messages from '../messages';

interface DownloadReportButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DownloadReportButton = ({ onClick, disabled = false }: DownloadReportButtonProps) => {
  const intl = useIntl();

  return (
    <Button iconBefore={SaveAlt} size="sm" onClick={onClick} disabled={disabled}>
      {intl.formatMessage(messages['corporate.tables.action.download.report'])}
    </Button>
  );
};

export default DownloadReportButton;
