import { Recipe, RecipeFilterParams, RecipeStatus } from "@/types/recipe";
import { Category } from "@/types/category";
import { AuditEvent } from "@/types/audit";
import { UserProfile, UserRole } from "@/types/auth";
import { initialRecipes } from "@/data/seedRecipes";
import { initialCategories } from "@/data/seedCategories";

const RECIPES_KEY = "resepify_recipes_v1";
const CATEGORIES_KEY = "resepify_categories_v1";
const AUDIT_KEY = "resepify_audit_v1";

// Default seed users
export const defaultUsers: UserProfile[] = [
  {
    id: "usr-admin-1",
    email: "admin@resepify.com",
    display_name: "Chef Admin Resepify",
    avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80",
    role: "admin",
    status: "active",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "usr-viewer-1",
    email: "sarah.kuliner@gmail.com",
    display_name: "Sarah Penggemar Masak",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "viewer",
    status: "active",
    created_at: "2026-09-01T00:00:00Z",
  },
];

// Helper to check window environment
const isClient = typeof window !== "undefined";

export const getStoredRecipes = (): Recipe[] => {
  if (!isClient) return initialRecipes;
  try {
    const raw = localStorage.getItem(RECIPES_KEY);
    if (!raw) {
      localStorage.setItem(RECIPES_KEY, JSON.stringify(initialRecipes));
      return initialRecipes;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading stored recipes", err);
    return initialRecipes;
  }
};

export const setStoredRecipes = (recipes: Recipe[]) => {
  if (!isClient) return;
  try {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (err) {
    console.error("Error saving recipes", err);
  }
};

export const getStoredCategories = (): Category[] => {
  if (!isClient) return initialCategories;
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
      return initialCategories;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading categories", err);
    return initialCategories;
  }
};

export const setStoredCategories = (categories: Category[]) => {
  if (!isClient) return;
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error("Error saving categories", err);
  }
};

