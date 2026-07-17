CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "DocumentChunk"
ADD COLUMN IF NOT EXISTS embedding vector(3072);

CREATE INDEX IF NOT EXISTS document_chunk_embedding_idx
ON "DocumentChunk"
USING hnsw (embedding vector_cosine_ops);