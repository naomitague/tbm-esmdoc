import { Navbar } from '@/components/Navbar';
import { EtObservationsExplorer } from '@/components/EtObservationsExplorer';
import { readCsvRows } from '@/lib/csv';
import { Droplets } from 'lucide-react';

export const metadata = {
  title: 'ET / Forest-Change Observations',
};

const CSV_PATH = 'patterns/evapotranspiration/examplepapers/observations.csv';

export default function EtObservationsPage() {
  const observations = readCsvRows(CSV_PATH);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="bg-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-2">
            <Droplets className="w-10 h-10" strokeWidth={1.5} />
            <div>
              <h1 className="text-4xl font-heading">ET / Forest-Change Observations</h1>
              <p className="text-base mt-1 text-white/80">
                Catchment-level ΔForest → ΔET / Δrunoff observations, by climate class
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-stone-600 mb-6 max-w-3xl">
          {observations.length} observations drawn from the ET / forest-change literature
          synthesis (Yang et al. 2023; Zhang et al. 2017). Click a bar in either histogram to
          list its underlying observations in the table.
        </p>

        <EtObservationsExplorer observations={observations} />
      </div>
    </div>
  );
}
