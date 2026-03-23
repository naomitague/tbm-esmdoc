import { ContentMetadata, FluxMetadata, ParameterMetadata } from '@/types';

interface InfoBoxProps {
  content: ContentMetadata;
}

export function InfoBox({ content }: InfoBoxProps) {
  if (content.type === 'flux') {
    const metadata = content.metadata as FluxMetadata;
    return (
      <div className="infobox mb-6 float-right ml-6 w-80">
        <div className="infobox-title">{metadata.title}</div>

        {metadata.modelName && (
          <div className="infobox-row">
            <div className="infobox-label">Model</div>
            <div className="text-sm text-stone-700">{metadata.modelName}</div>
          </div>
        )}

        {metadata.variables.flux.length > 0 && (
          <div className="infobox-row">
            <div className="infobox-label">Flux Variables</div>
            <div>
              <ul className="text-sm text-stone-700">
                {metadata.variables.flux.map(v => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {metadata.variables.state.length > 0 && (
          <div className="infobox-row">
            <div className="infobox-label">State Variables</div>
            <div>
              <ul className="text-sm text-stone-700">
                {metadata.variables.state.map(v => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {metadata.variables.parameters.length > 0 && (
          <div className="infobox-row">
            <div className="infobox-label">Parameters</div>
            <div>
              <ul className="text-sm text-stone-700">
                {metadata.variables.parameters.slice(0, 5).map(v => (
                  <li key={v}>{v}</li>
                ))}
                {metadata.variables.parameters.length > 5 && (
                  <li className="text-stone-400">
                    +{metadata.variables.parameters.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {metadata.codeFiles && metadata.codeFiles.length > 0 && (
          <div className="infobox-row">
            <div className="infobox-label">Code Files</div>
            <div>
              <ul className="text-sm">
                {metadata.codeFiles.map(f => (
                  <li key={f} className="font-mono text-xs text-stone-600">{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {metadata.aliases && metadata.aliases.length > 0 && (
          <div className="infobox-row">
            <div className="infobox-label">Also known as</div>
            <div className="text-sm text-stone-700">{metadata.aliases.join(', ')}</div>
          </div>
        )}
      </div>
    );
  }

  if (content.type === 'parameter') {
    const metadata = content.metadata as ParameterMetadata;
    return (
      <div className="infobox mb-6 float-right ml-6 w-80">
        <div className="infobox-title">{metadata.parameterName}</div>

        {metadata.units && (
          <div className="infobox-row">
            <div className="infobox-label">Units</div>
            <div className="text-sm text-stone-700">{metadata.units}</div>
          </div>
        )}

        {metadata.classification.length > 0 && (
          <div className="infobox-row">
            <div className="infobox-label">Classification</div>
            <div className="text-sm text-stone-700">{metadata.classification.join(', ')}</div>
          </div>
        )}

        <div className="infobox-row">
          <div className="infobox-label">Dynamic</div>
          <div className="text-sm text-stone-700">{metadata.dynamicallyComputed ? 'Yes' : 'No'}</div>
        </div>

        {metadata.realism && (
          <div className="infobox-row">
            <div className="infobox-label">Realism</div>
            <div className="text-sm text-stone-700">{metadata.realism}</div>
          </div>
        )}

        {metadata.spaceScale && (
          <div className="infobox-row">
            <div className="infobox-label">Space Scale</div>
            <div className="text-sm text-stone-700">{metadata.spaceScale}</div>
          </div>
        )}

        {metadata.timeScale && (
          <div className="infobox-row">
            <div className="infobox-label">Time Scale</div>
            <div className="text-sm text-stone-700">{metadata.timeScale}</div>
          </div>
        )}

        {metadata.function && (
          <div className="infobox-row">
            <div className="infobox-label">Function</div>
            <div className="text-sm text-stone-700">{metadata.function}</div>
          </div>
        )}

        {metadata.status && (
          <div className="infobox-row">
            <div className="infobox-label">Status</div>
            <div>
              <span className={`badge ${
                metadata.status === 'todo' ? 'bg-amber-500' : 'bg-emerald-600'
              }`}>
                {metadata.status}
              </span>
            </div>
          </div>
        )}

        {metadata.aliases && metadata.aliases.length > 0 && (
          <div className="infobox-row">
            <div className="infobox-label">Aliases</div>
            <div className="text-sm text-stone-700">{metadata.aliases.join(', ')}</div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
