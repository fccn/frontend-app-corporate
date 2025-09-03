import { FC, ReactNode } from 'react';
import {
  breakpoints, Stack, useMediaQuery,
} from '@openedx/paragon';

import ImageWithSkeleton from './ImageWithSkeleton';

interface HeaderDescriptionProps {
  context: {
    title: string;
    imageUrl: string | null;
    description?: string;
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

  return (
    <Stack
      className={`border rounded bg-primary-100 px-${isSmall ? 3 : 4} py-3 my-3 justify-content-between`}
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
          <span className="small">{context?.description}</span>
        </Stack>
      </Stack>

      <Stack direction="horizontal" gap={4}>
        {info.map((item, index) => (
          <>
            <div key={item.title} className="d-flex flex-column">
              <span className="x-small text-primary-500">{item.title}</span>
              <span className="small text-primary-400">{item.value}</span>
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
