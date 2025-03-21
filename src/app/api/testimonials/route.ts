import { NextResponse } from "next/server";
import { db, collection, getDocs, query, orderBy } from "@/lib/firebase";
import { Testimonial } from "@/types/testimonial";

// GET all testimonials
export async function GET() {
  try {
    const testimonialsRef = collection(db, "testimonials");
    const q = query(testimonialsRef, orderBy("id", "asc"));
    const querySnapshot = await getDocs(q);

    const testimonials: Testimonial[] = [];
    querySnapshot.forEach((doc) => {
      testimonials.push(doc.data() as Testimonial);
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
