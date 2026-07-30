import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const SEVERITY_FILL = {
  Critical: '#EF4444',
  High: '#F97316',
  Moderate: '#F59E0B',
  Low: '#22C55E',
};

/**
 * Determines bar color based on the highest severity among open items in a family.
 */
const getBarColor = (items) => {
  const severityOrder = ['Critical', 'High', 'Moderate', 'Low'];
  for (const sev of severityOrder) {
    if (items.some((i) => i.severity === sev)) {
      return SEVERITY_FILL[sev];
    }
  }
  return SEVERITY_FILL.Low;
};

/**
 * Custom dark tooltip for the bar chart
 */
const FamilyTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div className="recharts-custom-tooltip">
      <div className="tooltip-label">{data.familyName}</div>
      <div className="tooltip-value">{data.count} open item{data.count !== 1 ? 's' : ''}</div>
    </div>
  );
};

/**
 * OpenByFamilyChart — horizontal bar chart of open items grouped by NIST control family.
 * Bars colored by highest severity in each family.
 * Uses layout="vertical" for horizontal bars per spec.
 */
export const OpenByFamilyChart = ({ enrichedItems }) => {
  const chartData = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) return [];

    const openItems = enrichedItems.filter(
      (i) => i.status === 'Open' || i.status === 'In Progress'
    );

    // Group by control family
    const familyMap = {};
    openItems.forEach((item) => {
      const family = item.controlFamily;
      if (!familyMap[family]) {
        familyMap[family] = {
          family,
          familyName: item.controlFamilyName,
          count: 0,
          items: [],
        };
      }
      familyMap[family].count++;
      familyMap[family].items.push(item);
    });

    // Convert to array, sort descending by count, only families with ≥1 open item
    return Object.values(familyMap)
      .filter((f) => f.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((f) => ({
        family: f.family,
        familyName: f.familyName,
        count: f.count,
        color: getBarColor(f.items),
      }));
  }, [enrichedItems]);

  if (chartData.length === 0) {
    return (
      <div className="card-float rounded-3xl p-7">
        <h3 className="text-base font-semibold text-text-primary">
          Open Items by Control Family
        </h3>
        <p className="mt-4 text-sm text-text-muted">No open items found.</p>
      </div>
    );
  }

  return (
    <div className="card-float rounded-3xl p-7" id="chart-open-by-family">
      <h3 className="text-base font-semibold text-text-primary mb-5">
        Open Items by Control Family
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(26,29,41,0.04)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="family"
            tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<FamilyTooltip />} cursor={{ fill: 'rgba(26,29,41,0.03)' }} />
          <Bar
            dataKey="count"
            radius={[0, 8, 8, 0]}
            barSize={22}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
