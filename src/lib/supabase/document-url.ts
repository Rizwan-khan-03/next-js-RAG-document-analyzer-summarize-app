import { supabase } from "@/lib/supabase/supabase";

export async function getDocumentSignedUrl(
  filePath: string
) {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    console.error("SIGNED URL ERROR:", error);
    throw new Error("Failed to create signed URL");
  }

  return data.signedUrl;
}