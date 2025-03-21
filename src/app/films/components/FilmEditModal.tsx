'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FilmStory } from './FilmCard';
import { saveFilm, deleteFilm, uploadFilmImage } from '@/lib/filmUtils';

interface FilmEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  films: FilmStory[];
  onSuccess: () => void;
  initialMode?: 'edit' | 'add';
}

export default function FilmEditModal({ 
  isOpen, 
  onClose, 
  films, 
  onSuccess,
  initialMode = 'edit'
}: FilmEditModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'add'>(initialMode);
  const [selectedFilm, setSelectedFilm] = useState<FilmStory | null>(null);
  const [editedFilm, setEditedFilm] = useState<FilmStory | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a new film object
  const createNewFilm = () => {
    // Generate a unique ID using timestamp
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const newId = `${timestamp}-${randomSuffix}`;
    
    return {
      id: newId,
      title: '',
      description: '',
      imageUrl: '',
      youtubeUrl: '',
      isNew: true
    };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editedFilm) return;

    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setEditedFilm({
      ...editedFilm,
      [e.target.name]: value
    });
  };

  // Initialize component state once when it mounts
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'add' || films.length === 0) {
        const newFilm = createNewFilm();
        setSelectedFilm(newFilm);
        setEditedFilm(newFilm);
        setActiveTab('add');
      } else if (films.length > 0) {
        // Ensure all required fields have default values
        const firstFilm = {
          ...films[0],
          title: films[0].title || '',
          description: films[0].description || '',
          imageUrl: films[0].imageUrl || '',
          youtubeUrl: films[0].youtubeUrl || ''
        };
        setSelectedFilm(firstFilm);
        setEditedFilm(firstFilm);
        setActiveTab('edit');
      }
    }
    
    return () => {
      // Reset state when component unmounts
      setSelectedFilm(null);
      setEditedFilm(null);
      setSelectedFile(null);
      setPreviewUrl(null);
    };
  }, [isOpen, initialMode, films]);

  if (!isOpen || !user) return null;

  const handleFilmSelect = (film: FilmStory) => {
    // Ensure all required fields have default values
    const selectedFilm = {
      ...film,
      title: film.title || '',
      description: film.description || '',
      imageUrl: film.imageUrl || '',
      youtubeUrl: film.youtubeUrl || ''
    };
    setSelectedFilm(selectedFilm);
    setEditedFilm(selectedFilm);
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveTab('edit');
  };

  const handleAddNew = () => {
    const newFilm = createNewFilm();
    setSelectedFilm(newFilm);
    setEditedFilm(newFilm);
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveTab('add');
  };

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

  const handleSave = async () => {
    if (!editedFilm || !user) return;
    
    // Validate required fields
    if (!editedFilm.title || !editedFilm.description || !editedFilm.youtubeUrl) {
      toast.error('Please fill in all required fields (Title, Description, and YouTube URL)');
      return;
    }
    
    // Validate YouTube URL format
    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    if (!youtubeRegExp.test(editedFilm.youtubeUrl)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    // Require image upload for new films
    if ((activeTab === 'add' || editedFilm.isNew) && !selectedFile) {
      toast.error('Please upload a thumbnail image for the new film');
      return;
    }
    
    try {
      setIsProcessing(true);
      const loadingToast = toast.loading('Saving film...');
      
      // Upload image if selected
      if (selectedFile) {
        const uploadResult = await uploadFilmImage(
          selectedFile,
          editedFilm.id,
          user
        );
        
        if (uploadResult.success && uploadResult.url) {
          editedFilm.imageUrl = uploadResult.url;
          // Remove the isNew flag after successful upload
          if (editedFilm.isNew) {
            delete editedFilm.isNew;
          }
        } else {
          toast.dismiss(loadingToast);
          toast.error('Failed to upload image. Please try again.');
          setIsProcessing(false);
          return;
        }
      }
      
      // Save film
      const saveResult = await saveFilm(editedFilm, user);
      
      toast.dismiss(loadingToast);
      
      if (saveResult.success) {
        toast.success('Film saved successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to save film. Please try again.');
      }
    } catch (error) {
      console.error('Error saving film:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFilm || !user) return;
    
    if (!confirm(`Are you sure you want to delete this film "${selectedFilm.title}"? This will also delete the associated image.`)) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const loadingToast = toast.loading('Deleting film and associated image...');
      
      const result = await deleteFilm(selectedFilm.id, user);
      
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('Film and associated image deleted successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to delete film. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting film:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto"
         onClick={(e) => {
           // Close modal when clicking outside
           if (e.target === e.currentTarget) {
             onClose();
           }
         }}
    >
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Films</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Films List */}
          <div className="md:w-1/3 border-r pr-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Films</h3>
              <button
                onClick={handleAddNew}
                className="px-3 py-1 bg-brand-blue text-white rounded-md text-sm hover:bg-brand-blue/90"
                disabled={isProcessing}
              >
                Add New
              </button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {films.length === 0 ? (
                <p className="text-gray-500 italic">No films yet. Click &quot;Add New&quot; to create one.</p>
              ) : (
                films.map((film) => (
                  <div 
                    key={film.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedFilm?.id === film.id 
                        ? 'bg-brand-blue/10 border border-brand-blue/30' 
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => handleFilmSelect(film)}
                  >
                    <p className="font-medium truncate">{film.title}</p>
                    <p className="text-sm text-gray-600 truncate">{film.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Edit Form */}
          <div className="md:w-2/3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {activeTab === 'add' ? 'Add New Film' : 'Edit Film'}
              </h3>
            </div>
            
            {editedFilm ? (
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editedFilm.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter film title (e.g., JOHN + JANE)"
                    disabled={isProcessing}
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={editedFilm.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter the film description"
                    disabled={isProcessing}
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL*
                  </label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={editedFilm.youtubeUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
                    disabled={isProcessing}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    You can use any YouTube URL format (watch, share, or embed)
                  </p>
                </div>
                
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image*
                  </label>
                  
                  <div className="flex items-start space-x-4">
                    {/* Current Image - only show for existing films */}
                    {(activeTab === 'edit' && !editedFilm.isNew && editedFilm.imageUrl) && (
                      <div className="w-1/3">
                        <p className="text-sm text-gray-500 mb-1">Current Image</p>
                        <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={editedFilm.imageUrl}
                            alt={`${editedFilm.title} film`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* New Image Upload */}
                    <div className={(activeTab === 'edit' && !editedFilm.isNew && editedFilm.imageUrl) ? "w-2/3" : "w-full"}>
                      <p className="text-sm text-gray-500 mb-1">
                        {(activeTab === 'edit' && !editedFilm.isNew) ? "Upload New Thumbnail" : "Upload Thumbnail"}
                      </p>
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
                          disabled={isProcessing}
                        />
                        
                        {previewUrl ? (
                          <div className="relative aspect-video w-full">
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
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  {activeTab === 'edit' && (
                    <button
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                      onClick={handleDelete}
                      disabled={isProcessing}
                    >
                      Delete
                    </button>
                  )}
                  
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={onClose}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Save Film'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Select a film to edit or click &quot;Add New&quot; to create one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 