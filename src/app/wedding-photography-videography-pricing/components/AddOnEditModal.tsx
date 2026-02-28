'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog } from '@headlessui/react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Addon } from '@/types/addon';
import toast from 'react-hot-toast';

interface AddOnEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addons: Addon[];
  onSuccess: () => void;
}

export default function AddOnEditModal({ isOpen, onClose, addons, onSuccess }: AddOnEditModalProps) {
  const { user } = useAuth();
  const [editedAddons, setEditedAddons] = useState<Addon[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setEditedAddons(addons);
  }, [addons]);

  const handleAddNew = () => {
    const newAddon: Addon = {
      id: crypto.randomUUID(),
      title: '',
      order: editedAddons.length,
      isNew: true
    };
    setEditedAddons([...editedAddons, newAddon]);
  };

  const handleDelete = (addonId: string) => {
    setEditedAddons(editedAddons.filter(addon => addon.id !== addonId));
  };

  const handleInputChange = (addonId: string, value: string) => {
    setEditedAddons(editedAddons.map(addon => 
      addon.id === addonId ? { ...addon, title: value } : addon
    ));
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate all addons have titles
    if (editedAddons.some(addon => !addon.title.trim())) {
      toast.error('All add-ons must have titles');
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Saving add-ons...');

    try {
      // Get the current addons to find deleted ones
      const deletedAddons = addons.filter(addon => 
        !editedAddons.find(edited => edited.id === addon.id)
      );

      // Delete removed addons
      for (const addon of deletedAddons) {
        await deleteDoc(doc(db, 'addons', addon.id));
      }

      // Save all current addons
      for (const [index, addon] of editedAddons.entries()) {
        const addonRef = doc(db, 'addons', addon.id);
        await setDoc(addonRef, {
          ...addon,
          order: index,
          isNew: false
        });
      }

      toast.dismiss(loadingToast);
      toast.success('Add-ons updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error saving add-ons:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to save add-ons');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-2xl font-semibold">
                Manage Add-ons
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {editedAddons.map((addon, index) => (
                <div key={addon.id} className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">{index + 1}.</span>
                  <input
                    type="text"
                    value={addon.title}
                    onChange={(e) => handleInputChange(addon.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    placeholder="Enter add-on title"
                    disabled={isProcessing}
                  />
                  <button
                    onClick={() => handleDelete(addon.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                    disabled={isProcessing}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleAddNew}
                disabled={isProcessing}
                className="px-4 py-2 text-brand-blue border border-brand-blue rounded-md hover:bg-brand-blue/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New
              </button>

              <div className="space-x-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 