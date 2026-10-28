import { NextRequest, NextResponse } from "next/server";
import { initialRecipes } from "@/data/seedRecipes";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = req.nextUrl.searchParams;
  const isGuest = searchParams.get("role") === "guest";

  if (isGuest) {
    return NextResponse.json(
      { error: "Akses ditolak. Silakan login untuk membaca resep." },
      { status: 401 }
    );
  }

  const recipe = initialRecipes.find((r) => r.slug === slug);

  if (!recipe || recipe.status !== "published") {
    return NextResponse.json(
      { error: "Resep tidak ditemukan atau belum dipublikasikan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ recipe });
}
