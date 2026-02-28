'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Addon } from '@/types/addon';
import AddOnEditModal from './AddOnEditModal';

export default function AddOnsSection() {
  const { user } = useAuth();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const addonsQuery = query(
      collection(db, 'addons'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(addonsQuery, (snapshot) => {
      const addonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Addon[];
      setAddons(addonsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Additional Services</h2>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 transition-colors"
            >
              Edit Add-ons
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon, index) => (
            <div
              key={addon.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-8 h-8 bg-brand-blue/10 text-brand-blue rounded-full font-semibold">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">{addon.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <AddOnEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          addons={addons}
          onSuccess={() => setIsModalOpen(false)}
        />
      </div>
    </section>
  );
} 