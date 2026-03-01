import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const HUBSPOT_PORTAL_ID = "243672196";
const HUBSPOT_FORM_ID = "115f7d3d-7a34-4afc-adca-15d39582ea0d";

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

    // Submit to HubSpot Forms API
    try {
      const hubspotResponse = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { objectTypeId: "0-1", name: "firstname", value: name },
              { objectTypeId: "0-1", name: "email", value: email },
              { objectTypeId: "0-1", name: "message", value: `Service: ${service}\nEvent Date: ${date || "Not specified"}\n\n${message}` },
            ],
            context: {
              pageUri: "https://skylimitvisuals.com/contact",
              pageName: "Contact Us",
            },
          }),
        }
      );

      if (!hubspotResponse.ok) {
        const hubspotError = await hubspotResponse.text();
        console.error("HubSpot submission error:", hubspotError);
      } else {
        console.log("Successfully submitted to HubSpot");
      }
    } catch (hubspotError) {
      console.error("HubSpot submission error:", hubspotError);
      // Continue with Firebase/email even if HubSpot fails
    }

    // Store in Firebase
    try {
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

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Event Date:</strong> ${date || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `;

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
        } else {
          console.log("Email sent successfully");
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
      }
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
