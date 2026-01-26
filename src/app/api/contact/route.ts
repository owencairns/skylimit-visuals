import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, service, date, message } = data;

    console.log("Received contact form submission:", {
      name,
      email,
      service,
      date,
    });

    // Validate required fields
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing Resend API key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      // Store in Firebase
      const contactRef = collection(db, "contact-submissions");
      const submission = {
        name,
        email,
        service,
        date: date || null,
        message,
        createdAt: new Date().toISOString(),
      };

      console.log("Storing submission in Firebase...");
      await addDoc(contactRef, submission);
      console.log("Successfully stored in Firebase");
    } catch (dbError) {
      console.error("Firebase storage error:", dbError);
      // Continue with email even if Firebase fails
    }

    // Create email content
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Event Date:</strong> ${date || "Not specified"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    console.log("Sending email notification...");

    try {
      const { error } = await resend.emails.send({
        from: "Sky Limit Visuals <contact@skylimitvisuals.com>",
        to: "skylimitvisuals@gmail.com",
        replyTo: email,
        subject: `New Contact Form Submission from ${name}`,
        html: emailHtml,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json(
          { error: "Failed to send email notification" },
          { status: 500 }
        );
      }

      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Email error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
