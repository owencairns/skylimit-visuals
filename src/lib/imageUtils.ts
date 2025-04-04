import { storage, ref, getDownloadURL, listAll } from "./firebase";
import { SiteImage } from "../types/image";
import { siteImages, imagesByPage } from "../data/siteImages";
import { uploadBytes } from "firebase/storage";

/**
 * Fetches a single image URL from Firebase Storage
 * @param imagePath - Path to the image in Firebase Storage
 * @returns Promise with the download URL
 */
export const fetchImageUrl = async (imagePath: string): Promise<string> => {
  try {
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    // Don't log the error here since it's handled by the caller
    throw error;
  }
};

/**
 * Attempts to find a file in Firebase Storage by name, regardless of extension
 * @param basePath - Base path in storage (e.g., "/home/")
 * @param fileName - File name without extension (e.g., "hero-main")
 * @returns Promise with the file path and URL if found
 */
export const findFileByName = async (
  basePath: string,
  fileName: string
): Promise<{ path: string; url: string; isVideo: boolean } | null> => {
  try {
    console.log(`Looking for file with name ${fileName} in ${basePath}`);

    // List all files in the directory
    const directoryRef = ref(storage, basePath);
    const filesList = await listAll(directoryRef);

    console.log(
      `Found ${filesList.items.length} files in directory:`,
      filesList.items.map((item) => item.name)
    );

    // Find files that start with the fileName
    const matchingFiles = filesList.items.filter(
      (item) => item.name.startsWith(fileName + ".") || item.name === fileName
    );

    console.log(
      `Found ${matchingFiles.length} matching files:`,
      matchingFiles.map((item) => item.name)
    );

    if (matchingFiles.length === 0) {
      console.warn(`No files found matching ${fileName} in ${basePath}`);
      return null;
    }

    // Get the first matching file
    const fileRef = matchingFiles[0];
    const url = await getDownloadURL(fileRef);

    // Determine if it's a video based on file extension
    const isVideo = fileRef.name.match(/\.(mp4|webm|ogg|mov)$/i) !== null;

    console.log(`Using file: ${fileRef.name}, isVideo: ${isVideo}`);

    return {
      path: `${basePath}${fileRef.name}`,
      url,
      isVideo,
    };
  } catch (error) {
    console.error(`Error finding file ${fileName} in ${basePath}:`, error);
    return null;
  }
};

/**
 * Fetches all site images from Firebase Storage
 * @returns Promise with an array of SiteImage objects with URLs populated
 */
export const fetchAllSiteImages = async (): Promise<SiteImage[]> => {
  try {
    const imagesWithUrls = await Promise.all(
      siteImages.map(async (image) => {
        try {
          const url = await fetchImageUrl(image.path);
          return { ...image, url };
        } catch (error) {
          console.error(`Error fetching image ${image.path}:`, error);
          return image; // Return the image without URL if there's an error
        }
      })
    );

    return imagesWithUrls;
  } catch (error) {
    console.error("Error fetching all site images:", error);
    return siteImages; // Return original images without URLs if there's an error
  }
};

/**
 * Fetches images for a specific page
 * @param page - Page name to fetch images for
 * @returns Promise with an array of SiteImage objects for the specified page
 */
export const fetchPageImages = async (
  page: SiteImage["page"]
): Promise<SiteImage[]> => {
  try {
    const pageImages = imagesByPage[page] || [];
    const imagesWithUrls = await Promise.all(
      pageImages.map(async (image) => {
        try {
          // Try to find the file by name in the page directory
          const pagePath = `/${page}/`;
          const fileName = image.id;
          const fileInfo = await findFileByName(pagePath, fileName);

          if (fileInfo) {
            return {
              ...image,
              path: fileInfo.path,
              url: fileInfo.url,
              type: fileInfo.isVideo ? ("video" as const) : ("image" as const),
              mimeType: fileInfo.isVideo ? "video/mp4" : "image/jpeg",
            };
          }

          // Fall back to the original path
          const url = await fetchImageUrl(image.path);
          return { ...image, url };
        } catch (error) {
          console.error(`Error fetching image ${image.path}:`, error);
          return image; // Return the image without URL if there's an error
        }
      })
    );

    return imagesWithUrls;
  } catch (error) {
    console.error(`Error fetching images for page ${page}:`, error);
    return imagesByPage[page] || [];
  }
};

/**
 * Fetches a single image by ID
 * @param id - ID of the image to fetch
 * @returns Promise with the SiteImage object or undefined if not found
 */
export const fetchImageById = async (
  id: string
): Promise<SiteImage | undefined> => {
  // Special case for testimonial images (handle both singular and plural forms)
  if (id.startsWith("testimonial-") || id.startsWith("testimonials-")) {
    // Extract the number from the ID
    const testimonialNumber = id.split("-")[1];
    // Try both formats without logging intermediate failures
    const pathFormats = [
      `home/testimonials-${testimonialNumber}`,
      `home/testimonial-${testimonialNumber}`,
    ];
    const extensions = [".jpg", ".jpeg", ".png", ".webp"];

    for (const basePath of pathFormats) {
      for (const ext of extensions) {
        try {
          const fullPath = basePath + ext;
          const url = await fetchImageUrl(fullPath);
          return {
            id: id,
            name: id.startsWith("testimonials-")
              ? id
              : `testimonials-${testimonialNumber}`,
            path: fullPath,
            url: url,
            alt: `Testimonial Image ${testimonialNumber}`,
            page: "home",
            section: "testimonials",
            type: "image",
            priority: false,
            width: 800,
            height: 1000,
          };
        } catch {
          continue;
        }
      }
    }

    // Only log one error if all attempts fail, and only in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`Could not find image for testimonial ${id}`);
    }
    return undefined;
  }

  // Find the image definition in our data
  const imageDefinition = siteImages.find((image) => image.id === id);

  if (!imageDefinition) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Image definition not found for ID: ${id}`);
    }
    return undefined;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`Fetching image with ID: ${id}`);
  }

  // Look for the file in the page directory
  const pagePath = `/${imageDefinition.page}/`;
  const fileInfo = await findFileByName(pagePath, id);

  if (!fileInfo) {
    try {
      const url = await fetchImageUrl(imageDefinition.path);
      return { ...imageDefinition, url };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Could not fetch image: ${id}`);
      }
      return imageDefinition;
    }
  }

  return {
    ...imageDefinition,
    path: fileInfo.path,
    url: fileInfo.url,
    type: fileInfo.isVideo ? "video" : "image",
    mimeType: fileInfo.isVideo ? "video/mp4" : "image/jpeg",
  };
};

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImage(
  file: File,
  imageId: string
): Promise<UploadResult> {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `images/${imageId}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}
