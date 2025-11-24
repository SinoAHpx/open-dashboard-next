"use client";

import type { AuthBindings } from "@refinedev/core";
import type { SessionUser } from "@/lib/auth/session";

const SESSION_ENDPOINT = "/api/auth/session";

async function readSession() {
  const response = await fetch(SESSION_ENDPOINT, {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { user?: SessionUser } | null;
  return data?.user ?? null;
}

async function createSession(user: SessionUser) {
  const response = await fetch(SESSION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(
      (payload as { message?: string }).message ||
        "Unable to create session. Please try again.",
    );
  }

  return user;
}

async function clearSession() {
  await fetch(SESSION_ENDPOINT, {
    method: "DELETE",
    credentials: "include",
  });
}

export const authProvider: AuthBindings = {
  login: async ({ email, name }) => {
    if (!email) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Email is required",
        },
      };
    }

    await createSession({ email, name });

    return {
      success: true,
      redirectTo: "/",
    };
  },
  register: async ({ email, name }) => {
    if (!email) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Email is required",
        },
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  logout: async () => {
    await clearSession();

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const user = await readSession();

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getIdentity: async () => {
    const user = await readSession();
    return user ?? null;
  },
  onError: async (error) => {
    console.error("[authProvider] onError", error);
    return { error };
  },
};
