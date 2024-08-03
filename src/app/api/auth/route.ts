import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { access_token, expires_in, refresh_token, expires_at } = body.data;

    if (!refresh_token) {
      return NextResponse.json({ message: "Invalid token!" });
    }

    cookies().set(ACCESS_TOKEN, access_token, {
      secure: true,
      maxAge: expires_in,
      sameSite: "strict",
      path: "/",
    });

    cookies().set(REFRESH_TOKEN, refresh_token, {
      secure: true,
      maxAge: expires_at,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ message: "Cookies set successfully!" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" });
  }
}

export async function DELETE() {
  try {
    cookies().delete(ACCESS_TOKEN);
    cookies().delete(REFRESH_TOKEN);

    return NextResponse.json({ message: "Cookies deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
