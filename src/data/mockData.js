// KUTUMB - Centralized Mock Data
// Synthetic data for Sharma Family knowledge, responsibilities, and documents.
// Structured cleanly so that it can be seamlessly connected to Gemini / backend later.

export const familyInfo = {
  familyName: "Sharma Family",
  greeting: "Namaste, Sharma Family",
  tagline: "Because family knowledge shouldn't live in one person's head.",
  headOfFamily: "Rajesh Sharma",
  address: "Flat 402, Royal Palms Heights, New Delhi",
  lastSynced: "Today, 11:30 AM",
  totalMonthlyObligations: "₹78,490",
  healthCoverTotal: "₹15,00,000",
  members: [
    {
      id: "rajesh",
      name: "Rajesh Sharma",
      relation: "Father",
      role: "Primary Manager",
      avatarBg: "from-amber-500 to-orange-600",
      initials: "RS",
      email: "rajesh.sharma@example.com",
      phone: "+91 98110 •••••",
      responsibilitiesCount: 5,
      activeAlerts: 1,
    },
    {
      id: "sunita",
      name: "Sunita Sharma",
      relation: "Mother",
      role: "Co-manager & Household",
      avatarBg: "from-rose-500 to-pink-600",
      initials: "SS",
      email: "sunita.sharma@example.com",
      phone: "+91 98112 •••••",
      responsibilitiesCount: 3,
      activeAlerts: 1,
    },
    {
      id: "aarav",
      name: "Aarav Sharma",
      relation: "Son",
      role: "College Student",
      avatarBg: "from-blue-500 to-cyan-600",
      initials: "AS",
      email: "aarav.s@example.edu",
      phone: "+91 98711 •••••",
      responsibilitiesCount: 1,
      activeAlerts: 0,
    },
    {
      id: "ananya",
      name: "Ananya Sharma",
      relation: "Daughter",
      role: "High School Student",
      avatarBg: "from-emerald-500 to-teal-600",
      initials: "NS",
      email: "ananya.s@example.edu",
      phone: "+91 98715 •••••",
      responsibilitiesCount: 1,
      activeAlerts: 0,
    }
  ]
};

export const dashboardData = {
  needsAttention: [
    {
      id: "na-1",
      title: "Health Insurance Renewal",
      category: "Insurance",
      owner: "Rajesh Sharma",
      memberId: "rajesh",
      dueDate: "18 September 2026",
      daysLeft: 13,
      priority: "High",
      amount: "₹28,450",
      policyNumber: "STAR-IND-908234",
      provider: "Star Health & Allied",
      actionText: "Review & Pay Premium",
      notes: "Annual floater renewal for all 4 family members. Grace period ends 25 Sep.",
      status: "action_required"
    }
  ],
  upcoming: [
    {
      id: "up-1",
      title: "Electricity Bill",
      category: "Utilities",
      owner: "Sunita Sharma",
      memberId: "sunita",
      dueDate: "20 September 2026",
      daysLeft: 15,
      priority: "Medium",
      amount: "₹3,240",
      consumerId: "BSES-9921-042",
      provider: "BSES Yamuna Power",
      actionText: "Pay Bill",
      notes: "Billed for August air conditioning usage. Auto-pay not linked.",
      status: "pending"
    },
    {
      id: "up-2",
      title: "Home Loan EMI",
      category: "Loans",
      owner: "Rajesh + Sunita",
      memberId: "both",
      dueDate: "25 September 2026",
      daysLeft: 20,
      priority: "Medium",
      amount: "₹46,800",
      loanAccount: "HDFC-HL-339210",
      provider: "HDFC Bank",
      actionText: "Ensure Account Balance",
      notes: "Auto-debit from Joint Account ending ••4092.",
      status: "pending"
    }
  ],
  alreadyHandled: [
    {
      id: "ah-1",
      title: "Property Tax",
      category: "Taxes",
      owner: "Rajesh Sharma",
      memberId: "rajesh",
      handledDate: "Paid on 12 August 2026",
      amount: "₹8,500",
      receiptNumber: "MCD-PTR-2026-8819",
      provider: "Municipal Corporation",
      status: "completed",
      verified: true
    },
    {
      id: "ah-2",
      title: "Vehicle Servicing & PUC",
      category: "Vehicles",
      owner: "Rajesh Sharma",
      handledDate: "Completed on 04 August 2026",
      amount: "₹6,200",
      receiptNumber: "HON-SVC-9023",
      provider: "Honda Authorized Center",
      status: "completed",
      verified: true
    }
  ]
};

