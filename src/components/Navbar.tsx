'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Network, Boxes, Info, User, Settings, Menu, X, Leaf, Map, ChevronDown } from 'lucide-react';
import { useTours } from '@/components/TourProvider';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);
  const { tours } = useTours();

  const navItems = [
    { href: '/synthesis', label: 'Synthesis', icon: Network },
    { href: '/esms', label: 'ESMs', icon: Boxes },
    { href: '/about', label: 'About', icon: Info },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <Leaf className="w-6 h-6 text-primary" strokeWidth={1.5} />
            <span className="text-lg font-heading text-stone-900">
              ESM Obs, Theory, Model
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive(item.href)
                        ? 'bg-primary-light text-primary'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {tours.length > 0 && (
              <div className="relative" onKeyDown={e => e.key === 'Escape' && setIsToursOpen(false)}>
                <button
                  type="button"
                  onClick={() => setIsToursOpen(open => !open)}
                  aria-haspopup="menu"
                  aria-expanded={isToursOpen}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive('/tours') || isToursOpen
                        ? 'bg-primary-light text-primary'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }
                  `}
                >
                  <Map className="w-4 h-4" strokeWidth={1.5} />
                  <span>Tours</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isToursOpen ? 'rotate-180' : ''}`}
                    strokeWidth={1.5}
                  />
                </button>

                {isToursOpen && (
                  <>
                    {/* Click-anywhere-else to dismiss — the same backdrop idiom the Sidebar uses. */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsToursOpen(false)} />
                    <div
                      role="menu"
                      className="absolute right-0 z-50 mt-1 w-80 rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
                    >
                      {tours.map(tour => (
                        <Link
                          key={tour.id}
                          role="menuitem"
                          href={`/tours/${tour.id}`}
                          onClick={() => setIsToursOpen(false)}
                          className="block px-3 py-2 hover:bg-stone-50"
                        >
                          <span className="block text-sm font-medium text-stone-900">{tour.title}</span>
                          {tour.who && (
                            <span className="mt-0.5 block text-xs text-stone-500 line-clamp-2">{tour.who}</span>
                          )}
                        </Link>
                      ))}
                      <Link
                        role="menuitem"
                        href="/tours"
                        onClick={() => setIsToursOpen(false)}
                        className="mt-1 block border-t border-stone-100 px-3 py-2 text-sm font-medium text-primary hover:bg-stone-50"
                      >
                        All tours →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-stone-600 hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md
                    ${
                      isActive(item.href)
                        ? 'bg-primary-light text-primary'
                        : 'text-stone-600 hover:bg-stone-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {tours.length > 0 && (
              <div className="mt-2 border-t border-stone-100 pt-2">
                <Link
                  href="/tours"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md
                    ${isActive('/tours') ? 'bg-primary-light text-primary' : 'text-stone-600 hover:bg-stone-100'}
                  `}
                >
                  <Map className="w-4 h-4" strokeWidth={1.5} />
                  <span>Tours</span>
                </Link>
                {tours.map(tour => (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-md py-2 pl-10 pr-3 text-sm text-stone-600 hover:bg-stone-100"
                  >
                    {tour.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
