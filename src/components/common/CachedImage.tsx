'use client';

import Image from 'next/image';
import { useFirebaseImage } from '@/hooks/useFirebaseImage';
import { useState } from 'react';

interface CachedImageProps {
  storagePath: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackUrl?: string;
}

export default function CachedImage({
  storagePath,
  alt,
  width,
  height,
  className,
  fallbackUrl,
}: CachedImageProps) {
  const [error, setError] = useState(false);
  const { imageUrl, isLoading } = useFirebaseImage({
    path: storagePath,
    fallbackUrl,
  });

  if (isLoading) {
    return (
      <div 
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{ width, height }}
      />
    );
  }

  if (error || !imageUrl) {
    return fallbackUrl ? (
      <Image
        src={fallbackUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    ) : (
      <div 
        className={`bg-gray-100 rounded flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image not found</span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      priority={false}
    />
  );
} 