<div align="center">

# POA&M Tracker

### Federal Cybersecurity GRC : Plan of Action & Milestones Management Tool

[![React](https://img.shields.io/badge/React-19.2.7-61dafb?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1.1-646cff?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.2-38bdf8?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.9.2-22c55e?style=flat-square)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)
[![Deploy: GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-181717?logo=github&style=flat-square)](https://pages.github.com/)

**A fully client-side, production-quality POA&M tracking application built for federal cybersecurity GRC teams. Zero backend. Zero configuration. Deploy anywhere.**

[Live Demo](#) · [Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [Documentation](#-documentation)

</div>

---

## Table of Contents

1. [What is a POA&M?](#-what-is-a-poam)
2. [Project Overview](#-project-overview)
3. [Features](#-features)
   - [Dashboard](#dashboard)
   - [POAM Tracker](#poam-tracker-1)
   - [Reports & Export](#reports--export)
4. [Tech Stack](#-tech-stack)
5. [Architecture](#-architecture)
   - [Application Design Philosophy](#application-design-philosophy)
   - [Component Hierarchy](#component-hierarchy)
   - [Data Flow](#data-flow)
   - [State Ownership](#state-ownership)
6. [Data Model](#-data-model)
   - [Stored Fields](#stored-fields)
   - [Computed Fields](#computed-fields-never-stored)
   - [JSON Schema Example](#json-schema-example)
7. [Risk Score Engine](#-risk-score-engine)
8. [SLA Aging Formulas](#-sla-aging-formulas)
9. [Project Structure](#-project-structure)
10. [Quick Start](#-quick-start)
11. [Deployment](#-deployment)
    - [GitHub Pages (Recommended)](#github-pages-recommended)
    - [Troubleshooting](#troubleshooting)
12. [Custom Hooks Reference](#-custom-hooks-reference)
13. [Utility Functions Reference](#-utility-functions-reference)
14. [Component Reference](#-component-reference)
15. [Seed Data](#-seed-data)
16. [Design Decisions](#-design-decisions)
17. [Naming Conventions](#-naming-conventions)
18. [Known Limitations & Future Work](#-known-limitations--future-work)
19. [Portfolio Presentation Guide](#-portfolio-presentation-guide)
20. [Contributing](#-contributing)

---

## What is a POA&M?

A **Plan of Action and Milestones (POA&M)** is a formal federal information security document that identifies security weaknesses found in an information system and tracks the plan to remediate them.

Every federal agency operating under **FISMA (Federal Information Security Modernization Act)** is required to maintain POA&Ms for each system granted an **Authority to Operate (ATO)**. When an assessor, vulnerability scanner, or penetration tester discovers a weakness , such as an unpatched system, a misconfigured firewall, or inadequate access controls — it is recorded as a POA&M item with:

- An assigned owner (Point of Contact / POC)
- A remediation plan and milestone notes
- A target completion date
- An SLA deadline based on severity

POA&Ms are living documents reviewed regularly by the **Information System Security Officer (ISSO)**, **Authorizing Official (AO)**, and other stakeholders. Items not remediated within the agreed timeframe become "overdue" and can trigger escalation, risk acceptance decisions, or—in severe cases—ATO revocation.

This application implements a complete POA&M management capability as a self-contained, client-side web application aligned with **NIST SP 800-53 Rev 5** and **FedRAMP** requirements.

---

## Project Overview

The POA&M Tracker is a **fully client-side React Single Page Application (SPA)** designed for cybersecurity GRC teams. It provides:

- **Real-time dashboards** with 6 chart and table components for risk visibility
- **Full CRUD operations** for managing POA&M records
- **Advanced filtering and sorting** across all NIST SP 800-53 control families
- **Composite risk scoring** with a dynamic, aging-weighted algorithm
- **SLA compliance tracking** aligned with federal severity thresholds
- **Executive reporting** with auto-generated narratives and CSV exports
- **Zero backend** — data persists via `localStorage`, making it instantly deployable

> **Portfolio Context**: This project demonstrates deep federal GRC domain knowledge, clean React architecture, and complex client-side business logic — without relying on a backend.

---

## Features

### Dashboard

The Dashboard provides a real-time overview of the organization's remediation posture across six visual components:

#### Summary KPI Cards
Four at-a-glance metric cards compute in real time:

| Card | Metric |
|------|--------|
| **Open POA&Ms** | Count of items with status `Open` or `In Progress` |
| **SLA Breaches** | Count of items with `slaStatus` of `Overdue` or `Severely Overdue` |
| **Avg Risk Score** | Mean risk score (0–10) of all active Open/In Progress items |
| **Closed This Month** | Items marked `Completed` in the current calendar month |

#### Open Items by NIST Control Family (Horizontal Bar Chart)
Groups all open/in-progress items by their NIST SP 800-53 control family code. Bars are color-coded by the highest severity item within each family (Critical → red, High → orange, Moderate → amber, Low → green). This reveals systemic control gaps requiring programmatic remediation rather than one-off fixes.

#### Severity Breakdown (Donut Chart)
Displays the entire portfolio (excluding Cancelled) broken down by severity (Critical / High / Moderate / Low). The center of the donut shows the total item count. A heavy skew toward Critical/High signals urgent resource allocation needs.

#### SLA Compliance (CSS Stacked Bar + Action Table)
A proportional stacked bar visualization showing the share of active items in each SLA bucket:
- **On Track** : Deadline is more than 14 days away
- **At Risk** : Deadline is within 14 days
- **Overdue** : Past deadline by 1–30 days
- **Severely Overdue** : Past deadline by more than 30 days

Below the bar, a summary table provides a count, percentage, and recommended action per SLA category. The **On Track percentage** is a key ATO health indicator — below ~70% may signal compliance risk.

#### Top Risk Items Table
A ranked table of the top 5 highest-risk active items, sorted by composite risk score (descending). Columns include: Risk Score badge, POA&M ID, Title (truncated), Severity badge, Days Overdue, and POC with avatar initials. These are the items requiring immediate escalation.

#### 12-Month Trend Line (Area Chart)
A dual-line area chart showing the evolution of the Open and Closed item counts over the past 12 calendar months. Data is simulated from item `dateIdentified` and `dateOfClosure` fields, reconstructing what the portfolio looked like at each month-end.

> **Interpretation**: A healthy program shows Open items peaking then declining as Closed items accumulate (an S-curve). Flat or rising Open with a flat Closed line indicates a degrading remediation program.

---

### POAM Tracker

The Tracker page is the primary data management interface.

#### Advanced Filtering
`FilterBar` provides multi-dimensional filtering with AND logic — items must satisfy all active constraints simultaneously:

| Filter | Type | Behavior |
|--------|------|----------|
| **Search** | Text | 300ms debounced search across Title, Description, Control ID, Asset, and POC |
| **Severity** | Dropdown | Exact match: Critical / High / Moderate / Low |
| **Status** | Dropdown | Exact match: Open / In Progress / Completed / Risk Accepted / Cancelled |
| **Control Family** | Dropdown | 2-letter NIST code. Disables families not present in the dataset |
| **SLA Status** | Dropdown | Exact match: On Track / At Risk / Overdue / Severely Overdue |
| **Clear Filters** | Button | Resets all filters (visible only when filters are active) |

Filter state is **persisted to `localStorage`** and restored on page reload.

#### Column Sorting
Click any column header in `POAMTable` to sort. Clicking the same header again reverses direction.

| Column | Sort Logic |
|--------|-----------|
| Risk Score, Days Overdue | Numeric |
| Severity | Semantic order (Critical > High > Moderate > Low) |
| Dates | Chronological |
| Text fields | Alphabetical |

#### Full CRUD Operations

| Action | Detail |
|--------|--------|
| **Add (N key shortcut)** | Opens `AddPOAMModal`. Auto-generates a sequential ID in `POAM-YYYY-NNN` format. All required fields validated before save. |
| **Edit** | Opens `EditPOAMModal` pre-populated with the selected item. Changing status to `Completed` displays an informational alert and auto-sets `dateOfClosure` to today. |
| **Delete** | Triggers `ConfirmDialog` before permanently removing the item from state and `localStorage`. |
| **Detail View** | Click any table row to open `POAMDetailModal` : a read-only full-field view with an optional Quick Resolve section for active items. |

#### Quick Resolve
Within the Detail Modal, active (Open / In Progress) items display a **Quick Resolve** panel with three instant actions:
- **Mark Complete** : Sets status to `Completed`, assigns today as `dateOfClosure`
- **Accept Risk** : Sets status to `Risk Accepted`, caps risk score at 5.0
- **Cancel** : Sets status to `Cancelled`, zeroes the risk score

All quick resolve actions require an inline confirmation before saving.

#### Frozen Days Overdue
When an item is marked `Completed`, `Risk Accepted`, or `Cancelled`, its `daysOverdue` value is **frozen** at the exact count at time of closure. This preserves a historical record of how overdue the item was when it was resolved. Frozen values display in purple text in the table and detail modal.

#### CSV Export
The `ExportButton` exports the currently filtered view to a `.csv` file, including: ID, Title, Control ID, Severity, Status, SLA Status, Risk Score, Days Overdue, Dates, and POC.

#### Keyboard Accessibility
- **`N` key** : Global shortcut to open the Add POA&M modal from any page
- All table actions have descriptive `aria-label` attributes (e.g., `"Edit POAM-2024-001"`)
- Modals trap focus and can be dismissed via `Escape` or backdrop click

---

### Reports & Export

A read-only, executive-level analytics view designed for stakeholders and auditors.

#### Executive Summary Grid
A 2×3 KPI grid showing:
- Total POA&M Items
- Open + In Progress count
- Completed count (with % of total)
- SLA Breach Rate (% of active items that are Overdue or Severely Overdue)
- Average Risk Score across all active items
- Critical + High Open item count

#### Auto-generated Narrative
A dynamically composed paragraph that translates the raw metrics into plain English, calling out the SLA breach rate and highlighting the single highest-risk item by name, severity, days overdue, and risk score.

#### By Control Family Table
Aggregates all items by NIST family and shows: Total, Open, Overdue counts, Average Risk Score, and a **Status** indicator:
- 🔴 **Needs Attention** : Any item is Severely Overdue
- 🟠 **Monitor** : Any item is Overdue (but none Severely)
- 🟢 **On Track** : No items are overdue

Sorted automatically by Average Risk Score (highest first).

#### By Responsible POC Table
Groups items by assigned POC, showing: Total Assigned, Open, Overdue counts, and **Overdue Rate** (% of their active items that are overdue). Color-coded: Red (>30%), Amber (10–30%), Green (<10%). Sorted by Overdue Rate descending.

#### Three CSV Export Options
1. **Export All Items** : Full dataset
2. **Export Open Items Only** : Filters out Completed, Cancelled, Risk Accepted
3. **Export Overdue Items** : Only items currently breaching SLA

#### Reset to Seed Data
A "Danger Zone" button that wipes all `localStorage` modifications and restores the original 28 seed items. Includes a `ConfirmDialog` to prevent accidental loss.

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 19.2.7 | UI framework and component model |
| **React DOM** | 19.2.7 | DOM rendering |
| **Vite** | 8.1.1 | Build tool and HMR dev server |
| **Tailwind CSS** | 4.3.2 | Utility-first styling with CSS-native configuration |
| **@tailwindcss/vite** | 4.3.2 | Tailwind v4 Vite plugin (`@theme` block, no `tailwind.config.js`) |
| **@vitejs/plugin-react** | 6.0.3 | React Fast Refresh for Vite |
| **Recharts** | 3.9.2 | Composable charting library (bar, area, pie/donut charts) |
| **oxlint** | 1.71.0 | Fast JavaScript/JSX linter (dev dependency) |

> **Important**: This project uses **Tailwind CSS v4**, which uses a CSS-native `@theme` block in `index.css` for configuration instead of a `tailwind.config.js` file. Custom design tokens (severity colors, SLA status colors) are declared directly in CSS.

---

## Architecture

### Application Design Philosophy

The POA&M Tracker is built around three core design decisions:

1. **No Backend** : The application runs entirely in the browser. All data lives in `localStorage`, making it instantly deployable to GitHub Pages or any static host with zero infrastructure.

2. **No Routing Library** : Navigation is handled by a single `currentPage` string in `App.jsx` using a `switch` statement. The app has only three views (`dashboard`, `tracker`, `reports`), making a full routing library unnecessary overhead.

3. **Computed Fields Are Never Stored** : `slaStatus`, `daysOverdue`, and `riskScore` are recalculated at runtime on every render from the stored fields plus the current date. This prevents stale data and keeps the stored JSON clean and auditable.

---

### Component Hierarchy

```
App.jsx  (root orchestrator : owns top-level state)
├── usePOAMs (hook : CRUD + localStorage + enrichedItems)
├── useFilters (hook : search/filter/sort state)
├── Toast (global notification)
└── Layout
    ├── Sidebar (navigation)
    ├── TopBar (header + stat pills)
    └── [active page]
        ├── Dashboard
        │   ├── SummaryCards
        │   ├── OpenByFamilyChart
        │   ├── SeverityBreakdownChart
        │   ├── SLAComplianceChart
        │   ├── TopRiskTable
        │   └── TrendLineChart
        ├── Tracker
        │   ├── FilterBar
        │   ├── POAMTable
        │   │   ├── StatusBadge
        │   │   └── RiskScoreBadge
        │   ├── POAMDetailModal
        │   ├── AddPOAMModal
        │   ├── EditPOAMModal
        │   ├── ConfirmDialog
        │   └── ExportButton
        └── Reports
            └── ExportButton (×3 variants)
```

---

### Data Flow

```
┌─────────────────────┐
│   public/data/      │   ← 28 realistic seed items (JSON)
│   poams.json        │
└──────────┬──────────┘
           │  fetched on first visit or after reset
           ▼
┌─────────────────────┐
│    localStorage     │   ← key: "poam_tracker_data"
│    (working copy)   │   ← all CRUD ops write here
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   usePOAMs hook     │   ← React state (source of truth)
│   ├── items[]       │   ← raw stored fields only
│   └── enrichedItems │   ← items + slaStatus + daysOverdue + riskScore
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     App.jsx         │   ← computes itemCounts, currentPage
└──────────┬──────────┘
           │
    ┌──────┼──────────┐
    ▼      ▼          ▼
Dashboard Tracker   Reports
(enriched) (enriched (enriched
           + CRUD    items)
           + filters)
```

Each Dashboard child component independently transforms `enrichedItems` with `useMemo` , no pre-computed chart data is passed as props.

---

### State Ownership

| State | Owner | Description |
|-------|-------|-------------|
| `items` | `usePOAMs` | Raw POAM array from `localStorage`. Source of truth for stored fields. |
| `enrichedItems` | `usePOAMs` | `items` + computed `slaStatus`, `daysOverdue`, `riskScore` via `useMemo`. |
| `isLoading` / `error` | `usePOAMs` | Tracks seed data initialization status. |
| `addPOAM` / `updatePOAM` / `deletePOAM` / `resetToSeedData` | `usePOAMs` | CRUD handlers that update state + `localStorage` atomically. |
| `currentPage` | `App.jsx` | Active route string: `'dashboard'`, `'tracker'`, or `'reports'`. |
| `itemCounts` | `App.jsx` | `{ open, overdue, critical }` , derived from `enrichedItems` via `useMemo`. |
| `lastUpdated` | `App.jsx` | Latest `lastUpdated` date across all items, shown in `TopBar`. |
| `toast` | `App.jsx` | Current toast notification `{ message, type }` or `null`. |
| `searchQuery`, `filterSeverity`, `filterStatus`, `filterFamily`, `filterSLAStatus` | `useFilters` | Active filter state. Persisted to `localStorage`. |
| `sortField`, `sortDirection` | `useFilters` | Active sort configuration. |
| `sidebarOpen` | `Layout.jsx` | Mobile-only sidebar visibility toggle. |

---

## 📐 Data Model

### Stored Fields

Every POAM item has exactly **20 stored fields**. The data model is final — no additional fields should be added.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `string` | `POAM-YYYY-NNN` | Unique identifier. Sequential per year. E.g., `POAM-2025-001`. |
| `title` | `string` | Max 80 chars | Short, specific name of the weakness. |
| `description` | `string` | 2–3 sentences | Detailed explanation referencing technologies, CVEs, or policies. |
| `detectionSource` | `enum` | See below | How the weakness was discovered. |
| `controlId` | `string` | NIST 800-53 ID | E.g., `IA-5`, `AC-17`, `SI-2`. |
| `controlFamily` | `string` | 2-letter code | E.g., `IA`, `AC`, `SI`. One of 20 official NIST families. |
| `controlFamilyName` | `string` | Full name | E.g., `Identification and Authentication`. |
| `severity` | `enum` | See below | Risk severity — determines SLA thresholds. |
| `assetAffected` | `string` | System name | The affected information system or component. |
| `assetCriticality` | `enum` | See below | Mission importance of the affected asset. |
| `responsiblePOC` | `string` | Full name | Person accountable for remediation progress. |
| `dateIdentified` | `string` | `YYYY-MM-DD` | Date the weakness was first discovered. SLA aging starts here. |
| `originalMilestoneDate` | `string` | `YYYY-MM-DD` | Original agreed-upon deadline. Immutable historical record. |
| `scheduledCompletionDate` | `string` | `YYYY-MM-DD` | Current target date. Used for all SLA calculations. |
| `dateOfClosure` | `string \| null` | `YYYY-MM-DD` or `null` | Set when status becomes `Completed`. `null` for active items. |
| `status` | `enum` | See below | Lifecycle state of the item. |
| `milestoneNotes` | `string` | Free text | Progress notes, blockers, dependencies, next steps. |
| `resourceEstimate` | `string` | Hours or dollars | E.g., `"40 hours"`, `"$5,000"`. |
| `vendorDependency` | `boolean` | `true` / `false` | Whether remediation requires external vendor action. |
| `lastUpdated` | `string` | `YYYY-MM-DD` | Date the item was last modified. |

**Enum Values Quick Reference**

| Field | Allowed Values |
|-------|---------------|
| `detectionSource` | `vulnerability_scan`, `penetration_test`, `audit`, `self_assessment`, `continuous_monitoring` |
| `severity` | `Critical`, `High`, `Moderate`, `Low` |
| `assetCriticality` | `Critical`, `High`, `Moderate`, `Low` |
| `status` | `Open`, `In Progress`, `Completed`, `Risk Accepted`, `Cancelled` |

---

### Computed Fields (Never Stored)

| Field | Type | Description |
|-------|------|-------------|
| `slaStatus` | `string` | `On Track` / `At Risk` / `Overdue` / `Severely Overdue` / `Completed` |
| `daysOverdue` | `number` | Days past `scheduledCompletionDate`. Frozen at closure for resolved items. |
| `riskScore` | `number` | Composite 0–10 score: severity × asset criticality × overdue multiplier. |

These are **intentionally never stored** because:
- They change daily (a stored `daysOverdue` would be stale by tomorrow)
- They are deterministically derived from stored fields + the current date
- Keeping them computed ensures the risk score formula can evolve without data migration

---

### JSON Schema Example

```json
{
  "id": "POAM-2025-001",
  "title": "MFA not enforced for privileged accounts",
  "description": "Multi-factor authentication is not configured for administrator accounts on the primary identity provider, creating risk of credential-based attack.",
  "detectionSource": "penetration_test",
  "controlId": "IA-5",
  "controlFamily": "IA",
  "controlFamilyName": "Identification and Authentication",
  "severity": "High",
  "assetAffected": "Identity Provider - Okta Production",
  "assetCriticality": "Critical",
  "responsiblePOC": "John Smith",
  "dateIdentified": "2025-01-15",
  "originalMilestoneDate": "2025-03-15",
  "scheduledCompletionDate": "2025-03-15",
  "dateOfClosure": null,
  "status": "Open",
  "milestoneNotes": "Awaiting procurement approval for MFA token licenses.",
  "resourceEstimate": "40 hours",
  "vendorDependency": false,
  "lastUpdated": "2025-03-01"
}
```

---

## ⚖️ Risk Score Engine

The risk score is a composite 0–10 metric that increases dynamically as items age past their SLA deadlines, highlighting the items posing the greatest risk to the organization at any given moment.

### Formula

```
Raw Score = Severity Base × Asset Criticality Multiplier × Overdue Multiplier
Final Score = Math.min(10, Raw Score)   [rounded to 2 decimal places]
```

### Component Lookup Tables

**1. Severity Base**

| Severity | Base Score |
|----------|-----------|
| Critical | 10 |
| High | 7 |
| Moderate | 4 |
| Low | 1 |

**2. Asset Criticality Multiplier**

| Asset Criticality | Multiplier |
|-------------------|-----------|
| Critical | 1.5× |
| High | 1.25× |
| Moderate | 1.0× |
| Low | 0.75× |

**3. Overdue Multiplier** (scales continuously as days overdue increases)

| Days Overdue | Multiplier | Formula |
|-------------|-----------|---------|
| 0 days | 1.0 | Baseline , no penalty |
| 1–30 days | 1.0 → 1.3 | `1.0 + (daysOverdue / 30) × 0.3` |
| 31–90 days | 1.3 → 1.7 | `1.3 + ((daysOverdue - 30) / 60) × 0.4` |
| >90 days | 2.0 | Maximum penalty |

### Worked Example

> *Scenario: A **High** severity finding on a **Critical** asset, **45 days overdue**.*

```
Severity Base:      High = 7
Asset Multiplier:   Critical = 1.5
Overdue Multiplier: 45 days → 1.3 + ((45 - 30) / 60) × 0.4 = 1.4
Raw Score:          7 × 1.5 × 1.4 = 14.7
Final Score:        Math.min(10, 14.7) = 10.00
```

### Special Status Rules

| Status | Risk Score |
|--------|-----------|
| `Completed` or `Cancelled` | **0.0** , Remediated/invalid findings pose no risk |
| `Risk Accepted` | **Capped at 5.0** , AO has formally acknowledged the risk; treated as managed |

### Implementation
- **Formula**: [`src/utils/riskScore.js`](./src/utils/riskScore.js)
- **Hook wrapper**: [`src/hooks/useRiskScore.js`](./src/hooks/useRiskScore.js)
- **Constants**: [`src/utils/constants.js`](./src/utils/constants.js) (`RISK_SCORE_BANDS`, `getRiskBand()`)

---

## SLA Aging Formulas

Federal SLA thresholds define the maximum acceptable time to remediate a finding based on its severity. These are checked daily to determine each item's SLA status.

### SLA Thresholds (by Severity)

| Severity | SLA Window |
|----------|-----------|
| Critical | **15 days** |
| High | **30 days** |
| Moderate | **90 days** |
| Low | **365 days** |

### Aging Calculations

```
Days Open            = Today − dateIdentified
Days Until Milestone = scheduledCompletionDate − Today  (negative = overdue)
Days Overdue (open)  = max(0, abs(Days Until Milestone)) if past deadline
Days Overdue (closed)= daysOverdue frozen at time of closure
SLA Percent Used     = min(200%, (Days Open / SLA Allowed Days) × 100)
```

### SLA Status Decision Tree

```
Is status "Completed", "Cancelled", or "Risk Accepted"?
├── YES → slaStatus = "Completed"
└── NO
    ├── daysOverdue > 30?
    │   ├── YES → slaStatus = "Severely Overdue"
    │   └── NO
    │       ├── daysOverdue > 0?
    │       │   ├── YES → slaStatus = "Overdue"
    │       │   └── NO
    │       │       ├── daysUntilMilestone ≤ 14?
    │       │       │   ├── YES → slaStatus = "At Risk"
    │       │       │   └── NO  → slaStatus = "On Track"
```

### Implementation
- **Utility**: [`src/utils/aging.js`](./src/utils/aging.js)
- **Documentation**: [`docs/FORMULAS.md`](./docs/FORMULAS.md)

---

## 📁 Project Structure

```
poam-tracker/
├── public/
│   ├── data/
│   │   └── poams.json              ← 28 realistic POAM seed items
│   ├── favicon.svg                 ← App favicon
│   └── icons.svg                   ← SVG icon sprite sheet
│
├── src/
│   ├── assets/
│   │   └── nist-families.json      ← 20 NIST 800-53 control families (code → name)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx          ← App shell (sidebar + topbar + content area)
│   │   │   ├── Sidebar.jsx         ← Navigation sidebar with NIST/FedRAMP branding
│   │   │   └── TopBar.jsx          ← Header with dynamic title + stat pills
│   │   │
│   │   ├── dashboard/
│   │   │   ├── CustomTooltip.jsx   ← Shared dark-themed Recharts tooltip
│   │   │   ├── SummaryCards.jsx    ← 4 KPI metric cards
│   │   │   ├── OpenByFamilyChart.jsx   ← Horizontal bar chart by control family
│   │   │   ├── SeverityBreakdownChart.jsx ← Donut chart of severity distribution
│   │   │   ├── SLAComplianceChart.jsx  ← CSS stacked bar + action table
│   │   │   ├── TopRiskTable.jsx    ← Top 5 highest risk items table
│   │   │   └── TrendLineChart.jsx  ← 12-month area chart with gradient fill
│   │   │
│   │   ├── tracker/
│   │   │   ├── FilterBar.jsx       ← Debounced search + dropdown filters
│   │   │   ├── POAMTable.jsx       ← Main data table with click-to-sort headers
│   │   │   ├── StatusBadge.jsx     ← Pill badge for status and severity
│   │   │   ├── RiskScoreBadge.jsx  ← Visual risk score display with color bands
│   │   │   └── POAMDetailModal.jsx ← Read-only detail view + Quick Resolve
│   │   │
│   │   ├── forms/
│   │   │   ├── AddPOAMModal.jsx    ← Controlled form for creating new items
│   │   │   └── EditPOAMModal.jsx   ← Pre-populated form for updating items
│   │   │
│   │   └── shared/
│   │       ├── Modal.jsx           ← Reusable modal shell (backdrop + close)
│   │       ├── ConfirmDialog.jsx   ← Standard confirmation prompt
│   │       ├── ExportButton.jsx    ← CSV export trigger with item count
│   │       └── Toast.jsx           ← Slide-up notification system
│   │
│   ├── hooks/
│   │   ├── usePOAMs.js             ← CRUD + localStorage + enrichedItems computation
│   │   ├── useFilters.js           ← Filter/search/sort state management + localStorage
│   │   └── useRiskScore.js         ← Risk score display helpers and top-item lookup
│   │
│   ├── utils/
│   │   ├── aging.js                ← SLA aging calculations and status logic
│   │   ├── riskScore.js            ← Risk score formula implementation
│   │   ├── constants.js            ← All enums, thresholds, and color mappings
│   │   ├── exportCSV.js            ← CSV serialization and download trigger
│   │   └── dateHelpers.js          ← Date formatting and comparison utilities
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx           ← Composes all 6 dashboard chart/table components
│   │   ├── Tracker.jsx             ← POAM table with full CRUD, filter, and sort
│   │   └── Reports.jsx             ← Executive summary, grouped tables, and exports
│   │
│   ├── App.jsx                     ← Root orchestrator (page routing + data flow)
│   ├── main.jsx                    ← React entry point + StrictMode
│   ├── App.css                     ← Component-level styles
│   └── index.css                   ← Tailwind v4 @theme tokens + global design system
│
├── docs/
│   ├── DATA_MODEL.md               ← Full data model reference and field descriptions
│   ├── ARCHITECTURE.md             ← Technical architecture, data flow, state ownership
│   ├── FEATURES.md                 ← Feature documentation with GRC context
│   ├── COMPONENTS.md               ← Component and hook API reference
│   ├── FORMULAS.md                 ← SLA aging + risk score formulas documented
│   └── DEPLOYMENT.md               ← Deployment guide for local dev and GitHub Pages
│
├── CONTEXT.md                      ← AI agent project context (single source of truth)
├── index.html                      ← HTML entry point (Plus Jakarta Sans font)
├── vite.config.js                  ← Vite + React plugin + Tailwind CSS v4 plugin
├── package.json                    ← Dependencies and npm scripts
├── package-lock.json               ← Dependency lock file
└── .oxlintrc.json                  ← Linter configuration
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (included with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/poam-tracker.git
cd poam-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note**: The app fetches `public/data/poams.json` on first load to seed `localStorage`. It must be served over HTTP, not opened as a `file://` URL.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR at `localhost:5173` |
| `npm run build` | Compile and minify production bundle to `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run oxlint across all source files |

---

## Deployment

### GitHub Pages (Recommended)

The `vite.config.js` sets `base: "./"` so all asset paths are relative — no subdirectory configuration needed.

**Step 1: Install the `gh-pages` package**
```bash
npm install -D gh-pages
```

**Step 2: Add deploy scripts to `package.json`**
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

**Step 3: Deploy**
```bash
npm run deploy
```

This builds the project and pushes `dist/` to the `gh-pages` branch automatically.

**Step 4: Configure GitHub Pages**
1. Go to **Settings → Pages** in your repository
2. Set Source to **Deploy from a branch**
3. Select branch `gh-pages`, folder `/ (root)`
4. Click **Save**

Your app will be live at `https://<your-username>.github.io/<repository-name>/`

---

### Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank white page | Incorrect asset base path | Ensure `base: "./"` in `vite.config.js` |
| 404 on page reload | URL-based routing not supported by GitHub Pages | This app uses state-based routing , reloads always work on the root URL |
| Data not saving | `localStorage` blocked | Ensure the site is not in an iframe with strict cross-origin policies or incognito with cookies blocked |
| Seed data not loading | App opened as `file://` URL | Must be served over HTTP , use `npm run dev` or a static server |

---

## Custom Hooks Reference

### `usePOAMs`  [`src/hooks/usePOAMs.js`](./src/hooks/usePOAMs.js)

The primary data layer hook. Manages all POAM data with localStorage persistence, seed data initialization, and CRUD operations.

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `items` | `Array` | Raw POAM objects (stored fields only) |
| `enrichedItems` | `Array` | `items` + computed `slaStatus`, `daysOverdue`, `riskScore` |
| `isLoading` | `boolean` | True during seed data fetch initialization |
| `error` | `string \| null` | Error message if initialization fails |
| `addPOAM(data)` | `function` | Creates item, auto-generates ID, syncs to localStorage. Returns `{ success, id }` |
| `updatePOAM(id, fields)` | `function` | Merges fields into item, handles auto-close date logic. Returns `{ success }` |
| `deletePOAM(id)` | `function` | Removes item from state + localStorage. Returns `{ success }` |
| `resetToSeedData()` | `function` | Re-fetches `poams.json` and overwrites localStorage |
| `getById(id)` | `function` | Returns a single enriched item or `null` |

```jsx
const { enrichedItems, addPOAM, isLoading } = usePOAMs();
```

---

### `useFilters` , [`src/hooks/useFilters.js`](./src/hooks/useFilters.js)

Manages all filter, search, and sort state. Filter state is persisted to `localStorage` and restored on mount.

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `searchQuery` | `string` | Active text search (defaults to `""`) |
| `filterSeverity` | `string` | Active severity filter (defaults to `"All"`) |
| `filterStatus` | `string` | Active status filter (defaults to `"All"`) |
| `filterFamily` | `string` | Active control family filter (defaults to `"All"`) |
| `filterSLAStatus` | `string` | Active SLA status filter (defaults to `"All"`) |
| `sortField` | `string` | Active sort column (defaults to `"riskScore"`) |
| `sortDirection` | `string` | `"asc"` or `"desc"` (defaults to `"desc"`) |
| `activeFilterCount` | `number` | Count of non-default categorical filters (via `useMemo`) |
| `setSearchQuery(q)` | `function` | Update search text |
| `setFilter(name, val)` | `function` | Update a categorical filter by name |
| `setSort(field, dir)` | `function` | Update sort configuration |
| `clearAllFilters()` | `function` | Reset all text + dropdown filters (preserves sort) |
| `applyFilters(items)` | `function` | Filter + sort an array of enriched items |

```jsx
const { applyFilters, setSearchQuery, activeFilterCount } = useFilters();
const filtered = applyFilters(enrichedItems);
```

---

### `useRiskScore` , [`src/hooks/useRiskScore.js`](./src/hooks/useRiskScore.js)

A thin presentation wrapper exposing risk calculation utilities to components.

**Returns:**

| Function | Description |
|----------|-------------|
| `getRiskBand(score)` | Returns the risk band object `{ label, color, bg }` for a given score |
| `formatRiskScore(score)` | Returns a 1-decimal formatted score string (e.g., `"7.5"`) |
| `getRiskColor(score)` | Returns a Tailwind text color class based on score thresholds |
| `getTopRiskItems(items, n)` | Filters active items, sorts by `riskScore` desc, returns top `n` |

```jsx
const { getRiskColor, getTopRiskItems } = useRiskScore();
const top5 = getTopRiskItems(enrichedItems, 5);
```

---

## Utility Functions Reference

### `src/utils/aging.js`

| Function | Returns | Description |
|----------|---------|-------------|
| `calculateAgingForItem(item)` | `{ daysOpen, daysUntilMilestone, daysOverdue, slaAllowedDays, slaStatus, slaPercentUsed }` | Full SLA aging computation for a single item |
| `calculateAgingForAll(items)` | `Array` | Maps all items with aging fields merged in |
| `getSLAThreshold(severity)` | `number` | Days allowed: Critical=15, High=30, Moderate=90, Low=365 |
| `isOverdue(item)` | `boolean` | True if item is past its `scheduledCompletionDate` and not closed |
| `getDaysOverdue(item)` | `number` | Days past deadline (0 if not overdue) |

---

### `src/utils/riskScore.js`

| Function | Returns | Description |
|----------|---------|-------------|
| `calculateRiskScore(item, agingData)` | `number` (0–10) | Composite risk score for a single item |
| `getSeverityBase(severity)` | `number` | Severity base: Critical=10, High=7, Moderate=4, Low=1 |
| `getAssetMultiplier(assetCriticality)` | `number` | Criticality multiplier: Critical=1.5, High=1.25, Moderate=1.0, Low=0.75 |
| `getOverdueMultiplier(daysOverdue)` | `number` | Scaling multiplier (1.0 → 2.0) based on days overdue |
| `calculateRiskForAll(items)` | `Array` | Maps all items with `riskScore` merged in |

---

### `src/utils/dateHelpers.js`

| Function | Returns | Example |
|----------|---------|---------|
| `formatDate(isoString)` | `string` | `"Jan 15, 2025"` |
| `formatDateShort(isoString)` | `string` | `"01/15/25"` |
| `daysBetween(dateA, dateB)` | `number` | Positive integer if B is after A |
| `isDatePast(isoString)` | `boolean` | True if date is before today |
| `todayISO()` | `string` | `"2025-07-16"` |
| `addDays(isoString, days)` | `string` | Returns new ISO date string |
| `daysFromToday(isoString)` | `number` | Negative if date is in the past |

---

### `src/utils/constants.js`

Exports the following constants and utility functions:

| Export | Type | Description |
|--------|------|-------------|
| `SEVERITY_LEVELS` | `Array` | `["Critical", "High", "Moderate", "Low"]` |
| `SEVERITY_COLORS` | `Object` | Maps severity to Tailwind CSS classes |
| `STATUS_OPTIONS` | `Array` | `["Open", "In Progress", "Completed", "Risk Accepted", "Cancelled"]` |
| `STATUS_COLORS` | `Object` | Maps status to Tailwind CSS classes |
| `SLA_STATUS_COLORS` | `Object` | Maps SLA status to Tailwind CSS classes |
| `DETECTION_SOURCES` | `Array` | `[{ value, label }]` objects for dropdowns |
| `ASSET_CRITICALITY_LEVELS` | `Array` | `["Critical", "High", "Moderate", "Low"]` |
| `SLA_THRESHOLDS` | `Object` | `{ Critical: 15, High: 30, Moderate: 90, Low: 365 }` |
| `RISK_SCORE_BANDS` | `Array` | Risk band definitions with labels and colors |
| `getRiskBand(score)` | `function` | Returns matching band object for a score |
| `NIST_FAMILIES` | `Object` | Full map of family codes to names |

---

### `src/utils/exportCSV.js`

| Function | Description |
|----------|-------------|
| `exportToCSV(items, filename)` | Serializes enriched POAM items to CSV and triggers a browser download |

---

## Seed Data

The application ships with **28 realistic POA&M items** in [`public/data/poams.json`](./public/data/poams.json), covering:

| Dimension | Distribution |
|-----------|-------------|
| **Severity** | 3 Critical · 8 High · 12 Moderate · 5 Low |
| **Status** | 12 Open · 6 In Progress · 7 Completed · 2 Risk Accepted · 1 Cancelled |
| **Control Families** | All 20 NIST SP 800-53 families (AC, AT, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PM, PS, PT, RA, SA, SC, SI, SR) |
| **Assets** | 10 distinct systems (Identity Provider, Cloud Storage, HR Portal, etc.) |
| **Points of Contact** | 6 realistic names (Marcus Thompson, Diana Castillo, Robert Nakamura, James Okafor, Patricia Hernandez, Angela Whitfield) |
| **Date Range** | 2024-01-10 through 2025-06-01 |
| **Overdue Items** | Multiple items with past `scheduledCompletionDates` — drives SLA dashboard charts |

The seed data is fetched once on the user's first visit and written to `localStorage`. On subsequent visits, the app reads from `localStorage` directly. Users can restore the original seed data via the **Reset to Seed Data** button in the Reports page.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **`localStorage`, no backend** | Portfolio project — must run anywhere without server setup. Demonstrates client-side state management at scale. |
| **State-based routing, no React Router** | Only 3 views. A full routing library adds complexity without benefit and avoids the GitHub Pages 404-on-reload problem. |
| **Tailwind CSS v4** | Latest version with CSS-native `@theme` blocks instead of `tailwind.config.js`. Demonstrates knowledge of the current ecosystem. |
| **Recharts for charts** | React-native library with composable components for the specific chart types needed (bar, area, pie). |
| **Seed data in `public/`** | Fetchable over HTTP in both dev and production. Read once, then `localStorage` takes over. |
| **Computed fields never stored** | `slaStatus`, `daysOverdue`, `riskScore` change daily. Storing derived data creates stale-data risk. Computing at runtime keeps the stored JSON clean and auditable. |
| **`App.jsx` as the orchestrator** | Single source of truth for page routing and top-level metrics. Avoids a global state library (Redux, Zustand) for a 3-page app. |
| **Each dashboard component owns its data transformation** | Child chart components use `useMemo` to transform `enrichedItems` locally rather than receiving pre-computed chart data as props. This keeps the Dashboard page thin and each chart self-contained. |
| **`POAM-YYYY-NNN` ID format** | Mirrors real federal POA&M ID conventions — year-scoped, sequential, human-readable. |
| **Plus Jakarta Sans typography** | Modern, readable geometric sans-serif that feels professional without being generic. |

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `POAMTable.jsx`, `SummaryCards.jsx` |
| Hooks | camelCase with `use` prefix | `usePOAMs.js`, `useFilters.js` |
| Utility functions | camelCase | `calculateRiskScore()`, `formatDate()` |
| Utility files | camelCase | `riskScore.js`, `dateHelpers.js` |
| Constants | UPPER_SNAKE_CASE | `SEVERITY_LEVELS`, `SLA_THRESHOLDS` |
| Custom CSS tokens | kebab-case | `--color-severity-critical`, `--color-sla-overdue` |
| POAM IDs | `POAM-YYYY-NNN` | `POAM-2025-001` |
| Dates | ISO 8601 | `2025-05-15` |
| localStorage key | snake_case | `poam_tracker_data`, `poam_tracker_filters` |

---

## ⚠️ Known Limitations & Future Work

This is a frontend-only portfolio demonstration. It has the following intentional limitations:

| Limitation | Description | Production Solution |
|------------|-------------|---------------------|
| **No Backend** | Data lives only in the user's browser `localStorage`. Cannot be shared between devices or users. | Secure REST API + relational database (PostgreSQL) |
| **No Authentication** | No login, SSO, session management, or RBAC. | Federal IdP integration via SAML/OIDC (Okta, Login.gov) |
| **No Audit Trail** | Edits and deletions leave no immutable log. | Append-only audit log table with actor + timestamp + diff |
| **Simulated Trend Data** | `TrendLineChart` reconstructs history from item dates — no true time-series database. | Time-series data stored server-side per calendar period |
| **Client-Side Filtering Only** | Suitable for hundreds of records. At 10,000+ items, performance would degrade. | Server-side pagination, filtering, and sorting via API |
| **localStorage Volatility** | Data is erased if the user clears browser data or uses incognito mode. | Persisted database backend |

---

## Portfolio Presentation Guide

If presenting this project in a portfolio or technical interview, use the following demo flow and talking points.

### Suggested Demo Order

1. **Dashboard First** : Open the dashboard and explain the KPI cards. Walk through the SLA Compliance bar and note the On Track percentage. Highlight the TrendLineChart and explain how it simulates historical posture from item dates.
2. **Tracker Page**  Use the search bar to filter for `"critical"`. Apply the Severity dropdown to layer filters. Click a table row to open the Detail Modal and show the Quick Resolve workflow.
3. **CRUD Live Demo** - Press the **`N`** keyboard shortcut to add a new item. Fill in a realistic scenario. Then edit an existing item and change its status to `Completed` - point out the auto-date assignment alert.
4. **Reports Page** - Show the Executive Summary grid and explain how the auto-generated narrative works. Demonstrate the three CSV export options. Show the Reset to Seed Data button.

### Technical Talking Points

- **Domain knowledge**: The SLA thresholds, risk score formula, NIST control family groupings, and ATO health indicators are all aligned with real federal GRC programs - not invented for the demo.
- **Clean architecture without over-engineering**: No Redux, no React Router, no external form libraries. The three-page app is managed by a single `useState` string and two custom hooks.
- **Computed fields strategy**: `riskScore` and `daysOverdue` are derived at runtime from stored fields + the current date — so every page load reflects live risk posture, not a stale snapshot.
- **Tailwind CSS v4**: Uses `@theme` blocks in CSS for design tokens instead of `tailwind.config.js`, demonstrating knowledge of the current ecosystem.
- **Zero infrastructure**: The entire app is a static file bundle. It can be deployed to GitHub Pages, Netlify, Vercel, S3, or any CDN with no environment setup.

---

## 🤝 Contributing

This project is primarily a portfolio demonstration, but contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Before Contributing

- Review [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the design philosophy
- Review [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) , the 20-field data model is final
- Run `npm run lint` before committing
- Do not add computed fields (`slaStatus`, `daysOverdue`, `riskScore`) to the stored data model

---

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) | Full data model reference with field descriptions and enum values |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Technical architecture, component hierarchy, data flow, and state ownership |
| [`docs/FEATURES.md`](./docs/FEATURES.md) | Feature documentation with federal GRC context and analyst decision rationale |
| [`docs/COMPONENTS.md`](./docs/COMPONENTS.md) | Complete component and hook API reference |
| [`docs/FORMULAS.md`](./docs/FORMULAS.md) | SLA aging and risk score formulas with worked examples |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Local dev, production build, and GitHub Pages deployment guide |
| [`CONTEXT.md`](./CONTEXT.md) | AI agent project context document (single source of truth for the codebase) |

---

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).

---

<div align="center">

**Built with ❤️ for federal cybersecurity GRC teams**

*Aligned with NIST SP 800-53 Rev 5 · FedRAMP · FISMA*

</div>
