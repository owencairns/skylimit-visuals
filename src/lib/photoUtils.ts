import { storage, db } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Photo } from "@/app/wedding-photography/types/Photo";

// Upload a photo to Firebase Storage
export const uploadPhoto = async (
  file: File,
  photoId: string
): Promise<{ success: boolean; url?: string }> => {
  try {
    const storageRef = ref(storage, `photos/${photoId}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return { success: true, url: downloadUrl };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return { success: false };
  }
};

// Save photo data to Firestore
export const savePhoto = async (
  photo: Photo
): Promise<{ success: boolean }> => {
  try {
    // Add new photo
    await addDoc(collection(db, "photos"), {
      ...photo,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving photo:", error);
    return { success: false };
  }
};

// Delete photo from Firebase Storage and Firestore
export const deletePhoto = async (
  photoId: string
): Promise<{ success: boolean }> => {
  try {
    // Delete from Storage first, but don't fail if the file doesn't exist
    try {
      const storageRef = ref(storage, `photos/${photoId}`);
      await deleteObject(storageRef);
    } catch (error: unknown) {
      // Only log warning if the error is not "object-not-found"
      if (
        error instanceof Error &&
        error.message !== "storage/object-not-found"
      ) {
        console.warn("Error deleting photo from storage:", error);
      }
    }

    // Delete from Firestore
    const querySnapshot = await getDocs(
      query(collection(db, "photos"), where("id", "==", photoId))
    );

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error) {
    console.error("Error deleting photo:", error);
    return { success: false };
  }
};

// Get all photos from Firestore
export const getAllPhotos = async (): Promise<Photo[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "photos"));
    const photos: Photo[] = [];
    querySnapshot.forEach((doc) => {
      photos.push({ id: doc.id, ...doc.data() } as Photo);
    });
    return photos.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error getting photos:", error);
    return [];
  }
};
