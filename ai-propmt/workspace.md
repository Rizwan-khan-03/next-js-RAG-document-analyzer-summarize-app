You are a Senior Full Stack Engineer working on a production-grade AI Document Intelligence Platform built with:

- Next.js 15 App Router
- TypeScript
- Prisma
- PostgreSQL
- React
- TailwindCSS
- OpenRouter LLM
- Existing RAG pipeline

Your goal is to COMPLETE the Workspace feature WITHOUT breaking the existing Single Document flow.

==================================================
IMPORTANT
==================================================

The current Single Document feature is already working.

DO NOT modify its behavior.

The following must continue working exactly as before:

- /document/[documentId]
- ChatSidebar
- ChatPanel
- PdfViewer
- /api/chat
- ChatSession
- ChatMessage
- RagService.askQuestion(documentId)

These are production code.

Workspace is a NEW feature.

==================================================
CURRENT PROJECT
==================================================

Current architecture

Document Page

Document
    ↓
ChatSidebar
    ↓
ChatPanel
    ↓
/api/chat
    ↓
RagService.askQuestion(documentId)
    ↓
OpenRouter

Workspace should become

Workspace
    ↓
WorkspaceChatSidebar
    ↓
WorkspaceChatPanel
    ↓
/api/workspace/chat
    ↓
RagService.askWorkspaceQuestion(workspaceId)
    ↓
OpenRouter

==================================================
GOAL
==================================================

Workspace chat must answer questions using ALL documents inside the selected workspace.

Example

Workspace

Legal Documents

- Agreement.pdf
- NDA.pdf
- Invoice.pdf

Question

"What is the termination clause?"

The AI should search ALL three documents and answer using the best matching chunks.

==================================================
DATABASE
==================================================

Do NOT remove any existing models.

Add only new models.

Create

WorkspaceChatSession

id
workspaceId
title
createdAt
updatedAt

WorkspaceChatMessage

id
sessionId
role
content
sources
feedback
createdAt

Create proper Prisma relations.

==================================================
API
==================================================

Create new APIs.

DO NOT modify

/api/chat/*

Create

/api/workspace/session

GET
POST
DELETE

Exactly like

/api/chat/session

except linked with Workspace.

-----------------------------------

Create

/api/workspace/message

GET

Returns workspace messages.

Exactly like

/api/chat/message

-----------------------------------

Create

/api/workspace/feedback

POST

Exactly same implementation as chat feedback.

-----------------------------------

Create

/api/workspace/chat

POST

Input

{
    workspaceId,
    sessionId,
    question,
    history,
    replaceAssistantMessageId
}

Behavior

Exactly same streaming implementation used in

/api/chat

The ONLY difference is

Instead of

documentId

use

workspaceId

==================================================
RAG
==================================================

DO NOT rewrite the existing RAG pipeline.

Extend it.

Current

RagService.askQuestion(documentId)

Add

RagService.askWorkspaceQuestion(
    workspaceId,
    question,
    history
)

Implementation

1. Load all documents belonging to workspace.

2. Collect document IDs.

3. Search chunks from ALL those documents.

4. Rank by similarity.

5. Merge top chunks.

6. Build prompt.

7. Stream answer.

8. Return answer + sources.

Reuse existing embedding search.

Do NOT duplicate vector search logic.

==================================================
COMPONENTS
==================================================

Do NOT modify

ChatPanel.tsx

Instead

Copy

ChatPanel.tsx

into

WorkspaceChatPanel.tsx

Modify only

documentId

↓

workspaceId

API endpoint

↓

/api/workspace/chat

Similarly

Copy

ChatSidebar.tsx

↓

WorkspaceChatSidebar.tsx

Use

/api/workspace/session

instead.

==================================================
WORKSPACE PAGE
==================================================

Workspace page should contain

------------------------------------------------

LEFT

WorkspaceSidebar

- create workspace
- rename workspace
- delete workspace

------------------------------------------------

CENTER LEFT

WorkspaceChatSidebar

- New Chat
- Previous chats

------------------------------------------------

CENTER

WorkspaceChatPanel

Exactly same UI as document chat.

------------------------------------------------

RIGHT LEFT

WorkspaceDocumentSidebar

Shows

Documents inside selected workspace

Each document

- title
- remove button

Clicking document

↓

changes PDF Viewer.

------------------------------------------------

RIGHT

PdfViewer

Shows selected document.

==================================================
DOCUMENT SELECTION
==================================================

Workspace may contain many documents.

Maintain

selectedDocumentId

When user clicks

Agreement.pdf

Show Agreement PDF.

When user clicks

Invoice.pdf

Show Invoice PDF.

Chat continues unchanged.

==================================================
STATE
==================================================

Workspace page should maintain

selectedWorkspaceId

selectedDocumentId

selectedSessionId

highlightText

currentPage

Messages

==================================================
REUSE
==================================================

Reuse as much code as possible.

Do NOT duplicate logic.

Only duplicate UI components where needed.

==================================================
QUALITY
==================================================

- Strict TypeScript
- No any
- No duplicated business logic
- Production ready
- Reuse existing services
- Keep existing document feature untouched
- Use Server Components where possible
- Use Client Components only where state is required

==================================================
OUTPUT
==================================================

Implement the entire feature.

Create all required files.

Update Prisma schema.

Update API routes.

Update components.

Update services.

Do NOT leave TODOs.

Do NOT use mock data.

Everything must work with the existing database.