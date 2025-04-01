import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FirebaseTextOptions {
  collection: string;
  document: string;
  field: string;
  defaultText: string;
}

export function useFirebaseText({
  collection,
  document,
  field,
  defaultText,
}: FirebaseTextOptions) {
  const queryClient = useQueryClient();
  const cacheKey = ["firebase-text", collection, document, field];

  // Query for fetching text
  const { data: text, isLoading } = useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      const docRef = doc(db, collection, document);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data[field] ?? defaultText;
      }
      return defaultText;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    initialData: defaultText, // Use defaultText while loading
  });

  // Mutation for updating text
  const { mutate: updateText } = useMutation({
    mutationFn: async (newText: string) => {
      const docRef = doc(db, collection, document);
      await setDoc(docRef, { [field]: newText }, { merge: true });
      return newText;
    },
    onSuccess: (newText) => {
      // Update cache immediately
      queryClient.setQueryData(cacheKey, newText);
    },
  });

  return {
    text: text ?? defaultText,
    isLoading,
    updateText,
  };
}
