'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import TextEditModal from '@/components/TextEdit/TextEditModal';

interface EditableFirebaseTextProps {
  collection: string;
  document: string;
  field: string;
  defaultText: string;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}

export default function EditableFirebaseText({
  collection,
  document,
  field,
  defaultText,
  className = '',
  as = 'p'
}: EditableFirebaseTextProps) {
  const { user } = useAuth();
  const [text, setText] = useState<string>(defaultText);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Subscribe to changes in the text content
  useEffect(() => {
    const docRef = doc(db, collection, document);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data[field] !== undefined) {
          setText(data[field]);
        } else {
          setText(defaultText);
        }
      } else {
        setText(defaultText);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching text content:", error);
      setText(defaultText);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collection, document, field, defaultText]);

  const handleTextClick = (e: React.MouseEvent) => {
    // Stop event propagation to prevent parent links from being clicked
    e.stopPropagation();
    e.preventDefault();
    
    if (user) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveText = async (newText: string) => {
    try {
      const docRef = doc(db, collection, document);
      
      // Check if document exists
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Update existing document
        await setDoc(docRef, { [field]: newText }, { merge: true });
      } else {
        // Create new document
        await setDoc(docRef, { [field]: newText });
      }
      
      setText(newText);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving text:", error);
    }
  };

  // Render the appropriate HTML element based on the 'as' prop
  const TextComponent = as;

  return (
    <>
      <div className="relative group">
        <TextComponent className={className}>
          {loading ? (
            <span className="animate-pulse bg-gray-200 rounded inline-block min-h-[1em] min-w-[10em]"></span>
          ) : (
            text
          )}
        </TextComponent>
        
        {user && (
          <div 
            className="absolute inset-0 z-50 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
            onClick={handleTextClick}
          >
            <div className="bg-white rounded-full p-2 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TextEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleSaveText}
          initialText={text}
          title={`Edit ${field}`}
        />
      )}
    </>
  );
} 