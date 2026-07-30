import { useState, useMemo } from 'react';
import { usePOAMs } from './hooks/usePOAMs.js';
import { useFilters } from './hooks/useFilters.js';
import { Layout } from './components/layout/Layout.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Tracker } from './pages/Tracker.jsx';
import { Reports } from './pages/Reports.jsx';
import { Toast } from './components/shared/Toast.jsx';

function App() {
  const {
    isLoading,
    error,
    enrichedItems,
    addPOAM,
    updatePOAM,
    deletePOAM,
    resetToSeedData,
  } = usePOAMs();

  const filterState = useFilters();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const itemCounts = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) {
      return { open: 0, overdue: 0, critical: 0 };
    }

    const open = enrichedItems.filter(
      (item) => item.status === 'Open' || item.status === 'In Progress'
    ).length;

    const overdue = enrichedItems.filter(
      (item) => item.slaStatus === 'Overdue' || item.slaStatus === 'Severely Overdue'
    ).length;

    const critical = enrichedItems.filter(
      (item) => item.severity === 'Critical' && item.status !== 'Completed'
    ).length;

    return { open, overdue, critical };
  }, [enrichedItems]);

  const lastUpdated = useMemo(() => {
    if (!enrichedItems || enrichedItems.length === 0) return null;
    return enrichedItems.reduce((latest, item) => {
      if (!item.lastUpdated) return latest;
      return item.lastUpdated > latest ? item.lastUpdated : latest;
    }, '1970-01-01');
  }, [enrichedItems]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-bg-canvas">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-bg-surface-tint border-t-accent-primary" aria-label="Loading" />
        <p className="text-sm font-semibold text-text-secondary">
          Loading POA&M data…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-bg-canvas px-6 text-center">
        <div className="card-float max-w-md rounded-3xl p-8">
          <h2 className="text-xl font-bold text-text-primary">Unable to load data</h2>
          <p className="mt-2 text-sm text-text-secondary">{error}</p>
          <button
            type="button"
            onClick={resetToSeedData}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-primary-hover"
          >
            Reset to seed data
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'tracker':
        return (
          <Tracker
            enrichedItems={enrichedItems}
            addPOAM={addPOAM}
            updatePOAM={updatePOAM}
            deletePOAM={deletePOAM}
            resetToSeedData={resetToSeedData}
            showToast={showToast}
            {...filterState}
          />
        );
      case 'reports':
        return (
          <Reports 
            enrichedItems={enrichedItems} 
            resetToSeedData={resetToSeedData}
            showToast={showToast}
          />
        );
      case 'dashboard':
      default:
        return <Dashboard enrichedItems={enrichedItems} />;
    }
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemCounts={itemCounts}
        lastUpdated={lastUpdated}
      >
        {renderPage()}
      </Layout>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onDismiss={() => setToast(null)} 
        />
      )}
    </>
  );
}

export default App;
