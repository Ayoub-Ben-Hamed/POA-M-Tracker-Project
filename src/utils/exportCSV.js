import { todayISO } from './dateHelpers.js';

export const exportToCSV = (items, filename = `poam-export-${todayISO()}.csv`) => {
  const headers = [
    "POA&M ID", "Title", "Status", "Severity", "Control ID", "Control Family",
    "Asset Affected", "Asset Criticality", "Responsible POC", "Date Identified",
    "Milestone Date", "Date of Closure", "Days Overdue", "SLA Status", "Risk Score", "Detection Source",
    "Milestone Notes", "Vendor Dependency", "Resource Estimate", "Last Updated"
  ];
  
  const formatCell = (value) => {
    if (value === null || value === undefined) return '';
    let stringValue = String(value);
    
    // Format dates if they look like YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
      const [year, month, day] = stringValue.split('-');
      stringValue = `${month}/${day}/${year}`;
    }
    
    // Wrap in quotes if it contains commas, quotes, or newlines
    if (/[,"\n]/.test(stringValue)) {
      stringValue = `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };
  
  const rows = items.map(item => {
    return [
      item.id,
      item.title,
      item.status,
      item.severity,
      item.controlId,
      item.controlFamily,
      item.assetAffected,
      item.assetCriticality,
      item.responsiblePOC,
      item.dateIdentified,
      item.scheduledCompletionDate,
      item.dateOfClosure,
      item.daysOverdue !== undefined ? item.daysOverdue : '',
      item.slaStatus || '',
      item.riskScore !== undefined ? item.riskScore : '',
      item.detectionSource,
      item.milestoneNotes,
      item.vendorDependency,
      item.resourceEstimate,
      item.lastUpdated
    ].map(formatCell).join(',');
  });
  
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
