# TECHNICAL ARCHITECTURE

## Application Overview

POA&M Tracker is a fully client-side React single-page application (SPA) designed for cybersecurity GRC teams. It loads realistic seed data from a static JSON file, persists all POAM records in the browser's `localStorage`, and dynamically computes SLA aging and risk scores at runtime. The user interface is organized around a fixed sidebar layout with three tab-based "routes" — Dashboard, Tracker, and Reports — implemented entirely with React `useState` rather than an external routing library.

## Why No Backend

The application intentionally avoids a backend database or API server:

- **Demo-first deployment**: The project runs anywhere a static file server is available (including GitHub Pages). No environment variables, database credentials, or server setup are required.
- **Local persistence**: All POAM data is stored in `localStorage` under the key `poam_tracker_data`. On first visit the app fetches `public/data/poams.json` and seeds `localStorage`; subsequent visits read directly from `localStorage`.
- **Tradeoffs**: Data is scoped to the current browser and not shared across devices or users. This is acceptable for a portfolio/demo tool but would be replaced with a persisted backend in a production multi-user system.

## Why No Routing Library

Navigation is handled by a single `currentPage` string in `App.jsx` rather than React Router or a similar library:

- **Self-contained scope**: The app only has three top-level views. A full routing library adds complexity without meaningful benefit.
- **No extra dependencies**: Keeping the project dependency-light aligns with the portfolio/demo context and reduces bundle size.
- **Predictable state**: The active view is just React state, making it trivial to reset, test, and synchronize with the sidebar and main content area.

## Component Hierarchy

```
App
├── usePOAMs (hook)
├── useFilters (hook)
└── Layout
    ├── Sidebar
    ├── TopBar
    └── children
        ├── Dashboard
        ├── Tracker
        └── Reports
```

## Data Flow

```
┌──────────────────┐
│ public/data/     │
│ poams.json       │
└────────┬─────────┘
         │ first visit / reset
         ▼
┌──────────────────┐
│ localStorage     │
│ poam_tracker_data│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ usePOAMs hook    │
│ - items          │
│ - enrichedItems  │
│   (risk + aging) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ App.jsx          │
│ - itemCounts     │
│ - currentPage    │
└────────┬─────────┘
         │
         ├──► Dashboard  (enrichedItems)
         ├──► Tracker    (enrichedItems + CRUD + filters)
         └──► Reports    (enrichedItems)
```

## State Ownership Table

| State | Owner | Notes |
|-------|-------|-------|
| `items` (raw POAM data) | `usePOAMs` | Loaded from `localStorage`; source of truth for stored fields. |
| `enrichedItems` | `usePOAMs` | Computed via `calculateRiskForAll`. Includes `slaStatus`, `daysOverdue`, and `riskScore`. |
| `isLoading` / `error` | `usePOAMs` | Tracks seed data initialization status. |
| CRUD handlers | `usePOAMs` | `addPOAM`, `updatePOAM`, `deletePOAM`, `resetToSeedData`. |
| `currentPage` | `App.jsx` | Determines active route (`dashboard`, `tracker`, `reports`). |
| `itemCounts` | `App.jsx` | Derived from `enrichedItems` with `useMemo`. |
| Filter / search / sort state | `useFilters` | Owned by the hook; applied via `applyFilters`. |
| `sidebarOpen` | `Layout.jsx` | Mobile-only UI state for sidebar visibility. |

## Prop Drilling Map

### `App.jsx` → `Layout`
- `currentPage`
- `setCurrentPage`
- `itemCounts`
- `children` (active page component)

### `Layout` → `Sidebar`
- `currentPage`
- `setCurrentPage` (wrapped to also close mobile sidebar)

### `Layout` → `TopBar`
- `currentPage`
- `toggleSidebar`
- `itemCounts`

### `App.jsx` → Pages
| Page | Props |
|------|-------|
| `Dashboard` | `enrichedItems` |
| `Tracker` | `enrichedItems`, `addPOAM`, `updatePOAM`, `deletePOAM`, `resetToSeedData`, and all filter state/functions from `useFilters` |
| `Reports` | `enrichedItems` |

## Build and Deployment

### Development
```bash
npm run dev
```
This starts the Vite dev server. Open the provided localhost URL in a browser. Because the app fetches `public/data/poams.json`, it must be served over HTTP rather than opened via `file://`.

### Production Build
```bash
npm run build
```
Generates the static bundle in the `dist/` directory. The `vite.config.js` sets `base: "./"` so assets use relative paths, which is required for GitHub Pages deployments.

### GitHub Pages Deployment
1. Run `npm run build`.
2. Push the contents of the `dist/` folder to the desired GitHub Pages branch (commonly `gh-pages`), or configure an Actions workflow to do this automatically on pushes to `main`.
3. The relative `base` path ensures fonts, scripts, and the seed JSON load correctly from the Pages URL.

## Security Considerations for a Portfolio App

While this application manages "vulnerabilities" and "security findings," it is built specifically as a portfolio demonstration. The architecture reflects this:

- **No Sensitive Data Stored**: The application does not connect to actual government databases or scanners. The seed data provided is entirely fictional and for demonstration purposes only.
- **Local Storage Only**: Any modifications, additions, or PII (e.g., Point of Contact names) entered into the application are stored entirely within the user's browser `localStorage`. No data is transmitted to an external server.
- **Data Volatility**: Because data is stored in `localStorage`, it will be completely erased if the user clears their browser data or uses incognito mode.
- **No Authentication**: The application lacks login, session management, or authorization controls. This is appropriate for a public-facing portfolio piece, but unacceptable for production.

### Requirements for a True Production Deployment
If this architecture were to be adapted for a real federal environment, the following major architectural shifts would be required:
1. **Backend API**: A secure backend (e.g., Node.js, Python/Django, Go) to handle database queries, validation, and business logic.
2. **Relational Database**: A proper relational database (e.g., PostgreSQL) to ensure data integrity, audit logging, and complex joins.
3. **Authentication & Authorization**: Integration with federal Identity Providers (IdP) via SAML or OIDC (e.g., Okta, Login.gov) and strict Role-Based Access Control (RBAC).
4. **Audit Trails**: Immutable logging of all creation, modification, and deletion events for compliance.
