import { useMemo, useState } from 'react';
import { exportToCSV } from '../utils/exportCSV.js';
import { ConfirmDialog } from '../components/shared/ConfirmDialog.jsx';

export const Reports = ({ enrichedItems, resetToSeedData, showToast }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 1. Report Date
  const reportDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // 2. Executive Summary Metrics
  const metrics = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) return null;

    const total = enrichedItems.length;
    const active = enrichedItems.filter(i => i.status === 'Open' || i.status === 'In Progress');
    const openCount = active.length;
    const completed = enrichedItems.filter(i => i.status === 'Completed').length;
    const completedRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const nonCompleted = enrichedItems.filter(i => i.status !== 'Completed' && i.status !== 'Cancelled' && i.status !== 'Risk Accepted');
    const slaBreaches = nonCompleted.filter(i => i.slaStatus === 'Overdue' || i.slaStatus === 'Severely Overdue').length;
    const slaBreachRate = nonCompleted.length > 0 ? Math.round((slaBreaches / nonCompleted.length) * 100) : 0;

    const totalRiskScore = active.reduce((sum, item) => sum + (Number(item.riskScore) || 0), 0);
    const avgRiskScore = openCount > 0 ? (totalRiskScore / openCount).toFixed(1) : '0.0';

    const criticalHighOpen = active.filter(i => i.severity === 'Critical' || i.severity === 'High').length;

    // Highest risk item
    let topRiskItem = null;
    if (active.length > 0) {
      topRiskItem = active.reduce((highest, current) => 
        (Number(current.riskScore) || 0) > (Number(highest.riskScore) || 0) ? current : highest
      );
    }

    return {
      total,
      openCount,
      completed,
      completedRate,
      slaBreachRate,
      avgRiskScore,
      criticalHighOpen,
      topRiskItem
    };
  }, [enrichedItems]);

  // 3. By Control Family Data
  const familyData = useMemo(() => {
    if (!enrichedItems) return [];
    
    const map = new Map();
    
    enrichedItems.forEach(item => {
      if (!map.has(item.controlFamily)) {
        map.set(item.controlFamily, {
          code: item.controlFamily,
          name: item.controlFamilyName || 'Unknown',
          total: 0,
          open: 0,
          overdue: 0,
          severelyOverdue: 0,
          totalRisk: 0,
          activeCount: 0
        });
      }
      
      const stat = map.get(item.controlFamily);
      stat.total += 1;
      
      if (item.status === 'Open' || item.status === 'In Progress') {
        stat.open += 1;
        stat.totalRisk += (Number(item.riskScore) || 0);
        stat.activeCount += 1;
      }
      
      if (item.slaStatus === 'Overdue') stat.overdue += 1;
      if (item.slaStatus === 'Severely Overdue') stat.severelyOverdue += 1;
    });

    const result = Array.from(map.values()).map(f => {
      let status = 'On Track';
      let statusColor = 'text-green-600 bg-green-50';
      if (f.severelyOverdue > 0) {
        status = 'Needs Attention';
        statusColor = 'text-red-600 bg-red-50';
      } else if (f.overdue > 0) {
        status = 'Monitor';
        statusColor = 'text-orange-600 bg-orange-50';
      }

      return {
        ...f,
        avgRisk: f.activeCount > 0 ? (f.totalRisk / f.activeCount).toFixed(1) : '0.0',
        status,
        statusColor
      };
    });

    result.sort((a, b) => Number(b.avgRisk) - Number(a.avgRisk));
    return result;
  }, [enrichedItems]);

  // 4. By Responsible POC Data
  const pocData = useMemo(() => {
    if (!enrichedItems) return [];
    
    const map = new Map();
    
    enrichedItems.forEach(item => {
      const poc = item.responsiblePOC || 'Unassigned';
      if (!map.has(poc)) {
        map.set(poc, {
          name: poc,
          assigned: 0,
          open: 0,
          overdue: 0,
          totalRisk: 0,
          activeCount: 0
        });
      }
      
      const stat = map.get(poc);
      stat.assigned += 1;
      
      if (item.status === 'Open' || item.status === 'In Progress') {
        stat.open += 1;
        stat.totalRisk += (Number(item.riskScore) || 0);
        stat.activeCount += 1;
      }
      
      if (item.slaStatus === 'Overdue' || item.slaStatus === 'Severely Overdue') {
        stat.overdue += 1;
      }
    });

    const result = Array.from(map.values()).map(p => {
      const overdueRateNum = p.assigned > 0 ? (p.overdue / p.assigned) * 100 : 0;
      let rateColor = 'text-green-600';
      if (overdueRateNum > 30) rateColor = 'text-red-600';
      else if (overdueRateNum >= 10) rateColor = 'text-amber-500';

      return {
        ...p,
        avgRisk: p.activeCount > 0 ? (p.totalRisk / p.activeCount).toFixed(1) : '0.0',
        overdueRate: Math.round(overdueRateNum),
        rateColor
      };
    });

    result.sort((a, b) => b.overdueRate - a.overdueRate);
    return result;
  }, [enrichedItems]);

  const handleResetConfirm = () => {
    const res = resetToSeedData();
    setShowResetConfirm(false);
    if (res && res.success) {
      showToast('Data reset to original seed state successfully.', 'info');
    }
  };

  const handleExport = (type) => {
    let itemsToExport = enrichedItems;
    let filename = 'poam_export_all.csv';

    if (type === 'open') {
      itemsToExport = enrichedItems.filter(i => i.status === 'Open' || i.status === 'In Progress');
      filename = 'poam_export_open.csv';
    } else if (type === 'overdue') {
      itemsToExport = enrichedItems.filter(i => i.slaStatus === 'Overdue' || i.slaStatus === 'Severely Overdue');
      filename = 'poam_export_overdue.csv';
    }

    exportToCSV(itemsToExport, filename);
  };

  if (!metrics) return null;

  const overdueOnlyCount = enrichedItems.filter(i => i.slaStatus === 'Overdue' || i.slaStatus === 'Severely Overdue').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reports & Export</h1>
        <p className="mt-1 text-sm text-text-secondary">POA&M Status Summary for Audit</p>
      </div>

      <div className="card-float rounded-3xl p-6 border border-border-soft space-y-8 bg-white">
        {/* Report Date */}
        <div>
          <p className="text-sm font-semibold text-text-primary">Generated: {reportDate}</p>
          <p className="text-sm text-text-secondary">Data reflects current state as of {reportDate}</p>
        </div>

        {/* Executive Summary Section */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Executive Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <MetricCard title="Total POA&M Items" value={metrics.total} />
            <MetricCard title="Open + In Progress" value={metrics.openCount} />
            <MetricCard title="Completed" value={metrics.completed} subtext={`(${metrics.completedRate}% of total)`} />
            <MetricCard title="SLA Breach Rate" value={`${metrics.slaBreachRate}%`} />
            <MetricCard title="Average Risk Score" value={metrics.avgRiskScore} />
            <MetricCard title="Critical/High Open" value={metrics.criticalHighOpen} />
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-border-soft text-sm text-text-primary leading-relaxed">
            As of {reportDate}, the system has {metrics.openCount} open security findings requiring remediation. {overdueOnlyCount} items ({metrics.slaBreachRate}%) are currently breaching their SLA deadlines. {metrics.topRiskItem ? `The highest-risk finding is '${metrics.topRiskItem.title}' (${metrics.topRiskItem.severity}, ${metrics.topRiskItem.daysOverdue || 0} days overdue) with a risk score of ${Number(metrics.topRiskItem.riskScore).toFixed(1)}.` : ''} {metrics.criticalHighOpen} critical and high severity items remain open.
          </div>
        </section>

        <hr className="border-t border-border-soft" />

        {/* By Control Family Section */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">By Control Family</h2>
          <div className="overflow-x-auto rounded-xl border border-border-soft">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Family Code</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Family Name</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Total</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Open</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Overdue</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Avg Risk Score</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {familyData.map(f => (
                  <tr key={f.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{f.code}</td>
                    <td className="px-4 py-3 text-text-secondary">{f.name}</td>
                    <td className="px-4 py-3 text-text-primary">{f.total}</td>
                    <td className="px-4 py-3 text-text-primary">{f.open}</td>
                    <td className="px-4 py-3 text-text-primary">{f.overdue + f.severelyOverdue}</td>
                    <td className="px-4 py-3 text-text-primary">{f.avgRisk}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${f.statusColor}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {familyData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-text-secondary">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-t border-border-soft" />

        {/* By Responsible POC Section */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">By Responsible POC</h2>
          <div className="overflow-x-auto rounded-xl border border-border-soft">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Responsible POC</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Assigned</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Open</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Overdue</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Avg Risk Score</th>
                  <th className="px-4 py-3 font-semibold text-text-secondary">Overdue Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {pocData.map(p => (
                  <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{p.name}</td>
                    <td className="px-4 py-3 text-text-primary">{p.assigned}</td>
                    <td className="px-4 py-3 text-text-primary">{p.open}</td>
                    <td className="px-4 py-3 text-text-primary">{p.overdue}</td>
                    <td className="px-4 py-3 text-text-primary">{p.avgRisk}</td>
                    <td className={`px-4 py-3 font-bold ${p.rateColor}`}>
                      {p.overdueRate}%
                    </td>
                  </tr>
                ))}
                {pocData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-text-secondary">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-t border-border-soft" />

        {/* Full Export Section */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Full Export</h2>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <button
              onClick={() => handleExport('all')}
              className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-primary-hover focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export All Items ({enrichedItems.length})
            </button>
            <button
              onClick={() => handleExport('open')}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-text-primary shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors"
            >
              Export Open Items Only ({metrics.openCount})
            </button>
            <button
              onClick={() => handleExport('overdue')}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-text-primary shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 transition-colors"
            >
              Export Overdue Items ({overdueOnlyCount})
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-8">
            CSV exports include: POA&M ID, title, status, severity, control, asset, responsible POC, dates, SLA status, risk score, and milestone notes.
          </p>

          <div className="pt-6 border-t border-red-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
              <p className="text-xs text-gray-500 mt-1">Reset all modified data back to the original 28 seed items.</p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Reset to Seed Data
            </button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetConfirm}
        title="Reset to Seed Data"
        message="This will reset all POA&M data to the original 28 seed items. All changes, additions, and deletions will be permanently lost."
        confirmLabel="Reset Data"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

const MetricCard = ({ title, value, subtext }) => (
  <div className="flex flex-col p-4 bg-bg-surface-tint rounded-2xl border border-border-soft">
    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</span>
    <span className="text-2xl font-bold text-text-primary mt-1">{value}</span>
    {subtext && <span className="text-xs font-medium text-text-secondary mt-1">{subtext}</span>}
  </div>
);
