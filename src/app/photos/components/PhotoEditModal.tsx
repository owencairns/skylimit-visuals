'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Photo } from '../types/Photo';
import { uploadPhoto, savePhoto, deletePhoto } from '@/lib/photoUtils';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

interface PhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  onSuccess: () => void;
}

export default function PhotoEditModal({ isOpen, onClose, photos, onSuccess }: PhotoEditModalProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setIsProcessing(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const photoId = crypto.randomUUID();
        const { success, url } = await uploadPhoto(file, photoId);
        if (success && url) {
          const newPhoto: Photo = {
            id: photoId,
            title: 'Untitled',
            description: '',
            imageUrl: url,
            category: 'other',
            createdAt: new Date().toISOString(),
          };
          await savePhoto(newPhoto);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error uploading photo:', error);
        return false;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(Boolean).length;
    
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''}`);
      onSuccess();
    }
    if (successCount < files.length) {
      toast.error(`Failed to upload ${files.length - successCount} photo${files.length - successCount > 1 ? 's' : ''}`);
    }
    
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBatchDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedPhotos.size} photos?`)) return;
    
    setIsProcessing(true);
    const deletePromises = Array.from(selectedPhotos).map(async (photoId) => {
      try {
        await deletePhoto(photoId);
        return true;
      } catch (error) {
        console.error('Error deleting photo:', error);
        return false;
      }
    });

    const results = await Promise.all(deletePromises);
    const successCount = results.filter(Boolean).length;
    
    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} photo${successCount > 1 ? 's' : ''}`);
      onSuccess();
    }
    if (successCount < selectedPhotos.size) {
      toast.error(`Failed to delete ${selectedPhotos.size - successCount} photo${selectedPhotos.size - successCount > 1 ? 's' : ''}`);
    }
    
    setSelectedPhotos(new Set());
    setIsProcessing(false);
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Dialog.Title className="text-2xl font-semibold">
                  Manage Photos
                </Dialog.Title>
                {selectedPhotos.size > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    disabled={isProcessing}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Selected ({selectedPhotos.size})</span>
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Upload Section */}
            <div className="mb-8">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-blue file:text-white
                  hover:file:bg-brand-blue/90
                  cursor-pointer"
                disabled={isProcessing}
              />
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {photos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="group relative aspect-square cursor-pointer"
                  onClick={() => togglePhotoSelection(photo.id)}
                >
                  <Image
                    src={photo.imageUrl}
                    alt=""
                    fill
                    className={`object-cover rounded-lg transition-opacity duration-200 ${
                      selectedPhotos.has(photo.id) ? 'opacity-50' : 'group-hover:opacity-75'
                    }`}
                  />
                  {selectedPhotos.has(photo.id) && (
                    <div className="absolute top-2 right-2 bg-brand-blue text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isProcessing && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 