import { Fragment, ReactNode, useState } from 'react';
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

const HeaderDescription = ({ context, info, children }: HeaderDescriptionProps) => {
  const intl = useIntl();
  const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
  const isLarge = useMediaQuery({ maxWidth: breakpoints.large.maxWidth });
  const [copied, setCopied] = useState(intl.formatMessage(messages['corporate.copy.action']));

  const handleCopy = async () => {
    if (context.copyableDescription && context.description) {
      try {
        await navigator.clipboard.writeText(context.description);
        setCopied(intl.formatMessage(messages['corporate.copy.success']));
        setTimeout(() => setCopied(intl.formatMessage(messages['corporate.copy.action'])), 500);
      } catch (e) {
        setCopied(intl.formatMessage(messages['corporate.copy.error']));
        setTimeout(() => setCopied(intl.formatMessage(messages['corporate.copy.action'])), 2500);
      }
    }
  };

  return (
    <Stack
      className={`border rounded bg-light-100 px-${isSmall ? 3 : 4} py-3 my-3 justify-content-between`}
      direction={isLarge ? 'vertical' : 'horizontal'}
      gap={2}
    >
      <Stack direction={isSmall ? 'vertical' : 'horizontal'} gap={2}>
        {context.imageUrl && (
          <ImageWithSkeleton
            src={context.imageUrl}
            width={150}
            height={70}
            alt={context.title}
          />
        )}

        <Stack className="justify-content-center">
          <h3 className="mb-0 truncate-1-line">{context.title}</h3>
          <span className="x-small d-inline-flex align-items-center">
            <span className="truncate-2-line header-link">{context?.description}</span>
            {context.copyableDescription && (
              <IconButtonWithTooltip
                invertColors
                isActive
                src={ContentCopy}
                variant="black"
                onClick={handleCopy}
                alt="Copy description"
                tooltipContent={copied}
              />
            )}
          </span>
        </Stack>
      </Stack>

      <Stack direction="horizontal" gap={2} className="flex-wrap flex-md-nowrap text-center">
        {info.map((item, index) => (
          <Fragment key={item.title}>
            <div className="d-flex flex-column">
              <span className="x-small">{item.title}</span>
              <span className="small text-gray">{item.value}</span>
            </div>
            {index < info.length - 1 && <hr className="border border-left-1 header-splitter m-0" />}
          </Fragment>
        ))}
      </Stack>

      {children}
    </Stack>
  );
};

export default HeaderDescription;
