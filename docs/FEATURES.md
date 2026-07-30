# FEATURES DOCUMENTATION

> **Last Updated**: 2026-07-14 — After Prompt 6 (Tracker)

---

## POA&M Tracker

The Tracker page provides the main interface for viewing, filtering, sorting, and managing the individual Plan of Action and Milestones (POA&M) records.

### Filtering System
The `FilterBar` provides a multi-dimensional filtering experience:
- **Debounced Search**: A text input that searches across Title, Description, Control ID, Asset, and POC. Uses a 300ms debounce to prevent excessive re-renders while typing.
- **Categorical Dropdowns**: Filters for Severity, Status, Control Family, and SLA Status. The Control Family dropdown intelligently disables options for families that are not present in the current dataset.
- **AND Logic**: All active filters are combined using AND logic. An item must match the search query AND all selected dropdowns to be visible.
- **Clear Filters**: A dedicated button clears all active filters (appearing only when filters are applied).

### Sorting
Clicking column headers in the `POAMTable` cycles the sort direction (ascending -> descending). 
- **Risk Score / Days Overdue**: Sorted numerically.
- **Severity**: Sorted by semantic order (Critical > High > Moderate > Low).
- **Dates**: Sorted chronologically.
- **Text Fields**: Sorted alphabetically.

### Item Resolution and Detail View
Clicking on any row in the `POAMTable` opens the `POAMDetailModal`. This read-only view displays all fields in a clean, two-column layout. 
- **Frozen Overdue Status**: When an item is marked as "Completed", "Risk Accepted", or "Cancelled", its `dateOfClosure` is set and its `daysOverdue` value is permanently "frozen" at the exact number of days it was overdue at the time of closure (or 0 if on time). This frozen value is displayed in purple text in the table and detail view.
- **Quick Resolve**: If the item is Open or In Progress, the detail modal presents a "Resolve this item" section with buttons to immediately Mark Complete, Accept Risk, or Cancel. This utilizes an inline confirmation workflow before saving the updated status.

### CRUD Operations
All item modifications are handled via dedicated modals to ensure a focused user experience and validate input before saving.
- **Add POA&M**: Requires completing all mandatory fields. Auto-generates a sequential ID (e.g., `POAM-2026-001`).
- **Edit POA&M**: Pre-populates the form. Changing the status to "Completed" displays an info box explaining that the completion date will be auto-set.
- **Delete POA&M**: Prompts with a `ConfirmDialog` to prevent accidental data loss.

### CSV Export
The `ExportButton` allows users to download the currently filtered view of the table as a CSV file. The export includes all key data points (ID, Title, Control, Severity, Status, Dates, POC) and the computed Risk Score.

### Keyboard Accessibility
- The main data table is fully accessible via keyboard.
- Edit and Delete icon buttons include descriptive `aria-label` attributes specifying the target POA&M ID (e.g., "Edit POAM-2024-001") for screen readers.
- Modals trap focus appropriately and can be dismissed via keyboard actions or clicking the backdrop.

---

## Dashboard

The Dashboard page provides a real-time overview of POA&M remediation status and organizational risk posture. It is divided into four visual rows containing six components.

### SummaryCards

**Component**: `src/components/dashboard/SummaryCards.jsx`

**What it shows**: Four KPI metric cards at the top of the dashboard:
1. **Open POA&Ms** — count of items with status "Open" or "In Progress"
2. **SLA Breaches** — count of items with slaStatus "Overdue" or "Severely Overdue"
3. **Avg Risk Score** — weighted average risk score of all active (Open/In Progress) items
4. **Closed This Month** — items completed within the current calendar month

**How data is calculated**:
- Open count: filter enrichedItems where `status === "Open" || status === "In Progress"`
- SLA breaches: filter where `slaStatus === "Overdue" || slaStatus === "Severely Overdue"`
- Average risk score: sum all `riskScore` values for Open/In Progress items, divide by count, round to 1 decimal
- Closed this month: filter Completed items where `dateOfClosure` falls in the current month and year

**Chart type**: Metric cards (not charts) — chosen because KPIs need to be scannable at a glance without interaction.

**GRC analyst decision**: Quickly assess whether the program is under control (low breach count, declining open items) or needs escalation (rising breaches, high risk score).

---

### OpenByFamilyChart

**Component**: `src/components/dashboard/OpenByFamilyChart.jsx`

**What it shows**: Horizontal bar chart of open/in-progress items grouped by NIST SP 800-53 control family. Bars are colored by the highest severity item in each family.

