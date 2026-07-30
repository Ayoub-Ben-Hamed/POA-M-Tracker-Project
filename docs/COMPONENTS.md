# COMPONENTS & HOOKS REFERENCE

## Custom Hooks

### `usePOAMs`
**Purpose**: Manages all POAM data, handling localStorage persistence, seed data initialization, and CRUD operations. It acts as the single source of truth for the application's data layer.

**State Variables**:
- `items` (Array): The raw list of POAM objects stored in the app.
- `isLoading` (Boolean): Indicates whether data is currently being fetched or initialized. Defaults to `true`.
- `error` (String | null): Holds error messages if data fetching or initialization fails. Defaults to `null`.

**Computed/Memoized Values**:
- `enrichedItems`: A useMemo-cached array mapping the `items` to include computed SLA aging and risk score data. It recomputes whenever the `items` array changes.

**Exposed Functions**:
- `addPOAM(newItemData)`: Takes an object with new POAM fields (minus ID and lastUpdated). Auto-generates an ID, saves it, and syncs to localStorage. Returns `{ success, id }` or `{ success, error }`.
- `updatePOAM(id, updatedFields)`: Merges new field values into an existing POAM item matching the ID. Handles auto-closing completion dates. Returns `{ success }` or `{ success, error }`.
- `deletePOAM(id)`: Removes the POAM from state and localStorage. Returns `{ success }` or `{ success, error }`.
- `resetToSeedData()`: Re-fetches `public/data/poams.json` to overwrite state and localStorage. Returns `{ success }` or `{ success, error }`.
- `getById(id)`: Synchronously searches `enrichedItems` and returns a single fully computed item or `null`.

**Usage Example**:
```jsx
const { enrichedItems, addPOAM, isLoading } = usePOAMs();
if (!isLoading) {
  console.log(enrichedItems);
}
```

**What this hook does NOT do**: 
- It does not calculate the risk and aging formulas internally (it delegates this to the utility functions).
- It does not handle filtering or sorting data for views.

---

### `useFilters`
**Purpose**: Manages the application-wide state for searching, filtering, and sorting the POAM dataset without directly mutating the source data.

**State Variables**:
- `searchQuery` (String): The active text search constraint. Defaults to `""`.
- `filterSeverity` (String): The exact severity string to filter by. Defaults to `"All"`.
- `filterStatus` (String): The exact status string to filter by. Defaults to `"All"`.
- `filterFamily` (String): The exact NIST control family code to filter by. Defaults to `"All"`.
- `filterSLAStatus` (String): The exact SLA status to filter by. Defaults to `"All"`.
- `sortField` (String): The property to sort on. Defaults to `"riskScore"`.
- `sortDirection` (String): Ascending or Descending. Defaults to `"desc"`.

**Computed/Memoized Values**:
- `activeFilterCount`: A useMemo value tracking how many categorical filters are non-default (ignoring sort/search). Recomputes when categorical filter states change.

**Exposed Functions**:
- `setSearchQuery(query)`: Updates search text.
- `setFilter(filterName, value)`: Generic state update for dropdown categories.
- `setSort(field, direction)`: Modifies table ordering rules.
- `clearAllFilters()`: Resets all text and dropdown filters (preserves sort).
- `applyFilters(enrichedItems)`: A useCallback function that filters and sorts an array of items based on active hook states.

**Usage Example**:
```jsx
const { applyFilters, setSearchQuery, sortDirection } = useFilters();
const filteredData = applyFilters(enrichedItems);
```

**What this hook does NOT do**: 
- It does not contain any POAM data itself. 

---

### `useRiskScore`
**Purpose**: A thin presentation wrapper hook exposing risk calculation utilities and display helpers directly to components without needing utility file imports.

**State Variables**:
None. This hook acts purely as an access layer.

**Exposed Functions**:
- `getRiskBand(score)`: Looks up and returns the risk band definition object from constants.
- `formatRiskScore(score)`: Returns a cleanly formatted 1-decimal risk score string.
- `getRiskColor(score)`: Returns the appropriate Tailwind text color utility based on score thresholds.
- `getTopRiskItems(enrichedItems, n)`: Sorts and extracts the highest risk uncompleted items (default top 5).

**Usage Example**:
```jsx
const { getRiskColor, formatRiskScore } = useRiskScore();
const labelColor = getRiskColor(item.riskScore);
```

**What this hook does NOT do**: 
- It does not perform the raw formula computations (that belongs in `riskScore.js`).

## Layout Components

