You are working on an existing Next.js 15 + React + TypeScript + Tailwind AI Document Analyzer.

The application already supports:

- Streaming AI responses
- Multi-chat sessions
- Chat history
- Auto chat titles
- Suggested Questions
- AI Document Actions
- Markdown rendering
- Source citations
- PDF navigation

--------------------------------------------------------
GOAL
--------------------------------------------------------

Implement a reusable AI Response Toolbar that appears below every assistant response.

The toolbar should become the standard action bar for every AI message.

Do NOT place action buttons directly inside ChatPanel.

Create a reusable component.

--------------------------------------------------------
NEW COMPONENT
--------------------------------------------------------

Create:

src/components/chat/ResponseToolbar.tsx

Props:

interface ResponseToolbarProps {
    messageId: string;
    content: string;
    onRegenerate?: () => void;
    onFeedback?: (type: "LIKE" | "DISLIKE") => void;
}

The component must contain NO business logic.

Only UI.

--------------------------------------------------------
VERSION 1 FEATURES
--------------------------------------------------------

Implement these buttons:

📋 Copy

🔄 Regenerate

👍 Helpful

👎 Not Helpful

--------------------------------------------------------
COPY
--------------------------------------------------------

When clicked

Copy assistant response to clipboard.

Use

navigator.clipboard.writeText()

Show a temporary success state.

Example

✓ Copied

for 2 seconds.

--------------------------------------------------------
REGENERATE
--------------------------------------------------------

Do NOT implement regeneration logic yet.

Only expose

onRegenerate()

The parent ChatPanel will implement it later.

Disable button while loading.

--------------------------------------------------------
HELPFUL
--------------------------------------------------------

Call

onFeedback("LIKE")

--------------------------------------------------------
NOT HELPFUL
--------------------------------------------------------

Call

onFeedback("DISLIKE")

--------------------------------------------------------
UI
--------------------------------------------------------

Toolbar should appear

ONLY

for assistant messages.

Not user messages.

Layout

------------------------------------------------

📋 Copy

🔄 Regenerate

👍 Helpful

👎 Not Helpful

------------------------------------------------

Use

small icon buttons

rounded-lg

border

hover animation

transition

consistent spacing

Tailwind only.

No inline styles.

--------------------------------------------------------
CHAT PANEL
--------------------------------------------------------

Update ChatPanel

Render

<ResponseToolbar />

below every assistant response.

Do NOT place logic inside toolbar.

Pass callbacks from ChatPanel.

--------------------------------------------------------
STRUCTURE
--------------------------------------------------------

Assistant Message

Markdown

Source Citations

Response Toolbar

--------------------------------------------------------

Keep this order.

--------------------------------------------------------
CODE QUALITY
--------------------------------------------------------

Strict TypeScript

Reusable

No duplicated code

No any

Clean separation

UI component only

Business logic remains inside ChatPanel.

--------------------------------------------------------
FUTURE READY
--------------------------------------------------------

Design the toolbar so more buttons can be added later:

⭐ Share

⭐ Export

⭐ Save

⭐ Retry

⭐ Explain

without changing the layout.

--------------------------------------------------------
BEFORE CODING
--------------------------------------------------------

1. Analyze current ChatPanel architecture.

2. Explain where the toolbar should render.

3. List modified files.

4. Then implement.

Do NOT modify streaming behavior.

Do NOT modify session logic.

Do NOT change backend APIs.