import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SEVERITY_CHART_COLORS = {
  Critical: '#DC2626',
  High: '#EA580C',
  Moderate: '#D97706',
  Low: '#16A34A',
};

const SEVERITY_ORDER = ['Critical', 'High', 'Moderate', 'Low'];

/**
 * Custom dark tooltip for the severity donut chart
 */
const SeverityTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const { name, value, percent } = payload[0].payload;
  return (
    <div className="recharts-custom-tooltip">
      <div className="tooltip-label">{name}</div>
      <div className="tooltip-value">
        {value} item{value !== 1 ? 's' : ''} ({(percent * 100).toFixed(0)}%)
      </div>
    </div>
  );
};

/**
 * Custom legend below the donut showing severity name + count
 */
const SeverityLegend = ({ payload }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium">{entry.value}</span>
          <span className="text-text-muted">({entry.payload.count})</span>
        </div>
      ))}
    </div>
  );
};

/**
 * SeverityBreakdownChart — donut chart showing ALL items by severity.
 * Features a centered total count label and custom dark tooltips.
 */
export const SeverityBreakdownChart = ({ enrichedItems }) => {
  const { data, total } = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) {
      return { data: [], total: 0 };
    }

    // Exclude cancelled items from severity breakdown 
    const activeItems = enrichedItems.filter((i) => i.status !== 'Cancelled');
    const totalCount = activeItems.length;

    const counts = {};
    SEVERITY_ORDER.forEach((s) => (counts[s] = 0));
    activeItems.forEach((i) => {
      if (counts[i.severity] !== undefined) counts[i.severity]++;
    });

    const chartData = SEVERITY_ORDER.map((sev) => ({
      name: sev,
      count: counts[sev],
      value: counts[sev],
      percent: totalCount > 0 ? counts[sev] / totalCount : 0,
      fill: SEVERITY_CHART_COLORS[sev],
    })).filter((d) => d.count > 0);

    return { data: chartData, total: totalCount };
  }, [enrichedItems]);

  return (
    <div className="card-float rounded-3xl p-7" id="chart-severity-breakdown">
      <h3 className="text-base font-semibold text-text-primary mb-5">
        Severity Breakdown
      </h3>

      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<SeverityTooltip />} />
            <Legend content={<SeverityLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Donut center label — absolute over the chart center */}
        <div className="donut-center-label">
          <div className="text-3xl font-extrabold tracking-tight text-text-primary">
            {total}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Total
          </div>
        </div>
      </div>
    </div>
  );
};
