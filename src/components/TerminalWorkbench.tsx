import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';
import { sanitizeText } from '../utils/security';
import {
  Terminal as TerminalIcon,
  Cpu,
  Code,
  Copy,
  Download,
  Play,
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
  badge: string;
  value: string;
  context: string;
  rawType?: string;
}

interface TerminalWorkbenchProps {
  onSetMode: (mode: 'machine' | 'mind' | 'hybrid') => void;
}

export const TerminalWorkbench: React.FC<TerminalWorkbenchProps> = ({ onSetMode }) => {
  const [activeTab, setActiveTab] = useState<'scraper' | 'terminal'>('scraper');

  // Execution Log State
  const [terminalHistory, setTerminalHistory] = useState<Array<{ sender: string; text: string; isError?: boolean }>>([
    { sender: 'system', text: "Type 'help' to inspect automation commands. Try: 'scrape https://news.ycombinator.com', 'info stack', 'calc', or 'capabilities'." },
    { sender: 'user', text: "runtime.status" },
    { sender: 'system', text: "[OK] Python AsyncIO execution core online. Ready for target dispatch." }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>(['runtime.status']);
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
  • calc : Launch Automation Arbitrage & Savings Calculator
  • mode <machine|mind|hybrid> : Switch studio mode (Automation Services, Marketing Services, Hybrid)
  • capabilities : Inspect studio infrastructure standards & security SLAs
  • contact : View direct communication endpoints & intake instructions
  • clear : Reset execution log`
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
          text: `[VERIFIED INFO — STUDIO STACK]\n• Core Engine: Python 3.12 AsyncIO, Playwright, Crawl4AI, Pydantic V2\n• Workers & Agents: LangGraph deterministic state machines, Celery, Redis\n• Security: Hardened defensive architecture, AES-256 storage, TLS 1.3 in transit\n• Reliability: Multi-worker process pooling with automated health restarts`
        });
      } else if (topic.includes('pric') || topic.includes('cost') || topic.includes('retainer') || topic.includes('roi')) {
        newHist.push({
          sender: 'system',
          text: `[VERIFIED INFO — PRICING & ROI]\n• One-Time Automations: Custom scoped from low-frequency task scripts to enterprise pipelines\n• Managed Retainers: Dedicated autonomous systems sentry and continuous pipeline monitoring\n• Calculation Logic: Weekly labor = operators × hours × hourly rate × automated%\n• To compute exact ROI: type 'calc' or scroll to the Calculator section`
        });
      } else if (topic.includes('aira') || topic.includes('mascot') || topic.includes('bot')) {
        newHist.push({
          sender: 'system',
          text: `[VERIFIED INFO — AIRA CONCIERGE]\nAira is CrystalSteed's interactive studio concierge providing instant text navigation and architecture guidance across our engineering and advisory workflows.`
        });
      } else if (topic.includes('contact') || topic.includes('email') || topic.includes('hire')) {
        newHist.push({
          sender: 'system',
          text: `[VERIFIED INFO — CONTACT]\n• Direct Intake: #contact\n• Engagement Model: Dedicated engineering pipelines & strategic retainers`
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
      newHist.push({ sender: 'system', text: `[PARSING] Executing live extraction on ${target}. Switched to Extraction view.` });
    } else if (action === 'calc') {
      const el = document.getElementById('roi-arbitrage');
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = '#roi-arbitrage';
      }
      newHist.push({ sender: 'system', text: `[NAVIGATED] Opened Automation Arbitrage & Savings Calculator.` });
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
    } else if (action === 'capabilities') {
      const el = document.getElementById('capabilities');
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = '#capabilities';
      }
      newHist.push({ sender: 'system', text: `[CAPABILITIES] CrystalSteed — Defensive Architecture, Fault-Tolerant Worker Pooling, Distributed Autonomous Pipelines.` });
    } else if (action === 'contact') {
      const el = document.getElementById('contact');
      if (el && (window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.0 });
      } else {
        window.location.href = '#contact';
      }
      newHist.push({ sender: 'system', text: `[CONTACT DIRECT] Intake: #contact | Selective Enterprise Allocation` });
    } else if (action === 'clear') {
      setTerminalHistory([{ sender: 'system', text: 'Execution log cleared. Type "help" for commands.' }]);
      setTerminalInput('');
      return;
    } else {
      newHist.push({
        sender: 'system',
        text: `[UNSUPPORTED OPERATION] '${cmd}' is not a recognized command. Type 'help' for verified commands or 'info' to request information.`,
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
    Generated by: CrystalSteed Engineering Pipeline
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
      // 1. Try local/Vercel Node scraper API (zero browser CORS)
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

      // 3. Fallback to AllOrigins raw proxy gateway
      if (!isLiveFetched) {
        setScrapeStatus("FETCHING VIA ALLORIGINS PROXY GATEWAY...");
        try {
          const aoResp = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`, {
            signal: controller.signal
          });
          if (aoResp.ok) {
            rawHtml = await aoResp.text();
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

      const resolveUrl = (rawHref: string): string => {
        if (!rawHref) return '';
        try {
          return new URL(rawHref, parsedUrl.origin).href;
        } catch {
          return rawHref;
        }
      };

      if (targetType === 'contacts') {
        // A. Emails from mailto anchors
        const mailtoEls = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]'))
          .map(a => {
            const raw = a.getAttribute('href') || a.href || '';
            return raw.replace(/^mailto:/i, '').split('?')[0].trim();
          })
          .filter(Boolean);

        // B. Emails from body text or markdown regex
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
            .map(a => (a.getAttribute('href') || a.href || '').replace(/^tel:/i, '').trim());
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

        // D. Contact channels & profiles (resolved against target origin)
        if (parsedRecords.length < 3) {
          const contactLinks = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[href*="contact"], a[href*="about"], a[href*="apply"], a[href*="help"], a[href*="team"], a[href*="linkedin.com"], a[href*="github.com"], a[href*="twitter.com"], a[href*="x.com"]'))
            .map(a => resolveUrl(a.getAttribute('href') || a.href || ''))
            .filter(h => h.startsWith('http') && !h.includes(window.location.hostname));

          // Also check markdown links if response was markdown
          const mdLinks = Array.from(rawHtml.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi))
            .filter(m => /contact|about|apply|help|team|linkedin|github|twitter/i.test(m[1]) || /contact|about|apply|help|team|linkedin|github|twitter/i.test(m[2]))
            .map(m => m[2]);

          Array.from(new Set([...contactLinks, ...mdLinks])).forEach(cl => {
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

        // Headings H1, H2, H3, titleline, story titles
        const headings = Array.from(doc.querySelectorAll<HTMLElement>('h1, h2, h3, .titleline > a, .titleline, article header, [class*="headline"], [class*="story-title"]'))
          .map(h => (h.innerText || '').trim())
          .filter(t => t.length > 4 && t.length < 240);

        // Markdown headings fallback (e.g. # Title or ## Subtitle)
        if (headings.length === 0) {
          const mdHeadings = Array.from(rawHtml.matchAll(/^#{1,3}\s+(.+)$/gm))
            .map(m => m[1].trim())
            .filter(t => t.length > 4 && t.length < 240);
          headings.push(...mdHeadings);
        }

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
            .map(p => (p.innerText || '').trim())
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
            text: (a.innerText || a.getAttribute('aria-label') || a.getAttribute('title') || 'Destination Resource').trim().replace(/\s+/g, ' '),
            href: resolveUrl(a.getAttribute('href') || '')
          }))
          .filter(l => l.href.startsWith('http') && l.text.length > 1 && !l.href.includes('javascript:') && !l.href.startsWith(window.location.origin));

        // Markdown links fallback
        if (rawLinks.length === 0) {
          const mdLinks = Array.from(rawHtml.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/gi))
            .map(m => ({
              text: m[1].trim(),
              href: m[2].trim()
            }))
            .filter(l => l.text.length > 1 && !l.href.startsWith(window.location.origin));
          rawLinks.push(...mdLinks);
        }

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

  return (
    <section id="workbench" className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-emerald-400 block mb-2.5 font-semibold">
            AUTONOMOUS EXECUTION SANDBOX
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-white tracking-tight leading-[1.15] text-balance">
            Live Pipeline & Extraction Workbench
          </h2>
        </div>
        <p className="text-sm sm:text-base font-sans text-zinc-400 max-w-md mt-4 md:mt-0 leading-relaxed">
          Interactive DOM extraction engine, live runtime inspection, and automated Python Playwright script compilation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-xl">
        <button
          type="button"
          onClick={() => setActiveTab('scraper')}
          className={`px-4 py-2 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'scraper'
              ? 'backdrop-blur-xl bg-white/[0.12] border border-white/[0.24] text-white font-semibold shadow-[0_4px_16px_rgba(0,216,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]'
              : 'text-zinc-400 hover:text-white border border-transparent'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span><span className="font-mono">01</span>. Deterministic Extraction Sandbox</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terminal')}
          className={`px-4 py-2 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'terminal'
              ? 'backdrop-blur-xl bg-white/[0.12] border border-white/[0.24] text-white font-semibold shadow-[0_4px_16px_rgba(0,216,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.3)]'
              : 'text-zinc-400 hover:text-white border border-transparent'
          }`}
        >
          <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span><span className="font-mono">02</span>. Runtime Execution Inspector</span>
        </button>
      </div>

      {/* TAB 2: RUNTIME INSPECTOR */}
      {activeTab === 'terminal' && (
        <InteractiveTiltWrapper
          onMouseEnter={() => soundEngine.playHoverHum()}
          className="p-6 sm:p-8 space-y-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-zinc-300 uppercase">ONLINE</span>
              </div>
              <span className="text-xs font-sans text-zinc-400 tracking-tight">CrystalSteed Runtime Inspector</span>
            </div>
            <div className="flex items-center gap-2 font-sans font-semibold text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
              <span>ASYNCIO CORE</span>
            </div>
          </div>

          <div ref={terminalScrollRef} className="liquid-glass-inner font-mono text-xs h-80 overflow-y-auto space-y-2 relative z-10">
            {terminalHistory.map((item, i) => (
              <div
                key={i}
                className={
                  item.sender === 'user'
                    ? 'text-cyan-300'
                    : item.isError
                    ? 'text-rose-400 pl-2 border-l border-rose-500/40 my-1'
                    : 'text-zinc-300 pl-2 border-l border-white/10 my-1 whitespace-pre-wrap'
                }
              >
                {item.sender === 'user' && <span className="font-semibold text-cyan-400">[QUERY] </span>}
                {item.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-xl p-3 font-mono text-xs relative z-10">
            <span className="text-cyan-400 font-semibold">QUERY</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(sanitizeText(e.target.value, 200))}
              onKeyDown={handleTerminalKeyDown}
              placeholder="Enter runtime query (e.g. 'help', 'scrape https://example.com', 'info stack')..."
              className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-zinc-500 font-sans"
            />
            <button
              type="button"
              onClick={handleTerminalSubmit}
              className="px-4 py-1.5 rounded-lg bg-cyan-400 text-black font-sans font-semibold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors tactile-btn"
            >
              Execute
            </button>
          </div>
        </InteractiveTiltWrapper>
      )}

      {/* TAB 1: DETERMINISTIC EXTRACTION SANDBOX */}
      {activeTab === 'scraper' && (
        <InteractiveTiltWrapper
          onMouseEnter={() => soundEngine.playHoverHum()}
          className="p-6 sm:p-8 space-y-6 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <h3 className="text-xl font-sans font-semibold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Deterministic Extraction & Playwright Compiler</span>
              </h3>
              <p className="text-xs font-sans text-zinc-400 mt-1">
                Live DOM extraction sandbox. Select an extraction target, apply optional filters, and inspect structured records.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-zinc-300">
                <span className="text-cyan-400 font-semibold">SANDBOX:</span> LIVE DOM PARSER
              </span>
              <span className="px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                CAPPED AT 3 RECORDS
              </span>
            </div>
          </div>

          {/* Step 1: Input URL & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-sans text-zinc-400">
              <span className="uppercase tracking-[0.15em] font-semibold text-[11px]">Target Destination URL</span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 text-[10px] font-mono">PRESETS:</span>
                <button
                  type="button"
                  onClick={() => {
                    setScraperUrl('https://news.ycombinator.com');
                    setScrapeTargetType('contacts');
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-sans border border-white/[0.08] cursor-pointer"
                >
                  Hacker News
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScraperUrl('https://github.com/trending');
                    setScrapeTargetType('text');
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-sans border border-white/[0.08] cursor-pointer"
                >
                  GitHub Trending
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScraperUrl('https://stripe.com/pricing');
                    setScrapeTargetType('pricing');
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-sans border border-white/[0.08] cursor-pointer"
                >
                  Stripe Pricing
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-500">
                TARGET
              </span>
              <input
                type="url"
                value={scraperUrl}
                onChange={(e) => setScraperUrl(sanitizeText(e.target.value, 500))}
                placeholder="https://example.com"
                className="w-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.09] rounded-xl pl-20 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Step 2: What to Scrape (Target Mode) & Keyword Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-1.5">
              <span className="block text-[11px] font-sans font-semibold text-zinc-400 uppercase tracking-[0.15em]">
                Select Extraction Target
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setScrapeTargetType('contacts')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    scrapeTargetType === 'contacts'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'backdrop-blur-xl bg-white/[0.03] border-white/[0.09] text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Mail className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'contacts' ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="block text-xs font-sans font-semibold leading-none">Contacts</span>
                    <span className="text-[10px] font-sans text-zinc-500">Emails & Endpoints</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScrapeTargetType('text')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    scrapeTargetType === 'text'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'backdrop-blur-xl bg-white/[0.03] border-white/[0.09] text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'text' ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="block text-xs font-sans font-semibold leading-none">Structured Text</span>
                    <span className="text-[10px] font-sans text-zinc-500">Titles & Nodes</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScrapeTargetType('links')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    scrapeTargetType === 'links'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'backdrop-blur-xl bg-white/[0.03] border-white/[0.09] text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Link2 className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'links' ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="block text-xs font-sans font-semibold leading-none">Links & URLs</span>
                    <span className="text-[10px] font-sans text-zinc-500">Outbound Anchors</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScrapeTargetType('pricing')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    scrapeTargetType === 'pricing'
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : 'backdrop-blur-xl bg-white/[0.03] border-white/[0.09] text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <DollarSign className={`w-4 h-4 shrink-0 ${scrapeTargetType === 'pricing' ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <div>
                    <span className="block text-xs font-sans font-semibold leading-none">Pricing & Tiers</span>
                    <span className="text-[10px] font-sans text-zinc-500">Rates & Figures</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <span className="block text-[11px] font-sans font-semibold text-zinc-400 uppercase tracking-[0.15em]">
                Keyword Filter (Optional)
              </span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(sanitizeText(e.target.value, 100))}
                    placeholder="Filter records..."
                    className="w-full backdrop-blur-xl bg-white/[0.03] border border-white/[0.09] rounded-xl pl-8 pr-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                {isScraping && (
                  <button
                    type="button"
                    onClick={cancelScrape}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-sans text-xs font-medium transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="Cancel in-flight request"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  disabled={isScraping}
                  onClick={() => executeScrape(scraperUrl, scrapeTargetType, keywordFilter)}
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-sans font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
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
            <div className="lg:col-span-7 liquid-glass-inner text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isScraping ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-white font-mono font-semibold tracking-wider">{scrapeStatus}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-semibold uppercase">
                  {scrapeTargetType} — MAX 3 RECORDS
                </span>
              </div>

              <div className="space-y-3">
                {extractedRecords.slice(0, 3).map((record, index) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-cyan-400 font-mono text-[11px] font-semibold shrink-0">
                        0{index + 1}
                      </span>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
                            {record.badge}
                          </span>
                          <span className="text-[11px] font-sans text-zinc-400 truncate">
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
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
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

              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
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
                  className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-sans cursor-pointer"
                >
                  {copiedAll ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>{copiedAll ? "Copied 3 Records" : "Copy Top 3 Records"}</span>
                </button>

                <span className="text-[11px] font-sans text-zinc-500">
                  Normalized Schema Output
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 liquid-glass-inner text-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.08] text-zinc-400">
                  <span className="flex items-center gap-1.5 text-white font-sans font-semibold">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Compiled Playwright Worker</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPy);
                      setCopiedPy(true);
                      setTimeout(() => setCopiedPy(false), 2000);
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPy ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPy ? "Copied" : "Copy .py"}</span>
                  </button>
                </div>
                <pre className="h-64 overflow-y-auto text-cyan-200/90 font-mono text-[11px] leading-relaxed backdrop-blur-xl bg-white/[0.025] p-3.5 rounded-xl border border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]">
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
                className="w-full py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors font-sans font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Python Worker Script (.py)</span>
              </button>
            </div>
          </div>
        </InteractiveTiltWrapper>
      )}

    </section>
  );
};

