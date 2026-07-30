import { useState, useMemo, useCallback, useEffect } from 'react';

const SEVERITY_ORDER = {
  Critical: 4,
  High: 3,
  Moderate: 2,
  Low: 1
};

const FILTER_STORAGE_KEY = 'poam_filter_prefs';

export const useFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterFamily, setFilterFamily] = useState('All');
  const [filterSLAStatus, setFilterSLAStatus] = useState('All');
  const [sortField, setSortField] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.searchQuery !== undefined) setSearchQuery(parsed.searchQuery);
        if (parsed.filterSeverity) setFilterSeverity(parsed.filterSeverity);
        if (parsed.filterStatus) setFilterStatus(parsed.filterStatus);
        if (parsed.filterFamily) setFilterFamily(parsed.filterFamily);
        if (parsed.filterSLAStatus) setFilterSLAStatus(parsed.filterSLAStatus);
        if (parsed.sortField) setSortField(parsed.sortField);
        if (parsed.sortDirection) setSortDirection(parsed.sortDirection);
      }
    } catch (e) {
      console.warn("Failed to load filter preferences", e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const prefs = {
      searchQuery,
      filterSeverity,
      filterStatus,
      filterFamily,
      filterSLAStatus,
      sortField,
      sortDirection
    };
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(prefs));
  }, [searchQuery, filterSeverity, filterStatus, filterFamily, filterSLAStatus, sortField, sortDirection]);

  const setFilter = useCallback((filterName, value) => {
    switch(filterName) {
      case 'filterSeverity': setFilterSeverity(value); break;
      case 'filterStatus': setFilterStatus(value); break;
      case 'filterFamily': setFilterFamily(value); break;
      case 'filterSLAStatus': setFilterSLAStatus(value); break;
      default: break;
    }
  }, []);

  const setSort = useCallback((field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setFilterSeverity('All');
    setFilterStatus('All');
    setFilterFamily('All');
    setFilterSLAStatus('All');
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterSeverity !== 'All') count++;
    if (filterStatus !== 'All') count++;
    if (filterFamily !== 'All') count++;
    if (filterSLAStatus !== 'All') count++;
    return count;
  }, [filterSeverity, filterStatus, filterFamily, filterSLAStatus]);

  const applyFilters = useCallback((itemsToFilter) => {
    if (!itemsToFilter) return [];
    
    // Filter
    let result = itemsToFilter.filter(item => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchString = `
          ${item.title} 
          ${item.description} 
          ${item.controlId} 
          ${item.assetAffected} 
          ${item.responsiblePOC}
        `.toLowerCase();
        
        if (!searchString.includes(query)) return false;
      }

      // Exact matches
      if (filterSeverity !== 'All' && item.severity !== filterSeverity) return false;
      if (filterStatus !== 'All' && item.status !== filterStatus) return false;
      if (filterFamily !== 'All' && item.controlFamily !== filterFamily) return false;
      if (filterSLAStatus !== 'All' && item.slaStatus !== filterSLAStatus) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      let comparison = 0;

      // Handle specific sorts
      if (sortField === 'severity') {
        valA = SEVERITY_ORDER[a.severity] || 0;
        valB = SEVERITY_ORDER[b.severity] || 0;
        comparison = valA - valB;
      } else if (sortField === 'riskScore' || sortField === 'daysOverdue') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        comparison = valA - valB;
      } else if (sortField === 'dateIdentified' || sortField === 'scheduledCompletionDate') {
        const dateA = new Date(valA || '1970-01-01').getTime();
        const dateB = new Date(valB || '1970-01-01').getTime();
        comparison = dateA - dateB;
      } else {
        // String fallback
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
        if (valA < valB) comparison = -1;
        if (valA > valB) comparison = 1;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [searchQuery, filterSeverity, filterStatus, filterFamily, filterSLAStatus, sortField, sortDirection]);

  return {
    searchQuery,
    setSearchQuery,
    filterSeverity,
    filterStatus,
    filterFamily,
    filterSLAStatus,
    sortField,
    sortDirection,
    setFilter,
    setSort,
    clearAllFilters,
    applyFilters,
    activeFilterCount
  };
};
