import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Droplets, Sprout, FlaskConical, Sun, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-stone-200 p-8">
          <h1 className="text-3xl font-heading text-stone-900 mb-6">
            About RHESSys Documentation
          </h1>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-3">
              What is RHESSys?
            </h2>
            <p className="text-stone-600 mb-3 text-sm leading-relaxed">
              RHESSys (Regional Hydro-Ecologic Simulation System) is a physically-based,
              spatially-distributed ecosystem model that simulates carbon, water, and nutrient
              cycling across watersheds and regions. It integrates hydrological processes with
              ecosystem dynamics to understand how climate, topography, soils, and vegetation
              interact.
            </p>
            <p className="text-stone-600 mb-3 text-sm leading-relaxed">
              Developed by researchers at the University of North Carolina and the University of
              California, Santa Barbara, RHESSys has been widely used for studying:
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-1.5 mb-4 text-sm">
              <li>Climate change impacts on watersheds</li>
              <li>Forest management effects on water yield</li>
              <li>Drought and wildfire impacts on ecosystems</li>
              <li>Nutrient cycling and water quality</li>
              <li>Carbon sequestration in terrestrial ecosystems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-3">
              Model Components
            </h2>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="border border-stone-200 p-4 rounded-lg flex items-start gap-3">
                <Droplets className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium text-stone-800 text-sm mb-1">Water Model</h3>
                  <p className="text-xs text-stone-500">
                    Hydrological processes including evapotranspiration, infiltration, and runoff
                  </p>
                </div>
              </div>
              <div className="border border-stone-200 p-4 rounded-lg flex items-start gap-3">
                <Sprout className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium text-stone-800 text-sm mb-1">Carbon Model</h3>
                  <p className="text-xs text-stone-500">
                    Photosynthesis, respiration, allocation, and decomposition processes
                  </p>
                </div>
              </div>
              <div className="border border-stone-200 p-4 rounded-lg flex items-start gap-3">
                <FlaskConical className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium text-stone-800 text-sm mb-1">Nitrogen Model</h3>
                  <p className="text-xs text-stone-500">
                    Nitrogen cycling, mineralization, and plant uptake dynamics
                  </p>
                </div>
              </div>
              <div className="border border-stone-200 p-4 rounded-lg flex items-start gap-3">
                <Sun className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-medium text-stone-800 text-sm mb-1">Energy Model</h3>
                  <p className="text-xs text-stone-500">
                    Surface energy balance and radiation transfer through canopies
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-3">
              Features
            </h2>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <strong className="text-stone-800">Process Documentation:</strong> Detailed descriptions of model processes
                with equations and conceptual models
              </li>
              <li>
                <strong className="text-stone-800">Parameter Reference:</strong> Comprehensive parameter definitions including
                units, ranges, and measurement methods
              </li>
              <li>
                <strong className="text-stone-800">Observation Guide:</strong> Information on model outputs and how to measure
                them in the field
              </li>
              <li>
                <strong className="text-stone-800">Connection Visualization:</strong> Graphs showing relationships
                between processes and parameters
              </li>
              <li>
                <strong className="text-stone-800">Code References:</strong> Links to specific functions and files in the
                RHESSys source code
              </li>
              <li>
                <strong className="text-stone-800">Scientific Literature:</strong> Curated references to peer-reviewed papers
                for each component
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-heading text-stone-900 mb-3">
              Resources
            </h2>
            <div className="space-y-2 text-sm text-stone-600">
              <p>
                <strong className="text-stone-800">GitHub Repository:</strong>{' '}
                <a
                  href="https://github.com/RHESSys/RHESSys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/RHESSys/RHESSys
                </a>
              </p>
              <p>
                <strong className="text-stone-800">Key Publication:</strong>{' '}
                Tague, C.L. and Band, L.E., 2004. RHESSys: Regional Hydro-Ecologic Simulation
                System. <em>Earth Interactions</em>, 8(19), pp.1-42.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-heading text-stone-900 mb-3">
              Contributing
            </h2>
            <p className="text-sm text-stone-600 mb-3">
              This documentation is continually being updated. Contributions welcome:
            </p>
            <ul className="list-disc list-inside text-sm text-stone-600 space-y-1.5">
              <li>Submitting corrections or additions to the documentation</li>
              <li>Adding new process descriptions or parameter definitions</li>
              <li>Contributing references to relevant scientific literature</li>
              <li>Improving code references and examples</li>
            </ul>
          </section>

          <div className="mt-8 pt-6 border-t border-stone-200">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Back to Models
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
