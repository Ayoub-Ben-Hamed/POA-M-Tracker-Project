import { SummaryCards } from '../components/dashboard/SummaryCards.jsx';
import { OpenByFamilyChart } from '../components/dashboard/OpenByFamilyChart.jsx';
import { SeverityBreakdownChart } from '../components/dashboard/SeverityBreakdownChart.jsx';
import { SLAComplianceChart } from '../components/dashboard/SLAComplianceChart.jsx';
import { TopRiskTable } from '../components/dashboard/TopRiskTable.jsx';
import { TrendLineChart } from '../components/dashboard/TrendLineChart.jsx';

/**
 * Dashboard — overview page with charts and metrics.
 * Receives enrichedItems via props from App.jsx.
 * Loading/error states are handled at the App level.
 *
 * Layout (top to bottom):
 *  1. Summary Cards row (4 cards)
 *  2. Open by Family (60%) + Severity Breakdown (40%)
 *  3. SLA Compliance (40%) + Top 5 Risk Items (60%)
 *  4. Trend line chart (full width)
 */
export const Dashboard = ({ enrichedItems = [] }) => {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Real-time overview of POA&M remediation status and risk posture
        </p>
      </div>

      {/* Row 1: Summary Cards */}
      <SummaryCards enrichedItems={enrichedItems} />

      {/* Row 2: Open by Control Family (60%) + Severity Breakdown (40%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <OpenByFamilyChart enrichedItems={enrichedItems} />
        </div>
        <div className="lg:col-span-2">
          <SeverityBreakdownChart enrichedItems={enrichedItems} />
        </div>
      </div>

      {/* Row 3: SLA Compliance (40%) + Top 5 Risk Items (60%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SLAComplianceChart enrichedItems={enrichedItems} />
        </div>
        <div className="lg:col-span-3">
          <TopRiskTable enrichedItems={enrichedItems} />
        </div>
      </div>

      {/* Row 4: Trend line chart (full width) */}
      <TrendLineChart enrichedItems={enrichedItems} />
    </div>
  );
};