> All layout components are purely presentational. They do not import hooks or compute business logic; state is owned by `App.jsx` and passed down via props.

### `Layout`
**Props**:
- `currentPage` (String): Current active page ID (`"dashboard"`, `"tracker"`, `"reports"`).
- `setCurrentPage` (Function): Navigation state setter used by `Sidebar` to switch pages.
- `itemCounts` (Object): Pre-computed `{ open, overdue, critical }` counts for the `TopBar` stat pills.
- `children` (ReactNode): The active page component to render in the main content area.

**Visual Description**: Full-viewport-height flex wrapper. On desktop it shows a persistent 240px sidebar on the left and a flexible right column containing the `TopBar` and a scrollable main content area. On mobile devices the sidebar is hidden by default and toggles as a fixed overlay.

**Responsibilities**:
- Provides the application shell and responsive layout scaffolding.
- Owns mobile sidebar visibility state (`sidebarOpen`).
- Renders `Sidebar`, `TopBar`, and the active page passed as `children`.

**NOT Responsible For**:
- Computing metrics or managing POAM data.
- Deciding which page to render (that is handled by `App.jsx`).

---

### `Sidebar`
**Props**:
- `currentPage` (String): Current active page ID.
- `setCurrentPage` (Function): Callback fired when a navigation item is selected.

**Visual Description**: A full-height white column with a right border. The top section displays a shield logo, the app name "POA&M Tracker", and the subtitle "GRC Compliance Tool". The center contains three stacked navigation options (Dashboard, POA&M Tracker, Reports) represented by inline SVG icons and labels. Active navigation items receive a left blue border, light blue background, and blue text. The bottom features small regulatory labels: "NIST SP 800-53 Rev 5" and "FedRAMP Aligned".

**Responsibilities**:
- Render the main application navigation.
- Visually indicate the active page.
- Call `setCurrentPage` when the user selects a different route.

**NOT Responsible For**:
- Knowing how navigation affects the rest of the app.
- Reading or writing `localStorage`, POAM data, or filter state.

---

### `TopBar`
**Props**:
- `currentPage` (String): Used to dynamically set the header title.
- `toggleSidebar` (Function): Callback for the mobile hamburger button.
- `itemCounts` (Object): Pre-computed `{ open, overdue, critical }` counts.

**Visual Description**: A 64px-high white header with a bottom border. The left side shows a hamburger button (visible only on mobile) and the current page title ("Dashboard", "POA&M Tracker", or "Reports & Export"). The right side displays three rounded stat pills with colored dot indicators showing open POA&M count, overdue count, and active critical count. The stat pills are hidden on mobile viewports.

## Layout Components

> All layout components are purely presentational. They do not import hooks or compute business logic; state is owned by `App.jsx` and passed down via props.

### `Layout`
**Props**:
- `currentPage` (String): Current active page ID (`"dashboard"`, `"tracker"`, `"reports"`).
- `setCurrentPage` (Function): Navigation state setter used by `Sidebar` to switch pages.
- `itemCounts` (Object): Pre-computed `{ open, overdue, critical }` counts for the `TopBar` stat pills.
- `children` (ReactNode): The active page component to render in the main content area.

**Visual Description**: Full-viewport-height flex wrapper. On desktop it shows a persistent 240px sidebar on the left and a flexible right column containing the `TopBar` and a scrollable main content area. On mobile devices the sidebar is hidden by default and toggles as a fixed overlay.

**Responsibilities**:
- Provides the application shell and responsive layout scaffolding.
- Owns mobile sidebar visibility state (`sidebarOpen`).
- Renders `Sidebar`, `TopBar`, and the active page passed as `children`.

**NOT Responsible For**:
- Computing metrics or managing POAM data.
- Deciding which page to render (that is handled by `App.jsx`).

---

### `Sidebar`
**Props**:
- `currentPage` (String): Current active page ID.
- `setCurrentPage` (Function): Callback fired when a navigation item is selected.

**Visual Description**: A full-height white column with a right border. The top section displays a shield logo, the app name "POA&M Tracker", and the subtitle "GRC Compliance Tool". The center contains three stacked navigation options (Dashboard, POA&M Tracker, Reports) represented by inline SVG icons and labels. Active navigation items receive a left blue border, light blue background, and blue text. The bottom features small regulatory labels: "NIST SP 800-53 Rev 5" and "FedRAMP Aligned".

**Responsibilities**:
- Render the main application navigation.
- Visually indicate the active page.
- Call `setCurrentPage` when the user selects a different route.

