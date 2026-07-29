-- CreateTable
CREATE TABLE "WorkspaceChatSession" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sources" JSONB,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkspaceChatSession_workspaceId_idx" ON "WorkspaceChatSession"("workspaceId");

-- CreateIndex
CREATE INDEX "WorkspaceChatMessage_sessionId_idx" ON "WorkspaceChatMessage"("sessionId");

-- AddForeignKey
ALTER TABLE "WorkspaceChatSession" ADD CONSTRAINT "WorkspaceChatSession_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceChatMessage" ADD CONSTRAINT "WorkspaceChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkspaceChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
