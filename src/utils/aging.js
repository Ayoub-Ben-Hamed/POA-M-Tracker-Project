import { SLA_THRESHOLDS } from './constants.js';
import { daysBetween, todayISO } from './dateHelpers.js';

export const getSLAThreshold = (severity) => {
  return SLA_THRESHOLDS[severity] || 365;
};

export const calculateAgingForItem = (item) => {
  const today = todayISO();
  
  // 1. daysOpen
  const daysOpen = daysBetween(item.dateIdentified, today);
  
  // 2. daysUntilMilestone
  const daysUntilMilestone = daysBetween(today, item.scheduledCompletionDate);
  
  // 3. daysOverdue
  let daysOverdue = 0;
  if (item.dateOfClosure) {
    const overdueAtClosure = daysBetween(item.scheduledCompletionDate, item.dateOfClosure);
    daysOverdue = overdueAtClosure > 0 ? overdueAtClosure : 0;
  } else {
    daysOverdue = daysUntilMilestone < 0 ? Math.abs(daysUntilMilestone) : 0;
  }
  
  // 4. slaAllowedDays
  const slaAllowedDays = getSLAThreshold(item.severity);
  
  // 5. slaStatus
  let slaStatus = "On Track";
  if (item.dateOfClosure) {
    slaStatus = "Completed";
  } else if (daysOverdue > 30) {
    slaStatus = "Severely Overdue";
  } else if (daysOverdue > 0) {
    slaStatus = "Overdue";
  } else if (daysUntilMilestone <= 14) {
    slaStatus = "At Risk";
  }
  
  // 6. slaPercentUsed
  let percent = (daysOpen / slaAllowedDays) * 100;
  if (percent < 0) percent = 0;
  const slaPercentUsed = Math.min(200, percent);
  
  return {
    daysOpen,
    daysUntilMilestone,
    daysOverdue,
    slaAllowedDays,
    slaStatus,
    slaPercentUsed
  };
};

export const isOverdue = (item) => {
  const { daysOverdue, slaStatus } = calculateAgingForItem(item);
  return daysOverdue > 0 && slaStatus !== "Completed";
};

export const getDaysOverdue = (item) => {
  return calculateAgingForItem(item).daysOverdue;
};

export const calculateAgingForAll = (items) => {
  return items.map(item => {
    const agingData = calculateAgingForItem(item);
    return {
      ...item,
      ...agingData
    };
  });
};
