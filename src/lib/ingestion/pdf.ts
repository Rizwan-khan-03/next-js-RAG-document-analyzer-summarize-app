import fs from "fs";
import { extractText } from "unpdf";

export interface PdfPage {
  pageNumber: number;
  text: string;
}

export async function extractPdfText(
  filePath: string
): Promise<PdfPage[]> {
  const buffer = fs.readFileSync(filePath);

  const data = new Uint8Array(buffer);

  const result = await extractText(data);

  return result.text.map((pageText, index) => ({
    pageNumber: index + 1,
    text: pageText,
  }));
}