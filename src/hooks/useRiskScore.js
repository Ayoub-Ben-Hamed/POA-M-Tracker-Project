import { getRiskBand } from '../utils/constants.js';

export const useRiskScore = () => {
  const formatRiskScore = (score) => {
    return Number(score).toFixed(1);
  };

  const getRiskColor = (score) => {
    if (score >= 8.0) return "text-red-700";
    if (score >= 6.0) return "text-orange-700";
    if (score >= 3.0) return "text-amber-700";
    return "text-green-700";
  };

  const getTopRiskItems = (enrichedItems, n = 5) => {
    if (!enrichedItems) return [];
    
    const activeItems = enrichedItems.filter(
      item => item.status !== 'Completed' && item.status !== 'Cancelled'
    );
    
    return activeItems
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, n);
  };

  return {
    getRiskBand,
    formatRiskScore,
    getRiskColor,
    getTopRiskItems
  };
};
