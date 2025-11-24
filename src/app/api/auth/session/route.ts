import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  decodeSession,
  encodeSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionUser,
} from "@/lib/auth/session";

export async function GET() {
  const cookieStore = cookies();
  const encoded = cookieStore.get(SESSION_COOKIE)?.value;
  const user = decodeSession(encoded);

  return NextResponse.json(user ? { user } : {}, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as SessionUser | null;

  if (!body?.email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const user: SessionUser = {
    email: body.email,
    name: body.name,
  };

  const response = NextResponse.json({ user }, { status: 200 });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: encodeSession(user),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
