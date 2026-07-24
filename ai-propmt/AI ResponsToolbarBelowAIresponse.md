You are a Senior Staff Software Engineer working on an existing production-ready AI SaaS application.

Your task is NOT to generate isolated code.

Your task is to analyze the existing project, understand the current architecture, and COMPLETE the entire "AI Response Toolbar" feature in one implementation.

=========================================================
PROJECT
=========================================================

Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Prisma
- PostgreSQL
- OpenAI Streaming
- RAG Architecture
- Multi Chat Sessions

Already Implemented

✅ Document Upload
✅ OCR / Parsing
✅ Embeddings
✅ RAG Chat
✅ Streaming Responses
✅ Session History
✅ Multiple Chat Sessions
✅ Auto Chat Titles
✅ Suggested Questions
✅ AI Document Actions
✅ Source Citations
✅ PDF Navigation

The application already behaves similarly to ChatGPT.

Do NOT change existing architecture.

Reuse existing services whenever possible.

=========================================================
GOAL
=========================================================

Complete the entire AI Response Toolbar feature.

The toolbar should exist below EVERY assistant message.

Never display it for user messages.

Toolbar Layout

-------------------------------------------------

📋 Copy

🔄 Regenerate

👍 Helpful

👎 Not Helpful

📤 Share

📥 Export

-------------------------------------------------

The toolbar must be reusable.

Do NOT place logic directly inside ChatPanel.

=========================================================
CREATE
=========================================================

Create a reusable component

src/components/chat/ResponseToolbar.tsx

Props

interface ResponseToolbarProps {

    message: Message;

    loading:boolean;

    onCopy:()=>void;

    onRegenerate:()=>void;

    onFeedback:(type:"LIKE"|"DISLIKE")=>void;

    onShare:()=>void;

    onExport:()=>void;

}

The component must contain only UI.

Business logic belongs inside ChatPanel.

=========================================================
FEATURES
=========================================================

---------------------------------------------------------
1 COPY
---------------------------------------------------------

Already exists.

Keep working.

Improve UX.

Requirements

✓ navigator.clipboard

✓ "Copied" state

✓ Success icon

✓ Reset after 2 seconds

No alert()

No page refresh.

---------------------------------------------------------
2 REGENERATE
---------------------------------------------------------

Implement completely.

Exactly like ChatGPT.

Requirements

Reuse existing chat endpoint.

Reuse existing streaming logic.

Reuse existing session.

Reuse same document.

Reuse same history.

Reuse same user question.

Do NOT duplicate user message.

Do NOT create new session.

Do NOT append another assistant response.

Instead

Replace the selected assistant response.

Algorithm

Find clicked assistant message.

Locate nearest previous user message.

Reuse that question.

Generate new answer.

Replace assistant message.

Streaming should work exactly like Send.

---------------------------------------------------------
3 FEEDBACK
---------------------------------------------------------

Implement complete Like / Dislike system.

Backend

Prisma

Add

feedback

to ChatMessage

enum FeedbackType

LIKE

DISLIKE

Create

POST

/api/chat/feedback

Payload

{

messageId,

feedback

}

Frontend

Only one can be selected.

Clicking Like

removes Dislike.

Clicking Dislike

removes Like.

Persist after refresh.

Update UI immediately.

=========================================================
4 SHARE
=========================================================

Implement browser sharing.

If

navigator.share

exists

share

Current AI response

Otherwise

copy response to clipboard

Show toast

"Copied share text"

=========================================================
5 EXPORT
=========================================================

Allow exporting ONLY the selected assistant response.

Options

Markdown

TXT

Use Blob

No server upload.

Download locally.

Filename

response-YYYY-MM-DD.md

or

response-YYYY-MM-DD.txt

=========================================================
UI REQUIREMENTS
=========================================================

Modern

Minimal

ChatGPT inspired

Buttons

Small

Rounded

Hover animation

Icons

Tooltips

Disabled while loading

Responsive

No layout shift

Toolbar spacing

consistent

Works on mobile.

=========================================================
CHAT PANEL
=========================================================

Refactor ChatPanel if necessary.

Avoid duplicated code.

Move toolbar logic into reusable handlers.

Examples

handleCopy()

handleRegenerate()

handleFeedback()

handleShare()

handleExport()

ChatPanel should remain clean.

=========================================================
CODE QUALITY
=========================================================

Strict TypeScript

No any

No duplicated fetch()

No duplicated streaming logic

No duplicated message logic

Reusable

Maintainable

SOLID

Clean Architecture

=========================================================
BACKEND
=========================================================

Reuse existing APIs whenever possible.

Only create new API routes if absolutely necessary.

Do NOT duplicate RAG logic.

Do NOT duplicate OpenAI streaming.

=========================================================
BEFORE CODING
=========================================================

Analyze the existing project.

List every file that must change.

Explain WHY.

Identify reusable functions.

Explain the architecture.

Only then implement.

=========================================================
AFTER IMPLEMENTATION
=========================================================

Verify

✓ Copy works

✓ Regenerate works

✓ Feedback persists

✓ Share works

✓ Export works

✓ Streaming still works

✓ Session history still works

✓ Multi-chat still works

✓ Chat titles still work

✓ No duplicated user messages

✓ No duplicated assistant messages

✓ No duplicated sessions

✓ Build passes

✓ ESLint passes

=========================================================
IMPORTANT
=========================================================

Do NOT implement shortcuts.

Think like a Senior Staff Engineer.

Design this toolbar so future actions can be added without refactoring.

Future actions include

⭐ Translate

⭐ Improve Answer

⭐ Explain

⭐ Simplify

⭐ Expand

⭐ Retry

⭐ Save

⭐ Pin

⭐ Bookmark

The final implementation should be scalable enough that adding a new toolbar action requires only adding one configuration object instead of modifying multiple files.

Deliver production-quality code.