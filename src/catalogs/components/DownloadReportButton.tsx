import { useIntl } from '@edx/frontend-platform/i18n';

import { Button } from '@openedx/paragon';
import { SaveAlt } from '@openedx/paragon/icons';

import { useDownloadReport } from '@src/catalogs/hooks/useDownloadReport';
import messages from '../messages';

export interface DownloadReportButtonProps {
  endpoint: string;
  filename: string;
  successMessage?: string;
  disabled?: boolean;
}

const DownloadReportButton = ({
  endpoint,
  filename,
  successMessage,
  disabled = false,
}: DownloadReportButtonProps) => {
  const intl = useIntl();

  const downloadReport = useDownloadReport({ endpoint, filename, successMessage });

  const isDisabled = disabled || downloadReport.isPending;

  return (
    <Button
      iconBefore={SaveAlt}
      size="sm"
      onClick={() => downloadReport.mutate()}
      disabled={isDisabled}
    >
      {intl.formatMessage(messages['corporate.tables.action.download.report'])}
    </Button>
  );
};

export default DownloadReportButton;
