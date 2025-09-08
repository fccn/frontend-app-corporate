import { FC, ReactNode, useState } from 'react';
import { breakpoints, Stack, useMediaQuery, IconButtonWithTooltip } from '@openedx/paragon';
import { ContentCopy } from '@openedx/paragon/icons';

import ImageWithSkeleton from './ImageWithSkeleton';

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
  const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
  const isMedium = useMediaQuery({ maxWidth: breakpoints.medium.maxWidth });
  const [copied, setCopied] = useState('Copy');

  const handleCopy = async () => {
    if (context.copyableDescription && context.description) {
      try {
        await navigator.clipboard.writeText(context.description);
        setCopied('Copied');
        setTimeout(() => setCopied('Copy'), 500);
      } catch (e) {
        setCopied('It was not possible to copy, try again');
        setTimeout(() => setCopied('Copy'), 1500);
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
