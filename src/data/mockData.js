// SaleSahara Comprehensive Sales & AI Intelligence Mock Data

export const INITIAL_LEADS = [
  {
    id: "lead-101",
    name: "Rahul Sharma",
    company: "TechNova Technologies",
    role: "VP of Enterprise Infrastructure",
    email: "rahul.sharma@technova.io",
    phone: "+91 98765 43210",
    source: "Inbound Demo",
    industry: "Enterprise SaaS",
    companySize: "250-500",
    budget: "$75,000 / yr",
    timeline: "Immediate (< 30 days)",
    probability: 91,
    priority: "VERY HIGH",
    status: "Qualified",
    lastContact: "2 hours ago",
    why: "Demo requested + high engagement",
    nextAction: "Call within 2 hours",
    nextActionReason: "This lead recently requested a demo and shows strong buying intent.",
    confidence: "High",
    totalScore: 86,
    scoreBreakdown: {
      engagement: { score: 23, max: 25 },
      budgetMatch: { score: 22, max: 25 },
      companyFit: { score: 18, max: 20 },
      leadSource: { score: 14, max: 15 },
      recency: { score: 9, max: 15 }
    },
    positiveFactors: [
      "Demo requested on pricing page",
      "High website engagement (14 page views, 18m duration)",
      "Strong budget match ($75,000 ARR target)",
      "Recent interaction within past 2 hours"
    ],
    negativeFactors: [
      "No response to latest follow-up email sent yesterday"
    ],
    timelineEvents: [
      { date: "Today, 10:15 AM", type: "demo", title: "Demo requested", desc: "Submitted enterprise request form via website" },
      { date: "Yesterday, 3:45 PM", type: "web", title: "Opened pricing page", desc: "Viewed Enterprise Tier & AI Add-on module" },
      { date: "2 days ago, 11:20 AM", type: "whatsapp", title: "WhatsApp response", desc: "Confirmed team size of 45 sales reps" },
      { date: "4 days ago, 9:00 AM", type: "email", title: "Email opened", desc: "Opened 'Transform Sales Velocity with SaleSahara'" }
    ]
  },
  {
    id: "lead-102",
    name: "Ananya Verma",
    company: "FinServe Global",
    role: "Head of Revenue Operations",
    email: "a.verma@finserveglobal.com",
    phone: "+91 99123 88765",
    source: "Partner Referral",
    industry: "Financial Services",
    companySize: "1,000+",
    budget: "$120,000 / yr",
    timeline: "This Quarter",
    probability: 88,
    priority: "VERY HIGH",
    status: "In Discussion",
    lastContact: "4 hours ago",
    why: "Decision maker referral + pre-approved budget",
    nextAction: "Send Custom Enterprise Proposal",
    nextActionReason: "FinServe procurement requested formal SLA documentation.",
    confidence: "High",
    totalScore: 84,
    scoreBreakdown: {
      engagement: { score: 22, max: 25 },
      budgetMatch: { score: 24, max: 25 },
      companyFit: { score: 19, max: 20 },
      leadSource: { score: 13, max: 15 },
      recency: { score: 6, max: 15 }
    },
    positiveFactors: [
      "Referred directly by Managing Partner",
      "High buying power authority (FinServe RevOps Lead)",
      "Confirmed budget exceeding $100k ARR"
    ],
    negativeFactors: [
      "Security compliance audit required (SOC2 Type II)"
    ],
    timelineEvents: [
      { date: "Today, 8:30 AM", type: "email", title: "RFP Received", desc: "Sent technical requirements document for compliance review" },
      { date: "3 days ago", type: "web", title: "Downloaded Whitepaper", desc: "Downloaded AI Predictive Lead Scoring Benchmark Report" }
    ]
  },
  {
    id: "lead-103",
    name: "Vikram Mehta",
    company: "CloudScale Systems",
    role: "Chief Commercial Officer",
    email: "v.mehta@cloudscale.net",
    phone: "+91 98112 33445",
    source: "Webinar Attendee",
    industry: "Cloud Infrastructure",
    companySize: "500-1,000",
    budget: "$60,000 / yr",
    timeline: "30-60 Days",
    probability: 81,
    priority: "HIGH",
    status: "Demo Scheduled",
    lastContact: "1 day ago",
    why: "Attended product webinar + asked 3 Qs",
    nextAction: "Conduct Discovery Call tomorrow 2 PM",
    nextActionReason: "Lead showed intense interest during Q&A segment.",
    confidence: "High",
    totalScore: 79,
    scoreBreakdown: {
      engagement: { score: 20, max: 25 },
      budgetMatch: { score: 19, max: 25 },
      companyFit: { score: 17, max: 20 },
      leadSource: { score: 12, max: 15 },
      recency: { score: 11, max: 15 }
    },
    positiveFactors: [
      "Attended 45-min live webinar from start to end",
      "Asked technical API integration questions",
      "Downloaded SDK setup guidelines"
    ],
    negativeFactors: [
      "Evaluating competitor (Salesforce Einstein)"
    ],
    timelineEvents: [
      { date: "Yesterday", type: "webinar", title: "Attended Webinar", desc: "AI Lead Scoring Deep Dive" },
      { date: "2 days ago", type: "email", title: "Confirmed Calendar", desc: "Accepted invite for Discovery Call" }
    ]
  },
  {
    id: "lead-104",
    name: "Priya Patel",
    company: "BioHealth Diagnostics",
    role: "VP of Sales Operations",
    email: "p.patel@biohealth.org",
    phone: "+91 97654 12399",
    source: "Google Organic Search",
    industry: "Healthcare & Biotech",
    companySize: "100-250",
    budget: "$40,000 / yr",
    timeline: "60-90 Days",
    probability: 69,
    priority: "MEDIUM",
    status: "Nurturing",
    lastContact: "3 days ago",
    why: "Frequent blog reader + downloaded case study",
    nextAction: "Share Healthcare ROI Case Study",
    nextActionReason: "Lead is building an internal case for AI sales adoption.",
    confidence: "Medium",
    totalScore: 66,
    scoreBreakdown: {
      engagement: { score: 16, max: 25 },
      budgetMatch: { score: 15, max: 25 },
      companyFit: { score: 15, max: 20 },
      leadSource: { score: 10, max: 15 },
      recency: { score: 10, max: 15 }
    },
    positiveFactors: [
      "Subscribed to monthly intelligence briefing",
      "High organizational fit in med-tech sales"
    ],
    negativeFactors: [
      "Budget authorization pending Q4 review",
      "Longer buying cycle (Healthcare sector)"
    ],
    timelineEvents: [
      { date: "3 days ago", type: "web", title: "Downloaded Case Study", desc: "Read 200% ROI in MedTech Sales case study" }
    ]
  },
  {
    id: "lead-105",
    name: "Marcus Vance",
    company: "Nexus Commerce",
    role: "Director of Digital Sales",
    email: "marcus.v@nexuscommerce.com",
    phone: "+1 415 555 0192",
    source: "Outbound Email",
    industry: "E-Commerce & Retail",
    companySize: "50-100",
    budget: "$30,000 / yr",
    timeline: "Immediate",
    probability: 74,
    priority: "HIGH",
    status: "Contacted",
    lastContact: "5 hours ago",
    why: "Opened email 4x + clicked pricing calculator",
    nextAction: "Schedule 15-min Intro Call",
    nextActionReason: "Repeated clicks on pricing calculator indicate buying trigger.",
    confidence: "High",
    totalScore: 71,
    scoreBreakdown: {
      engagement: { score: 19, max: 25 },
      budgetMatch: { score: 16, max: 25 },
      companyFit: { score: 16, max: 20 },
      leadSource: { score: 8, max: 15 },
      recency: { score: 12, max: 15 }
    },
    positiveFactors: [
      "Opened outreach email 4 times in 24 hrs",
      "Calculated estimated ROI on pricing tool"
    ],
    negativeFactors: [
      "Outbound cold sequence origin"
    ],
    timelineEvents: [
      { date: "5 hours ago", type: "email", title: "Email Click", desc: "Clicked pricing calculator link" }
    ]
  },
  {
    id: "lead-106",
    name: "Sarah Jenkins",
    company: "Apex Logistics",
    role: "Sales Director",
    email: "s.jenkins@apexlogistics.com",
    phone: "+1 312 555 0148",
    source: "LinkedIn Ad",
    industry: "Logistics & Supply Chain",
    companySize: "500-1,000",
    budget: "$50,000 / yr",
    timeline: "30 Days",
    probability: 45,
    priority: "LOW",
    status: "At Risk",
    lastContact: "7 days ago",
    why: "Inactivity after initial demo + budget hold",
    nextAction: "Send Re-engagement Campaign",
    nextActionReason: "Lead has not opened last 3 emails and risk score is escalating.",
    confidence: "Medium",
    totalScore: 42,
    scoreBreakdown: {
      engagement: { score: 8, max: 25 },
      budgetMatch: { score: 14, max: 25 },
      companyFit: { score: 14, max: 20 },
      leadSource: { score: 4, max: 15 },
      recency: { score: 2, max: 15 }
    },
    positiveFactors: [
      "Large enterprise sales team (120 SDRs)",
      "High potential lifetime value"
    ],
    negativeFactors: [
      "Zero activity in past 7 days",
      "Unopened re-engagement messages"
    ],
    timelineEvents: [
      { date: "7 days ago", type: "email", title: "No Response", desc: "Follow-up email bounced/unopened" }
    ]
  },
  {
    id: "lead-107",
    name: "Elena Rostova",
    company: "CyberGuard Defense",
    role: "VP of Global Business Dev",
    email: "elena@cyberguard.tech",
    phone: "+44 20 7946 0912",
    source: "Inbound Demo",
    industry: "Cybersecurity",
    companySize: "250-500",
    budget: "$90,000 / yr",
    timeline: "Immediate",
    probability: 94,
    priority: "VERY HIGH",
    status: "Contract Pending",
    lastContact: "1 hour ago",
    why: "Legal security review passed + trial successful",
    nextAction: "Finalize Contract Signing",
    nextActionReason: "CyberGuard legal team approved agreement terms.",
    confidence: "High",
    totalScore: 92,
    scoreBreakdown: {
      engagement: { score: 25, max: 25 },
      budgetMatch: { score: 25, max: 25 },
      companyFit: { score: 20, max: 20 },
      leadSource: { score: 13, max: 15 },
      recency: { score: 9, max: 15 }
    },
    positiveFactors: [
      "99% feature adoption during 14-day trial",
      "Executive sign-off from Chief Revenue Officer",
      "Legal security compliance approved"
    ],
    negativeFactors: [],
    timelineEvents: [
      { date: "1 hour ago", type: "legal", title: "Contract Sent", desc: "DocuSign package delivered to C-suite" }
    ]
  }
];

