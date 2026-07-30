import { useState, useEffect, useMemo } from 'react';
import { calculateRiskForAll } from '../utils/riskScore.js';
import { todayISO } from '../utils/dateHelpers.js';

const STORAGE_KEY = 'poam_tracker_data';

export const usePOAMs = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          let parsedData = JSON.parse(storedData);
          let migrated = false;
          parsedData = parsedData.map(item => {
            const isClosed = item.status === 'Completed' || item.status === 'Risk Accepted' || item.status === 'Cancelled';
            if (isClosed && !item.dateOfClosure) {
              migrated = true;
              return { ...item, dateOfClosure: item.lastUpdated || todayISO() };
            }
            return item;
          });
          if (migrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
          }
          setItems(parsedData);
        } else {
          if (window.location.protocol === 'file:') {
            throw new Error('Application opened via file:// protocol. A local server is required to load seed data.');
          }
          const response = await fetch('./data/poams.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch seed data: ${response.statusText}`);
          }
          const data = await response.json();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setItems(data);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to initialize data');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const syncToStorage = (newItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const enrichedItems = useMemo(() => {
    return calculateRiskForAll(items);
  }, [items]);

  const addPOAM = (newItemData) => {
    try {
      if (!newItemData.title || !newItemData.title.trim()) {
        return { success: false, error: 'Title is required' };
      }
      if (!newItemData.severity) {
        return { success: false, error: 'Severity is required' };
      }
      if (!newItemData.dateIdentified || !newItemData.scheduledCompletionDate) {
        return { success: false, error: 'Dates are required' };
      }

      const currentYear = new Date().getFullYear();
      let maxNumber = 0;

      items.forEach(item => {
        const match = item.id.match(/^POAM-(\d{4})-(\d{3})$/);
        if (match && parseInt(match[1]) === currentYear) {
          const num = parseInt(match[2]);
          if (num > maxNumber) maxNumber = num;
        }
      });

      const nextNumber = String(maxNumber + 1).padStart(3, '0');
      const newId = `POAM-${currentYear}-${nextNumber}`;

      const isClosedStatus = newItemData.status === 'Completed' || newItemData.status === 'Risk Accepted' || newItemData.status === 'Cancelled';
      const newPOAM = {
        ...newItemData,
        id: newId,
        dateOfClosure: isClosedStatus ? todayISO() : (newItemData.dateOfClosure || null),
        lastUpdated: todayISO()
      };

      const newItems = [...items, newPOAM];
      syncToStorage(newItems);
      return { success: true, id: newId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePOAM = (id, updatedFields) => {
    try {
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        return { success: false, error: 'POAM not found' };
      }

      // Remove id and lastUpdated from updatedFields to prevent manual override
      const { id: _ignoreId, lastUpdated: _ignoreLastUpdated, ...safeFields } = updatedFields;

      const itemToUpdate = items[index];
      const mergedItem = { ...itemToUpdate, ...safeFields };

      const isClosedStatus = safeFields.status === 'Completed' || safeFields.status === 'Risk Accepted' || safeFields.status === 'Cancelled';
      if (isClosedStatus && mergedItem.dateOfClosure === null) {
        mergedItem.dateOfClosure = todayISO();
      } else if ((safeFields.status === 'Open' || safeFields.status === 'In Progress') && mergedItem.dateOfClosure !== null) {
        mergedItem.dateOfClosure = null;
      }

      mergedItem.lastUpdated = todayISO();

      const newItems = [...items];
      newItems[index] = mergedItem;

      syncToStorage(newItems);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deletePOAM = (id) => {
    try {
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        return { success: false, error: 'POAM not found' };
      }
      const newItems = items.filter(item => item.id !== id);
      syncToStorage(newItems);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetToSeedData = async () => {
    try {
      setIsLoading(true);
      if (window.location.protocol === 'file:') {
        throw new Error('Application opened via file:// protocol. A local server is required to load seed data.');
      }
      const response = await fetch('./data/poams.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch seed data: ${response.statusText}`);
      }
      const data = await response.json();
      syncToStorage(data);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to reset data');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getById = (id) => {
    return enrichedItems.find(item => item.id === id) || null;
  };

  return {
    items,
    enrichedItems,
    isLoading,
    error,
    addPOAM,
    updatePOAM,
    deletePOAM,
    resetToSeedData,
    getById
  };
};
