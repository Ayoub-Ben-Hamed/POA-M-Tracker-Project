# POA&M Tracker — Data Model Reference

## What is a POA&M?

A **Plan of Action and Milestones (POA&M)** is a federal information security document that identifies tasks needing completion in order to resolve known security weaknesses found in an information system. Every federal agency that operates under FISMA (Federal Information Security Modernization Act) is required to maintain POA&Ms for each system that has been granted an Authority to Operate (ATO).

POA&Ms serve as the primary mechanism for tracking the remediation of security findings discovered through vulnerability scans, penetration tests, security assessments, audits, and continuous monitoring activities. When an assessor or automated tool identifies a weakness — such as a missing patch, a misconfigured firewall rule, or inadequate access controls — that finding is recorded as a POA&M item with an assigned owner, a remediation plan, and a target completion date.

The POA&M is a living document. It is reviewed regularly by the Information System Security Officer (ISSO), the Authorizing Official (AO), and other stakeholders to track progress toward remediation. Items that are not remediated within the agreed-upon timeframe become "overdue" and may trigger escalation, risk acceptance decisions, or supplemental reporting requirements.

In a mature cybersecurity program, POA&Ms are not just compliance artifacts — they are operational tools that provide visibility into the organization's risk posture. An effective POA&M tracker allows security teams to prioritize remediation by severity, track aging of open findings, monitor SLA compliance, and report risk trends to leadership. This application implements that capability as a self-contained, client-side web application.

---

## Field Reference

Every POAM item stored in the application has exactly the fields documented below. No additional fields should be added to the data model.

### Stored Fields (persisted in JSON / localStorage)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `string` | Format: `POAM-YYYY-NNN` | Unique identifier. Year indicates when the item was created. Sequential number resets annually. Example: `POAM-2025-001`. |
| `title` | `string` | Max 80 characters | Short, descriptive name for the weakness or finding. Should be specific enough to identify the issue without reading the full description. |
| `description` | `string` | 2-3 sentences | Detailed explanation of the security weakness, its impact, and why it matters. Should reference specific technologies, CVEs, or policy requirements where applicable. |
| `detectionSource` | `string` | Enum: `"vulnerability_scan"`, `"penetration_test"`, `"audit"`, `"self_assessment"`, `"continuous_monitoring"` | How the weakness was initially discovered. This field is important for metrics reporting — it shows whether the organization is proactively finding issues or if they are being found by external assessors. |
| `controlId` | `string` | NIST 800-53 control identifier (e.g., `"IA-5"`, `"AC-17"`) | The specific NIST control that this weakness maps to. Used for compliance reporting and for grouping findings by control family. |
| `controlFamily` | `string` | 2-letter code (e.g., `"IA"`, `"AC"`, `"SI"`) | The NIST 800-53 control family. Must match one of the 20 official families. Used for dashboard charts and grouping. |
| `controlFamilyName` | `string` | Full family name | Human-readable name of the control family (e.g., `"Identification and Authentication"`). Must correspond to the `controlFamily` code. |
| `severity` | `string` | Enum: `"Critical"`, `"High"`, `"Moderate"`, `"Low"` | The risk severity of the finding. Determines SLA thresholds and prioritization. Critical findings have the shortest remediation windows. |
| `assetAffected` | `string` | Realistic system name | The information system, component, or infrastructure element affected by this weakness. |
| `assetCriticality` | `string` | Enum: `"Critical"`, `"High"`, `"Moderate"`, `"Low"` | How important the affected asset is to the organization's mission. A "Low" severity finding on a "Critical" asset may warrant faster remediation than a "High" severity finding on a "Low" criticality asset. |
| `responsiblePOC` | `string` | Full name | The person responsible for driving remediation of this item. This is the individual who will be held accountable for progress. |
| `dateIdentified` | `string` | ISO format: `YYYY-MM-DD` | The date when the weakness was first discovered or reported. This is the starting point for SLA aging calculations. |
| `originalMilestoneDate` | `string` | ISO format: `YYYY-MM-DD` | The initially agreed-upon deadline for completing remediation. This date is set when the POA&M item is created and should not change — it provides a historical record of the original commitment. |
| `scheduledCompletionDate` | `string` | ISO format: `YYYY-MM-DD` | The current target date for remediation. This may differ from `originalMilestoneDate` if the deadline has been extended. Used for SLA calculations. |
| `dateOfClosure` | `string \| null` | ISO format or `null` | The date remediation was actually completed. `null` for items that are not yet completed (status is `Open` or `In Progress`). Must be set for `Completed` items. |
| `status` | `string` | Enum: `"Open"`, `"In Progress"`, `"Completed"`, `"Risk Accepted"`, `"Cancelled"` | Current lifecycle state. `Open` = not yet started; `In Progress` = active remediation; `Completed` = remediated and verified; `Risk Accepted` = AO has formally accepted the risk; `Cancelled` = finding was invalidated or superseded. |
| `milestoneNotes` | `string` | Free text | Progress notes, blockers, dependencies, or next steps. Updated regularly to provide visibility into remediation activity. |
| `resourceEstimate` | `string` | Hours or dollars (e.g., `"40 hours"`, `"$5,000"`) | Estimated resources needed for remediation. May be expressed in labor hours, contract costs, or procurement amounts. |
| `vendorDependency` | `boolean` | `true` or `false` | Whether remediation depends on action by an external vendor (e.g., waiting for a patch, a license, or a service). Vendor-dependent items are at higher risk of delay. |
| `lastUpdated` | `string` | ISO format: `YYYY-MM-DD` | The date the POA&M item was last modified. Used for tracking staleness — items not updated in 30+ days may need attention. |

