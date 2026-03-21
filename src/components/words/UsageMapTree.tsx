'use client';

import type { UsageMap } from '@/types';

interface UsageMapTreeProps {
  data: UsageMap;
}

const labelStyle = { fontSize: '10px', letterSpacing: '2px' } as const;
const monoSm = { fontSize: '11px' } as const;

export function UsageMapTree({ data }: UsageMapTreeProps) {
  return (
    <div>
      <p className="font-mono uppercase text-ox-muted mb-3" style={labelStyle}>Usage Map</p>

      {/* Root word */}
      <div className="font-mono font-bold text-ox-ink-deep uppercase tracking-widest mb-2" style={{ fontSize: '13px' }}>
        {data.word.toUpperCase()}
      </div>

      {/* Domain branches */}
      <div className="space-y-0">
        {data.domains.map((domain, di) => {
          const isLastDomain = di === data.domains.length - 1;
          const domainPrefix = isLastDomain ? '└──' : '├──';
          const childIndentChar = isLastDomain ? '\u00a0\u00a0\u00a0\u00a0\u00a0' : '│\u00a0\u00a0\u00a0\u00a0';

          return (
            <div key={di}>
              {/* Domain label */}
              <div className="flex items-center gap-1">
                <span className="font-mono text-ox-muted select-none" style={monoSm}>{domainPrefix}</span>
                <span className="font-mono font-semibold text-ox-ink" style={monoSm}>{domain.domain}</span>
              </div>

              {/* Patterns */}
              {domain.patterns.map((p, pi) => {
                const isLastPattern = pi === domain.patterns.length - 1;
                const patternPrefix = isLastPattern ? '└──' : '├──';

                return (
                  <div key={pi} className="flex items-start gap-1">
                    <span className="font-mono text-ox-muted select-none shrink-0" style={monoSm}>
                      {childIndentChar}{patternPrefix}
                    </span>
                    <span className="font-mono text-ox-ink" style={monoSm}>
                      <span className="text-ox-accent">{p.pattern}</span>
                      <span className="text-ox-muted"> → </span>
                      <span className="text-ox-ink">{p.meaning}</span>
                    </span>
                  </div>
                );
              })}

              {/* Spacer between domains */}
              {!isLastDomain && (
                <div className="font-mono text-ox-muted select-none" style={monoSm}>│</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
