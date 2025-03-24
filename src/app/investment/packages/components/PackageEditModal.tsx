'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Package } from '@/types/package';
import { savePackage, deletePackage, uploadPackageImage } from '@/lib/packageUtils';

interface PackageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  onSuccess: () => void;
  initialMode?: 'edit' | 'add';
  initialType?: 'videography' | 'photography';
}

export default function PackageEditModal({ 
  isOpen, 
  onClose, 
  packages, 
  onSuccess,
  initialMode = 'edit',
  initialType = 'videography'
}: PackageEditModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'add'>(initialMode);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [editedPackage, setEditedPackage] = useState<Package | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a new package object
  const createNewPackage = (type: 'videography' | 'photography' = initialType) => {
    // Generate a unique ID using timestamp
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const newId = `${timestamp}-${randomSuffix}`;
    
    // Find the highest order number for the given type
    const maxOrder = packages
      .filter(pkg => pkg.type === type)
      .reduce((max, pkg) => {
        const order = typeof pkg.order === 'number' ? pkg.order : 0;
        return Math.max(max, order);
      }, -1);
    
    return {
      id: newId,
      title: '',
      description: '',
      imageUrl: '',
      price: '',
      features: [],
      type,
      order: maxOrder + 1, // Place at the end
      isNew: true
    };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editedPackage) return;

    let value: string | number | boolean = e.target.value;
    
    if (e.target.name === 'order') {
      // Ensure order is a non-negative number
      const orderValue = parseInt(e.target.value);
      value = isNaN(orderValue) ? 0 : Math.max(0, orderValue);
    } else if (e.target.type === 'checkbox') {
      value = (e.target as HTMLInputElement).checked;
    }
    
    setEditedPackage({
      ...editedPackage,
      [e.target.name]: value
    });
  };

  const handleFeatureChange = (index: number, field: 'text' | 'note', value: string) => {
    if (!editedPackage) return;

    const updatedFeatures = [...editedPackage.features];
    if (field === 'text') {
      updatedFeatures[index] = { ...updatedFeatures[index], text: value };
    } else {
      updatedFeatures[index] = { ...updatedFeatures[index], note: value };
    }

    setEditedPackage({
      ...editedPackage,
      features: updatedFeatures
    });
  };

  const addFeature = () => {
    if (!editedPackage) return;

    setEditedPackage({
      ...editedPackage,
      features: [...editedPackage.features, { text: '' }]
    });
  };

  const removeFeature = (index: number) => {
    if (!editedPackage) return;

    const updatedFeatures = editedPackage.features.filter((_, i) => i !== index);
    setEditedPackage({
      ...editedPackage,
      features: updatedFeatures
    });
  };

  // Initialize component state once when it mounts
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'add' || packages.length === 0) {
        const newPackage = createNewPackage(initialType);
        setSelectedPackage(newPackage);
        setEditedPackage(newPackage);
        setActiveTab('add');
      } else if (packages.length > 0) {
        const firstPackage = {
          ...packages[0],
          features: packages[0].features || []
        };
        setSelectedPackage(firstPackage);
        setEditedPackage(firstPackage);
        setActiveTab('edit');
      }
    }
    
    return () => {
      // Reset state when component unmounts
      setSelectedPackage(null);
      setEditedPackage(null);
      setSelectedFile(null);
      setPreviewUrl(null);
    };
  }, [isOpen, initialMode, initialType, packages]);

  if (!isOpen || !user) return null;

  const handlePackageSelect = (pkg: Package) => {
    const selectedPackage = {
      ...pkg,
      features: pkg.features || []
    };
    setSelectedPackage(selectedPackage);
    setEditedPackage(selectedPackage);
    setSelectedFile(null);
    setPreviewUrl(null);
    setActiveTab('edit');
  };

  const handleAddNew = (type: 'videography' | 'photography' = initialType) => {
    const newPackage = createNewPackage(type);
    setSelectedPackage(newPackage);
    setEditedPackage(newPackage);
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
    if (!editedPackage || !user) return;
    
    // Validate required fields
    if (!editedPackage.title || !editedPackage.description || !editedPackage.price) {
      toast.error('Please fill in all required fields (Title, Description, and Price)');
      return;
    }
    
    // Validate features
    if (editedPackage.features.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    // Validate each feature has text
    if (editedPackage.features.some(feature => !feature.text.trim())) {
      toast.error('All features must have text');
      return;
    }
    
    // Require image upload for new packages
    if ((activeTab === 'add' || editedPackage.isNew) && !selectedFile) {
      toast.error('Please upload a thumbnail image for the new package');
      return;
    }
    
    try {
      setIsProcessing(true);
      const loadingToast = toast.loading('Saving package...');
      
      // Upload image if selected
      if (selectedFile) {
        const uploadResult = await uploadPackageImage(
          selectedFile,
          editedPackage.id,
          user
        );
        
        if (uploadResult.success && uploadResult.url) {
          editedPackage.imageUrl = uploadResult.url;
          // Remove the isNew flag after successful upload
          if (editedPackage.isNew) {
            delete editedPackage.isNew;
          }
        } else {
          toast.dismiss(loadingToast);
          toast.error('Failed to upload image. Please try again.');
          setIsProcessing(false);
          return;
        }
      }
      
      // Save package
      const saveResult = await savePackage(editedPackage, user);
      
      toast.dismiss(loadingToast);
      
      if (saveResult.success) {
        toast.success('Package saved successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to save package. Please try again.');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage || !user) return;
    
    if (!confirm(`Are you sure you want to delete this package "${selectedPackage.title}"? This will also delete the associated image.`)) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const loadingToast = toast.loading('Deleting package and associated image...');
      
      const result = await deletePackage(selectedPackage.id, user);
      
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('Package and associated image deleted successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to delete package. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPackages = packages.filter(pkg => pkg.type === (editedPackage?.type || initialType));

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
          <h2 className="text-2xl font-bold">Manage Packages</h2>
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
          {/* Packages List */}
          <div className="md:w-1/3 border-r pr-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Packages</h3>
              <div className="space-x-2">
                <button
                  onClick={() => handleAddNew('videography')}
                  className="px-3 py-1 bg-brand-blue text-white rounded-md text-sm hover:bg-brand-blue/90"
                  disabled={isProcessing}
                >
                  + Video
                </button>
                <button
                  onClick={() => handleAddNew('photography')}
                  className="px-3 py-1 bg-brand-blue text-white rounded-md text-sm hover:bg-brand-blue/90"
                  disabled={isProcessing}
                >
                  + Photo
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {filteredPackages.length === 0 ? (
                <p className="text-gray-500 italic">No packages yet. Click one of the add buttons to create one.</p>
              ) : (
                filteredPackages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedPackage?.id === pkg.id 
                        ? 'bg-brand-blue/10 border border-brand-blue/30' 
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 text-sm bg-gray-100 rounded-full">
                        {pkg.order}
                      </span>
                      <p className="font-medium truncate">{pkg.title}</p>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{pkg.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Edit Form */}
          <div className="md:w-2/3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {activeTab === 'add' ? 'Add New Package' : 'Edit Package'}
              </h3>
            </div>
            
            {editedPackage ? (
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editedPackage.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter package title"
                    disabled={isProcessing}
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={editedPackage.subtitle || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter optional subtitle"
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
                    value={editedPackage.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter package description"
                    disabled={isProcessing}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price*
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={editedPackage.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter package price"
                    disabled={isProcessing}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type*
                  </label>
                  <select
                    name="type"
                    value={editedPackage.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    disabled={isProcessing}
                  >
                    <option value="videography">Videography</option>
                    <option value="photography">Photography</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order*
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={editedPackage.order}
                    onChange={handleInputChange}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter display order (0 = first)"
                    disabled={isProcessing}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Lower numbers appear first (0 = first, 1 = second, etc.)
                  </p>
                </div>

                {/* Features */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Features*
                    </label>
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-sm text-brand-blue hover:text-brand-blue/80"
                      disabled={isProcessing}
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editedPackage.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={feature.text}
                            onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                            placeholder="Feature text"
                            disabled={isProcessing}
                          />
                          <input
                            type="text"
                            value={feature.note || ''}
                            onChange={(e) => handleFeatureChange(index, 'note', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                            placeholder="Optional note"
                            disabled={isProcessing}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isProcessing}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image*
                  </label>
                  
                  <div className="flex items-start space-x-4">
                    {/* Current Image - only show for existing packages */}
                    {(activeTab === 'edit' && !editedPackage.isNew && editedPackage.imageUrl) && (
                      <div className="w-1/3">
                        <p className="text-sm text-gray-500 mb-1">Current Image</p>
                        <div className="aspect-[4/3] relative overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={editedPackage.imageUrl}
                            alt={`${editedPackage.title} package`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* New Image Upload */}
                    <div className={(activeTab === 'edit' && !editedPackage.isNew && editedPackage.imageUrl) ? "w-2/3" : "w-full"}>
                      <p className="text-sm text-gray-500 mb-1">
                        {(activeTab === 'edit' && !editedPackage.isNew) ? "Upload New Thumbnail" : "Upload Thumbnail"}
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
                          <div className="relative aspect-[4/3] w-full">
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
                      'Save Package'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Select a package to edit or click one of the add buttons to create one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 