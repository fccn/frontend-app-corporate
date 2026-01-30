import { FC, useState } from 'react';
import { Skeleton } from '@openedx/paragon';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  className?: string;
}

const ImageWithSkeleton: FC<ImageWithSkeletonProps> = ({
  src, alt, width, height, className,
}) => {
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isImageError, setImageError] = useState(false);

  return (
    <div>
      {isImageError
        ? <div style={{ width, height }} className={className ?? 'bg-light-200'} />
        : (
          <img
            src={src}
            alt={alt}
            onLoad={() => setImageLoaded(true)}
            className={className ?? ''}
            style={{
              maxHeight: height, width, display: isImageLoaded ? 'block' : 'none', objectFit: 'cover',
            }}
            onError={() => { setImageError(true); setImageLoaded(true); }}
          />
        )}
      {!isImageLoaded && <Skeleton width={width} height={height} />}
    </div>
  );
};

export default ImageWithSkeleton;
