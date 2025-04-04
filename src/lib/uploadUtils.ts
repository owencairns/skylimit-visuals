import { User } from "firebase/auth";
import toast from "react-hot-toast";
import { SiteImage } from "@/types/image";
import { storage, ref, deleteObject } from "@/lib/firebase";
import { EventEmitter } from "events";
import { FirebaseError } from "firebase/app";

// Create a global event emitter for image updates
export const imageUpdateEmitter = new EventEmitter();

/**
 * Uploads an image or video to Firebase Storage via the API
 * @param file - The file to upload
 * @param image - The image/video metadata
 * @param user - The authenticated user
 * @returns Promise with the upload result
 */
export const uploadImage = async (
  file: File,
  image: SiteImage,
  user: User
): Promise<{ success: boolean; url?: string; path?: string; id?: string }> => {
  try {
    // Get the user's ID token
    const idToken = await user.getIdToken();

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imagePath", image.path);
    formData.append("imageId", image.id);
    formData.append("type", image.type); // Add type to formData

    // Show appropriate loading message
    const loadingMessage =
      image.type === "video"
        ? "Uploading video... This may take a while."
        : "Uploading image...";
    const loadingToast = toast.loading(loadingMessage);

    try {
      // Send the request to the API
      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to upload ${image.type}`);
      }

      // Dismiss loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success(
        `${image.type === "video" ? "Video" : "Image"} updated successfully!`
      );

      // Emit an event to notify all components that an image/video has been updated
      imageUpdateEmitter.emit("imageUpdated", {
        id: image.id,
        section: image.section,
        page: image.page,
      });

      return {
        success: true,
        url: data.url,
        path: data.path,
        id: data.id,
      };
    } catch (error) {
      // Dismiss loading toast and show error message
      toast.dismiss(loadingToast);
      throw error;
    }
  } catch (error) {
    console.error(`Error uploading ${image.type}:`, error);
    toast.error(`Failed to upload ${image.type}. Please try again.`);
    return { success: false };
  }
};

/**
 * Deletes an image from Firebase Storage
 * @param imagePath - Path to the image in Firebase Storage
 * @returns Promise with the result
 */
export const deleteImage = async (
  imagePath: string
): Promise<{ success: boolean }> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    // Don't treat unauthorized errors as failures since they likely mean
    // the image was already deleted or doesn't exist
    if (
      error instanceof FirebaseError &&
      (error.code === "storage/unauthorized" ||
        error.code === "storage/object-not-found")
    ) {
      return { success: true };
    }

    // Only log actual errors
    console.error(`Error deleting image: ${imagePath}`, error);
    return { success: false };
  }
};
