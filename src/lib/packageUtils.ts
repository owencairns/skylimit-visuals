import { doc, setDoc, deleteDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { Package } from "@/types/package";

export async function savePackage(
  packageData: Package
): Promise<{ success: boolean; error?: string }> {
  try {
    // Save package data to Firestore
    const packageRef = doc(db, "packages", packageData.id);
    await setDoc(packageRef, packageData);

    return { success: true };
  } catch (error) {
    console.error("Error saving package:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deletePackage(
  packageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete package document from Firestore
    const packageRef = doc(db, "packages", packageId);
    await deleteDoc(packageRef);

    // Try to delete the associated image from Storage
    try {
      const imageRef = ref(storage, `packages/${packageId}`);
      await deleteObject(imageRef);
    } catch (error) {
      // If image doesn't exist or other error, just log it
      console.warn("Error deleting package image:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting package:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function uploadPackageImage(
  file: File,
  packageId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Create a reference to the package image in Storage
    const imageRef = ref(storage, `packages/${packageId}`);

    // Upload the file
    await uploadBytes(imageRef, file);

    // Get the download URL
    const downloadUrl = await getDownloadURL(imageRef);

    return { success: true, url: downloadUrl };
  } catch (error) {
    console.error("Error uploading package image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
