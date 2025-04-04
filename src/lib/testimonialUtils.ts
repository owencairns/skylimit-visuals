import { User } from "firebase/auth";
import { Testimonial } from "@/types/testimonial";
import { deleteImage } from "./uploadUtils";
import { imageUpdateEmitter } from "./uploadUtils";

/**
 * Fetches all testimonials from the API
 * @returns Promise with the testimonials
 */
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await fetch("/api/testimonials");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch testimonials");
    }

    return data.testimonials || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};

/**
 * Fetches a single testimonial by ID
 * @param id - The testimonial ID
 * @returns Promise with the testimonial
 */
export const fetchTestimonialById = async (
  id: number
): Promise<Testimonial | null> => {
  try {
    const response = await fetch(`/api/testimonials/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch testimonial");
    }

    return data.testimonial || null;
  } catch (error) {
    console.error(`Error fetching testimonial ${id}:`, error);
    return null;
  }
};

/**
 * Creates or updates a testimonial
 * @param testimonial - The testimonial data
 * @param user - The authenticated user
 * @returns Promise with the result
 */
export const saveTestimonial = async (
  testimonial: Testimonial,
  user: User
): Promise<{ success: boolean; testimonial?: Testimonial }> => {
  try {
    // Get the user's ID token
    const idToken = await user.getIdToken();

    const response = await fetch(`/api/testimonials/${testimonial.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(testimonial),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save testimonial");
    }

    return {
      success: true,
      testimonial: data.testimonial,
    };
  } catch (error) {
    console.error("Error saving testimonial:", error);
    return { success: false };
  }
};

/**
 * Deletes a testimonial
 * @param id - The testimonial ID
 * @param user - The authenticated user
 * @returns Promise with the result
 */
export const deleteTestimonial = async (
  id: number,
  user: User
): Promise<{ success: boolean }> => {
  try {
    // Get the user's ID token
    const idToken = await user.getIdToken();

    const response = await fetch(`/api/testimonials/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete testimonial");
    }

    return { success: true };
  } catch (error) {
    console.error(`Error deleting testimonial ${id}:`, error);
    return { success: false };
  }
};

/**
 * Uploads a testimonial image
 * @param file - The image file
 * @param testimonialId - The testimonial ID
 * @param user - The authenticated user
 * @returns Promise with the upload result
 */
export const uploadTestimonialImage = async (
  file: File,
  testimonialId: number,
  user: User
): Promise<{ success: boolean; url?: string; path?: string; id?: string }> => {
  try {
    // Get the user's ID token
    const idToken = await user.getIdToken();

    // Determine file extension from the actual file
    const fileExtension = file.name.split(".").pop() || "jpg";
    // Ensure consistent image ID format for testimonials
    const imageId = `testimonial-${testimonialId}`;
    // Ensure consistent image path format - directly under home directory
    const imagePath = `home/${imageId}.${fileExtension}`;

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imagePath", imagePath);
    formData.append("imageId", imageId);
    formData.append("type", "testimonial");
    formData.append("section", "home");

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
      throw new Error(data.error || "Failed to upload image");
    }

    // Emit an event to notify all components that the image has been updated
    imageUpdateEmitter.emit("imageUpdated", {
      id: imageId,
      section: "home",
      page: "testimonials",
    });

    return {
      success: true,
      url: data.url,
      path: imagePath,
      id: imageId,
    };
  } catch (error) {
    console.error("Error uploading testimonial image:", error);
    return { success: false };
  }
};

/**
 * Deletes a testimonial image from Firebase Storage
 * @param testimonial - The testimonial containing the image to delete
 * @returns Promise with the result
 */
export const deleteTestimonialImage = async (
  testimonial: Testimonial
): Promise<{ success: boolean }> => {
  try {
    if (!testimonial.imagePath) {
      console.warn(`No image path found for testimonial ${testimonial.id}`);
      return { success: false };
    }

    return await deleteImage(testimonial.imagePath);
  } catch (error) {
    console.error(
      `Error deleting image for testimonial ${testimonial.id}:`,
      error
    );
    return { success: false };
  }
};
