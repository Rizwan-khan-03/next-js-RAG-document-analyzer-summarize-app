import fs from "fs";
import { extractText } from "unpdf";

export async function extractPdfText(filePath: string) {
  try {
    const buffer = fs.readFileSync(filePath);

    // Convert Buffer -> Uint8Array
    const data = new Uint8Array(buffer);

    const result = await extractText(data);

    // console.log("PDF extracted successfully");
    // console.log("UNPDF RESULT:");
    // console.dir(result, { depth: null });

       return result.text.join("\n");
       
  } catch (error) {
    console.error("PDF ERROR:", error);
    throw error;
  }
}