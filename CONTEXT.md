# POAM TRACKER — PROJECT CONTEXT

> **Purpose**: This file is the single source of truth for any AI agent or developer working on this project. Read this file first before making any decisions.
> **Last Updated**: 2026-07-14 — After Prompt 6 (Tracker page and CRUD)

---

## What This Project Is

A **Plan of Action & Milestones (POA&M) Tracker** for cybersecurity GRC (Governance, Risk, and Compliance) teams. It is a federal-aligned tool used by security professionals to track remediation of security weaknesses found during audits, vulnerability scans, penetration tests, and continuous monitoring activities.

The application is a **fully client-side React SPA** with no backend. Data persists in `localStorage`. Seed data is loaded from a static JSON file on first visit.

This tool is designed for a **portfolio/demo context** — it showcases federal cybersecurity domain expertise and modern frontend development skills.

---

## Current Build Status

### ✅ Completed (Prompt 1)
- [x] Project scaffolded with Vite + React 19 + Tailwind CSS v4
- [x] Seed data created: `public/data/poams.json` (28 realistic POAM items)
- [x] NIST control families reference: `src/assets/nist-families.json` (20 families)
- [x] Tailwind CSS configuration with custom severity/SLA color tokens
- [x] Vite configuration with `base: "./"` for GitHub Pages
- [x] Data model documentation: `docs/DATA_MODEL.md`
- [x] Context documentation: `docs/CONTEXT.md` and `CONTEXT.md` (root)

### ✅ Completed (Prompt 2)
- [x] Utility functions (`src/utils/`) - built and exported
- [x] Formulas documentation (`docs/FORMULAS.md`)
### ✅ Completed (Prompt 3)
- [x] Custom hooks (`src/hooks/`) - `usePOAMs`, `useFilters`, `useRiskScore`
- [x] Hooks documentation (`docs/COMPONENTS.md`)

### ✅ Completed (Prompt 4)
- [x] Application shell and CSS design system configuration
- [x] Layout components (`Sidebar.jsx`, `TopBar.jsx`, `Layout.jsx`)
- [x] Base routing orchestration (`App.jsx`)
- [x] Placeholder pages (`Dashboard.jsx`, `Tracker.jsx`, `Reports.jsx`)
- [x] Architecture documentation (`docs/ARCHITECTURE.md`)
- [x] Responsive layout shell

### ✅ Completed (Prompt 5)
- [x] Dashboard page with all 6 child components
- [x] SummaryCards — 4 KPI metric cards (Open, SLA Breaches, Avg Risk, Closed This Month)
- [x] OpenByFamilyChart — horizontal bar chart by NIST control family
- [x] SeverityBreakdownChart — donut chart of severity distribution
- [x] SLAComplianceChart — CSS stacked bar + action table
### ✅ Completed (Prompt 3)
- [x] Custom hooks (`src/hooks/`) - `usePOAMs`, `useFilters`, `useRiskScore`
- [x] Hooks documentation (`docs/COMPONENTS.md`)

### ✅ Completed (Prompt 4)
- [x] Application shell and CSS design system configuration
- [x] Layout components (`Sidebar.jsx`, `TopBar.jsx`, `Layout.jsx`)
- [x] Base routing orchestration (`App.jsx`)
- [x] Placeholder pages (`Dashboard.jsx`, `Tracker.jsx`, `Reports.jsx`)
- [x] Architecture documentation (`docs/ARCHITECTURE.md`)
- [x] Responsive layout shell

### ✅ Completed (Prompt 5)
- [x] Dashboard page with all 6 child components
- [x] SummaryCards — 4 KPI metric cards (Open, SLA Breaches, Avg Risk, Closed This Month)
- [x] OpenByFamilyChart — horizontal bar chart by NIST control family
- [x] SeverityBreakdownChart — donut chart of severity distribution
- [x] SLAComplianceChart — CSS stacked bar + action table
- [x] TopRiskTable — top 5 highest risk items table
- [x] TrendLineChart — 12-month area chart with simulated historical data
- [x] CustomTooltip — shared dark-themed Recharts tooltip
- [x] Features documentation (`docs/FEATURES.md`)
- [x] Design system CSS additions (custom tooltip styles, donut center label)
- [x] TopRiskTable — top 5 highest risk items table
- [x] TrendLineChart — 12-month area chart with simulated historical data
- [x] CustomTooltip — shared dark-themed Recharts tooltip
- [x] Features documentation (`docs/FEATURES.md`)
- [x] Design system CSS additions (custom tooltip styles, donut center label)

