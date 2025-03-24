"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteImage } from "../types/image";
import {
  fetchAllSiteImages,
  fetchImageById,
  fetchPageImages,
} from "../lib/imageUtils";
import { imageUpdateEmitter } from "../lib/uploadUtils";

interface UseFirebaseImagesReturn {
  images: SiteImage[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all site images from Firebase Storage
 */
export const useAllFirebaseImages = (): UseFirebaseImagesReturn => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedImages = await fetchAllSiteImages();
      setImages(fetchedImages);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
    // Listen for image updates
    const handleImageUpdate = () => {
      fetchImages();
    };
    imageUpdateEmitter.on("imageUpdated", handleImageUpdate);
    return () => {
      imageUpdateEmitter.off("imageUpdated", handleImageUpdate);
    };
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
};

/**
 * Hook to fetch images for a specific page
 */
export const usePageFirebaseImages = (
  page: SiteImage["page"]
): UseFirebaseImagesReturn => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedImages = await fetchPageImages(page);
      setImages(fetchedImages);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
    // Listen for image updates for this page
    const handleImageUpdate = (data: { page: string }) => {
      if (data.page === page) {
        fetchImages();
      }
    };
    imageUpdateEmitter.on("imageUpdated", handleImageUpdate);
    return () => {
      imageUpdateEmitter.off("imageUpdated", handleImageUpdate);
    };
  }, [fetchImages, page]);

  return { images, loading, error, refetch: fetchImages };
};

/**
 * Hook to fetch a single image by ID
 */
export const useFirebaseImage = (
  id: string
): {
  image: SiteImage | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  const [image, setImage] = useState<SiteImage | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImage = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedImage = await fetchImageById(id);
      setImage(fetchedImage);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchImage();
    // Listen for updates to this specific image
    const handleImageUpdate = (data: { id: string }) => {
      if (data.id === id) {
        fetchImage();
      }
    };
    imageUpdateEmitter.on("imageUpdated", handleImageUpdate);
    return () => {
      imageUpdateEmitter.off("imageUpdated", handleImageUpdate);
    };
  }, [fetchImage, id]);

  return { image, loading, error, refetch: fetchImage };
};

/**
 * Hook to fetch images by section
 */
export const useSectionFirebaseImages = (
  section: string
): UseFirebaseImagesReturn => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const allImages = await fetchAllSiteImages();
      const sectionImages = allImages.filter((img) => img.section === section);
      setImages(sectionImages);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    fetchImages();
    // Listen for image updates for this section
    const handleImageUpdate = (data: { section: string }) => {
      if (data.section === section) {
        fetchImages();
      }
    };
    imageUpdateEmitter.on("imageUpdated", handleImageUpdate);
    return () => {
      imageUpdateEmitter.off("imageUpdated", handleImageUpdate);
    };
  }, [fetchImages, section]);

  return { images, loading, error, refetch: fetchImages };
};
