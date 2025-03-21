import { User } from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { FilmStory } from "@/app/films/components/FilmCard";

export async function saveFilm(film: FilmStory, user: User) {
  try {
    if (!user) {
      throw new Error("User must be authenticated to save films");
    }

    // Ensure film.id is a string and sanitize it
    const filmIdString = String(film.id);
    const sanitizedId = filmIdString.replace(/[^a-zA-Z0-9-_]/g, "-");

    // Save film data to Firestore
    const filmRef = doc(db, "films", sanitizedId);
    await setDoc(filmRef, {
      ...film,
      id: sanitizedId, // Ensure the ID in the document matches the sanitized ID
      updatedAt: new Date().toISOString(),
      updatedBy: user.uid,
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving film:", error);
    return { success: false, error };
  }
}

export async function deleteFilm(filmId: string | number, user: User) {
  try {
    if (!user) {
      throw new Error("User must be authenticated to delete films");
    }

    // Ensure filmId is a string and sanitize it
    const filmIdString = String(filmId);
    const sanitizedId = filmIdString.replace(/[^a-zA-Z0-9-_]/g, "-");

    // Delete film data from Firestore
    const filmRef = doc(db, "films", sanitizedId);
    await deleteDoc(filmRef);

    // Delete associated image from Storage if it exists
    try {
      const imageRef = ref(storage, `films/${sanitizedId}.jpg`);
      await deleteObject(imageRef);
    } catch (error) {
      console.warn("Error deleting film image, it may not exist:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting film:", error);
    return { success: false, error };
  }
}

export async function uploadFilmImage(
  file: File,
  filmId: string | number,
  user: User
) {
  try {
    if (!user) {
      throw new Error("User must be authenticated to upload images");
    }

    // Ensure filmId is a string and sanitize it
    const filmIdString = String(filmId);
    const sanitizedId = filmIdString.replace(/[^a-zA-Z0-9-_]/g, "-");

    // Create a reference to the film image in Firebase Storage
    const imageRef = ref(storage, `films/${sanitizedId}.jpg`);

    // Upload the file
    await uploadBytes(imageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef);

    return {
      success: true,
      path: `/films/${sanitizedId}.jpg`,
      url: downloadURL,
      id: sanitizedId,
    };
  } catch (error) {
    console.error("Error uploading film image:", error);
    return { success: false, error };
  }
}
