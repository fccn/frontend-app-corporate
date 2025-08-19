import { Skeleton } from '@openedx/paragon';
import React, { FC } from 'react';

interface ImageWithSkeletonProps {
  src: string;
  width: number | string;
  height: number | string;
}

const ImageWithSkeleton: FC<ImageWithSkeletonProps> = ({ src, width, height }) => {
  const [isImageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      <img
        src={src}
        alt="Header Description"
        onLoad={() => setImageLoaded(true)}
        style={{ maxHeight: height, display: isImageLoaded ? 'block' : 'none' }}
      />
      {!isImageLoaded && <Skeleton width={width} height={height} />}
    </>
  );
};

export default ImageWithSkeleton;
