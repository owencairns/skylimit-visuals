"use client";

import { useState, useEffect } from "react";
import { db, collection, getDocs, query, orderBy } from "@/lib/firebase";
import { Testimonial } from "@/types/testimonial";

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const testimonialsRef = collection(db, "testimonials");
      const q = query(testimonialsRef, orderBy("id", "asc"));
      const querySnapshot = await getDocs(q);

      const fetchedTestimonials: Testimonial[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTestimonials.push(doc.data() as Testimonial);
      });

      setTestimonials(fetchedTestimonials);
      setError(null);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch testimonials")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials,
  };
};
