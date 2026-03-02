import { FC } from 'react';
import AnalyticsIframe from './AnalyticsIframe';

interface AnalyticsTabProps {
  catalogId: string
}

const AnalyticsTab: FC<AnalyticsTabProps> = ({ catalogId }) => (
  <AnalyticsIframe catalogId={catalogId} />
);

export default AnalyticsTab;
