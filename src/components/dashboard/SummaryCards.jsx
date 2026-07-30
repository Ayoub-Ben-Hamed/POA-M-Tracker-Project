import { useMemo } from 'react';
import { getRiskBand } from '../../utils/constants.js';
import { useRiskScore } from '../../hooks/useRiskScore.js';

/**
 * SummaryCards — four KPI metric cards across the top of the dashboard.
 * Pure display component. Receives enrichedItems via props.
 * All data computation happens in useMemo.
 */
export const SummaryCards = ({ enrichedItems }) => {
  const { getRiskColor } = useRiskScore();

  const metrics = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) {
      return {
        openCount: 0,
        inProgressCount: 0,
        pureOpenCount: 0,
        overdueCount: 0,
        severelyOverdueCount: 0,
        avgRiskScore: 0,
        riskBand: getRiskBand(0),
        closedThisMonth: 0,
        totalCompleted: 0,
      };
    }

    const openItems = enrichedItems.filter(
      (i) => i.status === 'Open' || i.status === 'In Progress'
    );
    const openCount = openItems.length;
    const inProgressCount = enrichedItems.filter(
      (i) => i.status === 'In Progress'
    ).length;
    const pureOpenCount = enrichedItems.filter(
      (i) => i.status === 'Open'
    ).length;

    const overdueItems = enrichedItems.filter(
      (i) => i.slaStatus === 'Overdue' || i.slaStatus === 'Severely Overdue'
    );
    const overdueCount = overdueItems.length;
    const severelyOverdueCount = enrichedItems.filter(
      (i) => i.slaStatus === 'Severely Overdue'
    ).length;

    // Average risk score of open + in-progress items
    let avgRiskScore = 0;
    if (openItems.length > 0) {
      const totalRisk = openItems.reduce((sum, i) => sum + (i.riskScore || 0), 0);
      avgRiskScore = totalRisk / openItems.length;
    }
    const riskBand = getRiskBand(avgRiskScore);

    // Completed this month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const completedItems = enrichedItems.filter((i) => i.status === 'Completed');
    const closedThisMonth = completedItems.filter((i) => {
      if (!i.dateOfClosure) return false;
      const d = new Date(i.dateOfClosure + 'T00:00:00');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return {
      openCount,
      inProgressCount,
      pureOpenCount,
      overdueCount,
      severelyOverdueCount,
      avgRiskScore,
      riskBand,
      closedThisMonth,
      totalCompleted: completedItems.length,
    };
  }, [enrichedItems]);

  const cards = [
    {
      id: 'summary-open',
      value: metrics.openCount,
      label: 'Open POA&Ms',
      subtext: `${metrics.inProgressCount} In Progress, ${metrics.pureOpenCount} Open`,
      accentColor: '#3B82F6',
      bgTint: '',
    },
    {
      id: 'summary-overdue',
      value: metrics.overdueCount,
      label: 'SLA Breaches',
      subtext: `${metrics.severelyOverdueCount} Severely Overdue`,
      accentColor: '#DC2626',
      bgTint: metrics.overdueCount > 0 ? 'bg-red-50/60' : '',
    },
    {
      id: 'summary-risk',
      value: metrics.avgRiskScore.toFixed(1),
      label: 'Avg Risk Score',
      subtext: metrics.riskBand.label,
      subtextColor: getRiskColor(metrics.avgRiskScore),
      accentColor: '#F97316',
      bgTint: '',
    },
    {
      id: 'summary-closed',
      value: metrics.closedThisMonth,
      label: 'Closed This Month',
      subtext: `${metrics.totalCompleted} total completed`,
      accentColor: '#16A34A',
      bgTint: '',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className={`card-float rounded-3xl p-7 border-l-4 ${card.bgTint}`}
          style={{ borderLeftColor: card.accentColor }}
        >
          <div className="text-4xl font-extrabold tracking-tight text-text-primary">
            {card.value}
          </div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-text-secondary">
            {card.label}
          </div>
          <div className={`mt-1.5 text-xs ${card.subtextColor || 'text-text-muted'}`}>
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};
