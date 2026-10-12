export interface ModeService {
  title: string;
  badge: string;
  problem: string;
  solution: string;
  metric: string;
  deliverables: string[];
}

export interface ModeCaseStudy {
  tag: string;
  title: string;
  client: string;
  nature: 'PROPOSED STRATEGY' | 'VERIFIED PRODUCTION' | 'TECHNICAL DEMONSTRATION';
  bottleneck: string;
  system: string;
  metric: string;
  description: string;
  architectureTags: string[];
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
  telemetry: {
    metric1Val: string;
    metric1Label: string;
    metric2Val: string;
    metric2Label: string;
    metric3Val: string;
    metric3Label: string;
    runtimeProtocol: string;
    positioningMethod: string;
    securityPosture: string;
  };
  servicesHeading: string;
  servicesSubheading: string;
  services: ModeService[];
  caseStudyScope: ModeCaseStudy[];
}

export const MODE_CONTENT: Record<'machine' | 'mind' | 'hybrid', ModeConfig> = {
  machine: {
    tagline: "Autonomous Systems & Operational Engineering",
    badge: "Machine // Engineering & Process Automation",
    heroHeadline: {
      lead: "Automate the",
      emphasis: "boring.",
      subLead: "Architect the",
      subEmphasis: "autonomous."
    },
    heroDescription:
      "Flyvane engineers custom software infrastructure, headless browser clusters, deterministic AI worker agents, and resilient data extraction pipelines that eliminate repetitive operational bottlenecks.",
    ctaPrimary: "Launch Automation Terminal",
    ctaPrimaryHash: "#workbench",
    telemetry: {
      metric1Val: "100%",
      metric1Label: "Deterministic Extraction",
      metric2Val: "99.98%",
      metric2Label: "Cluster Availability Target",
      metric3Val: "<200ms",
      metric3Label: "Median Worker Latency",
      runtimeProtocol: "PYTHON ASYNCIO + PLAYWRIGHT + CELERY",
      positioningMethod: "HEADLESS STEALTH & PROXY ORCHESTRATION",
      securityPosture: "CEH HARDENED & ENCRYPTED AT REST"
    },
    servicesHeading: "Engineering & Technical Capabilities",
    servicesSubheading: "Precision software systems designed for mission-critical reliability and zero operator friction.",
    services: [
      {
        title: "Autonomous AI Agents & Multi-Worker Swarms",
        badge: "ENGINEERING // AGENTS",
        problem: "Operators spending manual hours triaging tickets, synthesizing documents, and routing payloads.",
        solution: "Deterministic background worker agents executing authenticated API calls, document parsing, and webhook triggers.",
        metric: "Illustrative Impact: Up to 85% reduction in manual triage cycles",
        deliverables: ["Custom Agent Workflows", "LangGraph State Machines", "Automatic Failover", "Human-in-the-Loop Safeguards"]
      },
      {
        title: "Headless Crawlers & High-Throughput Scrapers",
        badge: "INFRASTRUCTURE // CRAWLERS",
        problem: "Dynamic client-rendered web applications and anti-bot obstacles blocking data collection.",
        solution: "Stealth Playwright and Crawl4AI headless browser fleets with fingerprint rotation and strict schema normalization.",
        metric: "Demonstrated Architecture: Scalable zero-ban data extraction",
        deliverables: ["Anti-Detection Browser Fleets", "Residential Proxy Rotation", "Strict Schema Validation", "Automated Delta Sync"]
      },
      {
        title: "Workflow Automation & Webhook Integrations",
        badge: "SYSTEMS // WORKFLOWS",
        problem: "Disjointed enterprise applications causing data desynchronization and manual re-entry.",
        solution: "Fault-tolerant async message queues, idempotent webhook handlers, and background event buses.",
        metric: "Illustrative Impact: Elimination of manual cross-tool rekeying",
        deliverables: ["FastAPI Microservices", "PostgreSQL / Redis Queue Brokers", "Automated Retry & Alerts", "Bi-directional SaaS Sync"]
      },
      {
        title: "Custom Internal Web Applications & Operational Tooling",
        badge: "SOFTWARE // INTERFACES",
        problem: "Off-the-shelf software failing to match proprietary business processes.",
        solution: "Fast, bespoke operational command centers and dashboards built with React, TypeScript, and modern APIs.",
        metric: "Demonstrated Architecture: Sub-100ms interface interaction speeds",
        deliverables: ["Role-Based Access Control", "Real-Time Telemetry Panels", "Audited Event Logs", "Zero-Bloat Interfaces"]
      }
    ],
    caseStudyScope: [
      {
        tag: "DATA EXTRACTION // ARCHITECTURE DEMO",
        title: "Distributed Headless Clinical Catalog Extraction Pipeline",
        client: "Healthcare Catalog Specification",
        nature: "TECHNICAL DEMONSTRATION",
        bottleneck: "Dozens of manual hours spent extracting unstructured data across dynamic single-page applications",
        system: "Playwright async + stealth browser context + Pydantic schema validation",
        metric: "100% automated extraction with validated JSON output",
        description:
          "Architected a fault-tolerant Python extraction engine bypassing dynamic JavaScript single-page application hurdles, transforming unstructured updates into strict, validated JSON schemas with zero data loss.",
        architectureTags: ["Python AsyncIO", "Anti-Bot Stealth", "Schema Normalizer", "Automated Alerts"]
      },
      {
        tag: "MONITORING SENTRY // REGULATORY COMPLIANCE",
        title: "Autonomous Regulatory Filing Sentry & Alert Engine",
        client: "Compliance Advisory Architecture",
        nature: "TECHNICAL DEMONSTRATION",
        bottleneck: "Delayed manual monitoring of public state and federal filings risking missed deadlines",
        system: "Event-driven headless monitor polling registries with sub-second websocket broadcasting",
        metric: "<3.2s detection-to-alert latency on newly registered records",
        description:
          "Architected an automated sentry system that polls registries, parses public disclosures using OCR, and dispatches structured alerts directly to communication webhooks.",
        architectureTags: ["FastAPI", "Redis Streams", "OCR Pipeline", "Webhooks"]
      }
    ]
  },

  mind: {
    tagline: "Strategic Brand Differentiation & Audience Communication",
    badge: "Mind // Marketing, Positioning & Growth",
    heroHeadline: {
      lead: "Market the",
      emphasis: "brilliant.",
      subLead: "Command the",
      subEmphasis: "authority."
    },
    heroDescription:
      "Flyvane helps businesses transform complex offerings into distinct market authority. We craft strategic brand positioning, loss-aversion messaging, and structured communication programs that resonate with executive decision-makers.",
    ctaPrimary: "Explore Strategic Methodology",
    ctaPrimaryHash: "#strategy-board",
    telemetry: {
      metric1Val: "100%",
      metric1Label: "Positioning Differentiation",
      metric2Val: "0%",
      metric2Label: "Empty Buzzword Tolerance",
      metric3Val: "Executive",
      metric3Label: "Target Decision Profile",
      runtimeProtocol: "AUDIENCE COGNITION & LOSS AVERSION",
      positioningMethod: "HIGH-CONTRAST CATEGORY FRAMING",
      securityPosture: "AUDITED NARRATIVE INTEGRITY"
    },
    servicesHeading: "Strategic Marketing & Brand Capabilities",
    servicesSubheading: "Clear commercial positioning and communication structured to win qualified client trust.",
    services: [
      {
        title: "Enterprise Brand Positioning & Category Framing",
        badge: "POSITIONING // STRATEGY",
        problem: "Sounding like an interchangeable vendor in an overcrowded market of generic competitors.",
        solution: "High-contrast category framing that establishes clear differentiation, exposes competitor blind spots, and commands premium pricing.",
        metric: "Commercial Objective: Elevated deal qualification & pricing confidence",
        deliverables: ["Category Design Blueprint", "Value Proposition Matrix", "Competitor Contrast Teardown", "Executive Presentation Decks"]
      },
      {
        title: "Loss-Aversion Copywriting & Narrative Architecture",
        badge: "MESSAGING // COPY",
        problem: "Vague, jargon-heavy marketing copy that fails to trigger urgency or engage senior buyers.",
        solution: "Rigorously crafted copy structured around the cost of inaction, risk reduction, and quantified financial arbitrage.",
        metric: "Commercial Objective: Immediate clarity and reduced decision hesitation",
        deliverables: ["Website & Landing Page Copy", "Sales Battlecards", "Micro-Copy Calibration", "Commercial Offer Framing"]
      },
      {
        title: "Executive Thought Leadership & Content Strategy",
        badge: "DISTRIBUTION // AUTHORITY",
        problem: "Leadership teams lacking the time to translate proprietary expertise into market visibility.",
        solution: "Structured editorial frameworks and thought leadership programs that turn deep industry insights into recurring client conversations.",
        metric: "Commercial Objective: Sustained organic authority and inbound credibility",
        deliverables: ["Executive Editorial Strategy", "Case Narrative Architecture", "Industry Position Papers", "Organic Narrative Funnels"]
      },
      {
        title: "Audience Research & Customer Communication Design",
        badge: "COMMUNICATION // RESEARCH",
        problem: "Marketing campaigns built on internal assumptions rather than real customer purchase criteria.",
        solution: "Qualitative customer interviews, pain-point mapping, and tailored communication cadences across the client lifecycle.",
        metric: "Commercial Objective: Alignment between client needs and marketing communication",
        deliverables: ["Customer Buying Journey Maps", "Tailored Nurture Cadences", "Qualification Frameworks", "Message Testing Protocols"]
      }
    ],
    caseStudyScope: [
      {
        tag: "STRATEGIC POSITIONING // PROPOSED BLUEPRINT",
        title: "Professional Services Authority Positioning Blueprint",
        client: "Illustrative Strategy Model",
        nature: "PROPOSED STRATEGY",
        bottleneck: "Commoditized positioning forcing heavy discounting and prolonged sales cycles",
        system: "Loss-aversion narrative redesign paired with executive thought leadership calendar",
        metric: "Clear differentiation from legacy competitors",
        description:
          "An illustrative framework restructuring corporate messaging around quantifiable operational loss. Demonstrates how to translate complex technical service capabilities into urgent executive imperatives.",
        architectureTags: ["Category Framing", "Loss-Aversion Copy", "Editorial Pipeline", "Executive Distribution"]
      },
      {
        tag: "MESSAGING AUDIT // PROPOSED BLUEPRINT",
        title: "Enterprise Software Value Proposition Teardown",
        client: "Illustrative Conversion Model",
        nature: "PROPOSED STRATEGY",
        bottleneck: "Product messaging weighed down by feature lists rather than business outcomes",
        system: "Value proposition overhaul replacing generic claims with concrete economic leverage points",
        metric: "Immediate comprehension of core business value",
        description:
          "An illustrative teardown auditing the customer conversion journey from first click to qualification, eliminating cognitive friction and positioning software as an undeniable financial advantage.",
        architectureTags: ["Cognitive Teardown", "Value Calibration", "Conversion Funnel", "Clarity Scoring"]
      }
    ]
  },

  hybrid: {
    tagline: "Strategy Connected to Execution // The Integrated Practice",
    badge: "Hybrid // Technology Enabling Strategy",
    heroHeadline: {
      lead: "Automate the",
      emphasis: "boring.",
      subLead: "Market the",
      subEmphasis: "brilliant."
    },
    heroDescription:
      "Flyvane integrates technical engineering with marketing strategy. We build the automated systems that power your business and the strategic positioning that gives technology a commercial purpose.",
    ctaPrimary: "Explore Integrated Systems",
    ctaPrimaryHash: "#services",
    telemetry: {
      metric1Val: "Unified",
      metric1Label: "Strategy & Code Alignment",
      metric2Val: "End-to-End",
      metric2Label: "Workflow Coverage",
      metric3Val: "99.98%",
      metric3Label: "System Reliability Target",
      runtimeProtocol: "PYTHON ASYNCIO + PLAYWRIGHT + LLM WORKERS",
      positioningMethod: "BEHAVIORAL LOSS-AVERSION CONVERSION",
      securityPosture: "CEH HARDENED & PRODUCTION CERTIFIED"
    },
    servicesHeading: "Integrated Strategy & Execution Solutions",
    servicesSubheading: "How engineering capabilities directly unlock marketing outcomes and business growth.",
    services: [
      {
        title: "AI-Powered Marketing Workflows & Operations",
        badge: "HYBRID // OPERATIONS",
        problem: "Marketing teams spending hours manually formatting, distributing, and organizing campaign assets.",
        solution: "Automated pipelines that ingest source research, coordinate AI drafting under human review, and dispatch approved assets across channels.",
        metric: "Integrated Outcome: Drastic reduction in repetitive production friction",
        deliverables: ["Trend Monitoring Crawlers", "Calibrated LLM Pipelines", "Publishing Integrations", "Operational Feedback Loops"]
      },
      {
        title: "Intelligent Lead Research & Account Enrichment Sentries",
        badge: "HYBRID // PIPELINES",
        problem: "Commercial teams losing valuable hours manually researching company profiles and qualifying prospects.",
        solution: "Headless crawlers that continuously monitor target accounts, extract verified public disclosures, and enrich CRM profiles.",
        metric: "Integrated Outcome: Highly qualified prospect data delivered automatically",
        deliverables: ["Account Research Crawlers", "Data Verification Loops", "CRM Bi-directional Sync", "Dynamic Account Tiering"]
      },
      {
        title: "Interactive Web Systems & Value Calculators",
        badge: "HYBRID // INTERACTION",
        problem: "Static marketing websites failing to demonstrate real product capability or financial value to prospective buyers.",
        solution: "Interactive web applications, real-time ROI calculators, and live developer workbenches that demonstrate value within the first session.",
        metric: "Integrated Outcome: Immediate proof of capability during prospective evaluations",
        deliverables: ["Interactive Calculators", "Live Product Sandboxes", "Sub-second Load Times", "Behavioral Event Telemetry"]
      },
      {
        title: "Automated Customer Communication & Onboarding Workflows",
        badge: "HYBRID // RETENTION",
        problem: "Manual handoffs between sales closing and client delivery causing communication delays and friction.",
        solution: "Zero-delay onboarding workflows that auto-provision workspaces, trigger tailored orientation communications, and coordinate CRM records.",
        metric: "Integrated Outcome: Immediate, friction-free client time-to-value",
        deliverables: ["Provisioning Workflows", "Automated Client Portals", "Contract Record Sync", "Proactive Health Monitoring"]
      }
    ],
    caseStudyScope: [
      {
        tag: "INTEGRATED SYSTEMS // PROPOSED BLUEPRINT",
        title: "Autonomous Intelligence Sentry & Thought Leadership Engine",
        client: "Integrated Systems Framework",
        nature: "PROPOSED STRATEGY",
        bottleneck: "Manual industry research consuming dozens of hours weekly, leaving zero bandwidth for authority building",
        system: "Automated regulatory scraper feeding proprietary LLM distillation into executive distribution channels",
        metric: "Automated intelligence gathering supporting strategic distribution",
        description:
          "A proposed operational system combining a headless crawler monitoring regulatory disclosures with an automated drafting engine, enabling consistent executive thought leadership without manual research overhead.",
        architectureTags: ["Headless Sentry", "LLM Distillation", "Editorial Automation", "Executive Distribution"]
      },
      {
        tag: "OPERATIONAL INTEGRATION // TECHNICAL DEMO",
        title: "Clinical Extraction Pipeline Connected to Commercial Intake",
        client: "Technical Demonstration Model",
        nature: "TECHNICAL DEMONSTRATION",
        bottleneck: "Clinical data entry bottlenecks paired with unclear communication of technology benefits to stakeholders",
        system: "Playwright async crawler fleet connected to an interactive value arbitrage presentation",
        metric: "100% automated extraction with clear stakeholder communication",
        description:
          "Demonstrates how technical execution (headless browser automation) and strategic communication (transparent ROI modeling) unite to solve operational problems and secure executive stakeholder approval.",
        architectureTags: ["Python AsyncIO", "Stealth Crawlers", "Value Modeling", "Clear Communication"]
      }
    ]
  }
};