export const syntheticDocuments = [
  {
    id: "doc-1",
    name: "Health Insurance Policy",
    fileName: "Star_Health_Family_Optima_2026.pdf",
    category: "Insurance",
    type: "PDF Document",
    size: "2.4 MB",
    uploadedDate: "15 Jan 2026",
    dueDate: "18 Sep 2026",
    assignedMember: "Rajesh Sharma",
    memberId: "rajesh",
    status: "Needs Renewal",
    statusType: "warning",
    policyNo: "STAR-IND-908234",
    coverage: "₹15 Lakhs Floater",
    description: "Family Health Optima insurance policy covering Rajesh, Sunita, Aarav & Ananya."
  },
  {
    id: "doc-2",
    name: "Vehicle Insurance",
    fileName: "ICICI_Lombard_HondaCity_2026.pdf",
    category: "Vehicles",
    type: "PDF Document",
    size: "1.1 MB",
    uploadedDate: "10 Dec 2025",
    dueDate: "15 Dec 2026",
    assignedMember: "Rajesh Sharma",
    memberId: "rajesh",
    status: "Active",
    statusType: "success",
    policyNo: "VEC-4412-DL09",
    coverage: "Comprehensive Zero Dep",
    description: "Private Car package policy for Honda City (DL 09 CA 3421)."
  },
  {
    id: "doc-3",
    name: "Home Loan Statement",
    fileName: "HDFC_HomeLoan_Statement_Q3_2026.pdf",
    category: "Loans",
    type: "PDF Statement",
    size: "3.8 MB",
    uploadedDate: "01 Jul 2026",
    dueDate: "25 Sep 2026 (Next EMI)",
    assignedMember: "Rajesh + Sunita",
    memberId: "both",
    status: "Active EMI",
    statusType: "info",
    policyNo: "HDFC-HL-339210",
    coverage: "Principal balance ₹34.2 Lakhs",
    description: "Joint housing loan statement for Flat 402, Royal Palms Heights."
  },
  {
    id: "doc-4",
    name: "Electricity Bill",
    fileName: "BSES_Bill_Aug_2026.pdf",
    category: "Utilities",
    type: "Utility Bill",
    size: "450 KB",
    uploadedDate: "02 Sep 2026",
    dueDate: "20 Sep 2026",
    assignedMember: "Sunita Sharma",
    memberId: "sunita",
    status: "Due Soon",
    statusType: "warning",
    policyNo: "CA-9921-04289",
    coverage: "410 Units Consumed",
    description: "BSES Yamuna monthly electricity bill for August cycle."
  },
  {
    id: "doc-5",
    name: "Property Tax Receipt",
    fileName: "MCD_Property_Tax_Receipt_2026.pdf",
    category: "Taxes",
    type: "Official Receipt",
    size: "890 KB",
    uploadedDate: "12 Aug 2026",
    dueDate: "Paid",
    assignedMember: "Rajesh Sharma",
    memberId: "rajesh",
    status: "Verified & Paid",
    statusType: "success",
    policyNo: "PTR-2026-8819",
    coverage: "FY 2026-27 Paid in Full",
    description: "Property tax receipt with municipal barcode and digital confirmation."
  },
  {
    id: "doc-6",
    name: "Life Insurance Policy",
    fileName: "LIC_Tech_Term_RajeshSharma.pdf",
    category: "Insurance",
    type: "PDF Document",
    size: "4.2 MB",
    uploadedDate: "14 Feb 2024",
    dueDate: "14 Feb 2027",
    assignedMember: "Rajesh Sharma (Nominee: Sunita)",
    memberId: "rajesh",
    status: "Active",
    statusType: "success",
    policyNo: "LIC-TT-772190",
    coverage: "₹1 Crore Pure Term",
    description: "Pure term insurance policy with accidental death rider. Nominee registered as Sunita Sharma."
  }
];