export const KPI_DATA = [
  { id: "total-leads", title: "Total Leads", value: "1,248", trend: "+12.4%", trendType: "up", subtitle: "Active pipeline leads" },
  { id: "high-priority", title: "High Priority", value: "186", trend: "15% of total", trendType: "neutral", subtitle: "Probability > 75%" },
  { id: "avg-probability", title: "Avg. Conversion Prob.", value: "64%", trend: "+4.2%", trendType: "up", subtitle: "AI calculated score" },
  { id: "converted", title: "Converted", value: "312", trend: "+18%", trendType: "up", subtitle: "$1.4M ARR closed" },
  { id: "followups-due", title: "Follow-ups Due", value: "42", trend: "18 High Urgent", trendType: "warning", subtitle: "Actions scheduled today" },
  { id: "at-risk", title: "At Risk", value: "73", trend: "-5.1%", trendType: "down", subtitle: "Needs re-engagement" }
];

export const DATA_QUALITY_STATS = {
  overallScore: 87,
  missingFieldsPct: 12,
  duplicatesCount: 8,
  invalidEmailsCount: 4,
  incompleteProfilesCount: 31,
  issues: [
    { id: "dq-1", lead: "Marcus Vance", issue: "Missing Phone Number & LinkedIn URL", severity: "High", action: "Fix" },
    { id: "dq-2", lead: "Sarah Jenkins & Apex Team", issue: "Duplicate Lead Record Detected (Confidence: 94%)", severity: "High", action: "Merge" },
    { id: "dq-3", lead: "Priya Patel", issue: "Invalid Corporate Email Format (@gmail instead of corporate)", severity: "Medium", action: "Review" },
    { id: "dq-4", lead: "CloudScale Tech Draft", issue: "Missing Budget Authorization Range", severity: "Medium", action: "Fix" },
    { id: "dq-5", lead: "David Kim", issue: "Outdated Industry Category (Deprecated Taxonomy)", severity: "Low", action: "Review" }
  ]
};

