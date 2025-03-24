'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import FilmCard from './components/FilmCard';
import FilmsCTA from './components/FilmsCTA';
import FilmEditModal from './components/FilmEditModal';
import { FilmStory } from './components/FilmCard';

export default function FilmsPage() {
  const { user } = useAuth();
  const [films, setFilms] = useState<FilmStory[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    // Subscribe to films collection - don't order by order initially
    const q = query(collection(db, 'films'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filmsData = snapshot.docs.map((doc, index) => {
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
        } as FilmStory;
      });
      
      // Sort the films by order after we ensure all have an order value
      const sortedFilms = [...filmsData].sort((a, b) => {
        const orderA = typeof a.order === 'number' ? a.order : 0;
        const orderB = typeof b.order === 'number' ? b.order : 0;
        return orderA - orderB;
      });
      
      setFilms(sortedFilms);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching films:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main>
      <div className="text-center pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-blue mb-2">SELECTED STORIES</h1>
        <div className="w-24 h-px bg-brand-blue/30 mx-auto"></div>
      </div>
      
      <div 
        className="relative"
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
            <span>Manage Films</span>
          </button>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : films.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No films available. {user && 'Click "Manage Films" to add some!'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {films.map((film, index) => (
              <FilmCard
                key={film.id}
                story={film}
                reversed={index % 2 !== 0}
              />
            ))}
          </div>
        )}
      </div>

      <FilmEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        films={films}
        onSuccess={() => {
          setIsEditModalOpen(false);
        }}
      />

      <div className="container mx-auto px-4">
        <FilmsCTA />
      </div>
    </main>
  );
}
