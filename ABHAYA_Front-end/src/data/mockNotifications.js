// Mock notification notifications for Police and Social Worker feeds

export const MOCK_NOTIFICATIONS = {
  police: [
    {
      id: "notif-p1",
      title: "Urgent Distress Alert Triggered",
      message: "Case ABH-2026-0955 crossed critical well-being threshold (Score: 94). Priority review requested.",
      timestamp: "10 mins ago",
      type: "urgent", // urgent | warning | info
      caseId: "ABH-2026-0955",
      read: false
    },
    {
      id: "notif-p2",
      title: "New FIR Case Registered",
      message: "FIR-2026/0523 registered under Division 4. Victim support monitoring initialized.",
      timestamp: "1 hour ago",
      type: "info",
      caseId: "ABH-2026-0955",
      read: false
    },
    {
      id: "notif-p3",
      title: "Case Status Updated by Social Worker",
      message: "Dr. Ananya Roy submitted protection documentation for Case ABH-2026-0891.",
      timestamp: "3 hours ago",
      type: "info",
      caseId: "ABH-2026-0891",
      read: true
    },
    {
      id: "notif-p4",
      title: "Well-Being Status Flag",
      message: "Case ABH-2026-0904 well-being score increased from 75 to 82.",
      timestamp: "Yesterday",
      type: "warning",
      caseId: "ABH-2026-0904",
      read: true
    }
  ],
  socialWorker: [
    {
      id: "notif-sw1",
      title: "Critical AI Distress Signal Detected",
      message: "Case ABH-2026-0955 flagged for critical fear index following court witness testimony.",
      timestamp: "10 mins ago",
      type: "urgent",
      caseId: "ABH-2026-0955",
      read: false
    },
    {
      id: "notif-sw2",
      title: "Missed Check-In Window Alert",
      message: "Case ABH-2026-0891 missed 2 consecutive check-ins (Aug 29 - Aug 31).",
      timestamp: "45 mins ago",
      type: "warning",
      caseId: "ABH-2026-0891",
      read: false
    },
    {
      id: "notif-sw3",
      title: "Human Review Confirmation Required",
      message: "Case ABH-2026-0904 awaiting decision support verification (Score: 82).",
      timestamp: "2 hours ago",
      type: "warning",
      caseId: "ABH-2026-0904",
      read: false
    },
    {
      id: "notif-sw4",
      title: "Intervention Status Update",
      message: "Counseling support session successfully logged for Case ABH-2026-0780.",
      timestamp: "1 day ago",
      type: "info",
      caseId: "ABH-2026-0780",
      read: true
    }
  ]
};
