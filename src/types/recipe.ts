export type RecipeStatus = "draft" | "published" | "archived";
export type RecipeDifficulty = "easy" | "medium" | "hard";
export type MealType = "sarapan" | "makan_siang" | "makan_malam" | "camilan" | "minuman" | "pencuci_mulut";
export type CuisineType = "Indonesia" | "Asia" | "Jepang" | "Barat" | "Timur Tengah" | "Fusion";

export interface RecipeIngredient {
  id: string;
  recipe_id?: string;
  position: number;
  name: string;
  quantity: number | string;
  unit: string;
  note?: string;
}

export interface RecipeStep {
  id: string;
  recipe_id?: string;
  position: number;
  instruction: string;
  image_url?: string; // Optional image for cooking step
  video_url?: string; // Optional short video/clip for step (future-proof)
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  cover_image_url: string;
  category_ids: string[];
  cuisine: CuisineType;
  meal_type: MealType;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty: RecipeDifficulty;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tips?: string;
  source_attribution?: string;
  status: RecipeStatus;
  is_featured?: boolean;
  views_count?: number;
  created_by: string;
  updated_by?: string;
  published_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  archived_at?: string;
}

export interface RecipeFilterParams {
  search?: string;
  category_id?: string;
  cuisine?: string;
  meal_type?: string;
  difficulty?: string;
  max_time?: number;
  sort_by?: "newest" | "prep_time" | "alphabetical" | "popular";
  page?: number;
  limit?: number;
}
