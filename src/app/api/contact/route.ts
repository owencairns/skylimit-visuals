import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { google } from "googleapis";
import { Credentials } from "google-auth-library";

// Gmail API setup
const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials from environment variables
const credentials: Credentials = {
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  scope: GMAIL_SCOPES[0],
  token_type: "Bearer",
};

oauth2Client.setCredentials(credentials);

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

function createEmail(
  to: string,
  from: string,
  subject: string,
  message: string
) {
  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    message,
  ];

  const email = emailLines.join("\r\n");
  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

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
    if (!process.env.GOOGLE_ACCESS_TOKEN || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.error("Missing Gmail API credentials");
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
      // Create the email
      const encodedEmail = createEmail(
        "skylimitvisuals@gmail.com", // Changed recipient
        "owencairns15@gmail.com", // Use the submitter's email as the From address
        `New Contact Form Submission from ${name}`,
        emailHtml
      );

      // Send the email
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedEmail,
        },
      });

      console.log("Email sent successfully", response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (emailError: any) {
      console.error("Gmail API error:", {
        message: emailError.message,
        code: emailError.code,
        errors: emailError.errors,
      });
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
