import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { adminApp } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as unknown as Blob;
    const imagePath = formData.get("imagePath") as string;
    const imageId = formData.get("imageId") as string;
    const type = formData.get("type") as "image" | "video";

    if (!file || !imagePath) {
      return NextResponse.json(
        { error: "File and image path are required" },
        { status: 400 }
      );
    }

    console.log(`Starting upload for ${type} at ${imagePath}`);

    // Get the file data as buffer
    const fileData = await file.arrayBuffer();
    const buffer = Buffer.from(fileData);

    // Get storage instance
    const storage = getStorage(adminApp);
    const bucket = storage.bucket();

    // Upload the file
    const fileRef = bucket.file(imagePath.replace(/^\//, ""));

    try {
      await fileRef.save(buffer, {
        metadata: {
          contentType:
            file.type || (type === "video" ? "video/mp4" : "image/jpeg"),
          cacheControl: "public, max-age=31536000", // Cache for 1 year
        },
      });

      // Get the signed URL that expires in 1 year
      const [url] = await fileRef.getSignedUrl({
        action: "read",
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      });

      console.log("Upload completed successfully");
      console.log(`Download URL: ${url}`);

      const response = NextResponse.json({
        success: true,
        url,
        path: imagePath,
        id: imageId,
      });

      // Add CORS headers
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      return response;
    } catch (uploadError) {
      console.error("Error during upload:", uploadError);
      return NextResponse.json(
        {
          error:
            uploadError instanceof Error
              ? uploadError.message
              : `Failed to upload ${type} to Firebase Storage`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error handling upload request:", error);
    return NextResponse.json(
      { error: "Failed to process upload request" },
      { status: 500 }
    );
  }
}
