"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80";

/**
 * Robust image wrapper around next/image that provides
 * error handling, fallback images, and standard responsive behavior.
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className = "",
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const imageSource = error || !src ? fallbackSrc : src;

  return (
    <Image
      src={imageSource}
      alt={alt || "Image"}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
