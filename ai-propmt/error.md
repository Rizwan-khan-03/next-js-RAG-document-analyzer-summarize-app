You are working on an existing Next.js 15 + TypeScript + Prisma AI Document Analyzer application.

## Current Problem

The build fails with:

Property 'getOrCreateSession' does not exist on type 'typeof ChatService'. Did you mean 'createSession'?

File:

src/app/api/chat/history/[documentId]/route.ts

Code:

const session =
  await ChatService.getOrCreateSession(documentId);

The project has recently been refactored to support multiple chat sessions.

Previously there was only one session per document, but now users can create unlimited sessions.

Because of this refactor, some APIs still call old methods.

--------------------------------------------------

## Your Task

Do NOT simply replace the missing method.

Instead, audit the entire chat module and make sure every API follows the new multi-session architecture.

--------------------------------------------------

## First Step (Analysis)

Before changing code:

1. Search the project for every usage of:

- getOrCreateSession
- createSession
- getMessages
- saveMessage
- updateSessionTitle
- getSessions

2. List every file that references them.

3. Explain which files are still using the old architecture.

--------------------------------------------------

## Architecture Rules

The application should now work like ChatGPT.

A document

↓

contains many ChatSessions

↓

each ChatSession contains many ChatMessages

Therefore:

❌ Never automatically create a session inside APIs that operate on an existing chat.

✔ Creating a chat should happen ONLY when the user clicks "New Chat".

✔ APIs that fetch messages must use sessionId.

✔ APIs that save messages must use sessionId.

✔ History endpoints should no longer depend on documentId if the UI already works with sessionId.

--------------------------------------------------

## Fix Requirements

1. Remove obsolete references to getOrCreateSession.

2. Update APIs to use the correct session-based flow.

3. Remove dead code.

4. Ensure there is no legacy single-session logic remaining.

5. Verify that all endpoints are consistent.

--------------------------------------------------

## Verify

After changes verify:

✓ New Chat creates a new session

✓ Selecting a session loads only its messages

✓ Refresh preserves the selected session

✓ Chat titles still update

✓ Streaming responses still work

✓ Build succeeds

--------------------------------------------------

## Deliverables

1. Explain the root cause.

2. List every file modified.

3. Explain why each file changed.

4. Then implement the fix.

Do not introduce quick hacks.

Keep the code clean, maintainable, and consistent with the new multi-session architecture.