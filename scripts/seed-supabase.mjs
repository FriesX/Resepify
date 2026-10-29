import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

if (fs.existsSync(".env.local") && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(".env.local");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum dikonfigurasi di environment atau .env.local.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialCategories = [
  { name: "Makanan Utama", slug: "makanan-utama", description: "Hidangan utama berat berprotein dan kaya rempah", icon: "Utensils", is_active: true },
  { name: "Masakan Nusantara", slug: "masakan-nusantara", description: "Kuliner otentik warisan berbagai daerah di Indonesia", icon: "Flame", is_active: true },
  { name: "Sarapan Praktis", slug: "sarapan-praktis", description: "Menu lezat, cepat disiapkan, dan berenergi untuk memulai pagi", icon: "Sunrise", is_active: true },
  { name: "Camilan & Kudapan", slug: "camilan-kudapan", description: "Kudapan gurih, renyah, dan manis untuk waktu santai", icon: "Cookie", is_active: true },
  { name: "Pencuci Mulut & Kue", slug: "pencuci-mulut", description: "Hidangan penutup manis, puding lembut, dan cake modern", icon: "Cake", is_active: true },
  { name: "Minuman Segar", slug: "minuman-segar", description: "Minuman tradisional segar, es buah, dan pelepas dahaga", icon: "Coffee", is_active: true },
  { name: "Menu Sehat & Sayur", slug: "menu-sehat", description: "Olahan sayuran segar dan menu rendah minyak", icon: "Salad", is_active: true },
];

const initialRecipes = [
  {
    title: "Rendang Daging Sapi Minang Asli Warisan Nenek",
    slug: "rendang-daging-sapi-minang-asli",
    summary: "Rendang daging sapi khas Minangkabau yang dimasak perlahan hingga bumbu meresap hitam karamel dan serat daging sangat empuk.",
    description: "Rendang bukan sekadar masakan, melainkan filosofi kesabaran kuliner Minang. Menggunakan santan murni dari kelapa tua dan rempah aromatik segar (lengkuas, jahe, serai, daun kunyit). Dimasak dengan teknik perlahan bertahap mulai dari gulai, kalio, hingga menjadi rendang hitam pekat yang gurih meresap.",
    cover_image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indonesia",
    meal_type: "makan_siang",
    prep_time_minutes: 30,
    cook_time_minutes: 180,
    servings: 6,
    difficulty: "hard",
    status: "published",
    is_featured: true,
    views_count: 1420,
    source_attribution: "Resep Warisan Keluarga Bukittinggi",
    tips: "Gunakan api lilin yang sangat kecil setelah santan mengental (tahap kalio) agar minyak keluar alami tanpa membuat dasar wajan gosong.",
    ingredients: [
      { position: 1, name: "Daging Gandik Sapi", quantity: "1", unit: "kg", note: "potong searah serat 4x4 cm" },
      { position: 2, name: "Santan Kental", quantity: "1500", unit: "ml", note: "dari 3 butir kelapa tua" },
      { position: 3, name: "Santan Encer", quantity: "500", unit: "ml", note: "perasan kedua" },
      { position: 4, name: "Bawang Merah", quantity: "120", unit: "gr", note: "haluskan" },
      { position: 5, name: "Bawang Putih", quantity: "60", unit: "gr", note: "haluskan" },
      { position: 6, name: "Cabai Merah Keriting", quantity: "150", unit: "gr", note: "haluskan" },
      { position: 7, name: "Lengkuas", quantity: "40", unit: "gr", note: "haluskan" },
      { position: 8, name: "Serai", quantity: "3", unit: "batang", note: "memarkan" },
      { position: 9, name: "Daun Kunyit", quantity: "2", unit: "lembar", note: "simpulkan" },
      { position: 10, name: "Asam Kandis", quantity: "2", unit: "buah", note: "jangan dipecah" }
    ],
    steps: [
      { position: 1, instruction: "Haluskan bumbu halus (bawang merah, bawang putih, cabai, jahe, lengkuas) hingga benar-benar halus dan berminyak.", image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80" },
      { position: 2, instruction: "Siapkan wajan besi tebal. Tuangkan santan encer dan santan kental, masukkan bumbu halus, serai, daun kunyit, dan daun jeruk." },
      { position: 3, instruction: "Masak di atas api sedang sambil terus diaduk perlahan hingga mendidih dan mengeluarkan minyak kemerahan.", image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80" },
      { position: 4, instruction: "Masukkan potongan daging sapi. Aduk rata dan turunkan ke api sedang-kecil hingga kuah menyusut menjadi kalio cokelat." },
      { position: 5, instruction: "Masukkan asam kandis dan garam. Kecilkan api ke setelan paling kecil hingga bumbu berubah menjadi cokelat gelap kehitaman." }
    ]
  },
  {
    title: "Ayam Bakar Taliwang Pedas Gurih Khas Lombok",
    slug: "ayam-bakar-taliwang-pedas-gurih",
    summary: "Ayam kampung muda bakar dengan olesan bumbu terasi Lombok, cabai rawit pedas menyengat, dan aroma asap gurih arang.",
    description: "Ayam Taliwang adalah kuliner legendaris khas NTB. Dibuat dengan ayam kampung pejantan muda agar daging tetap empuk lembut dan manis alami.",
    cover_image_url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indonesia",
    meal_type: "makan_malam",
    prep_time_minutes: 25,
    cook_time_minutes: 40,
    servings: 4,
    difficulty: "medium",
    status: "published",
    is_featured: true,
    views_count: 980,
    source_attribution: "Eksplorasi Kuliner Lombok Asli",
    tips: "Gunakan terasi bakar kualitas prima untuk aroma wangi khas yang tidak tengik.",
    ingredients: [
      { position: 1, name: "Ayam Kampung Muda", quantity: "1", unit: "ekor", note: "belah dada tidak putus" },
      { position: 2, name: "Cabai Rawit Merah", quantity: "12", unit: "buah", note: "sesuai selera" },
      { position: 3, name: "Terasi Lombok Bakar", quantity: "1", unit: "sdm", note: "bakar hingga wangi" },
      { position: 4, name: "Kencur", quantity: "2", unit: "cm", note: "kupas" },
      { position: 5, name: "Santan Kental", quantity: "150", unit: "ml", note: "untuk mematangkan bumbu" }
    ],
    steps: [
      { position: 1, instruction: "Lumuri ayam kampung dengan perasan air jeruk limau dan garam. Diamkan selama 15 menit." },
      { position: 2, instruction: "Bakar ayam di atas bara arang hingga setengah matang beraroma asap.", image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" },
      { position: 3, instruction: "Tumis bumbu halus (cabai, bawang, kencur, terasi) dengan santan hingga menyusut dan berminyak." },
      { position: 4, instruction: "Celupkan ayam bakar ke dalam bumbu, lalu bakar kembali hingga matang terkaramelisasi." }
    ]
  },
  {
    title: "Soto Betawi Kuah Susu Gurih Creamy Rempah",
    slug: "soto-betawi-kuah-susu-gurih",
    summary: "Soto khas Jakarta dengan kuah kaldu perpaduan santan dan susu evaporasi yang gurih manis, potongan daging sapi empuk, dan emping renyah.",
    cover_image_url: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indonesia",
    meal_type: "makan_siang",
    prep_time_minutes: 20,
    cook_time_minutes: 60,
    servings: 5,
    difficulty: "medium",
    status: "published",
    is_featured: false,
    views_count: 810,
    tips: "Rebus daging pertama kali dan buang air rebusan pertama untuk kuah kaldu bersih bening.",
    ingredients: [
      { position: 1, name: "Daging Sapi Sengkel", quantity: "600", unit: "gr", note: "potong dadu" },
      { position: 2, name: "Susu Evaporasi", quantity: "300", unit: "ml", note: "kental manis gurih" },
      { position: 3, name: "Santan Sedang", quantity: "500", unit: "ml", note: "segar" }
    ],
    steps: [
      { position: 1, instruction: "Rebus potongan daging sengkel dengan rempah kayu manis, cengkih, dan kapulaga hingga empuk." },
      { position: 2, instruction: "Tumis bumbu halus dan masukkan ke dalam kaldu daging." },
      { position: 3, instruction: "Tuang susu evaporasi dan santan perlahan sambil diaduk rata hingga mendidih harum." }
    ]
  },
  {
    title: "Nasi Goreng Kampung Terasi Wangi Asap Wajan",
    slug: "nasi-goreng-kampung-terasi-wangi",
    summary: "Nasi goreng klasik rumahan tanpa kecap manis, menonjolkan aroma bawang merah, cabai rawit ulek kasar, terasi gurih, dan telur orak-arik.",
    cover_image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indonesia",
    meal_type: "sarapan",
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    servings: 2,
    difficulty: "easy",
    status: "published",
    views_count: 650,
    tips: "Gunakan nasi yang sudah diinapkan di kulkas semalaman.",
    ingredients: [
      { position: 1, name: "Nasi Putih Pera Dingin", quantity: "400", unit: "gr", note: "urai" },
      { position: 2, name: "Telur Ayam", quantity: "2", unit: "butir", note: "kocok lepas" },
      { position: 3, name: "Terasi Bakar", quantity: "1", unit: "sdt", note: "hancurkan" }
    ],
    steps: [
      { position: 1, instruction: "Orak-arik telur di wajan panas dengan sedikit minyak, sisihkan ke tepi." },
      { position: 2, instruction: "Tumis bumbu ulek cabai, bawang, dan terasi hingga harum tajam." },
      { position: 3, instruction: "Masukkan nasi dengan api besar, aduk cepat hingga berasap wangi." }
    ]
  },
  {
    title: "Es Pisang Ijo Lembut Khas Makassar Saus Vla Gurih",
    slug: "es-pisang-ijo-lembut-makassar",
    summary: "Pisang raja manis terbalut adonan tepung hijau pandan alami yang kenyal lembut, disajikan bersama bubur sumsum gurih, sirup DHT merah, dan es serut segar.",
    cover_image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indonesia",
    meal_type: "pencuci_mulut",
    prep_time_minutes: 30,
    cook_time_minutes: 30,
    servings: 6,
    difficulty: "medium",
    status: "published",
    is_featured: true,
    views_count: 1100,
    ingredients: [
      { position: 1, name: "Pisang Raja Bulu", quantity: "6", unit: "buah", note: "kukus matang" },
      { position: 2, name: "Tepung Beras", quantity: "150", unit: "gr", note: "kualitas baik" },
      { position: 3, name: "Santan Encer", quantity: "450", unit: "ml", note: "hangat" }
    ],
    steps: [
      { position: 1, instruction: "Masak adonan tepung beras, pandan, dan santan hingga kalis mengkilap." },
      { position: 2, instruction: "Bungkus pisang raja dengan adonan hijau, lalu kukus selama 15 menit." },
      { position: 3, instruction: "Potong-potong pisang ijo dan sajikan bersama bubur sumsum, sirup merah, dan es serut." }
    ]
  }
];

async function seed() {
  console.log("🌱 Menanam data kategori ke Supabase...");
  const { data: catData, error: catErr } = await supabase
    .from("categories")
    .upsert(initialCategories, { onConflict: "slug" })
    .select();

  if (catErr) {
    console.error("Gagal menanam kategori:", catErr.message);
    return;
  }
  console.log(`✅ Berhasil menanam ${catData.length} kategori.`);

  console.log("🌱 Menanam resep masakan ke Supabase...");
  for (const recipe of initialRecipes) {
    const { ingredients, steps, ...recipeData } = recipe;

    const { data: savedRecipe, error: recErr } = await supabase
      .from("recipes")
      .upsert(recipeData, { onConflict: "slug" })
      .select()
      .single();

    if (recErr) {
      console.error(`Gagal menanam resep ${recipe.title}:`, recErr.message);
      continue;
    }

    // Insert ingredients
    if (ingredients && ingredients.length > 0) {
      const ingPayload = ingredients.map((ing) => ({
        ...ing,
        recipe_id: savedRecipe.id,
      }));
      await supabase.from("recipe_ingredients").delete().eq("recipe_id", savedRecipe.id);
      await supabase.from("recipe_ingredients").insert(ingPayload);
    }

    // Insert steps
    if (steps && steps.length > 0) {
      const stpPayload = steps.map((s) => ({
        ...s,
        recipe_id: savedRecipe.id,
      }));
      await supabase.from("recipe_steps").delete().eq("recipe_id", savedRecipe.id);
      await supabase.from("recipe_steps").insert(stpPayload);
    }

    console.log(`✅ Resep '${savedRecipe.title}' berhasil ditanam.`);
  }

  console.log("\n🎉 SELURUH DATA SUPABASE SEED SELESAI!");
}

seed();
