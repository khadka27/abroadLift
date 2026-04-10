import Link from "next/link";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageShellProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalPageShell({
  title,
  description,
  lastUpdated,
  sections,
}: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link
          href="/legal"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          Back to legal center
        </Link>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <header className="border-b border-slate-100 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              {description}
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Last updated: {lastUpdated}
            </p>
          </header>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">
                  {section.heading}
                </h2>
                <div className="space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
