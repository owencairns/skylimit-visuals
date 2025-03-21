"use client";

import { useSectionFirebaseImages } from '../hooks/useFirebaseImages';
import EditableFirebaseImage from './ImageUpload/EditableFirebaseImage';
import { SiteImage } from '../types/image';

interface SectionImagesProps {
  section: SiteImage['section'];
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
  renderItem?: (image: SiteImage) => React.ReactNode;
}

export default function SectionImages({
  section,
  className = '',
  imageClassName = '',
  containerClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  renderItem,
}: SectionImagesProps) {
  const { images, loading, error } = useSectionFirebaseImages(section);

  if (loading) {
    return (
      <div className={`${containerClassName} ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No images available for this section.</p>
      </div>
    );
  }

  return (
    <div className={`${containerClassName} ${className}`}>
      {images.map((image) => (
        <div key={image.id} className="relative h-full w-full">
          {renderItem ? (
            renderItem(image)
          ) : (
            <EditableFirebaseImage
              id={image.id}
              className={`w-full h-full object-cover rounded-lg ${imageClassName}`}
              width={image.width}
              height={image.height}
            />
          )}
        </div>
      ))}
    </div>
  );
} 