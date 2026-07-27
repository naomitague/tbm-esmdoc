import Link from 'next/link';
import { OutlineHeading } from '@/lib/pageOutline';

interface PageOutlineProps {
  outline: OutlineHeading[];
}

/** "On this page" jump-to-section index, with each section's internal (vault) links nested underneath it — see buildPageOutline. */
export function PageOutline({ outline }: PageOutlineProps) {
  if (outline.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">On this page</h3>
      <ul className="space-y-0.5">
        {outline.map(heading => (
          <li key={heading.id} className={heading.level > 1 ? 'pl-2.5' : ''}>
            <a
              href={`#${heading.id}`}
              className="block text-sm py-1 px-2 rounded text-stone-600 hover:text-primary hover:bg-stone-50 transition-colors"
            >
              {heading.text}
            </a>
            {heading.links.length > 0 && (
              <ul className="ml-2 pl-2 border-l border-stone-100 space-y-0.5 mb-1">
                {heading.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-xs py-0.5 px-2 rounded text-primary hover:underline hover:bg-stone-50 transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