export const MODEL_INTELLIGENCE_DATA = {
  modelName: "Random Forest Classifier (v4.2)",
  accuracy: 84,
  precision: 81,
  recall: 79,
  rocAuc: 0.86,
  trainingLeads: "1,248",
  lastTrained: "10 Sep 2026",
  status: "Healthy",
  healthMessage: "Prediction performance is within the expected range with zero drift detected.",
  coldStart: {
    title: "Cold Start Intelligence",
    text: "SaleSahara is using hybrid scoring until sufficient conversion data is available.",
    weights: [
      { name: "Rule-Based Engine", percentage: 50, color: "#6366f1" },
      { name: "Behavioral Intent", percentage: 30, color: "#06b6d4" },
      { name: "Machine Learning (ML)", percentage: 20, color: "#8b5cf6" }
    ],
    confidence: "Medium"
  }
};

export const NOTIFICATIONS_LIST = [
  { id: "n1", title: "5 High-Priority Leads", message: "5 high-priority leads require immediate follow-up call.", time: "10m ago", read: false, type: "urgent" },
  { id: "n2", title: "Lead Inactivity Alert", message: "Rahul Sharma hasn't been contacted for 3 days.", time: "1h ago", read: false, type: "warning" },
  { id: "n3", title: "Pipeline Risk Notice", message: "3 leads are becoming at risk due to lack of response.", time: "3h ago", read: true, type: "risk" },
  { id: "n4", title: "Model Intelligence", message: "Model retraining recommended after receiving 50 new converted leads.", time: "1d ago", read: true, type: "info" }
];