### ✅ Completed (Prompt 6)
- [x] Tracker page implementation (`Tracker.jsx`)
- [x] POAM data table (`POAMTable.jsx`) with sorting and badges
- [x] Advanced filtering bar (`FilterBar.jsx`) with debounced search
- [x] CRUD form modals (`AddPOAMModal.jsx`, `EditPOAMModal.jsx`)
- [x] Shared UI components (`Modal.jsx`, `ConfirmDialog.jsx`, `ExportButton.jsx`)
- [x] Component and feature documentation

### ✅ Completed (Prompt 7 - Final)
- [x] Reports page with Executive Summary, tables, and narrative
- [x] Toast notification system
- [x] Filter state persistence (localStorage)
- [x] Global 'N' keyboard shortcut for adding POA&Ms
- [x] "Last updated" indicator in TopBar
- [x] Deployment documentation (`docs/DEPLOYMENT.md`)
- [x] Final architecture and context documentation

### 🔲 Future Enhancements (Out of Scope for MVP)
- [ ] Backend database integration
- [ ] User authentication and role-based access
- [ ] Real-time multi-user collaboration

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.2.7 | UI framework |
| React DOM | 19.2.7 | DOM rendering |
| Vite | 8.1.4 | Build tool and dev server |
| Tailwind CSS | 4.3.2 | Utility-first CSS framework |
| @tailwindcss/vite | 4.3.2 | Tailwind CSS Vite plugin (v4 integration) |
| @vitejs/plugin-react | 6.0.3 | React Fast Refresh for Vite |
| Recharts | 3.9.2 | Charting library for dashboard visualizations |
| oxlint | 1.73.0 | Linter (dev dependency) |

**Notable**: This project uses **Tailwind CSS v4**, which uses CSS-based configuration (`@theme` block in `index.css`) instead of the v3 `tailwind.config.js` approach. The `@tailwindcss/vite` plugin handles processing.

---

## File Tree

```
poam-tracker/
├── public/
│   ├── data/
│   │   └── poams.json              ← 28 realistic POAM seed items
│   ├── favicon.svg                 ← App favicon
│   └── icons.svg                   ← Icon sprite sheet
├── src/
│   ├── assets/
│   │   └── nist-families.json      ← 20 NIST 800-53 control families (code → name)
│   ├── components/                 
│   │   ├── layout/                 ← Sidebar, TopBar, Layout wrapper
│   │   ├── dashboard/              ← Dashboard visualization components
│   │   │   ├── CustomTooltip.jsx   ← Shared dark-themed Recharts tooltip
│   │   │   ├── SummaryCards.jsx    ← 4 KPI metric cards
│   │   │   ├── OpenByFamilyChart.jsx ← Horizontal bar chart by control family
│   │   │   ├── SeverityBreakdownChart.jsx ← Donut chart of severity distribution
│   │   │   ├── SLAComplianceChart.jsx ← CSS stacked bar + action table
│   │   │   ├── TopRiskTable.jsx    ← Top 5 highest risk items table
│   │   │   └── TrendLineChart.jsx  ← 12-month area chart with gradient fill
│   │   ├── tracker/                ← Tracker components
│   │   │   ├── FilterBar.jsx       ← Debounced search and dropdown filters
│   │   │   ├── POAMTable.jsx       ← Main data table with sorting
│   │   │   ├── StatusBadge.jsx     ← Pill badge for status/severity
│   │   │   └── RiskScoreBadge.jsx  ← Visual risk score display
│   │   ├── forms/                  ← Add/Edit POAM modals, form fields
│   │   │   ├── AddPOAMModal.jsx    ← Create form
│   │   │   └── EditPOAMModal.jsx   ← Update form
│   │   └── shared/                 ← Reusable UI shell components
│   │       ├── Modal.jsx           ← Modal container
│   │       ├── ConfirmDialog.jsx   ← Deletion confirmation
│   │       └── ExportButton.jsx    ← CSV export trigger
│   ├── hooks/                      
│   │   ├── usePOAMs.js             ← CRUD operations + localStorage persistence
│   │   ├── useFilters.js           ← Filter/sort state management
│   │   └── useRiskScore.js         ← Risk score calculation hook
│   ├── utils/                      
│   │   ├── aging.js                ← SLA aging and status calculations
│   │   ├── riskScore.js            ← Risk score formula implementation
│   │   ├── constants.js            ← Severity levels, SLA thresholds, families
│   │   ├── exportCSV.js            ← CSV export logic
│   │   └── dateHelpers.js          ← Date formatting and comparison utilities
│   ├── pages/                      
│   │   ├── Dashboard.jsx           ← Dashboard overview — composes 6 child chart/table components
│   │   ├── Tracker.jsx             ← Full POAM table with CRUD (placeholder)
│   │   └── Reports.jsx             ← Exportable reports and analytics (placeholder)
│   ├── App.jsx                     ← Root orchestrator (tab routing + data flow)
│   ├── main.jsx                    ← React entry point
│   └── index.css                   ← Tailwind v4 imports + custom theme tokens + chart CSS
├── docs/
│   ├── CONTEXT.md                  ← This file (project context)
│   ├── DATA_MODEL.md               ← Full data model reference
│   ├── ARCHITECTURE.md             ← Technical architecture and data flow diagrams
│   ├── FEATURES.md                 ← Dashboard feature documentation
│   ├── COMPONENTS.md               ← Components and hooks reference documentation
│   ├── FORMULAS.md                 ← Aging logic + risk score formulas documented
│   └── DEPLOYMENT.md               ← 🔲 Not yet created
├── CONTEXT.md                      ← Root copy of docs/CONTEXT.md
├── index.html                      ← HTML entry point
├── vite.config.js                  ← Vite + React + Tailwind CSS v4 plugin
├── package.json                    ← Dependencies and scripts
└── package-lock.json               ← Dependency lock file
```

