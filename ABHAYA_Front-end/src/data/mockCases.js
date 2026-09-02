// Mock victim support cases for ABHAYA system
// Note: All names, IDs, locations, and details are strictly fictional demo data.

export const MOCK_CASES = [
  {
    id: "case-001",
    caseId: "ABH-2026-0891",
    firNo: "FIR-2026/0412",
    caseType: "Domestic Violence & Cyber Harassment",
    status: "Active Monitoring",
    registeredOn: "2026-07-14",
    incidentDate: "2026-07-10",
    incidentLocation: "Sector 14, Zone B, Metro District",
    policeStation: "Central Police Station - Division 4",
    assignedOfficer: "Insp. Rajesh Sharma (ID: OFF-8821)",
    assignedSocialWorker: "Dr. Ananya Roy (ID: SW-402)",
    wellBeingScore: 64,
    wellBeingCategory: "Attention Required", // 41-70
    trend: "increasing", // increasing | decreasing | stable
    lastCheckIn: "2026-09-01 09:30 AM",
    victimInitials: "V.S. (Case #0891)",
    riskLevel: "medium",
    activity: [
      { id: "act-1", timestamp: "2026-09-01 09:30 AM", title: "Automated Check-in", description: "Completed scheduled morning check-in questionnaire." },
      { id: "act-2", timestamp: "2026-08-29 04:15 PM", title: "Social Worker Intervention", description: "Telephonic counseling session conducted by Dr. Ananya Roy." },
      { id: "act-3", timestamp: "2026-08-25 11:00 AM", title: "Police Case Status Update", description: "Protection order documentation submitted to district magistrate." },
      { id: "act-4", timestamp: "2026-07-14 02:30 PM", title: "Case Registered", description: "FIR filed under Section 498A / Cyber Cell assistance initiated." }
    ],
    aiSignals: [
      { id: "sig-1", type: "Language Shift", severity: "medium", detail: "35% increase in negative emotional sentiment keywords in daily check-in logs over the last 7 days." },
      { id: "sig-2", type: "Missed Check-ins", severity: "high", detail: "2 consecutive missed evening check-in intervals between Aug 29 and Aug 31." },
      { id: "sig-3", type: "Response Pattern", severity: "medium", detail: "Delayed response latency during routine inquiry prompts (average delay extended from 12 mins to 4 hours)." }
    ]
  },
  {
    id: "case-002",
    caseId: "ABH-2026-0904",
    firNo: "FIR-2026/0438",
    caseType: "Aggravated Stalking & Threat",
    status: "Urgent Intervention Needed",
    registeredOn: "2026-08-02",
    incidentDate: "2026-07-30",
    incidentLocation: "North Enclave, Ward 7",
    policeStation: "North Town Station - Division 2",
    assignedOfficer: "Sub-Insp. Vikram Singh (ID: OFF-9142)",
    assignedSocialWorker: "Meera Deshmukh (ID: SW-311)",
    wellBeingScore: 82,
    wellBeingCategory: "Urgent Support Needed", // 71-100
    trend: "increasing",
    lastCheckIn: "2026-08-31 08:45 PM",
    victimInitials: "R.K. (Case #0904)",
    riskLevel: "high",
    activity: [
      { id: "act-10", timestamp: "2026-08-31 08:45 PM", title: "Emergency Distress Flag Triggered", description: "Distress score crossed critical threshold of 80." },
      { id: "act-11", timestamp: "2026-08-30 02:00 PM", title: "Safety Protocol Initiated", description: "Assigned social worker flagged case for priority outreach." },
      { id: "act-12", timestamp: "2026-08-02 10:15 AM", title: "Case Registered", description: "FIR registered under Stalking and Criminal Intimidation provisions." }
    ],
    aiSignals: [
      { id: "sig-10", type: "Acute Emotional Distress", severity: "high", detail: "High frequency of panic and anxiety indicators in self-reported mood tracking." },
      { id: "sig-11", type: "Erratic Activity Cycles", severity: "high", detail: "Disrupted sleep and activity patterns detected via check-in timestamp variances." },
      { id: "sig-12", type: "Safety Concern Expressed", severity: "high", detail: "Explicit expressions of fear regarding physical location compromise." }
    ]
  },
  {
    id: "case-003",
    caseId: "ABH-2026-0780",
    firNo: "FIR-2026/0389",
    caseType: "Workplace Harassment & Retaliation",
    status: "Stable",
    registeredOn: "2026-06-10",
    incidentDate: "2026-06-05",
    incidentLocation: "Tech Park Phase II, Outer Ring",
    policeStation: "Cyber Crimes & Women Safety Cell",
    assignedOfficer: "Insp. Sunita Patil (ID: OFF-7703)",
    assignedSocialWorker: "Priya Nair (ID: SW-509)",
    wellBeingScore: 28,
    wellBeingCategory: "Stable", // 0-40
    trend: "decreasing",
    lastCheckIn: "2026-09-01 10:15 AM",
    victimInitials: "M.P. (Case #0780)",
    riskLevel: "low",
    activity: [
      { id: "act-20", timestamp: "2026-09-01 10:15 AM", title: "Routine Check-in", description: "Score dropped to 28 (Stable range). Victim expressed confidence in ongoing legal proceedings." },
      { id: "act-21", timestamp: "2026-08-20 03:30 PM", title: "Counseling Session Complete", description: "Fourth support session concluded with positive outcome assessment." }
    ],
    aiSignals: [
      { id: "sig-20", type: "Positive Sentiment Trend", severity: "low", detail: "Gradual reduction in stress-related keywords over a 30-day period." }
    ]
  },
  {
    id: "case-004",
    caseId: "ABH-2026-0915",
    firNo: "FIR-2026/0465",
    caseType: "Domestic Violence & Economic Coercion",
    status: "Active Monitoring",
    registeredOn: "2026-08-15",
    incidentDate: "2026-08-12",
    incidentLocation: "Suburban Block C, Green Park",
    policeStation: "East District Women Station",
    assignedOfficer: "Sub-Insp. Amit Verma (ID: OFF-6239)",
    assignedSocialWorker: "Dr. Ananya Roy (ID: SW-402)",
    wellBeingScore: 52,
    wellBeingCategory: "Attention Required",
    trend: "stable",
    lastCheckIn: "2026-08-31 06:20 PM",
    victimInitials: "A.G. (Case #0915)",
    riskLevel: "medium",
    activity: [
      { id: "act-30", timestamp: "2026-08-31 06:20 PM", title: "Weekly Review", description: "Distress level constant in Attention Required bracket." },
      { id: "act-31", timestamp: "2026-08-18 11:30 AM", title: "Shelter Services Offered", description: "Information provided regarding temporary safe housing options." }
    ],
    aiSignals: [
      { id: "sig-30", type: "Financial Distress Expressions", severity: "medium", detail: "Repeated mentions of isolation and restricted financial access." },
      { id: "sig-31", type: "Sporadic Check-in", severity: "medium", detail: "Check-in frequency fluctuates significantly during weekends." }
    ]
  },
  {
    id: "case-005",
    caseId: "ABH-2026-0932",
    firNo: "FIR-2026/0491",
    caseType: "Acid Violence Threat & Assault",
    status: "Urgent Intervention Needed",
    registeredOn: "2026-08-24",
    incidentDate: "2026-08-23",
    incidentLocation: "Old Market Colony, Street 4",
    policeStation: "Central Police Station - Division 4",
    assignedOfficer: "Insp. Rajesh Sharma (ID: OFF-8821)",
    assignedSocialWorker: "Meera Deshmukh (ID: SW-311)",
    wellBeingScore: 89,
    wellBeingCategory: "Urgent Support Needed",
    trend: "increasing",
    lastCheckIn: "2026-09-01 08:00 AM",
    victimInitials: "S.B. (Case #0932)",
    riskLevel: "high",
    activity: [
      { id: "act-40", timestamp: "2026-09-01 08:00 AM", title: "Urgent Alert Flagged", description: "Score reached 89. Emergency counseling and police protection requested." },
      { id: "act-41", timestamp: "2026-08-25 09:00 AM", title: "Police Protection Assigned", description: "Station deployed female constable guard at temporary residence." }
    ],
    aiSignals: [
      { id: "sig-40", type: "Severe Trauma Indicators", severity: "high", detail: "High concentration of hyper-arousal and fear terminology." },
      { id: "sig-41", type: "Immediate Threat Signal", severity: "high", detail: "Check-in log notes reported proximity of suspect near victim workplace." }
    ]
  },
  {
    id: "case-006",
    caseId: "ABH-2026-0744",
    firNo: "FIR-2026/0312",
    caseType: "Marital Abuse & Custody Coercion",
    status: "Stable",
    registeredOn: "2026-05-18",
    incidentDate: "2026-05-15",
    incidentLocation: "Model Town Avenue, House #104",
    policeStation: "East District Women Station",
    assignedOfficer: "Sub-Insp. Amit Verma (ID: OFF-6239)",
    assignedSocialWorker: "Priya Nair (ID: SW-509)",
    wellBeingScore: 32,
    wellBeingCategory: "Stable",
    trend: "decreasing",
    lastCheckIn: "2026-08-30 05:45 PM",
    victimInitials: "D.K. (Case #0744)",
    riskLevel: "low",
    activity: [
      { id: "act-50", timestamp: "2026-08-30 05:45 PM", title: "Monthly Assessment", description: "Victim reports stable living situation and legal aid satisfaction." }
    ],
    aiSignals: [
      { id: "sig-50", type: "Stabilized Mood Metrics", severity: "low", detail: "Consistent daily engagement with zero missed check-in windows." }
    ]
  },
  {
    id: "case-007",
    caseId: "ABH-2026-0940",
    firNo: "FIR-2026/0510",
    caseType: "Online Extortion & Defamation",
    status: "Active Monitoring",
    registeredOn: "2026-08-28",
    incidentDate: "2026-08-26",
    incidentLocation: "University Hostels, South Campus",
    policeStation: "Cyber Crimes & Women Safety Cell",
    assignedOfficer: "Insp. Sunita Patil (ID: OFF-7703)",
    assignedSocialWorker: "Dr. Ananya Roy (ID: SW-402)",
    wellBeingScore: 68,
    wellBeingCategory: "Attention Required",
    trend: "increasing",
    lastCheckIn: "2026-09-01 11:10 AM",
    victimInitials: "T.R. (Case #0940)",
    riskLevel: "medium",
    activity: [
      { id: "act-60", timestamp: "2026-09-01 11:10 AM", title: "Social Media Takedown Filed", description: "Cyber cell reported formal removal notice to hosting platforms." },
      { id: "act-61", timestamp: "2026-08-28 04:00 PM", title: "Case Intake", description: "Initial psychological first aid provided by Dr. Roy." }
    ],
    aiSignals: [
      { id: "sig-60", type: "Social Isolation Indicators", severity: "high", detail: "Expressed feelings of acute shame and reluctance to attend academic classes." },
      { id: "sig-61", type: "Rapid Score Spike", severity: "medium", detail: "Distress score escalated by 18 points over 4 days." }
    ]
  },
  {
    id: "case-008",
    caseId: "ABH-2026-0822",
    firNo: "FIR-2026/0401",
    caseType: "Elder Victim Abuse & Neglect",
    status: "Stable",
    registeredOn: "2026-06-29",
    incidentDate: "2026-06-25",
    incidentLocation: "Civil Lines, Elder Care Wing",
    policeStation: "North Town Station - Division 2",
    assignedOfficer: "Sub-Insp. Vikram Singh (ID: OFF-9142)",
    assignedSocialWorker: "Priya Nair (ID: SW-509)",
    wellBeingScore: 19,
    wellBeingCategory: "Stable",
    trend: "stable",
    lastCheckIn: "2026-08-31 03:00 PM",
    victimInitials: "K.L. (Case #0822)",
    riskLevel: "low",
    activity: [
      { id: "act-70", timestamp: "2026-08-31 03:00 PM", title: "Care Visit Recorded", description: "Community care assistant verified safe sheltered arrangement." }
    ],
    aiSignals: [
      { id: "sig-70", type: "Low Stress Variance", severity: "low", detail: "Distress index remains below 20 for 6 consecutive weeks." }
    ]
  },
  {
    id: "case-009",
    caseId: "ABH-2026-0955",
    firNo: "FIR-2026/0523",
    caseType: "Witness Intimidation & Assault Threat",
    status: "Urgent Intervention Needed",
    registeredOn: "2026-08-30",
    incidentDate: "2026-08-29",
    incidentLocation: "District Court Premises / Residence Zone 3",
    policeStation: "Central Police Station - Division 4",
    assignedOfficer: "Insp. Rajesh Sharma (ID: OFF-8821)",
    assignedSocialWorker: "Meera Deshmukh (ID: SW-311)",
    wellBeingScore: 94,
    wellBeingCategory: "Urgent Support Needed",
    trend: "increasing",
    lastCheckIn: "2026-09-01 12:15 PM",
    victimInitials: "N.J. (Case #0955)",
    riskLevel: "high",
    activity: [
      { id: "act-80", timestamp: "2026-09-01 12:15 PM", title: "High Alert Incident", description: "Direct threat recorded near residence. Emergency response team notified." }
    ],
    aiSignals: [
      { id: "sig-80", type: "Critical Fear Index", severity: "high", detail: "Extremely high distress markers (94/100) detected following direct court testimony." },
      { id: "sig-81", type: "High Risk Location Alert", severity: "high", detail: "Incident proximity matches suspect known activity radius." }
    ]
  }
];
