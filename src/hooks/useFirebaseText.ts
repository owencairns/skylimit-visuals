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
  const {
    data: text,
    isLoading,
    error,
  } = useQuery({
    queryKey: cacheKey,
    queryFn: async () => {
      try {
        console.log(`Fetching text for ${collection}/${document}/${field}`);
        const docRef = doc(db, collection, document);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const value = data[field] ?? defaultText;
          console.log(`Retrieved value: ${value}`);

          // Update cache if the value is different
          const cachedValue = queryClient.getQueryData(cacheKey);
          if (cachedValue !== value) {
            console.log(
              `Updating cache with new value from Firebase: ${value}`
            );
            queryClient.setQueryData(cacheKey, value);
          }

          return value;
        }
        console.log(
          `Document doesn't exist, using default text: ${defaultText}`
        );
        return defaultText;
      } catch (error) {
        console.error(
          `Error fetching text for ${collection}/${document}/${field}:`,
          error
        );
        throw error;
      }
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    initialData: defaultText,
  });

  // Mutation for updating text
  const { mutate: updateText } = useMutation({
    mutationFn: async (newText: string) => {
      try {
        console.log(
          `Updating text for ${collection}/${document}/${field} to: ${newText}`
        );
        const docRef = doc(db, collection, document);
        await setDoc(docRef, { [field]: newText }, { merge: true });
        return newText;
      } catch (error) {
        console.error(
          `Error updating text for ${collection}/${document}/${field}:`,
          error
        );
        throw error;
      }
    },
    onSuccess: (newText) => {
      console.log(
        `Successfully updated text to: ${newText}, updating cache for ${collection}/${document}/${field}`
      );
      // Immediately update cache with new value
      queryClient.setQueryData(cacheKey, newText);
      // Then invalidate to trigger a background refresh
      queryClient.invalidateQueries({ queryKey: cacheKey });
    },
    onError: (error) => {
      console.error(
        `Mutation error for ${collection}/${document}/${field}:`,
        error
      );
    },
  });

  return {
    text: text ?? defaultText,
    isLoading,
    error,
    updateText,
  };
}