**How data is calculated**:
- Filter enrichedItems to Open + In Progress status
- Group by `controlFamily` (2-letter code)
- Count items per family, sort descending by count
- Color each bar by inspecting all items in that family: if any Critical → red, else if any High → orange, else if any Moderate → amber, else green

**Chart type**: Horizontal bar chart — chosen because control family codes are categorical labels that read naturally on the Y-axis, and horizontal bars make it easy to compare relative counts across families.

**GRC analyst decision**: Identify which NIST control families have the most unresolved weaknesses. A concentration in one family (e.g., SI — System Integrity) suggests a systemic gap that may require a targeted remediation program rather than individual fixes.

---

### SeverityBreakdownChart

**Component**: `src/components/dashboard/SeverityBreakdownChart.jsx`

**What it shows**: Donut chart showing ALL items (excluding Cancelled) broken down by severity: Critical, High, Moderate, Low.

**How data is calculated**:
- Filter out Cancelled items
- Count items per severity level
- Calculate percentage of each severity relative to total
- Display total count in the donut hole

**Chart type**: Donut (pie with inner radius) — chosen because severity is a categorical whole-to-part relationship. The donut hole adds a total count, and the thin ring is visually elegant.

**GRC analyst decision**: Understand the severity distribution of the entire portfolio. A heavy skew toward Critical/High items signals urgent resource allocation needs.

---

### SLAComplianceChart

**Component**: `src/components/dashboard/SLAComplianceChart.jsx`

**What it shows**: SLA compliance as a proportional stacked horizontal bar with a summary table. Shows On Track, At Risk, Overdue, and Severely Overdue segments.

**How data is calculated**:
- Filter to items where `slaStatus !== "Completed"` (excludes Completed, Cancelled, Risk Accepted)
- Count items in each SLA status bucket
- Calculate On Track percentage as headline metric
- Summary table shows count, percentage, and recommended action per status

**Chart type**: Pure CSS stacked bar (not Recharts) — chosen because this is a single proportional comparison, not a data series. CSS is simpler, more accessible, and renders instantly without a charting library.

**GRC analyst decision**: The On Track percentage is a key ATO (Authority to Operate) health indicator. Below ~70% signals the program may not meet compliance deadlines. The action column in the table provides immediate next steps per status category.

---

### TopRiskTable

**Component**: `src/components/dashboard/TopRiskTable.jsx`

**What it shows**: Table of the top 5 items ranked by composite risk score, excluding Completed and Cancelled items.

**How data is calculated**:
- Uses `getTopRiskItems(enrichedItems, 5)` from the `useRiskScore` hook
- This filters to active items (not Completed/Cancelled), sorts by `riskScore` descending, takes top 5
- Risk score is the composite 0–10 score calculated by the `riskScore.js` utility (severity × asset criticality × overdue multiplier)

**Columns**: Risk Score (badge), POA&M ID, Title (truncated to 40 chars), Severity (badge), Days Overdue, POC (with avatar initials)

**Chart type**: HTML table — chosen because ranked lists with multiple attributes per item are best displayed in tabular format for scanability and comparison.

**GRC analyst decision**: These are the items that need immediate attention. The combination of high severity, critical assets, and overdue status creates compounding risk. An analyst would prioritize meetings with the listed POCs to discuss acceleration.

---

### TrendLineChart

**Component**: `src/components/dashboard/TrendLineChart.jsx`

**What it shows**: 12-month area chart with two lines — "Open Items" and "Closed Items" — showing how the portfolio evolves over time.

**How data is calculated** (simulated from item dates):
- For each of the past 12 months (current month − 11 to current month):
  - **Open count**: items where `dateIdentified` ≤ month end AND (still Open/In Progress OR `dateOfClosure` > month end)
  - **Closed cumulative**: items where `dateOfClosure` ≤ month end
- This creates a realistic S-curve: open items accumulate then plateau as closures ramp up

**Assumptions**: This chart uses **simulated historical data** — there is no actual time-series database. The simulation reconstructs what the portfolio looked like at each month-end based on identification dates and completion dates.

**Chart type**: Area chart with gradient fill — chosen because trends over time are best represented by line/area charts. The gradient fill adds depth and makes the relationship between the two curves (open vs. closed) more visually apparent. Smooth monotone curves with thick strokes create a premium feel.

**GRC analyst decision**: If the open line is flat or rising while the closed line is flat, the remediation program is falling behind. The ideal trend is an open line that peaks and then decreases as the closed line rises — showing the program is catching up.

---

