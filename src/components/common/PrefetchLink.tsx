'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { getDownloadURL, ref } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { useCallback } from 'react';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchImages?: string[];  // Firebase Storage paths
  prefetchText?: Array<{
    collection: string;
    document: string;
    field: string;
  }>;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function PrefetchLink({
  href,
  children,
  className,
  prefetchImages = [],
  prefetchText = [],
  onClick,
}: PrefetchLinkProps) {
  const queryClient = useQueryClient();

  const prefetchData = useCallback(async () => {
    // Prefetch images
    prefetchImages.forEach(async (path) => {
      queryClient.prefetchQuery({
        queryKey: ['firebase-image', path],
        queryFn: async () => {
          const imageRef = ref(storage, path);
          return getDownloadURL(imageRef);
        },
      });
    });

    // Prefetch text content
    prefetchText.forEach(async ({ collection, document, field }) => {
      queryClient.prefetchQuery({
        queryKey: ['firebase-text', collection, document, field],
        queryFn: async () => {
          const docRef = doc(db, collection, document);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return docSnap.data()?.[field];
          }
          return null;
        },
      });
    });
  }, [queryClient, prefetchImages, prefetchText]);

  return (
    <Link 
      href={href}
      className={className}
      onClick={onClick}
      onMouseEnter={() => {
        // Prefetch the next page
        prefetchData();
      }}
    >
      {children}
    </Link>
  );
} 