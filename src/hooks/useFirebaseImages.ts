"use client";

import { useState, useEffect } from "react";
import { SiteImage } from "../types/image";
import {
  fetchAllSiteImages,
  fetchPageImages,
  fetchImageById,
} from "../lib/imageUtils";

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

  const fetchImages = async () => {
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
  };

  useEffect(() => {
    fetchImages();
  }, []);

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

  const fetchImages = async () => {
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
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

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

  const fetchImage = async () => {
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
  };

  useEffect(() => {
    fetchImage();
  }, [id]);

  return { image, loading, error, refetch: fetchImage };
};

/**
 * Hook to fetch images for a specific section
 */
export const useSectionFirebaseImages = (
  section: SiteImage["section"]
): UseFirebaseImagesReturn => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // First fetch all images
      const allImages = await fetchAllSiteImages();
      // Then filter by section
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
  };

  useEffect(() => {
    fetchImages();
  }, [section]);

  return { images, loading, error, refetch: fetchImages };
};
