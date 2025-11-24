export const SESSION_COOKIE = "open-dashboard-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  email: string;
  name?: string;
};

export const encodeSession = (user: SessionUser) =>
  Buffer.from(JSON.stringify(user)).toString("base64");

export const decodeSession = (
  value: string | undefined,
): SessionUser | null => {
  if (!value) return null;

  try {
    return JSON.parse(Buffer.from(value, "base64").toString());
  } catch {
    return null;
  }
};
