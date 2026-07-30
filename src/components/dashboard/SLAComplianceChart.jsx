import { useMemo } from 'react';

const SLA_SEGMENTS = [
  { key: 'onTrack', label: 'On Track', color: '#16A34A', bgClass: 'bg-green-50', textClass: 'text-green-700', action: '—' },
  { key: 'atRisk', label: 'At Risk', color: '#D97706', bgClass: 'bg-amber-50', textClass: 'text-amber-700', action: 'Review soon' },
  { key: 'overdue', label: 'Overdue', color: '#EA580C', bgClass: 'bg-orange-50', textClass: 'text-orange-700', action: 'Escalate' },
  { key: 'severelyOverdue', label: 'Severely Overdue', color: '#DC2626', bgClass: 'bg-red-50', textClass: 'text-red-700', action: 'IMMEDIATE ACTION' },
];

/**
 * SLAComplianceChart — stacked horizontal bar built with pure CSS (not Recharts).
 * Shows SLA status distribution across all non-completed items.
 * Includes summary table with status counts, percentages, and action recommendations.
 */
export const SLAComplianceChart = ({ enrichedItems }) => {
  const slaData = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) {
      return { counts: { onTrack: 0, atRisk: 0, overdue: 0, severelyOverdue: 0 }, total: 0, onTrackPct: 0 };
    }

    // All non-completed items (exclude Completed, Cancelled, Risk Accepted — those have slaStatus "Completed")
    const activeItems = enrichedItems.filter(
      (i) => i.slaStatus !== 'Completed'
    );

    const counts = {
      onTrack: activeItems.filter((i) => i.slaStatus === 'On Track').length,
      atRisk: activeItems.filter((i) => i.slaStatus === 'At Risk').length,
      overdue: activeItems.filter((i) => i.slaStatus === 'Overdue').length,
      severelyOverdue: activeItems.filter((i) => i.slaStatus === 'Severely Overdue').length,
    };

    const total = counts.onTrack + counts.atRisk + counts.overdue + counts.severelyOverdue;
    const onTrackPct = total > 0 ? Math.round((counts.onTrack / total) * 100) : 0;

    return { counts, total, onTrackPct };
  }, [enrichedItems]);

  const { counts, total, onTrackPct } = slaData;

  return (
    <div className="card-float rounded-3xl p-7" id="chart-sla-compliance">
      <h3 className="text-base font-semibold text-text-primary mb-5">
        SLA Compliance Status
      </h3>

      {/* Large headline metric */}
      <div className="mb-5">
        <span className="text-4xl font-extrabold tracking-tight text-text-primary">
          {onTrackPct}%
        </span>
        <span className="ml-2 text-sm font-medium text-text-secondary">On Track</span>
      </div>

      {/* Stacked horizontal bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-bg-surface-tint">
        {total > 0 &&
          SLA_SEGMENTS.map((seg) => {
            const count = counts[seg.key];
            if (count === 0) return null;
            const widthPct = (count / total) * 100;
            return (
              <div
                key={seg.key}
                className="h-full transition-all duration-500"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: seg.color,
                  minWidth: count > 0 ? '8px' : '0',
                }}
                title={`${seg.label}: ${count} (${Math.round(widthPct)}%)`}
              />
            );
          })}
      </div>

      {/* Legend dots below bar */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {SLA_SEGMENTS.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="font-medium">{seg.label}</span>
            <span className="text-text-muted">
              {counts[seg.key]} ({total > 0 ? Math.round((counts[seg.key] / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border-soft">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-bg-surface-tint">
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted">Status</th>
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted text-right">Count</th>
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted text-right">%</th>
              <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {SLA_SEGMENTS.map((seg) => (
              <tr key={seg.key} className="border-t border-border-soft hover:bg-bg-surface-tint/50 transition-colors">
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ${seg.bgClass} ${seg.textClass}`}>
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    {seg.label}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-text-primary">
                  {counts[seg.key]}
                </td>
                <td className="px-4 py-2.5 text-right text-text-secondary">
                  {total > 0 ? Math.round((counts[seg.key] / total) * 100) : 0}%
                </td>
                <td className={`px-4 py-2.5 font-medium ${seg.key === 'severelyOverdue' ? 'text-red-700 font-bold' : 'text-text-secondary'}`}>
                  {seg.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
