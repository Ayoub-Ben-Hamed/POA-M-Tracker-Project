import { calculateAgingForAll } from './aging.js';

export const getSeverityBase = (severity) => {
  switch (severity) {
    case 'Critical': return 10;
    case 'High': return 7;
    case 'Moderate': return 4;
    case 'Low': return 1;
    default: return 1;
  }
};

export const getAssetMultiplier = (assetCriticality) => {
  switch (assetCriticality) {
    case 'Critical': return 1.5;
    case 'High': return 1.25;
    case 'Moderate': return 1.0;
    case 'Low': return 0.75;
    default: return 1.0;
  }
};

export const getOverdueMultiplier = (daysOverdue) => {
  if (daysOverdue === 0) return 1.0;
  if (daysOverdue >= 1 && daysOverdue <= 30) {
    return 1.0 + (daysOverdue / 30) * 0.3;
  }
  if (daysOverdue >= 31 && daysOverdue <= 90) {
    return 1.3 + ((daysOverdue - 30) / 60) * 0.4;
  }
  return 2.0; // > 90
};

export const calculateRiskScore = (item, agingData) => {
  if (item.status === 'Completed' || item.status === 'Cancelled') {
    return 0.0;
  }
  
  const severityBase = getSeverityBase(item.severity);
  const assetMultiplier = getAssetMultiplier(item.assetCriticality);
  const overdueMultiplier = getOverdueMultiplier(agingData.daysOverdue);
  
  const rawScore = severityBase * assetMultiplier * overdueMultiplier;
  let finalScore = Math.min(10, rawScore);
  
  if (item.status === 'Risk Accepted') {
    finalScore = Math.min(5.0, finalScore);
  }
  
  return Number(finalScore.toFixed(2));
};

export const calculateRiskForAll = (items) => {
  const itemsWithAging = calculateAgingForAll(items);
  
  return itemsWithAging.map(item => {
    // The agingData is already merged into item, so we pass it as the second arg
    const riskScore = calculateRiskScore(item, item);
    return {
      ...item,
      riskScore
    };
  });
};
