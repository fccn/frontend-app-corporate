import { FC, ReactNode, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  breakpoints, Stack, useMediaQuery, IconButtonWithTooltip,
} from '@openedx/paragon';
import { ContentCopy } from '@openedx/paragon/icons';

import ImageWithSkeleton from './ImageWithSkeleton';
import messages from './messages';

interface HeaderDescriptionProps {
  context: {
    title: string;
    imageUrl: string | null;
    description?: string;
    copyableDescription?: boolean;
  },
  info: {
    title: string;
    value: string | number;
  }[],
  children?: ReactNode;
}

const HeaderDescription: FC<HeaderDescriptionProps> = ({ context, info, children }) => {
  const intl = useIntl();
  const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
  const isMedium = useMediaQuery({ maxWidth: breakpoints.medium.maxWidth });
  const [copied, setCopied] = useState(intl.formatMessage(messages.copyAction));

  const handleCopy = async () => {
    if (context.copyableDescription && context.description) {
      try {
        await navigator.clipboard.writeText(context.description);
        setCopied(intl.formatMessage(messages.copySuccess));
        setTimeout(() => setCopied(intl.formatMessage(messages.copyAction)), 500);
      } catch (e) {
        setCopied(intl.formatMessage(messages.copyError));
        setTimeout(() => setCopied(intl.formatMessage(messages.copyAction)), 2500);
      }
    }
  };

  return (
    <Stack
      className={`border rounded bg-light-100 px-${isSmall ? 3 : 4} py-3 my-3 justify-content-between`}
      direction={isMedium ? 'vertical' : 'horizontal'}
      gap={4}
    >
      <Stack direction={isSmall ? 'vertical' : 'horizontal'} gap={3}>
        {context.imageUrl && (
          <ImageWithSkeleton
            src={context.imageUrl}
            width={150}
            height={70}
            alt={context.title}
          />
        )}

        <Stack className="justify-content-center">
          <h3 className="mb-0">{context.title}</h3>
          <span className="small">{context?.description}
            {context.copyableDescription && (
              <IconButtonWithTooltip
                invertColors
                isActive
                src={ContentCopy}
                variant="primary"
                onClick={handleCopy}
                alt="Copy description"
                tooltipContent={copied}
              />
            )}
          </span>
        </Stack>
      </Stack>

      <Stack direction="horizontal" gap={4}>
        {info.map((item, index) => (
          <>
            <div key={item.title} className="d-flex flex-column">
              <span className="x-small text-gray">{item.title}</span>
              <span className="small text-gray">{item.value}</span>
            </div>
            {index < info.length - 1 && !isSmall && <hr className="border border-left-1 h-25 m-0" />}
          </>
        ))}
      </Stack>

      {children}
    </Stack>
  );
};

export default HeaderDescription;
