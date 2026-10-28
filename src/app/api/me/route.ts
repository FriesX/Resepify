import { NextRequest, NextResponse } from "next/server";
import { defaultUsers } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role");

  if (role === "admin") {
    return NextResponse.json({ user: defaultUsers[0] });
  }

  if (role === "viewer") {
    return NextResponse.json({ user: defaultUsers[1] });
  }

  return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
}
