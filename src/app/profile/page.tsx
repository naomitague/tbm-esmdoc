import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Droplets, ArrowLeft, ArrowRight, Eye, Bookmark, PenLine } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-stone-200 p-8">
          <h1 className="text-3xl font-heading text-stone-900 mb-6">
            User Profile
          </h1>

          <div className="mb-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-heading">
                U
              </div>
              <div>
                <h2 className="text-xl font-heading text-stone-900">User Name</h2>
                <p className="text-sm text-stone-500">Environmental Modeler</p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h3 className="text-lg font-heading text-stone-900 mb-3">
              Recently Viewed
            </h3>
            <div className="space-y-2">
              <div className="border border-stone-200 rounded-lg p-3 hover:bg-stone-50 transition-colors">
                <Link href="/models/water" className="block">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-sky-600" strokeWidth={1.5} />
                    <div>
                      <h4 className="text-sm font-medium text-stone-800">Water Model</h4>
                      <p className="text-xs text-stone-400">Last viewed: Today</p>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="border border-stone-200 rounded-lg p-3 hover:bg-stone-50 transition-colors">
                <Link href="/models/water/processes/transpiration" className="block">
                  <div className="flex items-center gap-3">
                    <span className="badge badge-process">Process</span>
                    <div>
                      <h4 className="text-sm font-medium text-stone-800">Transpiration</h4>
                      <p className="text-xs text-stone-400">Last viewed: Today</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-heading text-stone-900 mb-3">
              Bookmarked Content
            </h3>
            <p className="text-sm text-stone-400 italic">
              No bookmarks yet. Browse the models and bookmark your favorite processes and parameters.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-heading text-stone-900 mb-3">
              Account Information
            </h3>
            <div className="space-y-0">
              <div className="flex justify-between py-2.5 border-b border-stone-100 text-sm">
                <span className="text-stone-500">Email:</span>
                <span className="text-stone-800">user@example.com</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-stone-100 text-sm">
                <span className="text-stone-500">Member since:</span>
                <span className="text-stone-800">January 2025</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-stone-100 text-sm">
                <span className="text-stone-500">Role:</span>
                <span className="text-stone-800">Viewer</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-heading text-stone-900 mb-3">
              Statistics
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="border border-stone-200 rounded-lg p-4 text-center">
                <Eye className="w-5 h-5 text-stone-400 mx-auto mb-2" strokeWidth={1.5} />
                <div className="text-2xl font-semibold text-stone-800">0</div>
                <div className="text-xs text-stone-400">Pages Viewed</div>
              </div>
              <div className="border border-stone-200 rounded-lg p-4 text-center">
                <Bookmark className="w-5 h-5 text-stone-400 mx-auto mb-2" strokeWidth={1.5} />
                <div className="text-2xl font-semibold text-stone-800">0</div>
                <div className="text-xs text-stone-400">Bookmarks</div>
              </div>
              <div className="border border-stone-200 rounded-lg p-4 text-center">
                <PenLine className="w-5 h-5 text-stone-400 mx-auto mb-2" strokeWidth={1.5} />
                <div className="text-2xl font-semibold text-stone-800">0</div>
                <div className="text-xs text-stone-400">Contributions</div>
              </div>
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
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors font-medium"
            >
              Edit Settings
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
