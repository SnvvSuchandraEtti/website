import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
  wrapperClassName?: string;
}

export function ImageWithSkeleton({
  className,
  skeletonClassName,
  wrapperClassName,
  alt,
  src,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state if src changes
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden w-full h-full", wrapperClassName)}>
      {(!isLoaded && !error) && (
        <Skeleton 
          className={cn(
            "absolute inset-0 w-full h-full transform-none rounded-none", 
            skeletonClassName
          )} 
        />
      )}
      <img
        src={src}
        alt={alt || ""}
        className={cn(
          className,
          "w-full h-full",
          "transition-opacity duration-300",
          (!isLoaded || error) ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
