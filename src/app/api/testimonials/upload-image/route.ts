import { NextRequest, NextResponse } from "next/server";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/environments/environment";

// Initialize Firebase app for server-side operations
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const testimonialId = formData.get("testimonialId") as string;

    if (!file || !testimonialId) {
      return NextResponse.json(
        { error: "File and testimonial ID are required" },
        { status: 400 }
      );
    }

    // Determine file extension
    const fileExtension = file.name.split(".").pop() || "jpg";

    // Create the image path
    const imagePath = `/home/testimonial-${testimonialId}.${fileExtension}`;
    const imageId = `testimonial-${testimonialId}`;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Create a storage reference
    const storageRef = ref(storage, imagePath);

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, buffer, {
      contentType: file.type,
    });

    // Wait for the upload to complete
    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress monitoring if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          // Handle successful uploads
          resolve();
        }
      );
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    return NextResponse.json({
      success: true,
      url: downloadURL,
      path: imagePath,
      id: imageId,
    });
  } catch (error) {
    console.error("Error uploading testimonial image:", error);
    return NextResponse.json(
      { error: "Failed to upload testimonial image" },
      { status: 500 }
    );
  }
}
