"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTestimonials } from '@/hooks/useTestimonials';
import TestimonialImage from '@/components/Testimonials/TestimonialImage';
import TestimonialEditModal from '@/components/Testimonials/TestimonialEditModal';

// Client component for the testimonial carousel
export default function TestimonialCarousel() {
  const { user } = useAuth();
  const { testimonials, loading, error, refetch } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'edit' | 'add'>('edit');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Function to go to the next slide
  const nextSlide = useCallback(() => {
    if (!isAnimating && testimonials.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500); // Match this with the transition duration
    }
  }, [isAnimating, testimonials.length]);

  // Auto-advance the carousel
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [nextSlide, testimonials.length]);

  // Calculate the previous index
  const prevIndex = testimonials.length > 0 
    ? (currentIndex - 1 + testimonials.length) % testimonials.length 
    : 0;

  const handleEditClick = () => {
    // If there are no testimonials, set the initial mode to 'add'
    setInitialMode(testimonials.length === 0 ? 'add' : 'edit');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    // Refetch testimonials after a successful edit/add
    refetch();
    
    // Reset the current index to 0 to show the first testimonial
    // This helps when adding a new testimonial
    setCurrentIndex(0);
  };

  // Render the modal only when it's open to avoid initialization issues
  const renderModal = () => {
    if (!isModalOpen) return null;
    
    return (
      <TestimonialEditModal
        isOpen={true}
        onClose={handleModalClose}
        testimonials={testimonials}
        onSuccess={handleModalSuccess}
        initialMode={initialMode}
      />
    );
  };

  // If loading, show a loading state
  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center p-8 md:p-16 animate-pulse">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md h-full bg-gray-200"></div>
          </div>
          <div className="md:w-2/3 md:pl-16 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  // If error or no testimonials, show a message
  if (error || testimonials.length === 0) {
    return (
      <div className="relative overflow-hidden">
        <div className="flex flex-col items-center p-8 md:p-16">
          <p className="text-brand-blue/80 mb-4">
            {error ? "Error loading testimonials." : "No testimonials available."}
          </p>
          {user && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90"
            >
              {error ? "Try Again" : "Add Testimonials"}
            </button>
          )}
        </div>
        
        {renderModal()}
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => user && setShowEditButton(true)}
      onMouseLeave={() => setShowEditButton(false)}
    >
      {/* Edit button for authenticated users */}
      {user && showEditButton && (
        <button
          onClick={handleEditClick}
          className="absolute top-4 right-4 z-20 bg-white/90 text-brand-blue px-3 py-1.5 rounded-md shadow-md hover:bg-white transition-colors flex items-center space-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Edit Testimonials</span>
        </button>
      )}

      {/* Navigation buttons */}
      <button 
        onClick={() => {
          if (!isAnimating) {
            setIsAnimating(true);
            setCurrentIndex(prevIndex);
            setTimeout(() => setIsAnimating(false), 500);
          }
        }}
        className="absolute left-8 md:left-12 top-1/2 transform -translate-y-1/2 z-10 text-4xl text-brand-blue/70 hover:text-brand-blue transition-colors"
        aria-label="Previous testimonial"
      >
        <span className="sr-only">Previous</span>
        <span className="pr-4">‹</span>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-8 md:right-12 top-1/2 transform -translate-y-1/2 z-10 text-4xl text-brand-blue/70 hover:text-brand-blue transition-colors"
        aria-label="Next testimonial"
      >
        <span className="sr-only">Next</span>
        <span className="pl-4">›</span>
      </button>
      
      {/* Carousel container */}
      <div 
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="w-full flex-shrink-0">
            <div className="flex flex-col md:flex-row items-center p-8 md:p-16">
              {/* Testimonial image */}
              <div className="md:w-1/3 mb-8 md:mb-0">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-md h-full">
                  <TestimonialImage 
                    imageId={testimonial.imageId}
                    alt={`Testimonial from ${testimonial.client}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Testimonial content */}
              <div className="md:w-2/3 md:pl-16">
                <h3 className="text-xl md:text-2xl font-medium text-brand-blue/90 mb-6 tracking-wide">
                  &ldquo;{testimonial.quote}&rdquo;
                </h3>
                <p className="text-brand-blue/80 mb-8">
                  {testimonial.description}
                </p>
                <p className="text-brand-blue font-medium tracking-wider">
                  {testimonial.client}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderModal()}
    </div>
  );
} 