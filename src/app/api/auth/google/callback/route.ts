import { NextResponse } from "next/server";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Get tokens from code
    const { tokens } = await oauth2Client.getToken(code);

    // Return the tokens in a readable format
    return new NextResponse(
      `
      <html>
        <head>
          <title>Gmail API Credentials</title>
          <style>
            body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
            pre { background: #f5f5f5; padding: 20px; border-radius: 8px; overflow-x: auto; }
            .warning { color: red; }
          </style>
        </head>
        <body>
          <h1>Your Gmail API Credentials</h1>
          <p class="warning">⚠️ Save these credentials securely! They will only be shown once.</p>
          <p>Add these values to your .env.local file:</p>
          <pre>
GOOGLE_ACCESS_TOKEN=${tokens.access_token}
GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}
          </pre>
          <p>Make sure you already have these values in your .env.local:</p>
          <pre>
GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET}
GOOGLE_REDIRECT_URI=${process.env.GOOGLE_REDIRECT_URI}
          </pre>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Error in callback:", error);
    return NextResponse.json(
      { error: "Failed to get tokens" },
      { status: 500 }
    );
  }
}
