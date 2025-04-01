import { useQuery } from "@tanstack/react-query";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface UseFirebaseImageOptions {
  path: string;
  fallbackUrl?: string;
}

export function useFirebaseImage({
  path,
  fallbackUrl,
}: UseFirebaseImageOptions) {
  const storage = getStorage();

  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ["firebase-image", path],
    queryFn: async () => {
      try {
        const imageRef = ref(storage, path);
        const url = await getDownloadURL(imageRef);
        return url;
      } catch (error) {
        console.error("Error fetching image:", error);
        return fallbackUrl;
      }
    },
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    initialData: fallbackUrl,
    enabled: !!path,
  });

  return {
    imageUrl: imageUrl ?? fallbackUrl,
    isLoading,
  };
}
