import { supabase } from "@/lib/supabase";

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export interface UploadResult {
  url: string;
  source: "supabase" | "local";
}

/**
 * Mengunggah file gambar ke Supabase Storage bucket 'recipe-images'.
 * Jika Supabase belum dikonfigurasi atau bucket belum dibuat, otomatis fallback
 * ke pembacaan Data URL lokal sehingga pengguna tidak terblokir.
 */
export async function uploadImage(
  file: File,
  folder: string = "covers"
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Berkas yang dipilih harus berupa gambar (JPG, PNG, WEBP, dsb).");
  }

  // Batas 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran berkas gambar maksimal adalah 10 MB.");
  }

  if (supabase) {
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from("recipe-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error) {
        const { data: publicData } = supabase.storage
          .from("recipe-images")
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          return { url: publicData.publicUrl, source: "supabase" };
        }
      } else {
        console.warn("Supabase Storage upload warning:", error.message);
      }
    } catch (err) {
      console.warn("Upload exception:", err);
    }
  }

  // Fallback to local Data URL
  const localUrl = await readFileAsDataUrl(file);
  return { url: localUrl, source: "local" };
}
