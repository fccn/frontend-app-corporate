import { FC, useRef } from 'react';
import { Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { CSVLink } from 'react-csv';

import messages from './messages';

interface TableActionProps {
  tableInstance: any
}

const DownloadReportButton: FC<TableActionProps> = ({ tableInstance }) => {
  const intl = useIntl();
  const csvLink = useRef<any>(null);

  return (
    <>
      <Button onClick={() => csvLink.current?.link.click()}>
        {intl.formatMessage(messages.downloadReport)}
      </Button>
      <CSVLink data={tableInstance.data} ref={csvLink} />
    </>
  );
};

export default DownloadReportButton;
