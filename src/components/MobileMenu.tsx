'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-64 bg-primary z-[100] shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={onClose}
                  className="text-white hover:text-secondary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4">
                <div className="space-y-4">
                  <Link
                    href="/"
                    className={`block py-2 text-lg ${pathname === '/' ? 'text-secondary' : 'text-white hover:text-secondary'} transition-colors`}
                    onClick={onClose}
                  >
                    Home
                  </Link>
                  <Link
                    href="/wedding-videography"
                    className={`block py-2 text-lg ${pathname === '/wedding-videography' ? 'text-secondary' : 'text-white hover:text-secondary'} transition-colors`}
                    onClick={onClose}
                  >
                    Films
                  </Link>
                  <Link
                    href="/wedding-photography"
                    className={`block py-2 text-lg ${pathname === '/wedding-photography' ? 'text-secondary' : 'text-white hover:text-secondary'} transition-colors`}
                    onClick={onClose}
                  >
                    Photos
                  </Link>
                  <Link
                    href="/wedding-photography-videography-pricing"
                    className={`block py-2 text-lg ${pathname === '/wedding-photography-videography-pricing' ? 'text-secondary' : 'text-white hover:text-secondary'} transition-colors`}
                    onClick={onClose}
                  >
                    Investment
                  </Link>
                  <Link
                    href="/about"
                    className={`block py-2 text-lg ${pathname === '/about' ? 'text-secondary' : 'text-white hover:text-secondary'} transition-colors`}
                    onClick={onClose}
                  >
                    About
                  </Link>
                </div>
              </nav>

              {/* Bottom section */}
              <div className="p-4 border-t border-white/10">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 text-center bg-white text-primary rounded hover:bg-secondary transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/contact"
                    className="block w-full py-2 text-center bg-white text-primary rounded hover:bg-secondary transition-colors"
                    onClick={onClose}
                  >
                    Contact
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 