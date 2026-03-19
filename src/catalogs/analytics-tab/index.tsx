import AnalyticsIframe from './AnalyticsIframe';

interface AnalyticsTabProps {
  catalogId: string
}

const AnalyticsTab = ({ catalogId }: AnalyticsTabProps) => (
  <AnalyticsIframe catalogId={catalogId} />
);

export default AnalyticsTab;
