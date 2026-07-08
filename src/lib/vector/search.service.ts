import { prisma } from "@/lib/prisma/client";
import { EmbeddingService } from "@/lib/ai/embedding.service";

export class SearchService {
    static async searchSimilarChunks(
        documentId: string,
        question: string,
        limit = 3
    ) {
        const embedding =
            await EmbeddingService.generateEmbedding(question);

        const vector = `[${embedding.join(",")}]`;

        const chunks =
            await prisma.$queryRawUnsafe<
                {
                    content: string;
                    chunkIndex: number;
                    similarity: number;
                }[]
            >(
                `
SELECT
content,
"chunkIndex",
1 - (embedding <=> $1::vector) AS similarity
FROM "DocumentChunk"
WHERE "documentId" = $2
ORDER BY embedding <=> $1::vector
LIMIT $3;
`,
                vector,
                documentId,
                limit
            );
console.log("Searching Document:", documentId);
        return chunks;
    }
}