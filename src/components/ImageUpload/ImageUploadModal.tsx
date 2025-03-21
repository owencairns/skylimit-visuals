'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { SiteImage } from '@/types/image';
import { uploadImage } from '@/lib/uploadUtils';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: SiteImage;
  onSuccess: () => void;
}

export default function ImageUploadModal({ isOpen, onClose, image, onSuccess }: ImageUploadModalProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, WEBP, or GIF)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      setIsUploading(true);
      const loadingToast = toast.loading('Uploading image...');

      const result = await uploadImage(selectedFile, image, user);

      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('Image updated successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Update Image</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Current Image</h3>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {image.type === 'video' ? (
              <video 
                src={image.url} 
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <Image
                src={image.url || '/images/placeholder.jpg'}
                alt={image.alt}
                fill
                className="object-cover"
              />
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">ID: {image.id}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Upload New Image</h3>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {previewUrl ? (
              <div className="relative w-full h-64">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">
                  Click to select a file or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG, WEBP, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Update Image'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 