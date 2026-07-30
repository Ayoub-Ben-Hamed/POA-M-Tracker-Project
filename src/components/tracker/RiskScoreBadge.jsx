import { useRiskScore } from '../../hooks/useRiskScore.js';

export const RiskScoreBadge = ({ score }) => {
  const { formatRiskScore, getRiskColor, getRiskBand } = useRiskScore();
  
  if (score === undefined || score === null) return null;

  const band = getRiskBand(score);
  const formattedScore = formatRiskScore(score);
  const textColor = getRiskColor(score);

  return (
    <div className={`inline-flex flex-col items-center justify-center rounded-lg px-2 py-1 ${band.bg} min-w-[70px]`}>
      <span className={`text-lg font-bold ${textColor}`}>
        {formattedScore}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-text-muted mt-0.5">
        {band.label}
      </span>
    </div>
  );
};
