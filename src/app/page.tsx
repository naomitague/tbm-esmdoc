import Link from 'next/link';
import { getAllModels } from '@/lib/models';
import { Navbar } from '@/components/Navbar';
import { Droplets, Sprout, FlaskConical, Sun, BookOpen, GitFork, GraduationCap, ArrowRight } from 'lucide-react';

const modelIcons: Record<string, React.ElementType> = {
  water: Droplets,
  carbon: Sprout,
  nitrogen: FlaskConical,
  energy: Sun,
};

const modelColors: Record<string, { card: string; badge: string }> = {
  blue: { card: 'border-t-4 border-t-sky-600', badge: 'bg-sky-600' },
  green: { card: 'border-t-4 border-t-emerald-600', badge: 'bg-emerald-600' },
  purple: { card: 'border-t-4 border-t-violet-600', badge: 'bg-violet-600' },
  orange: { card: 'border-t-4 border-t-amber-600', badge: 'bg-amber-600' },
  gray: { card: 'border-t-4 border-t-stone-500', badge: 'bg-stone-500' },
};

export default function HomePage() {
  const models = getAllModels();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-heading text-stone-900 mb-4">
            RHESSys Model Documentation
          </h1>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto font-light">
            fluxes, states, parameters, and observations for water, carbon,
            nitrogen, and energy cycling.
          </p>
        </div>

        {/* Model Gallery */}
        <div className="mb-20">
          <h2 className="text-2xl font-heading text-stone-900 mb-8 text-center">
            Model Components
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {models.map(model => {
              const Icon = modelIcons[model.slug] || BookOpen;
              const colors = modelColors[model.color] || modelColors.gray;
              return (
                <Link
                  key={model.slug}
                  href={`/models/${model.slug}`}
                  className="group"
                >
                  <div className={`bg-white rounded-lg ${colors.card} shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col`}>
                    <div className="p-5 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`${colors.badge} p-2 rounded-lg`}>
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-heading text-stone-900">{model.title}</h3>
                      </div>
                      <p className="text-sm text-stone-500 mb-4 line-clamp-2">
                        {model.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-stone-800">
                            {model.fluxCount}
                          </div>
                          <div className="text-[0.65rem] text-stone-400 uppercase tracking-wide">
                            Fluxes
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-stone-800">
                            {model.parameterCount}
                          </div>
                          <div className="text-[0.65rem] text-stone-400 uppercase tracking-wide">
                            Parameters
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-stone-800">
                            {model.observationCount}
                          </div>
                          <div className="text-[0.65rem] text-stone-400 uppercase tracking-wide">
                            Observations
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between text-sm text-primary group-hover:bg-primary-light transition-colors rounded-b-lg">
                      <span className="font-medium">Explore</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-lg border border-stone-200">
            <BookOpen className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-heading text-stone-900 mb-2">
              Documentation
            </h3>
            <p className="text-sm text-stone-500">
              Detailed descriptions of processes, equations, and implementations
              for each model component.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-stone-200">
            <GitFork className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-heading text-stone-900 mb-2">
              Connected Components
            </h3>
            <p className="text-sm text-stone-500">
              Relationships between processes, parameters, and
              observations across models.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-stone-200">
            <GraduationCap className="w-6 h-6 text-primary mb-3" strokeWidth={1.5} />
            <h3 className="text-lg font-heading text-stone-900 mb-2">
              Scientific References
            </h3>
            <p className="text-sm text-stone-500">
              text here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
