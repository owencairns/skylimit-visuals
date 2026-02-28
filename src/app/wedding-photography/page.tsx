'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Photo } from './types/Photo';
import PhotoEditModal from './components/PhotoEditModal';
import { motion, useSpring, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EditableFirebaseText from '@/components/TextEdit/EditableFirebaseText';

const PhotoItem = ({ photo, index, columnIndex }: { photo: Photo; index: number; columnIndex: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "0px 0px -15% 0px",
    amount: 0.1
  });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  const z = useTransform(mouseX, [-300, 300], [-20, 20]);
  
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    animate(mouseX, 0, { duration: 0.3 });
    animate(mouseY, 0, { duration: 0.3 });
  };

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springZ = useSpring(z, springConfig);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{
        duration: 0.5,
        delay: (index * 0.05) + (columnIndex * 0.1),
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className="relative mb-4 overflow-hidden rounded-sm group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        className="w-full relative"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          z: springZ,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center'
        }}
      >
        <div className="relative overflow-hidden rounded-sm shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
          <Image
            src={photo.imageUrl}
            alt={photo.title || "Wedding photography by Skylimit Visuals"}
            width={800}
            height={800}
            className="w-full h-auto"
            style={{ 
              objectFit: 'cover',
              backgroundColor: 'rgba(0,0,0,0.1)'
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PhotosPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    // Subscribe to photos collection
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      
      setPhotos(photosData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching photos:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Split photos into columns for staggered animation
  const getPhotoColumns = () => {
    const columns: Array<Array<{ photo: Photo; index: number }>> = [[], [], [], []];
    photos.forEach((photo, index) => {
      const columnIndex = index % 4;
      columns[columnIndex].push({ photo, index });
    });
    return columns;
  };

  const photoColumns = getPhotoColumns();

  return (
    <main 
      className="min-h-screen bg-white"
      onMouseEnter={() => user && setShowEditButton(true)}
      onMouseLeave={() => setShowEditButton(false)}
    >
      <div className="text-center pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-blue mb-2">Wedding Photography</h1>
        <div className="w-24 h-px bg-brand-blue/30 mx-auto mb-6"></div>
        <EditableFirebaseText
          collection="text-content"
          document="photos"
          field="gallery-description"
          defaultText="Browse through our collection of stunning wedding photography, capturing the most beautiful moments of your special day."
          className="text-lg md:text-xl text-brand-blue/80 max-w-2xl mx-auto px-4"
        />
      </div>

      <div className="relative px-4">
        {/* Edit button for authenticated users */}
        {user && showEditButton && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed top-24 right-4 z-50 bg-white/90 text-brand-blue px-3 py-1.5 rounded-md shadow-md hover:bg-white transition-colors flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Manage Photos</span>
          </button>
        )}

        {/* Photos Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">No photos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-8xl mx-auto">
            {photoColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col">
                {column.map(({ photo, index }) => (
                  <PhotoItem
                    key={photo.id}
                    photo={photo}
                    index={index}
                    columnIndex={columnIndex}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Edit Modal */}
      <PhotoEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        photos={photos}
        onSuccess={() => setIsModalOpen(false)}
      />
    </main>
  );
}
