import {
  FC, useEffect, useRef, useState,
} from 'react';
import { embedDashboard, EmbeddedDashboard, Size } from '@superset-ui/embedded-sdk';
import { fetchGuestToken } from '../data/api';

interface AnalyticsTabProps {
  catalogId: string | number
}

const Embed = ({ catalogId }: { catalogId: string }) => {
  const containerDiv = useRef(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [count, setCount] = useState(0);

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
          id: 'bcb741a1-a100-51f7-803c-6a3b607eb047',
          supersetDomain: 'http://superset.local.openedx.io:8088/',
          mountPoint: containerDiv.current,
          fetchGuestToken: () => fetchGuestToken({
            catalog_id: catalogId,
          }),
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
      className="aspects-sidebar-embed-container d-flex w-100"
      style={{ minHeight: containerHeight }}
    />
  );
};

const AnalyticsTab: FC<AnalyticsTabProps> = ({ catalogId }) => {
  useEffect(() => {
    // embedDashboard({
    //   id: 'f2880cc1-63e9-48d7-ac3c-d2ff6f6698e2', // Dashboard ID from Superset
    //   supersetDomain: 'http://superset.local.openedx.io:8088/',
    //   mountPoint: document.getElementById('superset-embedded-container')!, // HTML element to contain the iframe
    //   fetchGuestToken, // Function to fetch the guest token
    //   dashboardUiConfig: {
    //     filters: {
    //       expanded: false,
    //     },
    //   },
    //   iframeTitle: 'Embedded Dashboard',
    //   iframeSandboxExtras: ['allow-same-origin', 'allow-scripts', 'allow-presentation', 'allow-downloads', 'allow-forms', 'allow-popups'],
    // });
  }, []);

  return (
    <Embed catalogId={catalogId} />
  );
};

export default AnalyticsTab;
