import { useMemo } from 'react';
import { useRiskScore } from '../../hooks/useRiskScore.js';
import { SEVERITY_COLORS } from '../../utils/constants.js';

/**
 * TopRiskTable — top 5 highest risk items, excluding Completed and Cancelled.
 * Pure HTML table with design system styling.
 */
export const TopRiskTable = ({ enrichedItems }) => {
  const { getTopRiskItems, formatRiskScore, getRiskBand } = useRiskScore();

  const topItems = useMemo(() => {
    return getTopRiskItems(enrichedItems, 5);
  }, [enrichedItems, getTopRiskItems]);

  const truncate = (str, maxLen = 40) => {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
  };

  return (
    <div className="card-float rounded-3xl p-7" id="table-top-risk">
      <h3 className="text-base font-semibold text-text-primary mb-5">
        Top 5 Highest Risk Items
      </h3>

      {topItems.length === 0 ? (
        <p className="text-sm text-text-muted">No active risk items.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-soft">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-bg-surface-tint">
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted">
                  Risk Score
                </th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted">
                  POA&M ID
                </th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted">
                  Title
                </th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted">
                  Severity
                </th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted text-right">
                  Days Overdue
                </th>
                <th className="px-4 py-2.5 font-semibold uppercase tracking-wider text-text-muted">
                  POC
                </th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item) => {
                const band = getRiskBand(item.riskScore);
                const sevColor = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.Low;
                const daysOverdue = item.daysOverdue || 0;

                return (
                  <tr
                    key={item.id}
                    className="border-t border-border-soft hover:bg-bg-surface-tint/50 transition-colors"
                  >
                    {/* Risk Score Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 font-bold text-xs ${band.bg} ${band.color}`}
                      >
                        {formatRiskScore(item.riskScore)}
                      </span>
                    </td>

                    {/* POA&M ID */}
                    <td className="px-4 py-3 font-semibold text-text-primary whitespace-nowrap">
                      {item.id}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 text-text-secondary max-w-[220px]" title={item.title}>
                      {truncate(item.title)}
                    </td>

                    {/* Severity Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium text-xs ${sevColor.bg} ${sevColor.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${sevColor.dot}`} />
                        {item.severity}
                      </span>
                    </td>

                    {/* Days Overdue */}
                    <td className={`px-4 py-3 text-right font-semibold ${daysOverdue > 0 ? 'text-red-600' : 'text-text-muted'}`}>
                      {daysOverdue > 0 ? `${daysOverdue}d` : '—'}
                    </td>

                    {/* POC */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* Avatar initials */}
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
                          {item.responsiblePOC
                            ? item.responsiblePOC
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                            : '??'}
                        </div>
                        <span className="text-text-secondary text-xs">
                          {item.responsiblePOC?.split(' ')[1] || item.responsiblePOC}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
