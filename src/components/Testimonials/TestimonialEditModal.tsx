'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Testimonial } from '@/types/testimonial';
import { saveTestimonial, deleteTestimonial, uploadTestimonialImage, deleteTestimonialImage } from '@/lib/testimonialUtils';
import TestimonialImage from './TestimonialImage';

interface TestimonialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonials: Testimonial[];
  onSuccess: () => void;
  initialMode?: 'edit' | 'add';
}

export default function TestimonialEditModal({ 
  isOpen, 
  onClose, 
  testimonials, 
  onSuccess,
  initialMode = 'edit'
}: TestimonialEditModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'add'>(initialMode);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [editedTestimonial, setEditedTestimonial] = useState<Testimonial | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a new testimonial object
  const createNewTestimonial = () => {
    const newId = testimonials.length > 0 
      ? Math.max(...testimonials.map(t => t.id)) + 1 
      : 1;
    
    return {
      id: newId,
      quote: '',
      description: '',
      client: '',
      imageId: `testimonial-${newId}`,
      imagePath: `home/testimonial-${newId}.jpg`,
      imageUrl: '',
      isNew: true
    };
  };

  // Initialize component state once when it mounts
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'add' || testimonials.length === 0) {
        const newTestimonial = createNewTestimonial();
        setSelectedTestimonial(newTestimonial);
        setEditedTestimonial(newTestimonial);
        setActiveTab('add');
      } else if (testimonials.length > 0) {
        setSelectedTestimonial(testimonials[0]);
        setEditedTestimonial(testimonials[0]);
        setActiveTab('edit');
      }
    }
    
    return () => {
      // Reset state when component unmounts
      setSelectedTestimonial(null);
      setEditedTestimonial(null);
      setSelectedFile(null);
      setPreviewUrl(null);
    };
  // Only run this effect once when the component mounts or when isOpen changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Update activeTab when initialMode changes
  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  if (!isOpen || !user) return null;

  const handleTestimonialSelect = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setEditedTestimonial(testimonial);
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveTab('edit');
  };

  const handleAddNew = () => {
    const newTestimonial = createNewTestimonial();
    setSelectedTestimonial(newTestimonial);
    setEditedTestimonial(newTestimonial);
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveTab('add');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedTestimonial) return;
    
    setEditedTestimonial({
      ...editedTestimonial,
      [e.target.name]: e.target.value
    });
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
    if (!editedTestimonial || !user) return;
    
    // Validate required fields
    if (!editedTestimonial.quote || !editedTestimonial.description || !editedTestimonial.client) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Require image upload for new testimonials
    if (editedTestimonial.isNew && !selectedFile) {
      toast.error('Please upload an image for the new testimonial');
      return;
    }
    
    try {
      setIsProcessing(true);
      const loadingToast = toast.loading('Saving testimonial...');
      
      // Create a copy of the testimonial to update
      const testimonialToSave = { ...editedTestimonial };
      
      // Upload image if selected
      if (selectedFile) {
        // If this is an existing testimonial with an image, delete the old one first
        if (!testimonialToSave.isNew && testimonialToSave.imagePath) {
          const deleteResult = await deleteTestimonialImage(testimonialToSave);
          if (!deleteResult.success) {
            toast.dismiss(loadingToast);
            toast.error('Failed to delete existing image. Please try again.');
            setIsProcessing(false);
            return;
          }
        }

        const uploadResult = await uploadTestimonialImage(
          selectedFile,
          testimonialToSave.id,
          user
        );
        
        if (uploadResult.success && uploadResult.path && uploadResult.url && uploadResult.id) {
          testimonialToSave.imagePath = uploadResult.path;
          testimonialToSave.imageUrl = uploadResult.url;
          testimonialToSave.imageId = uploadResult.id;
          // Update the edited testimonial state to reflect the new image
          setEditedTestimonial(testimonialToSave);
          // Clear the selected file and preview
          setSelectedFile(null);
          setPreviewUrl(null);
        } else {
          toast.dismiss(loadingToast);
          toast.error('Failed to upload image. Please try again.');
          setIsProcessing(false);
          return;
        }
      }
      
      // Remove isNew flag before saving
      if (testimonialToSave.isNew) {
        delete testimonialToSave.isNew;
      }
      
      // Save testimonial
      const saveResult = await saveTestimonial(testimonialToSave, user);
      
      toast.dismiss(loadingToast);
      
      if (saveResult.success && saveResult.testimonial) {
        // Update the selected testimonial with the saved data
        setSelectedTestimonial(saveResult.testimonial);
        setEditedTestimonial(saveResult.testimonial);
        toast.success('Testimonial saved successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to save testimonial. Please try again.');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTestimonial || !user) return;
    
    if (!confirm(`Are you sure you want to delete this testimonial from ${selectedTestimonial.client}? This will also delete the associated image.`)) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const loadingToast = toast.loading('Deleting testimonial and associated image...');
      
      const result = await deleteTestimonial(selectedTestimonial.id, user);
      
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('Testimonial and associated image deleted successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to delete testimonial. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
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
          <h2 className="text-2xl font-bold">Manage Testimonials</h2>
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
          {/* Testimonials List */}
          <div className="md:w-1/3 border-r pr-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Testimonials</h3>
              <button
                onClick={handleAddNew}
                className="px-3 py-1 bg-brand-blue text-white rounded-md text-sm hover:bg-brand-blue/90"
                disabled={isProcessing}
              >
                Add New
              </button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {testimonials.length === 0 ? (
                <p className="text-gray-500 italic">No testimonials yet. Click &quot;Add New&quot; to create one.</p>
              ) : (
                testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedTestimonial?.id === testimonial.id 
                        ? 'bg-brand-blue/10 border border-brand-blue/30' 
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => handleTestimonialSelect(testimonial)}
                  >
                    <p className="font-medium truncate">{testimonial.client}</p>
                    <p className="text-sm text-gray-600 truncate">{testimonial.quote}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Edit Form */}
          <div className="md:w-2/3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {activeTab === 'add' ? 'Add New Testimonial' : 'Edit Testimonial'}
              </h3>
            </div>
            
            {editedTestimonial ? (
              <div className="space-y-4">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name*
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={editedTestimonial.client}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter client name"
                    disabled={isProcessing}
                  />
                </div>
                
                {/* Quote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Quote*
                  </label>
                  <input
                    type="text"
                    name="quote"
                    value={editedTestimonial.quote}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter a short quote (displayed in carousel)"
                    disabled={isProcessing}
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Testimonial*
                  </label>
                  <textarea
                    name="description"
                    value={editedTestimonial.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter the full testimonial text"
                    disabled={isProcessing}
                  />
                </div>
                
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonial Image
                  </label>
                  
                  <div className="flex items-start space-x-4">
                    {/* Current Image - only show for existing testimonials */}
                    {(activeTab === 'edit' && !editedTestimonial.isNew) && (
                      <div className="w-1/3">
                        <p className="text-sm text-gray-500 mb-1">Current Image</p>
                        <div className="aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-200">
                          <TestimonialImage
                            imageId={editedTestimonial.imageId}
                            alt={`Testimonial from ${editedTestimonial.client}`}
                            isNew={editedTestimonial.isNew}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* New Image Upload */}
                    <div className={(activeTab === 'edit' && !editedTestimonial.isNew) ? "w-2/3" : "w-full"}>
                      <p className="text-sm text-gray-500 mb-1">
                        {(activeTab === 'edit' && !editedTestimonial.isNew) ? "Upload New Image" : "Upload Image"}
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
                          <div className="relative aspect-[3/4] w-full">
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
                      'Save Testimonial'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Select a testimonial to edit or click &quot;Add New&quot; to create one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 

