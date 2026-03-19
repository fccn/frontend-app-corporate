import {
  useEffect, useRef, useState,
} from 'react';
import { embedDashboard, EmbeddedDashboard, Size } from '@superset-ui/embedded-sdk';
import { useParams } from 'wouter';
import { getConfig } from '@edx/frontend-platform';
import { fetchGuestToken } from './data/api';

interface AnalyticsIframeProps {
  catalogId: string
}

const AnalyticsIframe = ({ catalogId }: AnalyticsIframeProps) => {
  const containerDiv = useRef(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [count, setCount] = useState(0);

  const { courseId } = useParams<{ courseId: string }>();

  useEffect(() => {
    // Hide the dashboard when navigating
    setContainerHeight(0);

    (async () => {
      let iframe: EmbeddedDashboard | null = null;
      /**
       * The Superset Embed SDK provides a `getScrollSize` method that can return
       * the height and width of the iframe. However, the value is resolved as soon
       * as the DOM finishes loading. The charts take a while to render fully making
       * the value stale and the charts get hidden.
       *
       * The updateHeight method gets around this by using `setTimeout` to poll for
       * the height for 10 seconds or longer if the height keeps changing.
       */
      const updateHeight = async () => {
        if (iframe) {
          const size: Size = await iframe.getScrollSize();
          if ((count < 20) || (size.height !== containerHeight)) {
            setContainerHeight(size.height);
            setTimeout(updateHeight, 500);
            setCount(count + 1);
          }
        }
      };

      if (!containerDiv.current) {
        return;
      }

      try {
        iframe = await embedDashboard({
          id: getConfig().SUPERSET_DASHBOARD_ID,
          supersetDomain: getConfig().SUPERSET_HOST,
          mountPoint: containerDiv.current,
          fetchGuestToken: () => fetchGuestToken(courseId),
          dashboardUiConfig: {
            hideTitle: true,
            hideChartControls: true,
            filters: {
              expanded: false,
            },
          },
        });
      } catch (e) {
        return;
      }

      if (iframe) {
        await updateHeight();
      }
    })();
    // `containerHeight` is skipped to prevent height changes from re-rendering iframes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogId]);

  return (
    <div
      ref={containerDiv}
      className="aspects-embed-container d-flex w-100"
      style={{ minHeight: containerHeight }}
    />
  );
};

export default AnalyticsIframe;