**NOT Responsible For**:
- Knowing how navigation affects the rest of the app.
- Reading or writing `localStorage`, POAM data, or filter state.

---

### `TopBar`
**Props**:
- `currentPage` (String): Used to dynamically set the header title.
- `toggleSidebar` (Function): Callback for the mobile hamburger button.
- `itemCounts` (Object): Pre-computed `{ open, overdue, critical }` counts.

**Visual Description**: A 64px-high white header with a bottom border. The left side shows a hamburger button (visible only on mobile) and the current page title ("Dashboard", "POA&M Tracker", or "Reports & Export"). The right side displays three rounded stat pills with colored dot indicators showing open POA&M count, overdue count, and active critical count. The stat pills are hidden on mobile viewports.

**Responsibilities**:
- Provide page context through the dynamic title.
- Surface the most important high-level statistics at a glance.
- Trigger the mobile sidebar toggle.

**NOT Responsible For**:
- Computing `itemCounts` (received from `App.jsx`).
- Performing CRUD or filtering operations.

---

## Shared Components

### `Modal`
**Props**: `isOpen`, `onClose`, `title`, `children`, `size` ('md' | 'lg' | 'xl')
**Purpose**: A reusable modal shell component providing a fixed backdrop, accessible close button, scrollable body, and flexible sizing.

### `ConfirmDialog`
**Props**: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmLabel`, `confirmColor`
**Purpose**: Wraps `Modal` to provide a standard confirmation prompt (e.g., for deleting records).

### `ExportButton`
**Props**: `enrichedItems`, `filteredCount`
**Purpose**: Triggers the CSV export function (`exportToCSV`) and displays the number of currently filtered items to be exported.

### `Toast`
**Props**: `message`, `type` ('success' | 'error' | 'info'), `onDismiss`
**Purpose**: A global toast notification component that slides up from the bottom right to display non-blocking alerts to the user.

---

## Reports Components

### `Reports` (Page Component)
**Props**: `enrichedItems`
**Purpose**: A read-only analytical view designed for executives and auditors.
**Key Features**:
- **Executive Summary**: 2x3 grid displaying KPIs (Total, Open, Completed %, SLA Breach %, Avg Risk, Critical/High Open).
- **Narrative Generator**: Automatically constructs a plain-English summary of the current security posture.
- **By Control Family Table**: Aggregates items by NIST family, calculating average risk and SLA status.
- **By Responsible POC Table**: Aggregates items by assigned POC, highlighting their specific overdue rates.
- **Exports & Reset**: Provides full CSV export options and a "Danger Zone" button to reset the app to seed data.

---

## Tracker Components

### `FilterBar`
**Props**: Filter states and setters (`searchQuery`, `filterSeverity`, etc.), `activeFilterCount`, `items`
**Purpose**: Provides UI controls for filtering the main data table. Includes a debounced search input, and dropdowns for Severity, Status, Control Family, and SLA Status. Does not modify data directly, only sets state via props.

### `POAMTable`
**Props**: `filteredItems`, `onEdit`, `onDelete`, `sortField`, `sortDirection`, `setSort`
**Purpose**: The main data table rendering the `filteredItems`. Features a sticky header, click-to-sort columns, zebra striping, and visual status indicators. Displays `RiskScoreBadge` and `StatusBadge` cells. Provides row-level Actions (Edit/Delete).

### `StatusBadge` & `RiskScoreBadge`
**Purpose**: Small visual indicator components for status, SLA, severity, and risk scores. Styled according to `constants.js` and `useRiskScore`.

### `POAMDetailModal`
**Props**: `isOpen`, `onClose`, `item`, `onEdit`, `onUpdateStatus`, `showToast`
**Purpose**: A read-only detail view of a single POA&M item. Includes a "Quick Resolve" section for Open/In Progress items that allows users to instantly mark the item as Completed, Risk Accepted, or Cancelled via an inline confirmation workflow. Also displays frozen days overdue.

---

## Form Components

### `AddPOAMModal`
**Props**: `isOpen`, `onClose`, `onAdd`
**Purpose**: A large modal form for creating a new POA&M item. Uses vanilla controlled inputs. Performs validation on submit and displays error messages if required fields are missing.

### `EditPOAMModal`
**Props**: `isOpen`, `onClose`, `item`, `onUpdate`
**Purpose**: Similar to the Add modal, but pre-populated with the target `item`'s data. Includes the ability to update the item's Status, with an informative alert displayed if changing status to "Completed".
