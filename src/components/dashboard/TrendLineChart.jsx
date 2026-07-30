import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Custom dark tooltip for the trend line chart
 */
const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="recharts-custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((entry, index) => (
        <div key={index} className="tooltip-value" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
};

/**
 * TrendLineChart — 12-month remediation trend with simulated historical data.
 *
 * For each of the past 12 months:
 *   openCount: items where dateIdentified <= that month end AND
 *              (status is Open/InProgress OR dateOfClosure > that month end)
 *   closedCumulative: items where dateOfClosure <= that month end
 *
 * This creates a realistic S-curve showing items accumulating then resolving.
 */
export const TrendLineChart = ({ enrichedItems }) => {
  const chartData = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) return [];

    const now = new Date();
    const months = [];

    // Generate last 12 months (current month - 11 to current month)
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      // End of month
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const endStr = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;

      const monthLabel = MONTH_LABELS[d.getMonth()];
      const yearSuffix = d.getFullYear() !== now.getFullYear() ? ` '${String(d.getFullYear()).slice(2)}` : '';

      months.push({
        label: `${monthLabel}${yearSuffix}`,
        endStr,
        endDate: endOfMonth,
      });
    }

    return months.map((month) => {
      // Items that were identified before or during this month
      const identifiedByMonth = enrichedItems.filter((item) => {
        return item.dateIdentified <= month.endStr;
      });

      // Open count: identified by this month AND still open at this point
      // (status is Open/InProgress, OR dateOfClosure is after this month)
      const openCount = identifiedByMonth.filter((item) => {
        // If completed before or during this month, it's not open
        if (item.dateOfClosure && item.dateOfClosure <= month.endStr) {
          return false;
        }
        // If cancelled, skip
        if (item.status === 'Cancelled') return false;
        // Otherwise it was still open at this point
        return true;
      }).length;

      // Closed cumulative: items completed by this month
      const closedCumulative = enrichedItems.filter((item) => {
        return item.dateOfClosure && item.dateOfClosure <= month.endStr;
      }).length;

      return {
        month: month.label,
        'Open Items': openCount,
        'Closed Items': closedCumulative,
      };
    });
  }, [enrichedItems]);

  if (chartData.length === 0) {
    return (
      <div className="card-float rounded-3xl p-7">
        <h3 className="text-base font-semibold text-text-primary">
          Remediation Trend (12 Months)
        </h3>
        <p className="mt-4 text-sm text-text-muted">Insufficient data for trend analysis.</p>
      </div>
    );
  }

  return (
    <div className="card-float rounded-3xl p-7" id="chart-trend-line">
      <h3 className="text-base font-semibold text-text-primary mb-5">
        Remediation Trend (12 Months)
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradientOpen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradientClosed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16A34A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16A34A" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(26,29,41,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<TrendTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingTop: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="Open Items"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#gradientOpen)"
            dot={false}
            activeDot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="Closed Items"
            stroke="#16A34A"
            strokeWidth={3}
            fill="url(#gradientClosed)"
            dot={false}
            activeDot={{ r: 5, fill: '#16A34A', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <p className="mt-3 text-xs text-text-muted">
        * Historical data derived from item dates
      </p>
    </div>
  );
};
