'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FirebaseImage from '@/components/FirebaseImage';
import ImageUploadModal from './ImageUploadModal';
import { SiteImage } from '@/types/image';
import { useFirebaseImage } from '@/hooks/useFirebaseImages';

interface EditableFirebaseImageProps {
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
  onEditStart?: () => void;
  onEditEnd?: () => void;
}

export default function EditableFirebaseImage(props: EditableFirebaseImageProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { image, refetch } = useFirebaseImage(props.id);
  const { onEditStart, onEditEnd, ...restProps } = props;

  const handleImageClick = (e: React.MouseEvent) => {
    // Stop event propagation to prevent parent links from being clicked
    e.stopPropagation();
    e.preventDefault();
    
    if (user) {
      setIsModalOpen(true);
      onEditStart?.();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    onEditEnd?.();
  };

  const handleUploadSuccess = () => {
    refetch();
    onEditEnd?.();
  };

  const isVideo = image?.type === 'video';

  return (
    <>
      <div 
        className={`relative group w-full h-full ${user ? 'cursor-pointer' : ''}`} 
      >
        <FirebaseImage {...restProps} />
        
        {user && (
          <div 
            className={`absolute inset-0 z-50 ${isVideo ? 'bg-black bg-opacity-20' : 'bg-black bg-opacity-0 group-hover:bg-opacity-30'} transition-all duration-300 flex items-center justify-center ${isVideo ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            onClick={handleImageClick}
          >
            <div className="bg-white rounded-full p-2 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {image && isModalOpen && (
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          image={image as SiteImage}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
} 