'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ContentType } from '@/types';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

interface SidebarProps {
  currentSlug: string;
  contentType: ContentType;
}

interface NavItem {
  slug: string;
  title: string;
  type: ContentType;
}

export function Sidebar({ currentSlug, contentType }: SidebarProps) {
  const [items, setItems] = useState<NavItem[]>([]);
  const [variables, setVariables] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadSidebarData() {
      try {
        const response = await fetch('/api/sidebar');
        const data = await response.json();
        setItems(data.items || []);
        setVariables(data.variables || []);
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      }
    }

    loadSidebarData();
  }, []);

  const groupedItems = {
    overview: items.filter(item => item.type === 'overview'),
    process: items.filter(item => item.type === 'process'),
    parameter: items.filter(item => item.type === 'parameter'),
    observation: items.filter(item => item.type === 'observation'),
  };

  const scrollToVariable = (varName: string) => {
    const element = document.getElementById(varName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <PanelLeftClose className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <PanelLeftOpen className="w-5 h-5" strokeWidth={1.5} />
        )}
      </button>

      <aside
        className={`
          fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-stone-200
          overflow-y-auto transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4">
          {variables.length > 0 && (
            <div className="nav-section mb-6">
              <h3 className="nav-section-title">Variables on this page</h3>
              <ul className="space-y-0.5">
                {variables.map(varName => (
                  <li key={varName}>
                    <button
                      onClick={() => scrollToVariable(varName)}
                      className="nav-item w-full text-left text-sm"
                    >
                      {varName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="nav-section">
            <h3 className="nav-section-title">Overviews</h3>
            <ul className="space-y-0.5">
              {groupedItems.overview.map(item => (
                <li key={item.slug}>
                  <Link
                    href={`/wiki/${item.slug}`}
                    className={`nav-item block text-sm ${
                      item.slug === currentSlug ? 'nav-item-active' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Processes</h3>
            <ul className="space-y-0.5">
              {groupedItems.process.map(item => (
                <li key={item.slug}>
                  <Link
                    href={`/wiki/${item.slug}`}
                    className={`nav-item block text-sm ${
                      item.slug === currentSlug ? 'nav-item-active' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Parameters</h3>
            <ul className="space-y-0.5">
              {groupedItems.parameter.slice(0, 15).map(item => (
                <li key={item.slug}>
                  <Link
                    href={`/wiki/${item.slug}`}
                    className={`nav-item block text-sm ${
                      item.slug === currentSlug ? 'nav-item-active' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {groupedItems.parameter.length > 15 && (
                <li className="text-xs text-stone-400 px-2 py-1">
                  +{groupedItems.parameter.length - 15} more
                </li>
              )}
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Observations</h3>
            <ul className="space-y-0.5">
              {groupedItems.observation.map(item => (
                <li key={item.slug}>
                  <Link
                    href={`/wiki/${item.slug}`}
                    className={`nav-item block text-sm ${
                      item.slug === currentSlug ? 'nav-item-active' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