export const getStoredAuditLogs = (): AuditEvent[] => {
  if (!isClient) return [];
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    if (!raw) {
      const initialLogs: AuditEvent[] = [
        {
          id: "aud-seed-1",
          actor_user_id: "usr-admin-1",
          actor_name: "Chef Admin Resepify",
          action: "publish",
          entity_type: "recipe",
          entity_id: "rec-rendang-padang",
          entity_title: "Rendang Daging Sapi Minang Asli Warisan Nenek",
          metadata_minimal: { status: "published", version: 1 },
          created_at: "2026-09-12T08:00:00Z",
        },
        {
          id: "aud-seed-2",
          actor_user_id: "usr-admin-1",
          actor_name: "Chef Admin Resepify",
          action: "create",
          entity_type: "recipe",
          entity_id: "rec-draft-sop-buntut",
          entity_title: "Sop Buntut Sapi Bakar Kuah Bening Rempah Istimewa",
          metadata_minimal: { status: "draft" },
          created_at: "2026-10-25T16:00:00Z",
        },
      ];
      localStorage.setItem(AUDIT_KEY, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading audit logs", err);
    return [];
  }
};

export const logAuditEvent = (
  actor: UserProfile,
  action: AuditEvent["action"],
  entity_type: AuditEvent["entity_type"],
  entity_id: string,
  entity_title?: string,
  metadata?: Record<string, unknown>
) => {
  if (!isClient) return;
  try {
    const current = getStoredAuditLogs();
    const newLog: AuditEvent = {
      id: "aud-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      actor_user_id: actor.id,
      actor_name: actor.display_name,
      action,
      entity_type,
      entity_id,
      entity_title,
      metadata_minimal: metadata ? { ...metadata } : undefined,
      created_at: new Date().toISOString(),
    };
    const updated = [newLog, ...current].slice(0, 100); // keep last 100
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error logging audit event", err);
  }
};

// URL-safe Slug generator
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Recipe Operations
export const RecipeService = {
  // Query for Authenticated Viewers - strictly returns published only
  getPublishedRecipes: (filters: RecipeFilterParams = {}): { recipes: Recipe[]; total: number } => {
    const all = getStoredRecipes();
    let published = all.filter((r) => r.status === "published");

    // Search filter (title, summary, ingredients)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      published = published.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category_id && filters.category_id !== "all") {
      published = published.filter((r) => r.category_ids.includes(filters.category_id!));
    }

    // Cuisine filter
    if (filters.cuisine && filters.cuisine !== "all") {
      published = published.filter((r) => r.cuisine.toLowerCase() === filters.cuisine!.toLowerCase());
    }

    // Meal Type filter
    if (filters.meal_type && filters.meal_type !== "all") {
      published = published.filter((r) => r.meal_type === filters.meal_type);
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== "all") {
      published = published.filter((r) => r.difficulty === filters.difficulty);
    }

    // Max cooking time (prep + cook)
    if (filters.max_time && filters.max_time > 0) {
      published = published.filter(
        (r) => (r.prep_time_minutes || 0) + (r.cook_time_minutes || 0) <= filters.max_time!
      );
    }

    // Sorting
    switch (filters.sort_by) {
      case "newest":
        published.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        published.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        break;
      case "prep_time":
        published.sort(
          (a, b) =>
            (a.prep_time_minutes + a.cook_time_minutes) - (b.prep_time_minutes + b.cook_time_minutes)
        );
        break;
      case "alphabetical":
        published.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Default newest
        published.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return {
      recipes: published,
      total: published.length,
    };
  },

  // Get recipe by slug with strict role check
  getBySlug: (slug: string, role: UserRole): Recipe | null => {
    if (role === "guest") {
      return null; // Deny guest access strictly
    }
    const all = getStoredRecipes();
    const recipe = all.find((r) => r.slug === slug);
    if (!recipe) return null;

    // Viewers can ONLY see published recipes
    if (role === "viewer" && recipe.status !== "published") {
      return null;
    }

    return recipe;
  },

  // Get recipe by ID
  getById: (id: string, role: UserRole): Recipe | null => {
    if (role === "guest") return null;
    const all = getStoredRecipes();
    const recipe = all.find((r) => r.id === id);
    if (!recipe) return null;
    if (role === "viewer" && recipe.status !== "published") return null;
    return recipe;
  },

  // Admin Query - includes draft and archived
  getAllForAdmin: (filters: { status?: RecipeStatus | "all"; search?: string } = {}): Recipe[] => {
    let all = [...getStoredRecipes()];
    if (filters.status && filters.status !== "all") {
      all = all.filter((r) => r.status === filters.status);
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      all = all.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q)
      );
    }
    return all.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  // Create Recipe (Draft or Published)
  create: (data: Partial<Recipe>, actor: UserProfile): { success: boolean; recipe?: Recipe; error?: string } => {
    if (actor.role !== "admin") {
      return { success: false, error: "Akses ditolak. Hanya admin yang berhak membuat resep." };
    }

    const all = getStoredRecipes();
    const baseSlug = generateSlug(data.title || "resep-baru");
    let slug = baseSlug;
    let counter = 1;
    while (all.some((r) => r.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const now = new Date().toISOString();
    const isPublishing = data.status === "published";

    // Validation for publish
    if (isPublishing) {
      const valErr = RecipeService.validateForPublish(data);
      if (valErr) return { success: false, error: valErr };
    }

    const newRecipe: Recipe = {
      id: "rec-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      title: data.title || "Resep Baru Tanpa Judul",
      slug: data.slug ? generateSlug(data.slug) : slug,
      summary: data.summary || "",
      description: data.description || "",
      cover_image_url:
        data.cover_image_url ||
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80",
      category_ids: data.category_ids && data.category_ids.length > 0 ? data.category_ids : ["cat-utama"],
      cuisine: data.cuisine || "Indonesia",
      meal_type: data.meal_type || "makan_siang",
      prep_time_minutes: Number(data.prep_time_minutes) || 15,
      cook_time_minutes: Number(data.cook_time_minutes) || 30,
      servings: Number(data.servings) || 4,
      difficulty: data.difficulty || "medium",
      ingredients: data.ingredients && data.ingredients.length > 0 ? data.ingredients : [],
      steps: data.steps && data.steps.length > 0 ? data.steps : [],
      tips: data.tips || "",
      source_attribution: data.source_attribution || "",
      status: data.status || "draft",
      is_featured: Boolean(data.is_featured),
      views_count: 0,
      created_by: actor.id,
      created_at: now,
      updated_at: now,
      published_at: isPublishing ? now : undefined,
      published_by: isPublishing ? actor.id : undefined,
    };

    const updated = [newRecipe, ...all];
    setStoredRecipes(updated);
    logAuditEvent(actor, isPublishing ? "publish" : "create", "recipe", newRecipe.id, newRecipe.title);

    return { success: true, recipe: newRecipe };
  },

  // Update Recipe
  update: (id: string, data: Partial<Recipe>, actor: UserProfile): { success: boolean; recipe?: Recipe; error?: string } => {
    if (actor.role !== "admin") {
      return { success: false, error: "Akses ditolak. Hanya admin yang berhak mengubah resep." };
    }

    const all = getStoredRecipes();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) {
      return { success: false, error: "Resep tidak ditemukan." };
    }

    const existing = all[index];
    const now = new Date().toISOString();

    // Check slug uniqueness if changed
    if (data.slug && data.slug !== existing.slug) {
      const cleanSlug = generateSlug(data.slug);
      if (all.some((r) => r.id !== id && r.slug === cleanSlug)) {
        return { success: false, error: `Slug '${cleanSlug}' sudah digunakan oleh resep lain.` };
      }
      data.slug = cleanSlug;
    }

    // If changing to published, validate requirements
    if (data.status === "published" && existing.status !== "published") {
      const merged = { ...existing, ...data };
      const valErr = RecipeService.validateForPublish(merged);
      if (valErr) return { success: false, error: valErr };
      data.published_at = now;
      data.published_by = actor.id;
    }

    const updatedRecipe: Recipe = {
      ...existing,
      ...data,
      updated_by: actor.id,
      updated_at: now,
    };

    all[index] = updatedRecipe;
    setStoredRecipes(all);
    logAuditEvent(actor, "update", "recipe", id, updatedRecipe.title);

    return { success: true, recipe: updatedRecipe };
  },

  // Publish
  publish: (id: string, actor: UserProfile): { success: boolean; recipe?: Recipe; error?: string } => {
    return RecipeService.update(id, { status: "published" }, actor);
  },

  // Archive (Soft Delete)
  archive: (id: string, actor: UserProfile): { success: boolean; recipe?: Recipe; error?: string } => {
    const all = getStoredRecipes();
    const recipe = all.find((r) => r.id === id);
    if (!recipe) return { success: false, error: "Resep tidak ditemukan." };
    const now = new Date().toISOString();
    const res = RecipeService.update(id, { status: "archived", archived_at: now }, actor);
    if (res.success) {
      logAuditEvent(actor, "archive", "recipe", id, recipe.title);
    }
    return res;
  },

  // Restore
  restore: (id: string, actor: UserProfile): { success: boolean; recipe?: Recipe; error?: string } => {
    const all = getStoredRecipes();
    const recipe = all.find((r) => r.id === id);
    if (!recipe) return { success: false, error: "Resep tidak ditemukan." };
    const res = RecipeService.update(id, { status: "draft", archived_at: undefined }, actor);
    if (res.success) {
      logAuditEvent(actor, "restore", "recipe", id, recipe.title);
    }
    return res;
  },

  // Hard Delete with confirmation
  hardDelete: (id: string, actor: UserProfile): { success: boolean; error?: string } => {
    if (actor.role !== "admin") {
      return { success: false, error: "Akses ditolak. Hanya admin yang berhak menghapus resep." };
    }
    const all = getStoredRecipes();
    const target = all.find((r) => r.id === id);
    if (!target) return { success: false, error: "Resep tidak ditemukan." };

    const filtered = all.filter((r) => r.id !== id);
    setStoredRecipes(filtered);
    logAuditEvent(actor, "delete", "recipe", id, target.title);
    return { success: true };
  },

  // Increment views
  incrementViews: (slug: string) => {
    if (!isClient) return;
    try {
      const all = getStoredRecipes();
      const item = all.find((r) => r.slug === slug);
      if (item) {
        item.views_count = (item.views_count || 0) + 1;
        setStoredRecipes(all);
      }
    } catch {
      // ignore view count error
    }
  },

  // Validation rules as mandated in PRD Section 6.3
  validateForPublish: (data: Partial<Recipe>): string | null => {
    if (!data.title || data.title.trim().length < 5) {
      return "Judul resep wajib diisi minimal 5 karakter.";
    }
    if (data.title.trim().length > 120) {
      return "Judul resep maksimal 120 karakter.";
    }
    if (!data.cover_image_url || !data.cover_image_url.trim()) {
      return "Foto cover resep wajib diunggah atau diisi sebelum menerbitkan resep.";
    }
    if (!data.category_ids || data.category_ids.length === 0) {
      return "Pilih minimal 1 kategori masakan.";
    }
    if (!data.ingredients || data.ingredients.length === 0) {
      return "Resep wajib memiliki minimal 1 bahan masakan.";
    }
    if (!data.steps || data.steps.length === 0) {
      return "Resep wajib memiliki minimal 1 langkah memasak.";
    }
    if (!data.servings || data.servings <= 0) {
      return "Porsi masakan harus berupa angka positif.";
    }
    if (data.prep_time_minutes === undefined || data.prep_time_minutes < 0) {
      return "Waktu persiapan harus berupa angka positif.";
    }
    if (data.cook_time_minutes === undefined || data.cook_time_minutes < 0) {
      return "Waktu memasak harus berupa angka positif.";
    }
    return null;
  },

  // Category Operations
  getCategories: (): Category[] => {
    const categories = getStoredCategories();
    const recipes = getStoredRecipes();
    return categories.map((cat) => ({
      ...cat,
      recipe_count: recipes.filter((r) => r.status === "published" && r.category_ids.includes(cat.id)).length,
    }));
  },

  createCategory: (
    data: { name: string; description?: string; icon?: string },
    actor: UserProfile
  ): { success: boolean; category?: Category; error?: string } => {
    if (actor.role !== "admin") return { success: false, error: "Akses ditolak." };
    if (!data.name || !data.name.trim()) return { success: false, error: "Nama kategori wajib diisi." };

    const categories = getStoredCategories();
    const slug = generateSlug(data.name);
    if (categories.some((c) => c.slug === slug)) {
      return { success: false, error: `Kategori '${data.name}' sudah ada.` };
    }

    const newCat: Category = {
      id: "cat-" + Date.now().toString(36),
      name: data.name.trim(),
      slug,
      description: data.description || "",
      icon: data.icon || "Utensils",
      is_active: true,
    };

    setStoredCategories([...categories, newCat]);
    logAuditEvent(actor, "create", "category", newCat.id, newCat.name);
    return { success: true, category: newCat };
  },

  // Admin Dashboard Statistics
  getStats: () => {
    const recipes = getStoredRecipes();
    return {
      total: recipes.length,
      published: recipes.filter((r) => r.status === "published").length,
      drafts: recipes.filter((r) => r.status === "draft").length,
      archived: recipes.filter((r) => r.status === "archived").length,
      totalViews: recipes.reduce((acc, curr) => acc + (curr.views_count || 0), 0),
      totalCategories: getStoredCategories().length,
      activeViewers: 48, // Simulated active community
    };
  },

  // Backup (Export JSON)
  exportBackup: () => {
    const recipes = getStoredRecipes();
    const categories = getStoredCategories();
    const auditLogs = getStoredAuditLogs();
    const payload = {
      app: "Resepify",
      version: "1.0",
      exported_at: new Date().toISOString(),
      data: {
        recipes,
        categories,
        auditLogs,
      },
    };
    return JSON.stringify(payload, null, 2);
  },

  // Restore (Import JSON)
  restoreBackup: (
    jsonString: string,
    actor: UserProfile
  ): { success: boolean; error?: string; count?: number } => {
    if (actor.role !== "admin") return { success: false, error: "Akses ditolak." };
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data || !Array.isArray(parsed.data.recipes)) {
        return { success: false, error: "Format berkas backup tidak valid." };
      }
      setStoredRecipes(parsed.data.recipes);
      if (Array.isArray(parsed.data.categories)) {
        setStoredCategories(parsed.data.categories);
      }
      logAuditEvent(actor, "restore_backup", "system", "backup-restore", "Pemulihan Data Cadangan Resepify", {
        recipe_count: parsed.data.recipes.length,
      });
      return { success: true, count: parsed.data.recipes.length };
    } catch {
      return { success: false, error: "Gagal memproses berkas JSON backup." };
    }
  },
};
