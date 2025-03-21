"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useFirebaseImage } from '../hooks/useFirebaseImages';

interface FirebaseImageProps {
  id: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  fallbackSrc?: string;
  videoControls?: boolean;
  videoAutoPlay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
}

export default function FirebaseImage({
  id,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  fallbackSrc = '/images/placeholder.jpg',
  videoControls = true,
  videoAutoPlay = true,
  videoMuted = true,
  videoLoop = true,
}: FirebaseImageProps) {
  const { image, loading, error } = useFirebaseImage(id);
  const [src, setSrc] = useState<string>(fallbackSrc);
  
  useEffect(() => {
    if (image?.url) {
      setSrc(image.url);
    }
  }, [image]);

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse w-full h-full ${className}`} style={{ width, height }} />
    );
  }

  if (error || !image) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt || 'Image not found'}
        className={`w-full h-full ${className}`}
        width={width || 300}
        height={height || 300}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  // Render video if the type is video
  if (image.type === 'video') {
    return (
      <video
        src={src}
        className={`w-full h-full ${className}`}
        width={width || image.width}
        height={height || image.height}
        controls={videoControls}
        autoPlay={videoAutoPlay}
        muted={videoMuted}
        loop={videoLoop}
        playsInline
        style={{ objectFit: 'cover', pointerEvents: 'none' }}
      >
        <source src={src} type={image.mimeType || 'video/mp4'} />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Render image for all other types
  return (
    <Image
      src={src}
      alt={alt || image.alt}
      className={`w-full h-full ${className}`}
      width={width || image.width}
      height={height || image.height}
      priority={priority || image.priority}
      placeholder={placeholder}
      style={{ objectFit: 'cover' }}
    />
  );
} 