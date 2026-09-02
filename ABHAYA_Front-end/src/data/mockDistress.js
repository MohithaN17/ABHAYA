// Historical distress scores time-series data for each case ID

export const MOCK_DISTRESS_HISTORY = {
  "case-001": [ // ABH-2026-0891 (Attention Required 64)
    { date: "Aug 10", score: 38, category: "Stable", note: "Initial baseline assessment post FIR" },
    { date: "Aug 15", score: 42, category: "Attention", note: "First check-in delay noted" },
    { date: "Aug 20", score: 49, category: "Attention", note: "Reported heightened anxiety regarding hearing" },
    { date: "Aug 24", score: 54, category: "Attention", note: "Increased negative emotional sentiment score" },
    { date: "Aug 28", score: 58, category: "Attention", note: "Missed evening check-in cycle" },
    { date: "Sep 01", score: 64, category: "Attention", note: "Current evaluated score" }
  ],
  "case-002": [ // ABH-2026-0904 (Urgent 82)
    { date: "Aug 05", score: 45, category: "Attention", note: "Post filing baseline" },
    { date: "Aug 12", score: 56, category: "Attention", note: "Reported phone calls from unknown numbers" },
    { date: "Aug 19", score: 68, category: "Attention", note: "Stress indicators escalated" },
    { date: "Aug 25", score: 75, category: "Urgent", note: "Crossed urgent threshold (70+)" },
    { date: "Aug 29", score: 79, category: "Urgent", note: "Panic episode during night check-in" },
    { date: "Sep 01", score: 82, category: "Urgent", note: "High severity distress flag" }
  ],
  "case-003": [ // ABH-2026-0780 (Stable 28)
    { date: "Jul 15", score: 62, category: "Attention", note: "Initial post-incident counseling" },
    { date: "Jul 28", score: 50, category: "Attention", note: "Legal protection granted" },
    { date: "Aug 10", score: 41, category: "Attention", note: "Counseling session 3 completed" },
    { date: "Aug 20", score: 34, category: "Stable", note: "Transitioned to stable threshold" },
    { date: "Sep 01", score: 28, category: "Stable", note: "Continued positive stabilization" }
  ],
  "case-004": [ // ABH-2026-0915 (Attention 52)
    { date: "Aug 16", score: 55, category: "Attention", note: "Filing baseline" },
    { date: "Aug 20", score: 51, category: "Attention", note: "Shelter options discussed" },
    { date: "Aug 25", score: 54, category: "Attention", note: "Financial dependency reported" },
    { date: "Sep 01", score: 52, category: "Attention", note: "Stable moderate risk level" }
  ],
  "case-005": [ // ABH-2026-0932 (Urgent 89)
    { date: "Aug 24", score: 72, category: "Urgent", note: "Emergency filing after assault attempt" },
    { date: "Aug 27", score: 81, category: "Urgent", note: "Constable guard assigned" },
    { date: "Aug 30", score: 86, category: "Urgent", note: "High fear indicators recorded" },
    { date: "Sep 01", score: 89, category: "Urgent", note: "Urgent intervention required" }
  ],
  "case-006": [ // ABH-2026-0744 (Stable 32)
    { date: "Jul 01", score: 58, category: "Attention", note: "Initial mediation period" },
    { date: "Jul 20", score: 45, category: "Attention", note: "Custody agreement reached" },
    { date: "Aug 15", score: 36, category: "Stable", note: "Relocation complete" },
    { date: "Sep 01", score: 32, category: "Stable", note: "Stable progress" }
  ],
  "case-007": [ // ABH-2026-0940 (Attention 68)
    { date: "Aug 28", score: 50, category: "Attention", note: "Case registration baseline" },
    { date: "Aug 30", score: 61, category: "Attention", note: "Content spread anxiety" },
    { date: "Sep 01", score: 68, category: "Attention", note: "Takedown notice filed" }
  ],
  "case-008": [ // ABH-2026-0822 (Stable 19)
    { date: "Jul 10", score: 35, category: "Stable", note: "Care home admission" },
    { date: "Aug 01", score: 24, category: "Stable", note: "Medical assistance provided" },
    { date: "Sep 01", score: 19, category: "Stable", note: "Optimal low risk index" }
  ],
  "case-009": [ // ABH-2026-0955 (Urgent 94)
    { date: "Aug 30", score: 85, category: "Urgent", note: "Post-court threat incident" },
    { date: "Aug 31", score: 90, category: "Urgent", note: "Suspect movement detected" },
    { date: "Sep 01", score: 94, category: "Urgent", note: "Maximum security protocol alert" }
  ]
};
