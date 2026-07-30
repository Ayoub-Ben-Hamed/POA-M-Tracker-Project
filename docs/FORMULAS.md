# POA&M Formulas and Calculations

## SLA Aging

### What is SLA Aging?
In a federal cybersecurity context, a Service Level Agreement (SLA) for a POA&M item defines the maximum acceptable timeframe to remediate a security finding based on its risk severity. This ensures that Critical and High vulnerabilities are prioritized and fixed promptly, while giving more time for Moderate and Low findings. SLA aging tracks how long a weakness has been open and whether it is approaching or has exceeded its required remediation deadline.

### Formulas

1. **Days Open**: Number of days since the weakness was identified.
   `Days Open = Today - Date Identified`

2. **Days Until Milestone**: Number of days remaining until the scheduled completion date.
   `Days Until Milestone = Scheduled Completion Date - Today`
   *(Negative values indicate the item is overdue)*

3. **Days Overdue**: 
   - **For Open Items**: `If Days Until Milestone < 0 then Math.abs(Days Until Milestone), else 0`
   - **For Closed Items (Frozen Logic)**: If `dateOfClosure` is set, `Days Overdue` is frozen to the number of days the item was overdue at the time of closure (`Days Between Scheduled Completion Date and Date of Closure`), or `0` if closed on or before the deadline.

4. **SLA Allowed Days**: Lookup based on severity:
   - Critical: 15 days
   - High: 30 days
   - Moderate: 90 days
   - Low: 365 days

5. **SLA Percent Used**:
   `(Days Open / SLA Allowed Days) * 100` (Capped at 200%)
   *Example: A High severity item open for 15 days: (15 / 30) * 100 = 50%*

### SLA Status Decision Flowchart

```text
Is Status "Completed", "Cancelled", or "Risk Accepted"?
├── YES ────────> Status = "Completed"
└── NO 
    ├── Days Overdue > 30?
    │   ├── YES ────────> Status = "Severely Overdue"
    │   └── NO 
    │       ├── Days Overdue > 0?
    │       │   ├── YES ────────> Status = "Overdue"
    │       │   └── NO 
    │       │       ├── Days Until Milestone <= 14?
    │       │       │   ├── YES ────────> Status = "At Risk"
    │       │       │   └── NO ─────────> Status = "On Track"
```

---

## Risk Score Engine

The Risk Score provides a dynamic 0 to 10 metric that increases as an item sits open or becomes overdue, highlighting items that pose the greatest risk to the organization.

### Formula
`Raw Score = Severity Base × Asset Criticality Multiplier × Overdue Multiplier`
`Final Score = Math.min(10, Raw Score) rounded to 2 decimal places`

### Components

**1. Severity Base**
- Critical → 10
- High → 7
- Moderate → 4
- Low → 1

**2. Asset Criticality Multiplier**
- Critical → 1.5
- High → 1.25
- Moderate → 1.0
- Low → 0.75

**3. Overdue Multiplier**
- If Days Overdue = 0 → 1.0
- If Days Overdue 1-30 → `1.0 + (Days Overdue / 30) * 0.3` *(scales 1.0 to 1.3)*
- If Days Overdue 31-90 → `1.3 + ((Days Overdue - 30) / 60) * 0.4` *(scales 1.3 to 1.7)*
- If Days Overdue > 90 → 2.0 *(maximum)*

### Full Worked Example
*Scenario: A **High severity** finding on a **Critical asset** that is **45 days overdue**.*

1. **Severity Base**: High = 7
2. **Asset Multiplier**: Critical = 1.5
3. **Overdue Multiplier**: 45 days falls in the 31-90 range.
   `1.3 + ((45 - 30) / 60) * 0.4` = `1.3 + (15 / 60) * 0.4` = `1.3 + (0.25) * 0.4` = `1.3 + 0.1` = 1.4
4. **Calculate Raw Score**: `7 × 1.5 × 1.4 = 14.7`
5. **Apply Cap**: `Math.min(10, 14.7) = 10.00`

### Special Status Rules
- **Completed or Cancelled**: Risk Score = 0
  *(Remediated or invalid findings pose no risk)*
- **Risk Accepted**: Cap the final Risk Score at 5.0
  *(The Authorizing Official has formally acknowledged and accepted the risk, meaning it is no longer deemed unmanaged, keeping it moderate)*
