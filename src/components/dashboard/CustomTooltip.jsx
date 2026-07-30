/**
 * Custom dark tooltip for all Recharts charts.
 * Design system: accent-dark bg, white text, rounded-xl, no border, drop shadow.
 */
export const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="recharts-custom-tooltip">
      {label && <div className="tooltip-label">{label}</div>}
      {payload.map((entry, index) => (
        <div key={index} className="tooltip-value">
          {formatter
            ? formatter(entry.value, entry.name, entry)
            : `${entry.name}: ${entry.value}`}
        </div>
      ))}
    </div>
  );
};
