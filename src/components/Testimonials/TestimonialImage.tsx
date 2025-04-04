'use client';

import { useState, useEffect } from 'react';
import FirebaseImage from '@/components/FirebaseImage';

interface TestimonialImageProps {
  imageId: string;
  alt: string;
  className?: string;
  isNew?: boolean;
}

export default function TestimonialImage({ 
  imageId, 
  alt, 
  className = '',
  isNew = false
}: TestimonialImageProps) {
  const [imageError, setImageError] = useState(false);

  // Reset error state when imageId changes
  useEffect(() => {
    setImageError(false);
  }, [imageId]);

  // For new testimonials or missing imageId, show a placeholder
  if (isNew || !imageId || imageId.trim() === '' || imageError) {
    return (
      <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <svg className="mx-auto h-12 w-12 text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-400">
            {isNew ? 'Upload an image' : 'No image available'}
          </p>
        </div>
      </div>
    );
  }
  
  // Use FirebaseImage for existing testimonials
  return (
    <div className={`w-full h-full ${className}`}>
      <FirebaseImage
        id={imageId}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
} 