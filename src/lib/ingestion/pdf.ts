import { supabase } from "@/lib/supabase/supabase";

import { extractText } from "unpdf";

export interface PdfPage {
  pageNumber: number;
  text: string;
}

export async function extractPdfText(
  filePath: string
): Promise<PdfPage[]> {

  const { data, error } = await supabase.storage
    .from("documents")
    .download(filePath);

  if (error) {
    console.error("SUPABASE PDF DOWNLOAD ERROR:", error);
    throw new Error("Unable to download PDF");
  }

  const arrayBuffer = await data.arrayBuffer();

  const buffer = new Uint8Array(arrayBuffer);

  const result = await extractText(buffer);

  return result.text.map((pageText, index) => ({
    pageNumber: index + 1,
    text: pageText,
  }));
}