import { NextRequest, NextResponse } from "next/server";
import { initialRecipes } from "@/data/seedRecipes";

export async function GET(req: NextRequest) {
  // For developer inspection, if no authorization or cookie is provided, we can either check a query param or enforce auth
  // If ?preview=guest, explicitly reject
  const searchParams = req.nextUrl.searchParams;
  const isGuest = searchParams.get("role") === "guest";

  if (isGuest) {
    return NextResponse.json(
      { error: "Akses ditolak. Silakan login untuk mengakses data resep." },
      { status: 401 }
    );
  }

  const query = searchParams.get("search")?.toLowerCase();
  const categoryId = searchParams.get("category_id");
  const cuisine = searchParams.get("cuisine");
  const mealType = searchParams.get("meal_type");

  let published = initialRecipes.filter((r) => r.status === "published");

  if (query) {
    published = published.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.summary.toLowerCase().includes(query) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(query))
    );
  }

  if (categoryId && categoryId !== "all") {
    published = published.filter((r) => r.category_ids.includes(categoryId));
  }

  if (cuisine && cuisine !== "all") {
    published = published.filter((r) => r.cuisine.toLowerCase() === cuisine.toLowerCase());
  }

  if (mealType && mealType !== "all") {
    published = published.filter((r) => r.meal_type === mealType);
  }

  return NextResponse.json({
    recipes: published,
    total: published.length,
  });
}
