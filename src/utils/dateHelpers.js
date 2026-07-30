export const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const daysBetween = (dateA, dateB) => {
  const dA = new Date(dateA + 'T00:00:00');
  const dB = new Date(dateB + 'T00:00:00');
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((dB - dA) / msPerDay);
};

export const daysFromToday = (isoString) => {
  return daysBetween(todayISO(), isoString);
};

export const isDatePast = (isoString) => {
  return daysFromToday(isoString) < 0;
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateShort = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  });
};

export const addDays = (isoString, days) => {
  const d = new Date(isoString + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