### Computed Fields (calculated at runtime, NEVER stored)

| Field | Type | Description |
|-------|------|-------------|
| `slaStatus` | `string` | Calculated based on how the `scheduledCompletionDate` compares to today. Values: `"On Track"`, `"At Risk"`, `"Overdue"`, `"Severely Overdue"`, `"Completed"`. |
| `daysOverdue` | `number` | Number of days past the `scheduledCompletionDate`. Zero or negative for items not yet overdue. |
| `riskScore` | `number` | A composite score (0-10) calculated from severity, asset criticality, days overdue, and vendor dependency. Higher is worse. |

### Why are slaStatus, daysOverdue, and riskScore computed?

These three fields are intentionally **not stored** in the JSON or localStorage because:

1. **They change every day.** `daysOverdue` increases by 1 each day an item remains open past its deadline. Storing it would require daily recalculation and rewriting of all items.
2. **They are derived from stored fields.** Each can be deterministically computed from the stored fields plus the current date. Storing derived data creates a risk of inconsistency.
3. **The risk score formula may evolve.** By computing it at runtime, the formula can be updated without needing to migrate stored data.
4. **It keeps the data model clean.** The JSON file and localStorage contain only source-of-truth data, making it easier to audit, export, and import.

---

## Data Persistence Strategy

```
┌──────────────────┐     first load     ┌──────────────────┐
│  poams.json      │ ─────────────────► │  localStorage    │
│  (seed data)     │                    │  (working copy)  │
└──────────────────┘                    └──────────────────┘
                                               │
                                          all CRUD ops
                                               │
                                        ┌──────┴──────┐
                                        │  React app  │
                                        │  (in-memory │
                                        │   state)    │
                                        └─────────────┘
```

1. **First Load**: The app checks `localStorage` for a key (e.g., `poam-tracker-data`). If the key does not exist, the app fetches `public/data/poams.json` via HTTP, parses it, and writes the array to `localStorage`.
2. **Subsequent Loads**: The app reads from `localStorage` directly. The JSON file is never read again.
3. **All Mutations**: Create, update, and delete operations modify the in-memory React state and simultaneously persist the full array back to `localStorage`.
4. **No Backend**: There is no server, no database, and no API. This is a fully client-side application. Data persists across page refreshes via `localStorage` but is specific to the browser instance.
5. **Reset**: To re-seed the data, the user can clear `localStorage` (or a future "Reset Data" button can delete the key), which will trigger a fresh read from the JSON file on next load.

---

## Full JSON Schema (Code Block)

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

### Enum Values Quick Reference

| Field | Allowed Values |
|-------|---------------|
| `detectionSource` | `vulnerability_scan`, `penetration_test`, `audit`, `self_assessment`, `continuous_monitoring` |
| `severity` | `Critical`, `High`, `Moderate`, `Low` |
| `assetCriticality` | `Critical`, `High`, `Moderate`, `Low` |
| `status` | `Open`, `In Progress`, `Completed`, `Risk Accepted`, `Cancelled` |
