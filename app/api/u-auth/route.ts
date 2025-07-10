import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correctPassword = process.env.U_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (password === correctPassword) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("u_auth", "1", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } else {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
}
