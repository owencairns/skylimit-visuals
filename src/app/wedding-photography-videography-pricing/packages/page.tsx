'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package } from '@/types/package';
import PackageCard from './components/PackageCard';
import PackageEditModal from './components/PackageEditModal';

export default function PackagesPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [activeType, setActiveType] = useState<'videography' | 'photography'>('videography');

  useEffect(() => {
    // Subscribe to packages collection
    const q = query(collection(db, 'packages'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const packagesData = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        // If order is not set, use the index as a default order
        if (typeof data.order !== 'number') {
          data.order = index;
          // Update the document with the default order
          setDoc(doc.ref, { order: index }, { merge: true });
        }
        return {
          id: doc.id,
          ...data
        } as Package;
      });
      
      // Sort the packages by order after we ensure all have an order value
      const sortedPackages = [...packagesData].sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : 0;
        const orderB = typeof b.order === 'number' ? b.order : 0;
        return orderA - orderB;
      });
      
      setPackages(sortedPackages);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching packages:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPackages = packages.filter(pkg => pkg.type === activeType);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="text-center pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-blue mb-2">INVESTMENT</h1>
        <div className="w-24 h-px bg-brand-blue/30 mx-auto"></div>
      </div>

      {/* Package Type Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveType('videography')}
            className={`px-6 py-2 text-lg font-medium rounded-md transition-colors ${
              activeType === 'videography'
                ? 'bg-brand-blue text-white'
                : 'text-brand-blue hover:bg-brand-blue/10'
            }`}
          >
            Videography
          </button>
          <button
            onClick={() => setActiveType('photography')}
            className={`px-6 py-2 text-lg font-medium rounded-md transition-colors ${
              activeType === 'photography'
                ? 'bg-brand-blue text-white'
                : 'text-brand-blue hover:bg-brand-blue/10'
            }`}
          >
            Photography
          </button>
        </div>
      </div>
      
      <div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        onMouseEnter={() => user && setShowEditButton(true)}
        onMouseLeave={() => setShowEditButton(false)}
      >
        {/* Edit button for authenticated users */}
        {user && showEditButton && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/90 text-brand-blue px-3 py-1.5 rounded-md shadow-md hover:bg-white transition-colors flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Manage Packages</span>
          </button>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No {activeType} packages available. 
              {user && 'Click "Manage Packages" to add some!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
              />
            ))}
          </div>
        )}
      </div>

      <PackageEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        packages={packages}
        onSuccess={() => {
          setIsEditModalOpen(false);
        }}
        initialType={activeType}
      />
    </main>
  );
} 