export const familyMapNodes = {
  root: {
    id: "root-sharma",
    title: "Sharma Family Hub",
    subtitle: "Central Knowledge & Assets Core",
    membersCount: 4,
    assetsTracked: 6
  },
  members: [
    {
      id: "m-rajesh",
      name: "Rajesh Sharma",
      role: "Father (Primary Earner)",
      responsibilities: [
        {
          id: "node-health",
          title: "Health Insurance",
          tag: "Family Floater",
          detail: "Star Health ₹15L (Renewal Due 18 Sep)",
          urgency: "High",
          sharedWith: ["sunita", "aarav", "ananya"]
        },
        {
          id: "node-car",
          title: "Car (Honda City)",
          tag: "Vehicle & Insurance",
          detail: "DL 09 CA 3421 • ICICI Policy Active",
          urgency: "Low",
          sharedWith: []
        },
        {
          id: "node-homeloan",
          title: "Home Loan",
          tag: "Joint Liability",
          detail: "HDFC EMI ₹46,800 due 25th",
          urgency: "Medium",
          sharedWith: ["sunita"]
        },
        {
          id: "node-life",
          title: "Life Insurance",
          tag: "Term Protection",
          detail: "₹1 Crore LIC Term Plan",
          urgency: "Low",
          sharedWith: ["sunita"]
        }
      ]
    },
    {
      id: "m-sunita",
      name: "Sunita Sharma",
      role: "Mother (Co-Manager)",
      responsibilities: [
        {
          id: "node-electricity",
          title: "Electricity & Utilities",
          tag: "Household",
          detail: "BSES Bill ₹3,240 due 20 Sep",
          urgency: "Medium",
          sharedWith: []
        },
        {
          id: "node-homeloan-s",
          title: "Home Loan (Co-Borrower)",
          tag: "Joint Property",
          detail: "Co-owner Flat 402",
          urgency: "Medium",
          sharedWith: ["rajesh"]
        },
        {
          id: "node-groceries",
          title: "Domestic Accounts",
          tag: "Monthly Run",
          detail: "Society Maintenance & Staff",
          urgency: "Low",
          sharedWith: []
        }
      ]
    },
    {
      id: "m-aarav",
      name: "Aarav Sharma",
      role: "Son (Student)",
      responsibilities: [
        {
          id: "node-aarav-edu",
          title: "College Semester Records",
          tag: "Education",
          detail: "Delhi Univ • Next Sem Fee Jan 2027",
          urgency: "Low",
          sharedWith: ["rajesh"]
        },
        {
          id: "node-aarav-health",
          title: "Health Insurance Beneficiary",
          tag: "Dependent Cover",
          detail: "Covered under Family Optima",
          urgency: "Low",
          sharedWith: ["rajesh", "sunita"]
        }
      ]
    },
    {
      id: "m-ananya",
      name: "Ananya Sharma",
      role: "Daughter (Student)",
      responsibilities: [
        {
          id: "node-ananya-school",
          title: "High School Term Files",
          tag: "Education",
          detail: "DPS R.K. Puram • Grade 11",
          urgency: "Low",
          sharedWith: ["rajesh", "sunita"]
        },
        {
          id: "node-ananya-health",
          title: "Health Insurance Beneficiary",
          tag: "Dependent Cover",
          detail: "Covered under Family Optima",
          urgency: "Low",
          sharedWith: ["rajesh", "sunita"]
        }
      ]
    }
  ]
};

