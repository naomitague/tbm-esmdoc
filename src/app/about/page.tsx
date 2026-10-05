import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getSitePage } from '@/lib/sitePages';

export const metadata = {
  title: 'About Heliopause',
};

/** Rows the author has marked as not built yet, e.g. "… (NOT THERE YET)". */
const PLANNED = /\s*\(NOT THERE YET\)\s*$/i;

export default function AboutPage() {
  const page = getSitePage('about');

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-screen-xl px-4 py-12">
        <header className="mb-8 max-w-3xl">
          <h1 className="font-heading text-4xl text-stone-900">{page.title}</h1>
          {page.subtitle && <p className="mt-2 text-lg text-stone-600">{page.subtitle}</p>}
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <article className="wiki-content min-w-0 flex-1">
            <MarkdownContent content={page.prose} />
          </article>

          {page.table && page.table.rows.length > 0 && (
            <aside className="lg:w-[26rem] lg:flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <h2 className="mb-3 font-heading text-xl text-stone-900">{page.table.heading}</h2>
                <ul className="space-y-2.5">
                  {page.table.rows.map(row => {
                    const planned = PLANNED.test(row.body);
                    return (
                      <li key={row.label} className="rounded-lg border border-stone-200 bg-white p-4">
                        <h3 className="flex items-start justify-between gap-2 text-sm font-medium text-stone-900">
                          {row.label}
                          {planned && (
                            <span className="flex-shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-normal uppercase tracking-wide text-stone-500">
                              planned
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-stone-600">
                          {row.body.replace(PLANNED, '')}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
