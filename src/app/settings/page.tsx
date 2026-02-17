'use client';

import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Download, History, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    compactView: false,
    showEquations: true,
    showCodeReferences: true,
    defaultView: 'gallery',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        active ? 'bg-primary' : 'bg-stone-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          active ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-stone-200 p-8">
          <h1 className="text-3xl font-heading text-stone-900 mb-6">
            Settings
          </h1>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-4">
              Display Preferences
            </h2>
            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-medium text-stone-800">Dark Mode</h3>
                  <p className="text-xs text-stone-400">
                    Use dark theme for reduced eye strain
                  </p>
                </div>
                <Toggle active={settings.darkMode} onToggle={() => handleToggle('darkMode')} />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-medium text-stone-800">Compact View</h3>
                  <p className="text-xs text-stone-400">
                    Show more content with reduced spacing
                  </p>
                </div>
                <Toggle active={settings.compactView} onToggle={() => handleToggle('compactView')} />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-medium text-stone-800">Show Equations</h3>
                  <p className="text-xs text-stone-400">
                    Display mathematical equations in process documentation
                  </p>
                </div>
                <Toggle active={settings.showEquations} onToggle={() => handleToggle('showEquations')} />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-medium text-stone-800">Show Code References</h3>
                  <p className="text-xs text-stone-400">
                    Display references to RHESSys source code
                  </p>
                </div>
                <Toggle active={settings.showCodeReferences} onToggle={() => handleToggle('showCodeReferences')} />
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-4">
              Notifications
            </h2>
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-medium text-stone-800">Email Notifications</h3>
                <p className="text-xs text-stone-400">
                  Receive updates about new documentation
                </p>
              </div>
              <Toggle active={settings.emailNotifications} onToggle={() => handleToggle('emailNotifications')} />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-4">
              Default Views
            </h2>
            <div>
              <label className="block text-sm font-medium text-stone-800 mb-2">
                Homepage View
              </label>
              <select
                value={settings.defaultView}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultView: e.target.value }))}
                className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="gallery">Gallery View</option>
                <option value="list">List View</option>
                <option value="compact">Compact View</option>
              </select>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-4">
              Data & Privacy
            </h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 text-left border border-stone-200 rounded-lg px-4 py-3 hover:bg-stone-50 transition-colors">
                <Download className="w-4 h-4 text-stone-400 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-medium text-stone-800">Export Your Data</h3>
                  <p className="text-xs text-stone-400">
                    Download a copy of your bookmarks and viewing history
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 text-left border border-stone-200 rounded-lg px-4 py-3 hover:bg-stone-50 transition-colors">
                <History className="w-4 h-4 text-stone-400 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-medium text-stone-800">Clear Viewing History</h3>
                  <p className="text-xs text-stone-400">
                    Remove all recently viewed items
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 text-left border border-red-200 rounded-lg px-4 py-3 hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4 text-red-400 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-medium text-red-700">Delete Account</h3>
                  <p className="text-xs text-red-400">
                    Permanently delete your account and all associated data
                  </p>
                </div>
              </button>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t border-stone-200 flex justify-between items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Back to Models
            </Link>
            <button className="text-sm bg-primary text-white px-5 py-2 rounded-md hover:bg-primary-dark transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