export const askKutumbPresetResponses = [
  {
    id: "preset-1",
    question: "What needs attention this month?",
    answer: "For September 2026, there is **1 High Priority** item requiring immediate action and **2 Upcoming bills**:",
    highlights: [
      {
        title: "Health Insurance Renewal",
        person: "Rajesh Sharma",
        date: "18 September 2026",
        amount: "₹28,450",
        badge: "Urgent (High)",
        color: "amber"
      },
      {
        title: "Electricity Bill (BSES)",
        person: "Sunita Sharma",
        date: "20 September 2026",
        amount: "₹3,240",
        badge: "Upcoming",
        color: "blue"
      },
      {
        title: "Home Loan EMI (HDFC)",
        person: "Rajesh + Sunita",
        date: "25 September 2026",
        amount: "₹46,800",
        badge: "Auto-Debit",
        color: "indigo"
      }
    ],
    recommendation: "Tip: Renew the Star Health floater policy before 18 September to maintain continuity and cumulative bonus protection."
  },
  {
    id: "preset-2",
    question: "Papa ki responsibilities kya hain?",
    answer: "Here is the consolidated breakdown for **Rajesh Sharma (Papa)**:",
    highlights: [
      {
        title: "Health Insurance Policy",
        person: "Rajesh Sharma",
        date: "Due 18 Sep 2026",
        amount: "₹28,450",
        badge: "Renewal Pending",
        color: "rose"
      },
      {
        title: "Home Loan Joint EMI",
        person: "Rajesh (Joint with Sunita)",
        date: "Due 25th of every month",
        amount: "₹46,800",
        badge: "Joint",
        color: "indigo"
      },
      {
        title: "Honda City Car Insurance & Maintenance",
        person: "Rajesh Sharma",
        date: "Expiry: 15 Dec 2026",
        amount: "Zero-Dep Active",
        badge: "Active",
        color: "emerald"
      },
      {
        title: "Life Insurance (LIC Term Plan)",
        person: "Rajesh Sharma",
        date: "Annual Premium",
        amount: "₹1 Crore Cover",
        badge: "Active",
        color: "emerald"
      },
      {
        title: "Property Tax (Flat 402)",
        person: "Rajesh Sharma",
        date: "Paid 12 August 2026",
        amount: "₹8,500",
        badge: "Completed",
        color: "emerald"
      }
    ],
    recommendation: "Rajesh holds primary custody of 5 key family policies and properties. 1 requires immediate action this week."
  },
  {
    id: "preset-3",
    question: "Mummy ke naam pe kya hai?",
    answer: "Here are all the assets, bills, and joint agreements registered under **Sunita Sharma (Mummy)**:",
    highlights: [
      {
        title: "Electricity Connection (BSES Yamuna)",
        person: "Registered Name: Sunita Sharma",
        date: "Due 20 Sep 2026",
        amount: "₹3,240",
        badge: "Bill Due",
        color: "amber"
      },
      {
        title: "Home Loan Co-Borrower & Co-Owner",
        person: "Sunita Sharma (Joint with Rajesh)",
        date: "Flat 402 Royal Palms",
        amount: "50% Ownership",
        badge: "Co-Owner",
        color: "indigo"
      },
      {
        title: "Primary Nominee - LIC Term Insurance",
        person: "Sunita Sharma",
        date: "₹1 Crore Term Cover",
        amount: "100% Nominee",
        badge: "Nominee",
        color: "emerald"
      },
      {
        title: "Health Insurance Floater",
        person: "Sunita Sharma",
        date: "Covered Member",
        amount: "₹15 Lakhs cover",
        badge: "Beneficiary",
        color: "emerald"
      }
    ],
    recommendation: "Sunita is registered primary on household utilities and co-owner on the residence deed."
  },
  {
    id: "preset-4",
    question: "What is most urgent?",
    answer: "🚨 The single most critical pending task right now is:",
    highlights: [
      {
        title: "Health Insurance Renewal (Star Health Family Optima)",
        person: "Responsible: Rajesh Sharma",
        date: "18 September 2026 (13 days remaining)",
        amount: "₹28,450 Premium",
        badge: "High Urgency",
        color: "rose"
      }
    ],
    recommendation: "Why it matters: If this policy lapses, the waiting period reset applies to all 4 family members. Payment link and policy PDF are available in the Documents section."
  }
];
