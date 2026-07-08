export class ChunkService {
  static splitIntoChunks(
    text: string,
    chunkSize = 1000,
    overlap = 200
  ): string[] {
    if (!text) return [];

    const chunks: string[] = [];

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);

      chunks.push(text.slice(start, end));

      start += chunkSize - overlap;
    }
    console.log("========== RAG CHUNKS ==========");
    console.dir(chunks, { depth: null });
    console.log("================================");
    return chunks;
  }
}