---

## Data Model

Every POAM item has exactly these stored fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Format `POAM-YYYY-NNN` |
| `title` | `string` | Short weakness name (max 80 chars) |
| `description` | `string` | Detailed explanation (2-3 sentences) |
| `detectionSource` | `enum` | `vulnerability_scan`, `penetration_test`, `audit`, `self_assessment`, `continuous_monitoring` |
| `controlId` | `string` | NIST 800-53 control (e.g., `IA-5`) |
| `controlFamily` | `string` | 2-letter family code (e.g., `IA`) |
| `controlFamilyName` | `string` | Full family name |
| `severity` | `enum` | `Critical`, `High`, `Moderate`, `Low` |
| `assetAffected` | `string` | System/component name |
| `assetCriticality` | `enum` | `Critical`, `High`, `Moderate`, `Low` |
| `responsiblePOC` | `string` | Full name of responsible person |
| `dateIdentified` | `string` | ISO date `YYYY-MM-DD` |
| `originalMilestoneDate` | `string` | ISO date `YYYY-MM-DD` |
| `scheduledCompletionDate` | `string` | ISO date `YYYY-MM-DD` |
| `dateOfClosure` | `string \| null` | ISO date or `null` |
| `status` | `enum` | `Open`, `In Progress`, `Completed`, `Risk Accepted`, `Cancelled` |
| `milestoneNotes` | `string` | Progress notes |
| `resourceEstimate` | `string` | Hours or dollars |
| `vendorDependency` | `boolean` | External vendor required |
| `lastUpdated` | `string` | ISO date `YYYY-MM-DD` |

**Computed at runtime** (never stored):
- `slaStatus` — On Track / At Risk / Overdue / Severely Overdue / Completed
- `daysOverdue` — Days past scheduledCompletionDate
- `riskScore` — Composite 0-10 score

---

## Seed Data Distribution (28 items)

| Dimension | Distribution |
|-----------|-------------|
| **Severity** | 3 Critical, 8 High, 12 Moderate, 5 Low |
| **Status** | 12 Open, 6 In Progress, 7 Completed, 2 Risk Accepted, 1 Cancelled |
| **Control Families** | AC, AT, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PM, PS, PT, RA, SA, SC, SI, SR (all 20 represented) |
| **Assets** | All 10 specified systems used |
| **POCs** | Marcus Thompson, Diana Castillo, Robert Nakamura, James Okafor, Patricia Hernandez, Angela Whitfield |
| **Date Range** | 2024-01-10 to 2025-06-01 |
| **Overdue Items** | Multiple items with past scheduledCompletionDates |

---

## Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| **localStorage, no backend** | Portfolio project — must run anywhere without server setup. Demonstrates client-side state management. |
| **Vite, not CRA** | CRA is deprecated. Vite is the modern standard with faster builds and HMR. |
| **Tailwind CSS v4** | Latest version with CSS-native configuration. No `tailwind.config.js` needed — theme is defined via `@theme` in CSS. |
| **Recharts for charts** | React-native charting library, good for bar/line/pie charts needed for dashboard. |
| **JSON seed data in public/** | Fetchable via HTTP in development and production. Read once, then localStorage takes over. |
| **Computed fields not stored** | `slaStatus`, `daysOverdue`, `riskScore` change daily. Computing them prevents stale data. |
| **NIST families as separate JSON** | Clean separation of reference data from application data. Used for dropdowns and validation. |
| **Tab-based state routing** | No heavy routing library. Three "routes" (`dashboard`, `tracker`, `reports`) are switched with a single `useState` string in `App.jsx`. |
| **App.jsx orchestrator** | `App.jsx` owns top-level state, computes shared metrics, and prop-drills data/handlers into page components. |

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase, descriptive | `POAMTable.jsx`, `SummaryCards.jsx` |
| Hooks | camelCase, `use` prefix | `usePOAMs.js`, `useFilters.js` |
| Utility functions | camelCase | `calculateRiskScore()`, `formatDate()` |
| Utility files | camelCase | `riskScore.js`, `dateHelpers.js` |
| Constants | UPPER_SNAKE_CASE | `SEVERITY_LEVELS`, `SLA_THRESHOLDS` |
| CSS classes | Tailwind utility classes | `bg-severity-critical`, `text-sla-overdue` |
| POAM IDs | `POAM-YYYY-NNN` | `POAM-2025-001` |
| Dates | ISO 8601 | `2025-05-15` |

---

## Rules the AI Must Follow

1. **Do NOT add fields to the data model.** The 20 stored fields are final. No `tags`, `priority`, `comments`, or other additions.
2. **Computed fields are NEVER stored.** `slaStatus`, `daysOverdue`, and `riskScore` must always be calculated at runtime from stored fields + current date.
3. **Always update CONTEXT.md** at the end of every prompt response. Both `docs/CONTEXT.md` and root `CONTEXT.md` must stay in sync.
4. **Use Tailwind CSS v4 patterns.** This project uses `@theme` blocks, not `tailwind.config.js`. Custom colors are accessed as `severity-critical`, `sla-overdue`, etc.
5. **Use the NIST families from `nist-families.json`.** Do not hardcode family names — import from the reference file.
6. **Maintain realistic federal context.** All labels, tooltips, and descriptions should use authentic cybersecurity GRC terminology.
7. **Do NOT modify `package.json`** unless explicitly instructed.
8. **Keep seed data at exactly 28 items** unless instructed to change.
9. **All POAM IDs must follow `POAM-YYYY-NNN` format.** Enforce this in creation forms.
10. **Completed items must have `dateOfClosure` set.** Open/In Progress items must have it as `null`.
---

## Utility Functions Reference

### \src/utils/aging.js\
- \calculateAgingForItem(item)\ ? returns \{ daysOpen, daysUntilMilestone, daysOverdue, slaAllowedDays, slaStatus, slaPercentUsed }\
- \calculateAgingForAll(items)\ ? returns items array with aging fields merged in
- \getSLAThreshold(severity)\ ? returns number of days
- \isOverdue(item)\ ? returns boolean
- \getDaysOverdue(item)\ ? returns number (0 if not overdue)

### \src/utils/riskScore.js\
- \calculateRiskScore(item, agingData)\ ? returns number 0-10
- \getSeverityBase(severity)\ ? returns number
- \getAssetMultiplier(assetCriticality)\ ? returns number
- \getOverdueMultiplier(daysOverdue)\ ? returns number
- \calculateRiskForAll(items)\ ? returns items with riskScore merged in

### \src/utils/constants.js\
- \SEVERITY_LEVELS\: \["Critical", "High", "Moderate", "Low"]\
- \SEVERITY_COLORS\: Mapping to Tailwind classes
- \SLA_STATUS_COLORS\: Mapping to Tailwind classes
- \STATUS_OPTIONS\: \["Open", "In Progress", "Completed", "Risk Accepted", "Cancelled"]\
- \STATUS_COLORS\: Mapping to Tailwind classes
- \DETECTION_SOURCES\: Array of \{ value, label }\ objects
- \ASSET_CRITICALITY_LEVELS\: \["Critical", "High", "Moderate", "Low"]\
- \SLA_THRESHOLDS\: \{ Critical: 15, High: 30, Moderate: 90, Low: 365 }\
- \RISK_SCORE_BANDS\: Array of risk score definitions
- \getRiskBand(score)\ ? returns the matching risk band object
- \NIST_FAMILIES\: Mapped object of NIST control families

### \src/utils/dateHelpers.js\
- \ormatDate(isoString)\ ? returns "Jan 15, 2025"
- \ormatDateShort(isoString)\ ? returns "01/15/25"
- \daysBetween(dateA, dateB)\ ? returns positive int if B is after A
- \isDatePast(isoString)\ ? returns true if date is before today
- \	odayISO()\ ? returns today as "YYYY-MM-DD"
- \ddDays(isoString, days)\ ? returns new ISO date string
- \daysFromToday(isoString)\ ? returns negative if date is in the past

### \src/utils/exportCSV.js\
- \exportToCSV(items, filename)\ ? Triggers download of CSV of enriched POAMs
---

## Data Flow

1. **JSON Seed**: On the very first visit (or after a reset), the application fetches public/data/poams.json.
2. **localStorage**: The seed data is persisted to the browser's localStorage under the key poam_tracker_data. All future reads and mutations interact solely with this storage.
3. **usePOAMs**: This custom hook initializes state from localStorage and provides CRUD functions. It acts as the single source of truth for raw POAM data.
4. **enrichedItems (computed)**: Inside usePOAMs, the calculateRiskForAll utility is run to dynamically generate enrichedItems, attaching SLA aging and risk scores to every raw POAM on the fly.
5. **useFilters.applyFilters**: The enriched items are passed to useFilters, which applies search constraints, dropdown filters, and sorting parameters without altering the source arrays.
6. **App.jsx**: Acts as the central orchestrator. It instantiates the hooks, calculates top-level metrics, and prop-drills the state/functions into the active page component.
7. **Dashboard**: Receives `enrichedItems` via props. Each child component (SummaryCards, OpenByFamilyChart, SeverityBreakdownChart, SLAComplianceChart, TopRiskTable, TrendLineChart) computes its own chart data locally using `useMemo`. No pre-computed chart data is passed as props — each component owns its data transformation.
8. **Rendered Table Rows**: The final processed output from `applyFilters` is used by the frontend components to render the tracker table.

---

## Portfolio Presentation Guide

If presenting this project in a portfolio or interview context, emphasize the following points:

### What it demonstrates:
- **Domain Knowledge**: Deep understanding of federal GRC workflows, NIST 800-53 controls, SLA tracking, and ATO (Authority to Operate) requirements.
- **Frontend Architecture**: Clean, component-driven React architecture without relying on heavy frameworks or unnecessary external libraries (like React Router).
- **Complex Client-Side Logic**: Pure JavaScript implementations of risk scoring algorithms, aging formulas, and data aggregation/filtering.
- **Modern UI/UX**: Premium design using Tailwind CSS v4, responsive layouts, data visualization (Recharts), and accessible forms.

### Demo Flow:
1. **Dashboard First**: Show the high-level metrics. Point out the S-Curve (TrendLineChart) and explain how the risk scores are dynamically calculated.
2. **Tracker Page**: Demonstrate the filtering (e.g., search for "critical" or filter by family). Show the sorting capabilities.
3. **CRUD Operations**: Use the `N` keyboard shortcut to add a new item. Edit an item to change its status to "Completed" and note the auto-date assignment.
4. **Reports & Export**: Show the executive narrative that updates based on the data. Demonstrate the CSV exports. Finally, show the "Reset to Seed Data" feature.

### Technical Talking Points:
- The `localStorage` strategy allows the app to be instantly usable as a demo without backend infrastructure.
- Computed fields (`riskScore`, `slaStatus`) are derived at runtime via pure functions to prevent stale data.
- The use of `@tailwindcss/vite` (Tailwind v4) for native CSS variable theming instead of JS config files.

---

## Known Limitations & Future Improvements

Because this is a frontend-only portfolio demonstration, it has intentional limitations:
- **No Backend**: Data lives only in the browser's `localStorage`. It cannot be shared between devices or team members.
- **No Authentication**: There is no login system, SSO, or role-based access control (RBAC).
- **Simulated Trend Data**: The `TrendLineChart` simulates historical data points based on identification and completion dates, rather than querying a true time-series database.
- **Performance with Large Datasets**: Filtering and sorting are done client-side. While perfectly fine for hundreds or low thousands of records, enterprise deployments with 10,000+ records would require server-side pagination and filtering.
