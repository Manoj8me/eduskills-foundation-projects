// Mock data export for importing in other components
export const MOCK_TICKETS = [
  {
    id: "TKT-5724",
    title: "Network Issue",
    category: "IT",
    priority: "High",
    status: "Open",
    date: "2025-04-14",
    description:
      "Unable to connect to the company network. Getting timeout errors when trying to access internal resources.",
    files: ["network_log.txt", "screenshot.png"],
  },
  {
    id: "TKT-8431",
    title: "Software Bug",
    category: "Development",
    priority: "Medium",
    status: "In Progress",
    date: "2025-04-13",
    description:
      "Found a bug in the user registration flow that prevents users from completing the form.",
    files: ["bug_report.docx"],
  },
  {
    id: "TKT-2196",
    title: "User Access",
    category: "HR",
    priority: "Low",
    status: "Resolved",
    date: "2025-04-12",
    description:
      "Need access to the HR portal for new employee onboarding process.",
    files: [],
  },
  {
    id: "TKT-3847",
    title: "Server Down",
    category: "IT",
    priority: "Critical",
    status: "Open",
    date: "2025-04-11",
    description:
      "Main production server is down. All users are affected and cannot access the application.",
    files: ["server_logs.txt", "error_screenshot.jpg"],
  },
  {
    id: "TKT-1562",
    title: "Payment Issue",
    category: "Finance",
    priority: "Medium",
    status: "Resolved",
    date: "2025-04-10",
    description:
      "Customer payment processing is delayed due to gateway timeout errors.",
    files: ["transaction_id.pdf"],
  },
  {
    id: "TKT-6712",
    title: "Database Connection",
    category: "Development",
    priority: "High",
    status: "In Progress",
    date: "2025-04-09",
    description:
      "Database connection is intermittently failing causing sporadic application errors.",
    files: ["error_log.txt"],
  },
  {
    id: "TKT-4290",
    title: "Email Delivery Failure",
    category: "IT",
    priority: "Medium",
    status: "Closed",
    date: "2025-04-08",
    description:
      "Notification emails are not being delivered to external domains.",
    files: [],
  },
  {
    id: "TKT-9371",
    title: "Payroll Discrepancy",
    category: "Finance",
    priority: "High",
    status: "Resolved",
    date: "2025-04-07",
    description:
      "Overtime hours not correctly calculated in the latest payroll run.",
    files: ["timesheet.xlsx"],
  },
];
