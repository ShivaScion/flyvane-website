import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';
import {
  Terminal as TerminalIcon,
  Cpu,
  Brain,
  Code,
  Copy,
  Download,
  Play,
  Zap,
  Mail,
  FileText,
  Link2,
  DollarSign,
  Search,
  Check,
  Loader2
} from 'lucide-react';

export type ScraperTargetType = 'contacts' | 'text' | 'links' | 'pricing';

export interface ScrapedRecord {
  id: number;
  badge: string; // e.g. "EMAIL", "PHONE", "HEADLINE", "LINK", "PRICING"
  value: string;
  context: string;
  rawType?: string;
}

interface TerminalWorkbenchProps {
  onSetMode: (mode: 'machine' | 'mind' | 'hybrid') => void;
  onAiraSpeak: (text: string) => void;
}

export const TerminalWorkbench: React.FC<TerminalWorkbenchProps> = ({ onSetMode, onAiraSpeak }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'scraper' | 'teardown'>('terminal');

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<Array<{ sender: string; text: string; isError?: boolean }>>([
    { sender: 'system', text: "Type 'help' to inspect automation commands. Try: 'scrape https://news.ycombinator.com', 'audit <text>', 'mode mind', 'calc', or 'aira speak hello'." },
    { sender: 'user', text: "welcome --init" },
    { sender: 'system', text: "[OK] Python automation core loaded. Aira companion listening." }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>(['welcome --init']);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Scraper State
  const [scraperUrl, setScraperUrl] = useState('https://news.ycombinator.com');
  const [scrapeTargetType, setScrapeTargetType] = useState<ScraperTargetType>('contacts');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState('STATUS: READY');
  const [scrapeFailed, setScrapeFailed] = useState(false);
  const [copiedRecordId, setCopiedRecordId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPy, setCopiedPy] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const inFlightKeyRef = useRef<string>('');

  const [extractedRecords, setExtractedRecords] = useState<ScrapedRecord[]>([
    {
      id: 1,
      badge: "EMAIL",
      value: "hn@ycombinator.com",
      context: "Discovered on Hacker News footer contact anchor"
    },
    {
      id: 2,
      badge: "INTAKE LINK",
      value: "https://www.ycombinator.com/apply",
      context: "Discovered active intake & batch application link"
    },
    {
      id: 3,
      badge: "HEADLINE",
      value: "Hacker News - Global Tech & Engineering Network",
      context: "Root document hero header & community index"
    }
  ]);

  const [generatedPy, setGeneratedPy] = useState<string>(`import asyncio
import json
import re
from playwright.async_api import async_playwright

async def extract_contacts():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox"]
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={"width": 1920, "height": 1080}
        )
        page = await context.new_page()

        print("[INIT] Navigating to https://news.ycombinator.com...")
        await page.goto("https://news.ycombinator.com", wait_until="networkidle", timeout=30000)

        # 1. Query mailto anchors
        mailto_links = await page.eval_on_selector_all(
            "a[href^='mailto:']",
            "els => els.map(e => e.getAttribute('href').replace(/^mailto:/i, ''))"
        )

        # 2. Extract emails from body text
        body_text = await page.inner_text("body")
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
        all_emails = list(dict.fromkeys(mailto_links + re.findall(email_pattern, body_text)))

        # STRICT CAP: Output maximum 3 records in clean format
        top_records = all_emails[:3]
        print(f"[SUCCESS] Top {len(top_records)} extracted contacts:")
        for idx, item in enumerate(top_records, 1):
            print(f"  [{idx}] {item}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(extract_contacts())`);

  // Teardown State
  const [teardownInput, setTeardownInput] = useState("We are a passionate, cutting-edge platform delivering revolutionary AI-driven solutions to seamlessly maximize your team's innovative workflows.");
  const [teardownScore, setTeardownScore] = useState(42);
  const [metricHook, setMetricHook] = useState(40);
  const [metricLoss, setMetricLoss] = useState(20);
  const [fluffPenalty, setFluffPenalty] = useState('-40 pts (4 buzzwords)');
  const [teardownSuggestion, setTeardownSuggestion] = useState("Eliminate 15 hours of manual repetitive data entry every week with custom automated Python pipelines. Stop losing client deals to slow response times.");

  const handleTerminalSubmit = async () => {
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    soundEngine.playClick(0.06);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryPointer(-1);

    const newHist = [...terminalHistory, { sender: 'user', text: cmd }];
    const parts = cmd.split(" ");
    const action = parts[0].toLowerCase();

    if (action === 'help') {
      newHist.push({
        sender: 'system',
        text: `Verified System Commands:
  • info <topic|url> : Retrieve verified information from studio database or live web target
  • scrape <url> : Extract live DOM elements & compile Playwright script (max 3 records)
  • audit <text> : Run 5-point psychological loss-aversion copy teardown
  • calc : Launch Automation ROI & Arbitrage Calculator
  • mode <machine|mind|hybrid> : Switch studio mode, copy, and 3D palette
  • aira speak <text> : Trigger speech synthesis through Aira
  • capabilities : Inspect studio infrastructure standards & security SLAs
  • contact : View direct communication endpoints & intake instructions
  • clear : Reset terminal log`
      });
    } else if (action === 'info') {
      const topic = parts.slice(1).join(" ").trim().toLowerCase();
      if (!topic) {
        newHist.push({
          sender: 'system',
          text: `[INFO REQUEST] Please specify what information you need.\nUsage: 'info <topic>'\nExamples:\n  • 'info capabilities' (technical architecture & SLAs)\n  • 'info pricing' (automation cost & retainer models)\n  • 'info stack' (Python Playwright, Celery, LangGraph)\n  • 'info contact' (direct communication channels)\n  • 'info https://<url>' (query live domain metadata)`
        });
      } else if (topic.startsWith('http://') || topic.startsWith('https://')) {
        newHist.push({
          sender: 'system',
          text: `[RETRIEVING LIVE METADATA] Connecting to verified data source at ${topic}...`
        });
        setScraperUrl(topic);
        setActiveTab('scraper');
        executeScrape(topic, 'contacts', '');
      } else if (topic.includes('capab') || topic.includes('stack') || topic.includes('tech') || topic.includes('engine')) {
        newHist.push({
          sender: 'system',
          text: `[VERIFIED INFO // STUDIO STACK]\n• Core Engine: Python 3.12 AsyncIO, Playwright, Crawl4AI, Pydantic V2\n• Workers & Agents: LangGraph deterministic state machines, Celery, Redis\n• Security: Hardened defensive architecture, AES-256 storage, TLS 1.3 in transit\n• Reliability: Multi-worker process pooling with automated health restarts`
        });
      } else if (topic.includes('pric') || topic.includes('cost') || topic.includes('retainer') || topic.includes('roi')) {
        newHist.push({
          sender: 'system',
          text: `[VERIFIED INFO // PRICING & ROI]\n• One-Time Automations: Custom scoped from low-frequency task scripts to enterprise pipelines\n• Managed Retainers: Dedicated autonomous systems sentry and continuous pipeline monitoring\n• Calculation Logic: Weekly labor = operators × hours × hourly rate × automated%\n• To compute exact ROI: type 'calc' or scroll to the Calculator section`
        });
      } else if (topic.includes('aira') || topic.includes('mascot') || topic.includes('bot')) {
        newHist.push({
          sender: 'system',
          text: `[VERIFIED INFO // AIRA 3D RIG]\nAira is Flyvane's interactive companion rig. She features skeletal bone tracking, responsive head and eye gaze following, organic walking physics, and zero-emoji real-time conversational audio.`
        });
      } else if (topic.includes('contact') || topic.includes('email') || topic.includes('hire')) {
        newHist.push({
          sender: 'system',
          text: `[VERIFIED INFO // CONTACT]\n• Direct Email: contact@flyvane.com\n• Direct Portal: flyvane.com/#contact\n• Engagement Model: Dedicated engineering pipelines & strategic retainers`
        });
      } else {
        newHist.push({
          sender: 'system',
          text: `[LIMITATION] No verified local database record found for '${topic}'.\nIf you want to inspect a live external website, use 'info https://<target-domain>'.\nType 'help' to see available capabilities.`
        });
      }
    } else if (action === 'scrape') {
      const target = parts[1] || "https://news.ycombinator.com";
      setScraperUrl(target);
      setActiveTab('scraper');
      executeScrape(target);
      newHist.push({ sender: 'system', text: `[PARSING] Executing live extraction on ${target}. Switched to Scraper tab.` });
    } else if (action === 'audit') {
      const text = cmd.substring(6).trim();
      if (!text) {
        newHist.push({
          sender: 'system',
          text: `[AUDIT REQ] Missing copy text. Please provide the copy you want to audit:\nUsage: 'audit <your marketing copy here>'`
        });
      } else {
        setTeardownInput(text);
        setActiveTab('teardown');
        runAudit(text);
        newHist.push({ sender: 'system', text: `[AUDIT COMPLETE] Analyzed copy for buzzwords and loss aversion. Switched to Teardown tab.` });
      }
    } else if (action === 'calc') {
      const el = document.getElementById('roi-arbitrage');
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = '#roi-arbitrage';
      }
      newHist.push({ sender: 'system', text: `[NAVIGATED] Opened Automation ROI & Savings Calculator.` });
    } else if (action === 'mode') {
      const m = (parts[1] || '').toLowerCase();
      if (m === 'machine' || m === 'mind' || m === 'hybrid') {
        onSetMode(m);
        soundEngine.playModeMorph(m);
        newHist.push({ sender: 'system', text: `[MODE UPDATED] System state and content switched to '${m.toUpperCase()}'.` });
      } else {
        newHist.push({
          sender: 'system',
          text: `[UNSUPPORTED MODE] '${parts[1]}' is invalid. Supported modes: 'machine', 'mind', 'hybrid'.`,
          isError: true
        });
      }
    } else if (action === 'aira' && parts[1] === 'speak') {
      const msg = cmd.substring(11).trim();
      if (!msg) {
        newHist.push({ sender: 'system', text: `[USAGE] aira speak <text message>` });
      } else {
        onAiraSpeak(msg);
        newHist.push({ sender: 'system', text: `[AUDIO SYNTHESIS] Aira spoke: "${msg}"` });
      }
    } else if (action === 'capabilities') {
      const el = document.getElementById('capabilities');
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = '#capabilities';
      }
      newHist.push({ sender: 'system', text: `[CAPABILITIES] Flyvane // Defensive Architecture, Fault-Tolerant Worker Pooling, Distributed Autonomous Pipelines.` });
    } else if (action === 'contact') {
      const el = document.getElementById('contact');
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = '#contact';
      }
      newHist.push({ sender: 'system', text: `[CONTACT DIRECT] Email: contact@flyvane.com | Portal: flyvane.com/#contact | Selective Enterprise Allocation` });
    } else if (action === 'clear') {
      setTerminalHistory([{ sender: 'system', text: 'Terminal cleared. Type "help" for commands.' }]);
      setTerminalInput('');
      return;
    } else {
      newHist.push({
        sender: 'system',
        text: `[UNSUPPORTED OPERATION] '${cmd}' is not a recognized command. The terminal executes only implemented capabilities.\nType 'help' for verified commands or 'info' to request information.`,
        isError: true
      });
    }

    setTerminalHistory(newHist);
    setTerminalInput('');
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTerminalSubmit();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setTerminalHistory([{ sender: 'system', text: 'Terminal cleared. Type "help" for commands.' }]);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const next = historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(next);
      setTerminalInput(commandHistory[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;
      const next = historyPointer + 1;
      if (next >= commandHistory.length) {
        setHistoryPointer(-1);
        setTerminalInput('');
      } else {
        setHistoryPointer(next);
        setTerminalInput(commandHistory[next] || '');
      }
    }
  };

  const updatePlaywrightScript = (url: string, type: ScraperTargetType, query: string) => {
    const safeUrl = JSON.stringify(url);
    const safeQuery = JSON.stringify(query || '');

    let scriptBody = '';
    if (type === 'contacts') {
      scriptBody = `        # 1. Query mailto anchors safely
        mailto_links = await page.eval_on_selector_all(
            "a[href^='mailto:']",
            "els => els.map(e => (e.getAttribute('href') || '').replace(/^mailto:/i, '').split('?')[0].trim()).filter(Boolean)"
        )

        # 2. Extract emails from visible body text
        body_text = await page.inner_text("body")
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
        discovered_emails = re.findall(email_pattern, body_text)
        
        # Deduplicate preserving order
        unique_emails = list(dict.fromkeys(mailto_links + discovered_emails))
        filtered = [e for e in unique_emails if not any(e.lower().endswith(ext) for ext in ['.png', '.jpg', '.webp', '.svg', '.js'])]
        
        target_query = ${safeQuery}.lower()
        if target_query:
            filtered = [e for e in filtered if target_query in e.lower()]

        # STRICT CAP: Output maximum 3 clean records
        top_records = filtered[:3]
        results = [{"id": i, "type": "EMAIL", "value": val} for i, val in enumerate(top_records, 1)]`;
    } else if (type === 'text') {
      scriptBody = `        # Extract document title and primary semantic headings
        page_title = (await page.title() or "").strip()
        headings = await page.eval_on_selector_all(
            "h1, h2, h3, article header",
            "els => els.map(e => (e.innerText || e.textContent || '').trim()).filter(t => t.length > 4 && t.length < 200)"
        )
        combined = list(dict.fromkeys([page_title] + headings))
        target_query = ${safeQuery}.lower()
        if target_query:
            combined = [h for h in combined if target_query in h.lower()]
            
        top_records = combined[:3]
        results = [{"id": i, "type": "HEADLINE", "value": val} for i, val in enumerate(top_records, 1)]`;
    } else if (type === 'links') {
      scriptBody = `        # Extract validated destination links
        links = await page.eval_on_selector_all(
            "a[href]",
            "els => els.map(e => ({ text: (e.innerText || e.textContent || '').trim(), href: e.href })).filter(l => l.href.startsWith('http') && l.text.length > 2)"
        )
        seen = set()
        deduped = []
        for item in links:
            if item['href'] not in seen:
                seen.add(item['href'])
                deduped.append(item)
                
        target_query = ${safeQuery}.lower()
        if target_query:
            deduped = [l for l in deduped if target_query in l['text'].lower() or target_query in l['href'].lower()]

        top_records = deduped[:3]
        results = [{"id": i, "type": "OUTBOUND_LINK", "value": l['href'], "context": l['text']} for i, l in enumerate(top_records, 1)]`;
    } else {
      scriptBody = `        # Extract price points & currency symbols
        body_text = await page.inner_text("body")
        price_pattern = r'(?:\\$|€|£|₹)\\s*\\d+(?:,\\d{3})*(?:\\.\\d{2})?(?:\\s*\\/\\s*(?:mo|yr|month|year|seat))?'
        prices = list(dict.fromkeys(re.findall(price_pattern, body_text)))
        target_query = ${safeQuery}.lower()
        if target_query:
            prices = [p for p in prices if target_query in p.lower()]
            
        top_records = prices[:3]
        results = [{"id": i, "type": "PRICING_TIER", "value": val} for i, val in enumerate(top_records, 1)]`;
    }

    setGeneratedPy(`import asyncio
import json
import re
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

async def run_scraper():
    """
    Production-Grade Automation Pipeline
    Target: ${url}
    Extraction Scope: ${type.toUpperCase()}
    Generated by: Flyvane Engineering Pipeline
    """
    target_url = ${safeUrl}
    print(f"[INIT] Launching stealth browser context for: {target_url}")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-infobars"
            ]
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
            locale="en-US"
        )
        
        # Remove navigator.webdriver detection flag
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = await context.new_page()

        try:
            print("[CONNECT] Navigating with DOMContentLoaded fallback...")
            try:
                # Resilient navigation: avoid indefinite networkidle hangs
                await page.goto(target_url, wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_timeout(1500) # Settle dynamic client hydration
            except PlaywrightTimeout:
                print("[WARN] Navigation timeout reached; attempting extraction on partial DOM...")

${scriptBody}

            # Formatted Output
            print(f"\\n[SUCCESS] Extracted {len(results)} clean records (Capped at 3):")
            print(json.dumps(results, indent=2))
            return results

        except Exception as exc:
            print(f"[ERROR] Extraction pipeline failed: {exc}")
            raise
        finally:
            # Guarantees zero zombie Chromium processes
            await context.close()
            await browser.close()
            print("[TEARDOWN] Browser context closed cleanly.")

if __name__ == "__main__":
    asyncio.run(run_scraper())`);
  };

  const cancelScrape = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsScraping(false);
      setScrapeFailed(true);
      setScrapeStatus("REQUEST CANCELLED BY USER");
      soundEngine.playClick(0.05);
    }
  };

  const executeScrape = async (
    targetUrl: string = scraperUrl,
    targetType: ScraperTargetType = scrapeTargetType,
    customQuery: string = keywordFilter
  ) => {
    let cleanUrl = (targetUrl || scraperUrl).trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(cleanUrl);
    } catch {
      setIsScraping(false);
      setScrapeFailed(true);
      setScrapeStatus("INVALID URL SYNTAX");
      return;
    }

    const requestKey = `${cleanUrl}|${targetType}|${customQuery}`;
    if (isScraping && inFlightKeyRef.current === requestKey) {
      return; // Deduplicate identical concurrent requests
    }

    // Cancel any existing in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    inFlightKeyRef.current = requestKey;

    setIsScraping(true);
    setScrapeFailed(false);
    setScrapeStatus("CONNECTING TO TARGET...");
    const startTime = performance.now();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 12000);

    let rawHtml = '';
    let isLiveFetched = false;

    try {
      // 1. Try local Node scraper API (runs via Vite middleware with zero browser CORS)
      setScrapeStatus("FETCHING LIVE DOM VIA LOCAL NODE ENGINE...");
      try {
        const localResp = await fetch(`/api/scrape?url=${encodeURIComponent(cleanUrl)}`, {
          signal: controller.signal
        });
        if (localResp.ok) {
          rawHtml = await localResp.text();
          if (rawHtml && rawHtml.length > 200) {
            isLiveFetched = true;
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') throw err;
      }

      // 2. Fallback to Jina Reader CORS-friendly gateway
      if (!isLiveFetched) {
        setScrapeStatus("FETCHING VIA JINA GATEWAY PROXY...");
        try {
          const jinaResp = await fetch(`https://r.jina.ai/${cleanUrl}`, {
            signal: controller.signal
          });
          if (jinaResp.ok) {
            rawHtml = await jinaResp.text();
            if (rawHtml && rawHtml.length > 100) {
              isLiveFetched = true;
            }
          }
        } catch (err: any) {
          if (err.name === 'AbortError') throw err;
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setIsScraping(false);
      setScrapeFailed(true);
      if (err.name === 'AbortError') {
        setScrapeStatus("REQUEST TIMED OUT / CANCELLED");
      } else {
        setScrapeStatus("EXTRACTION NETWORK ERROR");
      }
      return;
    } finally {
      clearTimeout(timeoutId);
    }

    const duration = Math.round(performance.now() - startTime + 60);
    const parsedRecords: ScrapedRecord[] = [];
    const lowerQuery = customQuery.trim().toLowerCase();

    if (rawHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      const bodyText = doc.body?.innerText || rawHtml;

      if (targetType === 'contacts') {
        // A. Emails from mailto anchors
        const mailtoEls = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]'))
          .map(a => a.href.replace(/^mailto:/i, '').split('?')[0].trim());

        // B. Emails from body text regex
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
        const bodyEmails = Array.from(bodyText.match(emailRegex) || []);
        const rawEmails = Array.from(new Set([...mailtoEls, ...bodyEmails]))
          .filter(e => !e.endsWith('.png') && !e.endsWith('.jpg') && !e.endsWith('.webp') && !e.endsWith('.svg') && !e.endsWith('.js'));

        rawEmails.forEach(e => {
          if (!lowerQuery || e.toLowerCase().includes(lowerQuery)) {
            parsedRecords.push({
              id: parsedRecords.length + 1,
              badge: "EMAIL",
              value: e,
              context: `Discovered on ${parsedUrl.hostname} contact nodes`
            });
          }
        });

        // C. Telephone numbers
        if (parsedRecords.length < 3) {
          const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
          const telEls = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'))
            .map(a => a.href.replace(/^tel:/i, '').trim());
          const bodyPhones = Array.from(bodyText.match(phoneRegex) || []);
          const rawPhones = Array.from(new Set([...telEls, ...bodyPhones]))
            .filter(p => p.length >= 8 && p.length <= 20);

          rawPhones.forEach(p => {
            if (parsedRecords.length < 3 && (!lowerQuery || p.includes(lowerQuery))) {
              parsedRecords.push({
                id: parsedRecords.length + 1,
                badge: "PHONE",
                value: p,
                context: "Direct telephone voice line"
              });
            }
          });
        }

        // D. Contact channels & profiles
        if (parsedRecords.length < 3) {
          const contactLinks = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href*="contact"], a[href*="about"], a[href*="linkedin.com"], a[href*="github.com"], a[href*="twitter.com"], a[href*="x.com"]'))
            .map(a => a.href)
            .filter(h => h.startsWith('http'));

          Array.from(new Set(contactLinks)).forEach(cl => {
            if (parsedRecords.length < 3 && (!lowerQuery || cl.toLowerCase().includes(lowerQuery))) {
              parsedRecords.push({
                id: parsedRecords.length + 1,
                badge: cl.includes('linkedin') ? "LINKEDIN" : cl.includes('github') ? "GITHUB" : "CONTACT URL",
                value: cl,
                context: "Verified communication channel"
              });
            }
          });
        }
      } else if (targetType === 'text') {
        // Document Title
        const title = doc.querySelector('title')?.innerText.trim() || '';
        if (title && (!lowerQuery || title.toLowerCase().includes(lowerQuery))) {
          parsedRecords.push({
            id: 1,
            badge: "PAGE TITLE",
            value: title,
            context: `Document title (${parsedUrl.hostname})`
          });
        }

        // Headings H1, H2, H3
        const headings = Array.from(doc.querySelectorAll<HTMLElement>('h1, h2, h3, .titleline, article header'))
          .map(h => h.innerText.trim())
          .filter(t => t.length > 4 && t.length < 240);

        Array.from(new Set(headings)).forEach(hd => {
          if (parsedRecords.length < 3 && hd !== title && (!lowerQuery || hd.toLowerCase().includes(lowerQuery))) {
            parsedRecords.push({
              id: parsedRecords.length + 1,
              badge: "HEADLINE",
              value: hd,
              context: "Document section headline"
            });
          }
        });

        // Key Paragraphs
        if (parsedRecords.length < 3) {
          const paragraphs = Array.from(doc.querySelectorAll<HTMLElement>('p, article, [data-testid]'))
            .map(p => p.innerText.trim())
            .filter(t => t.length > 25 && t.length < 300);

          Array.from(new Set(paragraphs)).forEach(para => {
            if (parsedRecords.length < 3 && (!lowerQuery || para.toLowerCase().includes(lowerQuery))) {
              parsedRecords.push({
                id: parsedRecords.length + 1,
                badge: "KEY TEXT",
                value: para,
                context: "Core body statement"
              });
            }
          });
        }
      } else if (targetType === 'links') {
        const rawLinks = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href]'))
          .map(a => ({
            text: (a.innerText || a.getAttribute('aria-label') || 'Destination Resource').trim().replace(/\s+/g, ' '),
            href: a.href
          }))
          .filter(l => l.href.startsWith('http') && l.text.length > 2 && !l.href.includes('javascript:'));

        const seenUrls = new Set<string>();
        rawLinks.forEach(item => {
          if (parsedRecords.length < 3 && !seenUrls.has(item.href)) {
            seenUrls.add(item.href);
            if (!lowerQuery || item.text.toLowerCase().includes(lowerQuery) || item.href.toLowerCase().includes(lowerQuery)) {
              parsedRecords.push({
                id: parsedRecords.length + 1,
                badge: "DESTINATION",
                value: item.href,
                context: `Anchor label: "${item.text.slice(0, 50)}"`
              });
            }
          }
        });
      } else if (targetType === 'pricing') {
        const priceRegex = /(?:\$|€|£|₹)\s*\d+(?:,\d{3})*(?:\.\d{2})?(?:\s*\/\s*(?:mo|yr|month|year|seat|user))?/gi;
        const matches = Array.from(bodyText.match(priceRegex) || []);

        Array.from(new Set(matches)).forEach(pr => {
          if (parsedRecords.length < 3 && (!lowerQuery || pr.includes(lowerQuery))) {
            parsedRecords.push({
              id: parsedRecords.length + 1,
              badge: "PRICE POINT",
              value: pr,
              context: `Price point detected on ${parsedUrl.hostname}`
            });
          }
        });

        if (parsedRecords.length < 3) {
          const pricingNodes = Array.from(doc.querySelectorAll<HTMLElement>('[class*="price"], [class*="tier"], [class*="plan"], [class*="rate"]'))
            .map(n => n.innerText.trim())
            .filter(t => t.length > 3 && t.length < 80);

          Array.from(new Set(pricingNodes)).forEach(pn => {
            if (parsedRecords.length < 3 && (!lowerQuery || pn.toLowerCase().includes(lowerQuery))) {
              parsedRecords.push({
                id: parsedRecords.length + 1,
                badge: "PLAN TIER",
                value: pn,
                context: "Pricing tier element"
              });
            }
          });
        }
      }
    }

    // STRICT CAP: Keep max output strictly as 3 records
    const finalTop3 = parsedRecords.slice(0, 3);

    // Honest handling: never invent fake mock emails/data
    if (finalTop3.length === 0) {
      setScrapeFailed(true);
      if (isLiveFetched) {
        finalTop3.push({
          id: 1,
          badge: "NO RECORDS FOUND",
          value: customQuery
            ? `No records matching filter "${customQuery}"`
            : `No public ${targetType} elements discovered on page view`,
          context: `Target (${parsedUrl.hostname}) returned 200 OK without matching ${targetType}. Try another extraction category or query.`
        });
        setScrapeStatus(`200 OK (${duration}ms) - 0 RECORDS MATCHED`);
      } else {
        finalTop3.push({
          id: 1,
          badge: "CORS RESTRICTED",
          value: `Target domain (${parsedUrl.hostname}) blocks direct client-side reads`,
          context: "Direct browser extraction is restricted by cross-origin security. Execute the compiled Python Playwright script below on a dedicated worker."
        });
        setScrapeStatus(`CORS / GATEWAY RESTRICTED (${duration}ms)`);
      }
    } else {
      setScrapeFailed(false);
      setScrapeStatus(`200 OK (${duration}ms)`);
    }

    setExtractedRecords(finalTop3);
    setIsScraping(false);
    abortControllerRef.current = null;
    soundEngine.playPop(0.09);

    updatePlaywrightScript(cleanUrl, targetType, customQuery);
  };

  const runAudit = (text: string) => {
    const buzzwords = ["cutting-edge", "passionate", "seamless", "revolutionize", "revolutionary", "innovative", "delve", "tapestry"];
    let count = 0;
    buzzwords.forEach(bw => {
      if (text.toLowerCase().includes(bw)) count++;
    });

    const hook = Math.max(20, 100 - (count * 20));
    const loss = text.toLowerCase().includes("lose") || text.toLowerCase().includes("stop") || text.toLowerCase().includes("hours") || text.toLowerCase().includes("cost") ? 85 : 30;
    const total = Math.round((hook * 0.4) + (loss * 0.4) + (100 - count * 25) * 0.2);

    setTeardownScore(total);
    setMetricHook(hook);
    setMetricLoss(loss);
    setFluffPenalty(`-${count * 15} pts (${count} buzzwords)`);

    if (total < 60) {
      setTeardownSuggestion("Eliminate 15 hours of manual repetitive data entry every week with custom automated Python pipelines. Stop losing client deals to slow response times.");
    } else {
      setTeardownSuggestion("Strong positioning detected: clear economic value proposition with minimal cognitive friction.");
    }
  };

  return (
    <section id="workbench" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-surface-border">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.15em] text-cyanAccent block mb-2">// EXECUTABLE SANDBOX</span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Live Terminal & <span className="font-serif italic font-normal text-neutral-400">Workbench</span>
          </h2>
        </div>
        <p className="text-sm font-mono text-neutral-400 max-w-md mt-4 md:mt-0">
          Real client-side DOM parsers, interactive CLI command executions, and Playwright code generation in real time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-xl bg-surface-card border border-surface-border max-w-3xl">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'terminal' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <TerminalIcon className="w-3.5 h-3.5" /> 01. Interactive Shell (CLI)
        </button>
        <button
          onClick={() => setActiveTab('scraper')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'scraper' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> 02. Deterministic Scraper
        </button>
        <button
          onClick={() => setActiveTab('teardown')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'teardown' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5" /> 03. Copy Teardown
        </button>
      </div>

      {/* TAB 1: TERMINAL */}
      {activeTab === 'terminal' && (
        <div className="tilt-card rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-[10px] font-mono tracking-wider text-neutral-300 uppercase">RUNNING</span>
              </div>
              <span className="text-xs font-mono text-neutral-400 tracking-tight">flyvane@runtime // session: tty-live-01</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
              <span>LATENCY &lt;1ms</span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-300">UTF-8 / XTERM</span>
            </div>
          </div>

          <div ref={terminalScrollRef} className="bg-void rounded-xl border border-surface-border p-4 font-mono text-xs h-80 overflow-y-auto space-y-2 scrollbar-thin">
            {terminalHistory.map((item, i) => (
              <div
                key={i}
                className={
                  item.sender === 'user'
                    ? 'text-cyan-300'
                    : item.isError
                    ? 'text-red-400 pl-2 border-l border-red-500/40 my-1'
                    : 'text-neutral-300 pl-2 border-l border-surface-border my-1 whitespace-pre-wrap'
                }
              >
                {item.sender === 'user' && <span className="font-bold">flyvane@engine:~$ </span>}
                {item.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-surface-elevated border border-surface-border rounded-xl p-3 font-mono text-xs">
            <span className="text-cyan-400 font-bold">flyvane@engine:~$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalKeyDown}
              placeholder="Type a command (e.g. 'help', 'scrape https://example.com', 'aira speak hello')..."
              className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-neutral-600"
            />
            <button
              onClick={handleTerminalSubmit}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors tactile-btn"
            >
              Run
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SCRAPER */}
      {activeTab === 'scraper' && (
        <div className="tilt-card rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div>
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyanAccent" />
                Live Deterministic Scraper & Playwright Generator
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Real DOM extraction engine. Select what to extract, apply optional keyword filters, and view clean capped records.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300">
                <span className="text-cyan-400 font-bold">INTERACTIVE DEMO:</span> CLIENT-SIDE DOM & PROXY
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300">
                <span className="text-emerald-400 font-bold">PRODUCTION PIPELINE:</span> PLAYWRIGHT ASYNC FLEET
              </span>
              <span className="px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CAPPED AT 3 RECORDS
              </span>
            </div>
          </div>

          {/* Step 1: Input URL & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="uppercase tracking-wider">Target Destination URL</span>
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 text-[10px]">PRESETS:</span>
                <button
                  type="button"
                  onClick={() => {
                    setScraperUrl('https://news.ycombinator.com');
                    setScrapeTargetType('contacts');
                  }}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[10px] border border-white/10"
                >
                  Hacker News
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScraperUrl('https://github.com/trending');
                    setScrapeTargetType('text');
                  }}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[10px] border border-white/10"
                >
                  GitHub Trending
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScraperUrl('https://stripe.com/pricing');
                    setScrapeTargetType('pricing');
                  }}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[10px] border border-white/10"
                >
                  Stripe Pricing
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-500">
                URL //
              </span>
              <input
                type="url"
                value={scraperUrl}
                onChange={(e) => setScraperUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-16 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyanAccent transition-colors"
              />
            </div>
          </div>

          {/* Step 2: What to Scrape (Target Mode) & Keyword Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Mode Selector (8 cols) */}
            <div className="md:col-span-8 space-y-1.5">
              <span className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Select Extraction Target //
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setScrapeTargetType('contacts')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    scrapeTargetType === 'contacts'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-surface-elevated border-surface-border text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Mail className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'contacts' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <div>
                    <span className="block text-xs font-mono font-bold leading-none">Contacts</span>
                    <span className="text-[10px] text-neutral-500">Emails & Phones</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScrapeTargetType('text')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    scrapeTargetType === 'text'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-surface-elevated border-surface-border text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'text' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <div>
                    <span className="block text-xs font-mono font-bold leading-none">Text & Headings</span>
                    <span className="text-[10px] text-neutral-500">Titles & Copies</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScrapeTargetType('links')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    scrapeTargetType === 'links'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-surface-elevated border-surface-border text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Link2 className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'links' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <div>
                    <span className="block text-xs font-mono font-bold leading-none">Links & URLs</span>
                    <span className="text-[10px] text-neutral-500">Outbound Targets</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScrapeTargetType('pricing')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    scrapeTargetType === 'pricing'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-surface-elevated border-surface-border text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <DollarSign className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'pricing' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <div>
                    <span className="block text-xs font-mono font-bold leading-none">Pricing & Stats</span>
                    <span className="text-[10px] text-neutral-500">Rates & Figures</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Keyword Filter & Execute Button (4 cols) */}
            <div className="md:col-span-4 space-y-1.5">
              <span className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Keyword Filter (Optional) //
              </span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.value)}
                    placeholder="e.g. founder, price..."
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyanAccent"
                  />
                </div>
                {isScraping && (
                  <button
                    type="button"
                    onClick={cancelScrape}
                    className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="Cancel in-flight request"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  disabled={isScraping}
                  onClick={() => executeScrape(scraperUrl, scrapeTargetType, keywordFilter)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
                >
                  {isScraping ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Extracting</span>
                    </>
                  ) : scrapeFailed ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Retry</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Run</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid: Clean 3 Records (Left) & Playwright Script (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: CLEAN 3 RECORDS FORMAT (NOT JSON) */}
            <div className="lg:col-span-7 bg-void rounded-2xl border border-surface-border p-5 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border/60 text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isScraping ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-white font-bold tracking-wider">{scrapeStatus}</span>
                </div>
                <span className="text-[10px] text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 font-bold uppercase">
                  {scrapeTargetType} // STRICT CAP 3
                </span>
              </div>

              {/* 3 Clean Output Cards */}
              <div className="space-y-3">
                {extractedRecords.slice(0, 3).map((record, index) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl bg-surface-elevated border border-surface-border hover:border-cyan-500/40 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="px-2 py-1 rounded bg-black/60 border border-white/10 text-cyan-400 font-mono text-[11px] font-bold shrink-0">
                        0{index + 1}
                      </span>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300 font-semibold">
                            {record.badge}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-500 truncate">
                            {record.context}
                          </span>
                        </div>
                        <p className="text-sm font-sans font-medium text-white break-words select-all leading-snug">
                          {record.value}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(record.value);
                        setCopiedRecordId(record.id);
                        setTimeout(() => setCopiedRecordId(null), 2000);
                      }}
                      className="p-2 rounded-lg bg-surface-card hover:bg-white/10 border border-surface-border text-neutral-400 hover:text-white transition-colors shrink-0"
                      title="Copy this record"
                    >
                      {copiedRecordId === record.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Strip: Plaintext Export */}
              <div className="pt-3 border-t border-surface-border/60 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const textSummary = extractedRecords
                      .slice(0, 3)
                      .map((r, i) => `${i + 1}. [${r.badge}] ${r.value} (${r.context})`)
                      .join('\n');
                    navigator.clipboard.writeText(textSummary);
                    setCopiedAll(true);
                    setTimeout(() => setCopiedAll(false), 2200);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all text-[11px] font-mono"
                >
                  {copiedAll ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  {copiedAll ? "Copied 3 Records!" : "Copy Top 3 Records as Text"}
                </button>

                <span className="text-[10px] font-mono text-neutral-500">
                  Clean Human Format • JSON Suppressed
                </span>
              </div>
            </div>

            {/* Right Column: Tailored Playwright Python Script */}
            <div className="lg:col-span-5 bg-surface-elevated rounded-2xl border border-surface-border p-5 font-mono text-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-surface-border/60 text-neutral-400">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Code className="w-3.5 h-3.5 text-emerald-400" /> Tailored Playwright Script
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPy);
                      setCopiedPy(true);
                      setTimeout(() => setCopiedPy(false), 2000);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedPy ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedPy ? "Copied!" : "Copy .py"}
                  </button>
                </div>
                <pre className="h-64 overflow-y-auto text-emerald-300 text-[11px] leading-relaxed scrollbar-thin bg-black/40 p-3 rounded-xl border border-white/5">
                  {generatedPy}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([generatedPy], { type: "text/plain" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `scraper_${scrapeTargetType}_3records.py`;
                  a.click();
                }}
                className="w-full py-2.5 rounded-xl bg-surface-card hover:bg-surface border border-surface-border text-xs text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors font-mono"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Download Python Automation Script (.py)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TEARDOWN */}
      {activeTab === 'teardown' && (
        <div className="tilt-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div>
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-amberAccent" />
                Psychological Copy Teardown & Friction Analyzer
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Evaluates conversion velocity, loss aversion weight, cognitive friction, and flags buzzwords.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-amber-950/60 border border-amber-800 text-[11px] font-mono text-amber-300">
              ENGINE: BEHAVIORAL LINGUISTICS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Paste Landing Page Headline or Pitch Copy
              </label>
              <textarea
                rows={6}
                value={teardownInput}
                onChange={(e) => setTeardownInput(e.target.value)}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl p-4 text-sm font-sans text-white focus:outline-none focus:border-amberAccent transition-colors leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    const sample = "We are an innovative, passionate digital agency revolutionizing seamless cloud solutions.";
                    setTeardownInput(sample);
                    runAudit(sample);
                  }}
                  className="text-xs font-mono text-neutral-400 hover:text-white underline"
                >
                  Load Sample AI Pitch
                </button>
                <button
                  onClick={() => runAudit(teardownInput)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-black" /> Run Behavioral Audit
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-surface-elevated rounded-xl border border-surface-border p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <span className="text-xs font-mono uppercase text-neutral-400">Psychological Audit Score</span>
                <span className="text-2xl font-display font-bold text-amber-400">{teardownScore} / 100</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Hook Velocity & Clarity</span>
                    <span className="text-amber-400">{metricHook}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${metricHook}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Loss Aversion Framing</span>
                    <span className="text-amber-400">{metricLoss}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${metricLoss}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Fluff & Buzzword Penalty</span>
                    <span className="text-red-400">{fluffPenalty}</span>
                  </div>
                  <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: '75%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-void border border-surface-border mt-4">
                <span className="text-[10px] font-mono text-emerald-400 block mb-1 uppercase">// Flyvane Strategic Rewrite Architecture</span>
                <p className="text-xs font-sans text-neutral-200 leading-relaxed italic">
                  "{teardownSuggestion}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
