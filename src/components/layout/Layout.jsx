import { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';

export const Layout = ({ currentPage, setCurrentPage, itemCounts, lastUpdated, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-canvas">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-accent-dark/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden md:flex'
        } fixed top-0 left-0 z-50 h-screen w-60 flex-col bg-white border-r border-slate-200 md:static md:z-auto`}
      >
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            setSidebarOpen(false);
          }}
        />
      </aside>

      {/* Main wrapper */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          currentPage={currentPage}
          toggleSidebar={toggleSidebar}
          itemCounts={itemCounts}
          lastUpdated={lastUpdated}
        />

        <main className="flex-1 overflow-y-auto bg-bg-canvas p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
