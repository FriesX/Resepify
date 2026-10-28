import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fiwadkveglsegphmizsx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpd2Fka3ZlZ2xzZWdwaG1penN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzM0MzgsImV4cCI6MjEwODc0OTQzOH0.UqnFOHHcG7nz8iG-MIwQNuiSmv62Z36Wo-v8UFm3jYE";

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
