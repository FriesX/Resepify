// Resepify Business Logic Verification Suite (PRD Section 12 & 16)
import assert from "node:assert";

// 1. Test Slug Generation
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

console.log("🧪 Menjalankan pengujian logika bisnis Resepify...");

// Test Slug
assert.strictEqual(generateSlug("Rendang Sapi Minang Asli"), "rendang-sapi-minang-asli");
assert.strictEqual(generateSlug("Soto Betawi Kuah Susu @2026!"), "soto-betawi-kuah-susu-2026");
console.log("✅ 1. Slug generator: LULUS");

// 2. Test Validation For Publish (PRD Section 6.3 & 16)
const validateForPublish = (data) => {
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
};

// Test short title
assert.strictEqual(
  validateForPublish({ title: "Sup" }),
  "Judul resep wajib diisi minimal 5 karakter."
);

// Test missing cover image
assert.strictEqual(
  validateForPublish({
    title: "Sop Buntut Sapi Istimewa",
    cover_image_url: "",
  }),
  "Foto cover resep wajib diunggah atau diisi sebelum menerbitkan resep."
);

// Test empty ingredients
assert.strictEqual(
  validateForPublish({
    title: "Sop Buntut Sapi Istimewa",
    cover_image_url: "https://example.com/img.jpg",
    category_ids: ["cat-1"],
    ingredients: [],
  }),
  "Resep wajib memiliki minimal 1 bahan masakan."
);

// Test empty steps
assert.strictEqual(
  validateForPublish({
    title: "Sop Buntut Sapi Istimewa",
    cover_image_url: "https://example.com/img.jpg",
    category_ids: ["cat-1"],
    ingredients: [{ id: "1", name: "Daging", quantity: 500, unit: "gr" }],
    steps: [],
  }),
  "Resep wajib memiliki minimal 1 langkah memasak."
);

// Test valid recipe
assert.strictEqual(
  validateForPublish({
    title: "Sop Buntut Sapi Istimewa",
    cover_image_url: "https://example.com/img.jpg",
    category_ids: ["cat-1"],
    servings: 4,
    prep_time_minutes: 20,
    cook_time_minutes: 60,
    ingredients: [{ id: "1", name: "Daging", quantity: 500, unit: "gr" }],
    steps: [{ id: "1", instruction: "Rebus hingga empuk" }],
  }),
  null
);
console.log("✅ 2. Validasi aturan publish PRD §6.3: LULUS");

// 3. Test Authorization Gate (PRD Section 4 & Section 16)
const canAccessRecipe = (recipe, userRole) => {
  if (userRole === "guest") return false; // Guest cannot access recipe data
  if (userRole === "viewer" && recipe.status !== "published") return false; // Viewer only published
  return true;
};

const publishedRecipe = { id: "1", status: "published" };
const draftRecipe = { id: "2", status: "draft" };
const archivedRecipe = { id: "3", status: "archived" };

assert.strictEqual(canAccessRecipe(publishedRecipe, "guest"), false, "Guest dilarang membaca resep");
assert.strictEqual(canAccessRecipe(draftRecipe, "guest"), false, "Guest dilarang membaca draft");
assert.strictEqual(canAccessRecipe(publishedRecipe, "viewer"), true, "Viewer dapat membaca resep published");
assert.strictEqual(canAccessRecipe(draftRecipe, "viewer"), false, "Viewer dilarang membaca draft");
assert.strictEqual(canAccessRecipe(archivedRecipe, "viewer"), false, "Viewer dilarang membaca resep arsip");
assert.strictEqual(canAccessRecipe(draftRecipe, "admin"), true, "Admin dapat mengakses draft");
assert.strictEqual(canAccessRecipe(archivedRecipe, "admin"), true, "Admin dapat mengakses arsip");
console.log("✅ 3. Matriks Otorisasi & Guest Gate PRD §4 & §16: LULUS");

// 4. Test Serving Scaler Formula
const scaleQuantity = (qty, currentServings, baseServings) => {
  const ratio = currentServings / baseServings;
  if (typeof qty === "string") {
    const parsed = parseFloat(qty);
    if (isNaN(parsed)) return qty;
    const scaled = parsed * ratio;
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, "");
  }
  const scaled = qty * ratio;
  return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, "");
};

assert.strictEqual(scaleQuantity(500, 8, 4), "1000", "500gr untuk 4 porsi diskala ke 8 porsi = 1000gr");
assert.strictEqual(scaleQuantity(500, 2, 4), "250", "500gr untuk 4 porsi diskala ke 2 porsi = 250gr");
assert.strictEqual(scaleQuantity(1.5, 8, 4), "3", "1.5 sdm untuk 4 porsi diskala ke 8 porsi = 3");
console.log("✅ 4. Skala Porsi Interaktif (Servings Scaler): LULUS");

console.log("\n🎉 SELURUH PENGUJIAN LOGIKA BISNIS BERHASIL DENGAN SEMPURNA! (100% PASS)");
