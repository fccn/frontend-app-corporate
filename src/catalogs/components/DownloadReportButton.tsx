import { useIntl } from '@edx/frontend-platform/i18n';

import { Button } from '@openedx/paragon';
import { SaveAlt } from '@openedx/paragon/icons';

import messages from '../messages';

interface DownloadReportButtonProps {
  onClick: () => void;
}

const DownloadReportButton = ({ onClick }: DownloadReportButtonProps) => {
  const intl = useIntl();

  return (
    <Button iconBefore={SaveAlt} size="sm" onClick={onClick}>
      {intl.formatMessage(messages['corporate.tables.action.download.report'])}
    </Button>
  );
};

export default DownloadReportButton;
