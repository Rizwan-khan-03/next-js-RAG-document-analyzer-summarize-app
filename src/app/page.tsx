import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute right-[-150px] top-[300px] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/20">
            AI
          </div>

          <div>
            <div className="font-semibold tracking-tight">
              DocumentAI
            </div>
            <div className="text-xs text-slate-500">
              RAG-powered intelligence
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>

          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>

          <a href="#technology" className="transition hover:text-white">
            Technology
          </a>
        </div>

        <Link
          href="/dashboard"
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800"
        >
          Open Workspace
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              AI-Powered Document Intelligence
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Turn your documents into an{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                AI knowledge base.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Upload your documents, ask questions in natural language,
              and get intelligent answers grounded in your own data —
              with direct links back to the original source.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Start Analyzing Documents
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                See How It Works
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>✓ PDF Processing</span>
              <span>✓ Semantic Search</span>
              <span>✓ RAG Pipeline</span>
              <span>✓ Source Highlighting</span>
            </div>
          </div>

          {/* Right - Product Preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-blue-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">
              {/* Window header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>

                <span className="text-xs text-slate-500">
                  AI Document Workspace
                </span>

                <div className="w-12" />
              </div>

              {/* Workspace */}
              <div className="grid min-h-[430px] grid-cols-5">
                {/* Document */}
                <div className="col-span-3 border-r border-slate-800 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Resume.pdf
                      </p>
                      <p className="text-xs text-slate-500">
                        8 pages
                      </p>
                    </div>

                    <span className="rounded-md bg-green-500/10 px-2 py-1 text-xs text-green-400">
                      Processed
                    </span>
                  </div>

                  <div className="rounded-lg bg-white p-5 text-slate-800 shadow-lg">
                    <div className="mb-5 h-3 w-32 rounded bg-slate-200" />

                    <div className="space-y-3">
                      <div className="h-2 rounded bg-slate-100" />
                      <div className="h-2 w-11/12 rounded bg-slate-100" />
                      <div className="h-2 w-10/12 rounded bg-slate-100" />
                    </div>

                    <div className="mt-7">
                      <div className="mb-3 h-2 w-24 rounded bg-slate-300" />

                      <div className="space-y-3">
                        <div className="h-2 rounded bg-slate-100" />
                        <div className="h-2 w-9/12 rounded bg-slate-100" />
                        <div className="h-2 w-10/12 rounded bg-slate-100" />
                      </div>
                    </div>

                    {/* Highlight */}
                    <div className="mt-8 rounded-md bg-yellow-200 px-2 py-1 text-xs text-yellow-900">
                      React.js • Next.js • TypeScript • RAG
                    </div>
                  </div>
                </div>

                {/* AI Chat */}
                <div className="col-span-2 flex flex-col">
                  <div className="border-b border-slate-800 px-4 py-4">
                    <p className="text-sm font-medium">
                      AI Assistant
                    </p>
                    <p className="text-xs text-slate-500">
                      Ask about your document
                    </p>
                  </div>

                  <div className="flex-1 space-y-4 p-4">
                    <div className="ml-5 rounded-xl rounded-tr-sm bg-blue-600/20 p-3 text-xs leading-5 text-blue-100">
                      What technologies are mentioned in this resume?
                    </div>

                    <div className="mr-3 rounded-xl rounded-tl-sm border border-slate-700 bg-slate-800 p-3 text-xs leading-5 text-slate-300">
                      The document mentions React.js, Next.js,
                      TypeScript, Redux Toolkit, Tailwind CSS,
                      Node.js and several other technologies.
                    </div>

                    <div className="mr-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                      <div className="mb-2 flex items-center gap-2 text-xs text-blue-300">
                        <span>◉</span>
                        Source
                      </div>

                      <p className="text-xs text-slate-400">
                        Page 1 · Resume.pdf
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 p-3">
                    <div className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-600">
                      Ask a question...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating RAG indicator */}
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  ✦
                </div>

                <div>
                  <p className="text-xs font-medium">
                    RAG Retrieval
                  </p>
                  <p className="text-[11px] text-slate-500">
                    3 relevant chunks found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAG Flow */}
      <section
        id="how-it-works"
        className="relative border-y border-slate-800 bg-slate-900/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From document to intelligent answer
            </h2>

            <p className="mt-4 text-slate-400">
              A complete Retrieval-Augmented Generation pipeline
              connects your documents with the AI model.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-5">
            {[
              {
                number: "01",
                title: "Upload",
                description: "Upload your PDF document.",
                icon: "↑",
              },
              {
                number: "02",
                title: "Extract",
                description: "Extract and process document text.",
                icon: "▤",
              },
              {
                number: "03",
                title: "Chunk",
                description: "Split content into meaningful chunks.",
                icon: "◫",
              },
              {
                number: "04",
                title: "Retrieve",
                description: "Find the most relevant information.",
                icon: "⌕",
              },
              {
                number: "05",
                title: "Generate",
                description: "LLM generates a grounded answer.",
                icon: "✦",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="relative rounded-2xl border border-slate-800 bg-slate-950/70 p-6 transition hover:-translate-y-1 hover:border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    {item.number}
                  </span>

                  <span className="text-xl text-blue-400">
                    {item.icon}
                  </span>
                </div>

                <h3 className="mt-7 font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Built for real documents
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              More than a chatbot.
              <br />
              <span className="text-slate-500">
                A document intelligence system.
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              Instead of asking an LLM to guess from its general
              knowledge, the system retrieves relevant information
              from your documents and uses that context to generate
              answers.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "RAG-powered answers",
                text: "Answers are grounded in retrieved document context.",
                icon: "✦",
              },
              {
                title: "Semantic retrieval",
                text: "Find relevant information based on meaning, not just keywords.",
                icon: "⌕",
              },
              {
                title: "PDF source navigation",
                text: "Jump directly to the page containing the relevant information.",
                icon: "▤",
              },
              {
                title: "Highlighted sources",
                text: "See exactly which content was used to answer your question.",
                icon: "▰",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  {feature.icon}
                </div>

                <h3 className="mt-5 font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section
        id="technology"
        className="border-t border-slate-800 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Technology
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Built with modern web & AI technologies
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Prisma",
              "PostgreSQL",
              "Supabase",
              "RAG",
              "LLM",
              "React-PDF",
              "REST APIs",
              "Vercel",
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-slate-900 to-purple-600/10 p-10 text-center sm:p-16">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Your documents. Your knowledge. Your AI.
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to talk to your documents?
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Upload a document and start asking questions using
              an AI assistant powered by Retrieval-Augmented
              Generation.
            </p>

            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500"
            >
              Open Document Workspace
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} DocumentAI
          </p>

          <p>
            Built with Next.js • RAG • Supabase • PostgreSQL
          </p>
        </div>
      </footer>
    </main>
  );
}