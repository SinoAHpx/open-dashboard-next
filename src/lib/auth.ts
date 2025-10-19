import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendEmail } from "@/lib/email";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const pool =
  global.pgPool ??
  new Pool({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? undefined
      : {
          rejectUnauthorized: false,
        },
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Open Dashboard";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const createVerificationEmail = (displayName: string, url: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        padding: 0;
        background: #f4f6fb;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #1f2933;
      }
      .wrapper {
        padding: 32px 16px;
      }
      .card {
        max-width: 520px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 18px;
        padding: 32px;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
      }
      .brand {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: #2563eb;
        margin-bottom: 24px;
      }
      h1 {
        margin: 0 0 16px;
        font-size: 24px;
        font-weight: 600;
      }
      p {
        margin: 0 0 16px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 28px;
        border-radius: 999px;
        background: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 600;
        margin: 12px 0 20px;
      }
      .link {
        font-size: 14px;
        color: #64748b;
        word-break: break-all;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #94a3b8;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="brand">${appName}</div>
        <h1>Verify your email</h1>
        <p>Hi ${escapeHtml(displayName)},</p>
        <p>
          Thanks for joining ${appName}. Tap the button below to confirm your
          email address and activate your account.
        </p>
        <a class="button" href="${escapeHtml(url)}" target="_blank" rel="noopener">
          Verify email
        </a>
        <p class="link">${escapeHtml(url)}</p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} ${appName}. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;

export const auth = betterAuth({
  baseURL: appUrl,
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const displayName = user.name ?? "there";
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: createVerificationEmail(displayName, url),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60, // 1 hour
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 6, // refresh every 6 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
});
