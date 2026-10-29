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

async function testConnection() {
  console.log("Menghubungkan ke Supabase...");
  
  // Test query categories
  const { data: categories, error: catError } = await supabase.from("categories").select("*");
  if (catError) {
    console.log("Query categories error:", catError.message);
  } else {
    console.log(`Berhasil terhubung! Ditemukan ${categories.length} kategori di database Supabase.`);
  }

  // Test query recipes
  const { data: recipes, error: recError } = await supabase.from("recipes").select("*");
  if (recError) {
    console.log("Query recipes error:", recError.message);
  } else {
    console.log(`Ditemukan ${recipes.length} resep di database Supabase.`);
  }
}

testConnection();
