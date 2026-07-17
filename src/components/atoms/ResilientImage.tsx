"use client";

import { useEffect, useState, type ImgHTMLAttributes, type ReactNode } from "react";

type ResilientImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fallback?: ReactNode;
};

export function ResilientImage({
  alt,
  fallback = null,
  onError,
  src,
  ...props
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return <>{fallback}</>;
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
    />
  );
}
