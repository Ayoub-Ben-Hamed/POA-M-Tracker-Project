const navigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'tracker',
    label: 'POA&M Tracker',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 5-6" />
      </svg>
    ),
  },
];

export const Sidebar = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="flex h-full flex-col">
      {/* Logo area */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-text-primary leading-tight">
            POA&M Tracker
          </span>
          <span className="text-xs font-medium text-text-secondary">
            GRC Compliance Tool
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-l-[3px] border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-l-[3px] border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs font-medium text-gray-400">
        <p>NIST SP 800-53 Rev 5</p>
        <p className="mt-0.5">FedRAMP Aligned</p>
        <p className="mt-4 pt-4 border-t border-slate-200">Press <kbd className="font-mono bg-gray-100 text-gray-600 px-1 py-0.5 rounded border border-gray-200">N</kbd> to add new POA&M</p>
      </div>
    </div>
  );
};
