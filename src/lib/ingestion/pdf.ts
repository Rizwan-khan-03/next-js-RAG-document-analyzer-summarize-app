import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractPdfText(filePath: string) {
  const buffer = fs.readFileSync(filePath);

  const pdf = await pdfParse(buffer);

  return pdf.text;
}
// import fs from "fs";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// export async function extractPdfText(filePath: string) {
//   const data = new Uint8Array(fs.readFileSync(filePath));

//   const pdf = await pdfjsLib.getDocument({
//     data,
   
//   }).promise;

//   let text = "";

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();

//     text +=
//       content.items
//         .map((item: any) => item.str)
//         .join(" ") + "\n";
//   }

//   return text;
// }
