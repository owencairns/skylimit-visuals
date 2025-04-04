import { NextResponse } from "next/server";
import { db, collection, addDoc } from "@/lib/firebase";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with your API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, service, date, message } = data;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    await addDoc(contactRef, submission);

    // Send email notification if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      const emailContent = `
        New Contact Form Submission

        Name: ${name}
        Email: ${email}
        Service: ${service}
        Event Date: ${date || "Not specified"}
        Message:
        ${message}
      `;

      const msg = {
        to: "skylimitvisuals@gmail.com",
        from: "noreply@skylimitvisuals.com", // Use your verified sender
        subject: `New Contact Form Submission from ${name}`,
        text: emailContent,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Event Date:</strong> ${date || "Not specified"}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      };

      await sgMail.send(msg);
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
