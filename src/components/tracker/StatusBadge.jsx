import { SEVERITY_COLORS, STATUS_COLORS, SLA_STATUS_COLORS } from '../../utils/constants.js';

export const StatusBadge = ({ type, value }) => {
  if (!value) return null;

  let colorSet = {};
  let showDot = true;

  if (type === 'severity') {
    colorSet = SEVERITY_COLORS[value] || SEVERITY_COLORS.Low;
  } else if (type === 'status') {
    colorSet = STATUS_COLORS[value] || STATUS_COLORS.Open;
    // Optionally don't show dot for some status? The design says: 
    // "Dot: small 6px circle before text for severity and sla badges"
    // Though STATUS_COLORS have 'dot' property, let's include it if present.
    showDot = !!colorSet.dot;
  } else if (type === 'sla') {
    colorSet = SLA_STATUS_COLORS[value] || SLA_STATUS_COLORS['On Track'];
    showDot = true;
  }

  // SLA_STATUS_COLORS uses border, but we just need a dot to match others if requested, 
  // let's derive a dot color from text color if not explicitly provided, or use border color.
  const dotColorClass = type === 'sla' 
    ? (value === 'On Track' ? 'bg-green-600' :
       value === 'At Risk' ? 'bg-amber-500' :
       value === 'Overdue' ? 'bg-orange-600' :
       value === 'Severely Overdue' ? 'bg-red-600' : 'bg-gray-500')
    : colorSet.dot;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${colorSet.bg} ${colorSet.text} whitespace-nowrap`}>
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColorClass}`} aria-hidden="true" />
      )}
      {value}
    </span>
  );
};
