You are a Senior Staff Software Engineer at Vercel with expertise in Next.js 15, React 19, TypeScript, Prisma, PostgreSQL, TailwindCSS, AI/RAG systems, and production SaaS architecture.

Your task is to implement a complete "Document Intelligence / Document Insights" feature for my existing AI Document Analyzer application.

DO NOT create a quick demo.

Build it as if this application will be deployed to production and used by thousands of users.

=========================================================
PROJECT
=========================================================

Current Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- pgvector
- OpenRouter
- TailwindCSS

Current Features

✓ Upload PDF
✓ Chunk PDF
✓ Generate embeddings
✓ Semantic Search
✓ RAG Chat
✓ Multi Conversation Chat
✓ PDF Highlight
✓ Keywords
✓ Summary

=========================================================
GOAL
=========================================================

Add a professional "Document Intelligence" section.

The application should automatically analyze every uploaded PDF and generate useful metadata.

The UI should look like ChatGPT + Notion + Perplexity + Vercel Dashboard.

=========================================================
FEATURE
=========================================================

Create a new section called

Document Insights

It should contain beautiful cards.

=========================================================
INSIGHTS TO GENERATE
=========================================================

General

• Document Type
Example

Tax Return
Invoice
Resume
Agreement
Research Paper
Medical Report
Bank Statement
Legal Contract

----------------------------------------

Language

Example

English
Hindi
French

----------------------------------------

Pages

----------------------------------------

Word Count

----------------------------------------

Character Count

----------------------------------------

Estimated Reading Time

Example

12 min read

----------------------------------------

Created Date
(if available)

----------------------------------------

Last Modified
(if available)

----------------------------------------

File Size

=========================================================
AI INSIGHTS
=========================================================

Automatically extract

• Important Dates

Display

📅 Important Dates

16 Jul 2026

31 Mar 2026

etc

----------------------------------------

Money

Extract all

₹

$

€

Amounts

Display

💰 Monetary Values

₹5,42,120

₹45,000

₹0

----------------------------------------

People

Extract names

Display

👤 People

Rizwan Khan

etc

----------------------------------------

Organizations

Display

🏢 Organizations

Income Tax Department

OpenAI

etc

----------------------------------------

Locations

Display

📍 Locations

Burhanpur

Madhya Pradesh

India

----------------------------------------

PAN

Aadhar

GST

Invoice Numbers

Case Numbers

Reference IDs

Automatically detect.

=========================================================
DOCUMENT TAGS
=========================================================

Generate AI tags

Example

Finance

Tax

Government

Legal

Medical

Employment

Invoice

Resume

Research

=========================================================
DOCUMENT STATS
=========================================================

Display

Pages

Chunks

Embeddings

Chat Sessions

Messages

Keywords

=========================================================
CONFIDENCE SCORE
=========================================================

Show

AI Confidence

95%

=========================================================
UI
=========================================================

Modern Dashboard Cards

Example

----------------------------------------

📄 Document Type

Income Tax Return

----------------------------------------

📑 Pages

12

----------------------------------------

⏱ Reading Time

8 min

----------------------------------------

🏷 Tags

Finance

Tax

Government

Refund

=========================================================
QUICK ACTIONS
=========================================================

Add buttons

Summarize

Explain

Extract Dates

Extract Names

Extract Money

Create Notes

Generate Quiz

Translate

These buttons should automatically send prompts into the existing chat system.

=========================================================
DATABASE
=========================================================

If required

extend Prisma schema.

Create proper migrations.

Avoid storing duplicate data.

=========================================================
API
=========================================================

Create reusable service layer.

Do NOT place business logic inside route handlers.

=========================================================
ARCHITECTURE
=========================================================

Before implementing

1.

Analyze existing code.

2.

Find related files automatically.

3.

Explain architecture.

4.

List files to modify.

5.

Then implement.

=========================================================
UI REQUIREMENTS
=========================================================

Follow

ChatGPT

Notion

Linear

Vercel

Use

rounded-xl

subtle borders

beautiful spacing

proper typography

responsive layout

loading skeleton

empty states

hover animations

=========================================================
PERFORMANCE
=========================================================

Do not recalculate insights every render.

Cache results.

Only generate once after upload.

=========================================================
ERROR HANDLING
=========================================================

Handle

Missing metadata

Missing OCR

Empty PDFs

Unsupported PDFs

=========================================================
CODE QUALITY
=========================================================

No duplicate logic

Strict TypeScript

Reusable components

SOLID Principles

Production Ready

No any

No quick hacks

=========================================================
OUTPUT FORMAT
=========================================================

Always work in this order.

1.

Architecture Analysis

2.

Files to Modify

3.

Database Changes

4.

Backend Changes

5.

Frontend Changes

6.

Implementation

7.

Refactoring

8.

Future Improvements

=========================================================
IMPORTANT
=========================================================

Do NOT rewrite the project.

Only modify necessary files.

Preserve all existing features.

The final result should look like software built by engineers at OpenAI, Notion, or Vercel.