## Federal GRC Context

### Why SLA Compliance Rate Matters
SLA compliance directly impacts **ATO (Authority to Operate) renewal risk**. Federal systems operate under an ATO granted by an Authorizing Official (AO). A high number of overdue POA&M items signals that the organization is not remediating weaknesses within the timeframes established in the System Security Plan (SSP). During annual assessments or continuous monitoring reviews, an SLA compliance rate below organizational thresholds can trigger:
- **ATO conditions**: The AO may issue conditions on the ATO requiring accelerated remediation
- **ATO denial**: In severe cases, the system may lose its authority to operate
- **Audit findings**: Independent assessors will flag consistently missed milestones as a programmatic weakness

### Why Risk Score Changes Over Time
Risk scores incorporate an **aging/overdue multiplier** that increases exponentially as items remain unresolved past their SLA deadlines. This reflects the reality that:
- **Threat actors actively scan for known vulnerabilities** — the longer a weakness persists, the higher the probability of exploitation
- **Attack surfaces compound** — unresolved weaknesses interact with each other, creating multi-stage attack paths
- **Regulatory exposure increases** — overdue items represent known-but-unaddressed risks, which carry higher liability than unknown risks in federal compliance frameworks

### Why Control Family Grouping Matters
Concentrations of open items in specific NIST SP 800-53 control families reveal **systemic weaknesses** rather than isolated issues. For example:
- Multiple items in **AC (Access Control)** may indicate fundamental identity and access management infrastructure gaps
- A cluster in **SI (System and Information Integrity)** often points to patching program deficiencies
- High counts in **CM (Configuration Management)** suggest a lack of automated baseline enforcement

Systemic weaknesses require programmatic solutions (tool procurement, process redesign, staffing) rather than one-off fixes.

### Why Trend Line Matters
The 12-month trend reveals whether the **remediation program is improving or degrading** over time:
- **Healthy programs** show the open items curve peaking and then declining as closed items accumulate
- **Degrading programs** show steadily rising open items with a flat or slowly-growing closed count
- **Stagnant programs** show both lines flat — new items are identified at roughly the same rate they are closed, but the backlog never decreases

The trend line is the most important strategic metric because it answers the fundamental question: "Are we getting better or worse at managing our security posture?"

---

## Reports

The Reports page is a read-only, high-level summary view designed for executives, auditors, and stakeholders.

### Executive Summary
A 2x3 grid of key performance indicators:
- **Total POA&M Items**: The raw count of all items in the system.
- **Open + In Progress**: Items currently requiring remediation.
- **Completed**: Count of finished items, with a percentage relative to the total.
- **SLA Breach Rate**: The percentage of *active* items (excluding Completed/Cancelled/Risk Accepted) that are "Overdue" or "Severely Overdue".
- **Average Risk Score**: The mean risk score across all open/in-progress items (1 decimal place).
- **Critical/High Open**: A count of the most severe active items.

### Auto-generated Narrative
Below the metrics is a dynamically generated paragraph that translates the raw numbers into a plain-English summary. It highlights the total open count, SLA breach rate, and specifically calls out the single highest-risk item (title, severity, days overdue, and score) to focus executive attention.

### By Control Family Table
Groups all items by their NIST Control Family.
- Shows total, open, and overdue counts per family.
- Calculates the average risk score for that specific family.
- Assigns a **Status**:
  - `Needs Attention` (Red): If *any* item in the family is Severely Overdue.
  - `Monitor` (Orange): If *any* item is Overdue (but none severely).
  - `On Track` (Green): If no items are overdue.
- The table is automatically sorted by Average Risk Score (highest first).

### By Responsible POC Table
Groups all items by the assigned Point of Contact (POC).
- Shows their total assigned workload, open items, and overdue items.
- Calculates their specific **Overdue Rate** (percentage of their assigned active items that are overdue).
- The Overdue Rate is color-coded: Red (> 30%), Amber (10-30%), Green (< 10%).
- Automatically sorted by Overdue Rate (highest burden at the top).

### Export Options
Provides three distinct CSV export options using the `exportToCSV` utility:
- **Export All Items**: Dumps the entire dataset.
- **Export Open Items Only**: Filters out Completed, Cancelled, and Risk Accepted items.
- **Export Overdue Items**: Filters specifically for items currently breaching their SLAs.

### Reset to Seed Data
A "Danger Zone" button that allows users to wipe all `localStorage` modifications and restore the application to the original 28 JSON seed items. It includes a confirmation dialog to prevent accidental data loss.
