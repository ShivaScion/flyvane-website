export interface ModeService {
  title: string;
  badge: string;
  problem: string;
  solution: string;
  metric: string;
  deliverables: string[];
}

export interface ProofMetric {
  value: string;
  title: string;
  description: string;
}

export interface ModeConfig {
  tagline: string;
  badge: string;
  heroHeadline: {
    lead: string;
    emphasis: string;
    subLead: string;
    subEmphasis: string;
  };
  heroDescription: string;
  ctaPrimary: string;
  ctaPrimaryHash: string;
  ctaSecondary: string;
  ctaSecondaryHash: string;
  proofBar: [ProofMetric, ProofMetric, ProofMetric];
  architecturePanel: {
    overline: string;
    title: string;
    statusLabel: string;
    specs: Array<{ label: string; value: string }>;
    summary: string;
  };
  servicesHeading: string;
  servicesSubheading: string;
  services: ModeService[];
}

export const MODE_CONTENT: Record<'machine' | 'mind' | 'hybrid', ModeConfig> = {
  machine: {
    tagline: "Autonomous Systems & Operational Engineering",
    badge: "ENGINEERING & AUTONOMOUS PROCESS INFRASTRUCTURE",
    heroHeadline: {
      lead: "Automate the",
      emphasis: "Bottlenecks.",
      subLead: "Architect the",
      subEmphasis: "Autonomous."
    },
    heroDescription:
      "We engineer bespoke data extraction pipelines, intelligent worker swarms, and headless systems that replace fragile manual labor with zero-operator reliability.",
    ctaPrimary: "Explore Architecture",
    ctaPrimaryHash: "#workbench",
    ctaSecondary: "Initialize Advisory",
    ctaSecondaryHash: "#contact",
    proofBar: [
      {
        value: "65%",
        title: "65% Workload Elimination",
        description: "Reported reduction in repetitive human touchpoints across core workflows."
      },
      {
        value: "8x",
        title: "8x Throughput Acceleration",
        description: "Target extraction and document reconciliation cycles running autonomously."
      },
      {
        value: "99.4%",
        title: "99.4% Extraction Precision",
        description: "Strict schema validation eliminating downstream data corruption."
      }
    ],
    architecturePanel: {
      overline: "SYSTEMS ARCHITECTURE OVERVIEW",
      title: "Autonomous Execution Core",
      statusLabel: "PRODUCTION READY",
      specs: [
        { label: "Runtime Core", value: "Python AsyncIO & Distributed Queues" },
        { label: "Data Integrity", value: "Strict Pydantic Schema Validation" },
        { label: "Security Posture", value: "TLS 1.3 & Isolated Secret Vaults" }
      ],
      summary:
        "Deterministic execution pipelines engineered for zero-operator intervention, sub-second dispatch, and verifiable schema output."
    },
    servicesHeading: "Engineering Capabilities Grid",
    servicesSubheading: "Precision software systems designed for mission-critical reliability and zero operator friction.",
    services: [
      {
        title: "Headless Extraction Engines",
        badge: "INFRASTRUCTURE — EXTRACTION",
        problem: "Dynamic client-rendered web applications and anti-bot obstacles blocking structured data collection.",
        solution: "Resilient headless browser clusters with residential proxy rotation and strict Pydantic schema normalization.",
        metric: "99.4% schema validation accuracy",
        deliverables: ["Anti-Detection Browser Fleets", "Residential Proxy Rotation", "Strict Schema Validation", "Automated Delta Sync"]
      },
      {
        title: "Deterministic State Machines",
        badge: "ORCHESTRATION — STATE",
        problem: "Fragile linear automations failing silently when upstream APIs time out or return malformed payloads.",
        solution: "Stateful workflow graphs with checkpoint persistence, dead-letter recovery, and idempotent retry guarantees.",
        metric: "Zero-drop state persistence",
        deliverables: ["LangGraph State Machines", "Idempotent Task Queues", "Automatic Failover", "Structured Execution Tracing"]
      },
      {
        title: "AI Worker Swarms",
        badge: "ENGINEERING — AGENTS",
        problem: "Operators spending manual hours triaging tickets, synthesizing documents, and routing operational payloads.",
        solution: "Deterministic background worker agents executing authenticated API calls, document parsing, and validation loops.",
        metric: "Up to 85% reduction in manual triage",
        deliverables: ["Custom Agent Workflows", "Multi-Worker Process Pools", "Zero-Hallucination Guardrails", "Human-in-the-Loop Safeguards"]
      },
      {
        title: "Webhook Infrastructure",
        badge: "SYSTEMS — WEBHOOKS",
        problem: "Disjointed enterprise applications causing data desynchronization and manual cross-system re-entry.",
        solution: "High-throughput async event buses, cryptographic signature verification, and bi-directional state synchronization.",
        metric: "Sub-100ms event dispatch latency",
        deliverables: ["FastAPI Microservices", "PostgreSQL & Redis Brokers", "Automated Retry & Alerts", "Bi-directional System Sync"]
      }
    ]
  },

  mind: {
    tagline: "Strategic Brand Differentiation & Audience Communication",
    badge: "BEHAVIORAL STRATEGY & EXECUTIVE POSITIONING",
    heroHeadline: {
      lead: "Market the",
      emphasis: "Brilliant.",
      subLead: "Command the",
      subEmphasis: "Authority."
    },
    heroDescription:
      "Transforming technical complexity into category-defining market authority. We architect founder positioning, high-intent narrative funnels, and enterprise demand engines.",
    ctaPrimary: "View Strategy Frameworks",
    ctaPrimaryHash: "#strategy-board",
    ctaSecondary: "Retain Advisory",
    ctaSecondaryHash: "#contact",
    proofBar: [
      {
        value: "100%",
        title: "100% Category Differentiation",
        description: "Zero-fluff positioning engineered to dismantle commoditized price wars."
      },
      {
        value: "4.2x",
        title: "4.2x Executive Reach",
        description: "Average qualified organic pipeline lift generated for key decision-makers."
      },
      {
        value: "82%",
        title: "82% Qualified Intent",
        description: "Inbound prospect validation before initial discovery calls."
      }
    ],
    architecturePanel: {
      overline: "COMMERCIAL AUTHORITY MATRIX",
      title: "Executive Positioning Engine",
      statusLabel: "ADVISORY ACTIVE",
      specs: [
        { label: "Cognitive Model", value: "Loss-Aversion & Value Framing" },
        { label: "Market Posture", value: "High-Contrast Category Leadership" },
        { label: "Demand Channel", value: "Executive Syndication & Funnels" }
      ],
      summary:
        "Structured narrative architecture that eliminates vendor commoditization and converts executive attention into qualified enterprise pipeline."
    },
    servicesHeading: "Strategic Positioning & Authority Capabilities",
    servicesSubheading: "Clear commercial positioning and communication structured to win qualified enterprise trust.",
    services: [
      {
        title: "Enterprise Brand Positioning & Category Framing",
        badge: "POSITIONING — STRATEGY",
        problem: "Sounding like an interchangeable vendor in an overcrowded market of generic competitors.",
        solution: "High-contrast category framing that establishes clear differentiation, exposes competitor blind spots, and commands premium pricing.",
        metric: "Elevated deal qualification & pricing confidence",
        deliverables: ["Category Design Blueprint", "Value Proposition Matrix", "Competitor Contrast Analysis", "Executive Presentation Decks"]
      },
      {
        title: "Loss-Aversion Copywriting & Narrative Architecture",
        badge: "MESSAGING — COPY",
        problem: "Vague, jargon-heavy messaging that fails to trigger urgency or engage senior decision-makers.",
        solution: "Rigorously crafted copy structured around the cost of inaction, risk reduction, and quantified commercial value.",
        metric: "Immediate clarity & reduced decision hesitation",
        deliverables: ["Website & Landing Page Copy", "Sales Enablement Battlecards", "Micro-Copy Calibration", "Commercial Offer Framing"]
      },
      {
        title: "Executive Thought Leadership & Content Strategy",
        badge: "DISTRIBUTION — AUTHORITY",
        problem: "Leadership teams lacking a repeatable framework to translate proprietary expertise into market visibility.",
        solution: "Structured editorial programs that turn deep industry insights into recurring executive conversations.",
        metric: "Sustained organic authority & inbound credibility",
        deliverables: ["Executive Editorial Strategy", "Case Narrative Architecture", "Industry Position Papers", "Organic Narrative Funnels"]
      },
      {
        title: "Audience Research & Demand Qualification Design",
        badge: "COMMUNICATION — RESEARCH",
        problem: "Growth campaigns built on internal assumptions rather than verified executive purchase criteria.",
        solution: "Qualitative buyer interviews, pain-point mapping, and tailored communication cadences across the client lifecycle.",
        metric: "Aligned buyer intent & higher close velocity",
        deliverables: ["Customer Buying Journey Maps", "Tailored Nurture Cadences", "Qualification Frameworks", "Message Testing Protocols"]
      }
    ]
  },

  hybrid: {
    tagline: "Strategy Connected to Execution — The Integrated Practice",
    badge: "INTEGRATED SYSTEMS & COMMERCIAL AUTHORITY",
    heroHeadline: {
      lead: "Automate the",
      emphasis: "Bottlenecks.",
      subLead: "Command the",
      subEmphasis: "Authority."
    },
    heroDescription:
      "Flyvane integrates autonomous engineering with executive positioning. We build the technical infrastructure that scales your operations and the strategic authority that captures enterprise demand.",
    ctaPrimary: "Explore Integrated Systems",
    ctaPrimaryHash: "#capabilities",
    ctaSecondary: "Retain Advisory",
    ctaSecondaryHash: "#contact",
    proofBar: [
      {
        value: "65%",
        title: "65% Workload Elimination",
        description: "Reported reduction in repetitive human touchpoints across core workflows."
      },
      {
        value: "4.2x",
        title: "4.2x Executive Reach",
        description: "Average qualified organic pipeline lift generated for key decision-makers."
      },
      {
        value: "99.4%",
        title: "99.4% Extraction Precision",
        description: "Strict schema validation eliminating downstream data corruption."
      }
    ],
    architecturePanel: {
      overline: "UNIFIED PRACTICE ARCHITECTURE",
      title: "Engineering + Authority Synthesis",
      statusLabel: "HYBRID ACTIVE",
      specs: [
        { label: "Execution Layer", value: "Autonomous Workflows & Agents" },
        { label: "Commercial Layer", value: "High-Contrast Category Framing" },
        { label: "Conversion Layer", value: "Interactive Value Calculators" }
      ],
      summary:
        "Uniting backend operational automation with frontend commercial positioning so technical excellence translates directly into revenue growth."
    },
    servicesHeading: "Integrated Strategy & Execution Solutions",
    servicesSubheading: "How engineering capabilities directly unlock commercial authority and enterprise growth.",
    services: [
      {
        title: "AI-Powered Content & Distribution Operations",
        badge: "HYBRID — OPERATIONS",
        problem: "Teams spending hours manually formatting, distributing, and organizing campaign assets.",
        solution: "Automated pipelines that ingest source research, coordinate structured drafting under human review, and dispatch approved assets.",
        metric: "Drastic reduction in production friction",
        deliverables: ["Research Ingestion Pipelines", "Calibrated LLM Workflows", "Publishing Integrations", "Operational Feedback Loops"]
      },
      {
        title: "Intelligent Account Research & Enrichment Engines",
        badge: "HYBRID — PIPELINES",
        problem: "Commercial teams losing valuable hours manually researching company profiles and qualifying prospects.",
        solution: "Automated monitors that track target accounts, extract verified public disclosures, and enrich CRM profiles.",
        metric: "Qualified prospect data delivered automatically",
        deliverables: ["Account Research Monitors", "Data Verification Loops", "CRM Bi-directional Sync", "Dynamic Account Tiering"]
      },
      {
        title: "Interactive Web Systems & Value Calculators",
        badge: "HYBRID — INTERACTION",
        problem: "Static websites failing to demonstrate real product capability or financial value to prospective buyers.",
        solution: "Interactive web applications, real-time value calculators, and live sandboxes that prove capability within the first session.",
        metric: "Immediate proof of value during evaluations",
        deliverables: ["Interactive Value Calculators", "Live Product Sandboxes", "Sub-second Load Times", "Conversion Event Tracking"]
      },
      {
        title: "Automated Client Onboarding & Retention Workflows",
        badge: "HYBRID — RETENTION",
        problem: "Manual handoffs between deal closure and client delivery causing communication delays and friction.",
        solution: "Zero-delay onboarding workflows that auto-provision workspaces, trigger tailored orientation communications, and sync records.",
        metric: "Immediate, friction-free client time-to-value",
        deliverables: ["Provisioning Workflows", "Automated Client Portals", "Contract Record Sync", "Proactive Health Monitoring"]
      }
    ]
  }
};
