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
        html: `
          <p>Hi ${displayName},</p>
          <p>Thanks for creating an account with us. Please confirm your email address to activate your account.</p>
          <p>
            <a href="${url}" target="_blank" rel="noopener noreferrer">Verify your email</a>
          </p>
          <p>If you did not create this account, you can safely ignore this email.</p>
        `,
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
