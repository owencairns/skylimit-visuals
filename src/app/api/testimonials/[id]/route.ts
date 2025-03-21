import { NextRequest, NextResponse } from "next/server";
import { db, doc, getDoc, setDoc, deleteDoc } from "@/lib/firebase";
import { Testimonial } from "@/types/testimonial";
import { deleteImage } from "@/lib/uploadUtils";

// GET a specific testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const testimonialRef = doc(db, "testimonials", id);
    const testimonialSnap = await getDoc(testimonialRef);

    if (!testimonialSnap.exists()) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial: testimonialSnap.data() });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT to update or create a testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const data = await request.json();

    // Validate required fields
    if (!data.quote || !data.description || !data.client) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a testimonial object with default values for optional fields
    const testimonial: Testimonial = {
      id: parseInt(id),
      quote: data.quote,
      description: data.description,
      client: data.client,
      imageId: data.imageId || `testimonial-${id}`,
      imagePath: data.imagePath || `/home/testimonial-${id}.jpg`, // Default path if not provided
      imageUrl: data.imageUrl || "",
    };

    // Remove any isNew flag if it exists
    if ("isNew" in data) {
      const testimonialWithIsNew = testimonial as Testimonial & {
        isNew?: boolean;
      };
      delete testimonialWithIsNew.isNew;
    }

    await setDoc(doc(db, "testimonials", id), testimonial);

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE a testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Get the testimonial to find its image path
    const testimonialRef = doc(db, "testimonials", id);
    const testimonialSnap = await getDoc(testimonialRef);

    if (testimonialSnap.exists()) {
      const testimonial = testimonialSnap.data() as Testimonial;

      // Delete the image from Firebase Storage if it exists
      if (testimonial.imagePath) {
        try {
          await deleteImage(testimonial.imagePath);
          console.log(
            `Deleted image for testimonial ${id}: ${testimonial.imagePath}`
          );
        } catch (imageError) {
          console.error(
            `Error deleting image for testimonial ${id}:`,
            imageError
          );
          // Continue with testimonial deletion even if image deletion fails
        }
      }
    }

    // Delete the testimonial from Firestore
    await deleteDoc(doc(db, "testimonials", id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
