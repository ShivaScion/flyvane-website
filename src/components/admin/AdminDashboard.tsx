import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Smartphone,
  KeyRound,
  AlertCircle,
  Database,
  FileText,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  LogOut,
  RefreshCw,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { InteractiveTiltWrapper } from '../InteractiveTiltWrapper';
import { MODE_CONTENT, ModeConfig } from '../../data/modeContent';

interface LeadRecord {
  id: string;
  created_at: string;
  name: string;
  contact_handle: string;
  contact_type: string;
  service_scope: string;
  project_brief: string;
  active_mode: string;
  status: 'new' | 'contacted' | 'qualified' | 'archived';
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  reading_time: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
}

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

export function AdminDashboard({ onNavigateHome }: AdminDashboardProps) {
  // Authentication State
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return sessionStorage.getItem('flyvane_admin_token') || null;
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(300);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'leads' | 'content' | 'blogs' | 'system'>('leads');

  // Leads State
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Content CMS State
  const [selectedMode, setSelectedMode] = useState<'machine' | 'mind' | 'hybrid'>('machine');
  const [contentConfig, setContentConfig] = useState<Record<'machine' | 'mind' | 'hybrid', ModeConfig>>(MODE_CONTENT);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [contentSaveSuccess, setContentSaveSuccess] = useState(false);

  // Blogs State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);

  // Timer Countdown for OTP
  useEffect(() => {
    if (!otpSent || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Load Data when Authenticated
  useEffect(() => {
    if (!sessionToken) return;

    // Load Leads
    loadLeads();
    // Load Blogs
    loadBlogs();
    // Load Dynamic Content Overrides
    loadContentOverrides();
  }, [sessionToken]);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/send-otp', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setTimer(300);
      } else {
        setAuthError(data.error || 'Failed to dispatch 2FA code.');
      }
    } catch {
      setAuthError('Network communication failed during 2FA dispatch.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('flyvane_admin_token', data.token);
        setSessionToken(data.token);
      } else {
        setAuthError(data.error || 'Invalid 2FA passcode.');
      }
    } catch {
      setAuthError('Authentication handshake failure.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('flyvane_admin_token');
    setSessionToken(null);
    setOtpSent(false);
    setOtpCode('');
  };

  // Leads Management
  const loadLeads = async () => {
    if (!sessionToken) return;
    setIsLoadingLeads(true);
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: LeadRecord['status']) => {
    if (!sessionToken) return;
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Content Overrides Management
  const loadContentOverrides = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.success && data.content && Object.keys(data.content).length > 0) {
        setContentConfig((prev) => ({
          ...prev,
          ...data.content,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveContentChanges = async () => {
    if (!sessionToken) return;
    setIsSavingContent(true);
    setContentSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          key: selectedMode,
          value: contentConfig[selectedMode],
        }),
      });
      if (res.ok) {
        setContentSaveSuccess(true);
        setTimeout(() => setContentSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingContent(false);
    }
  };

  // Blogs Management
  const loadBlogs = async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch('/api/admin/blogs', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const data = await res.json();
      if (data.success && data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveBlogPost = async () => {
    if (!sessionToken || !editingPost) return;
    setIsSavingPost(true);
    try {
      const isNew = !editingPost.id;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/blogs', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(editingPost),
      });
      if (res.ok) {
        setEditingPost(null);
        await loadBlogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingPost(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!sessionToken || !confirm('Permanently delete this publication?')) return;
    try {
      await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      await loadBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  // ============================================================================
  // RENDER: 2FA LOGIN VAULT SCREEN
  // ============================================================================
  if (!sessionToken) {
    return (
      <div className="min-h-screen bg-[#030406] text-zinc-200 flex items-center justify-center p-4 sm:p-6 select-none relative z-20">
        <InteractiveTiltWrapper className="max-w-md w-full p-8 sm:p-10 space-y-8 relative overflow-hidden border border-white/[0.1]">
          {/* Top Security Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(0,216,255,0.2)]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 block font-semibold">
              FLYVANE COMMAND VAULT
            </span>
            <h1 className="text-2xl font-display font-medium text-white tracking-tight">
              Two-Factor Authentication
            </h1>
            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
              Restricted executive interface. Verification required across verified channels.
            </p>
          </div>

          {/* Registered Admin Channels Info */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 space-y-2 text-xs font-sans">
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>ransh4859@gmail.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 9800488177 (WhatsApp)</span>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full py-3.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-400/25 disabled:opacity-50"
            >
              {isSendingOtp ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching 2FA Code...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Dispatch 2FA Passcode</span>
                </>
              )}
            </button>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  Enter 6-Digit Passcode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoFocus
                  className="w-full bg-white/[0.03] border border-white/[0.12] focus:border-cyan-400 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.4em] text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || timer > 240}
                  className="text-cyan-400 hover:underline disabled:opacity-40"
                >
                  Resend Code
                </button>
              </div>

              <button
                type="submit"
                disabled={otpCode.length !== 6 || isVerifying}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <button
              onClick={onNavigateHome}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Studio</span>
            </button>
          </div>
        </InteractiveTiltWrapper>
      </div>
    );
  }

  // ============================================================================
  // RENDER: AUTHENTICATED COMMAND CONSOLE
  // ============================================================================
  return (
    <div className="min-h-screen bg-transparent text-zinc-200 pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Top Console Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/[0.08] gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-base font-display font-medium text-white tracking-tight">
                Flyvane Command Vault
              </h1>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Authenticated Owner: ransh4859@gmail.com
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'leads' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Advisory Leads ({leads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'content' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Content CMS</span>
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'blogs' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Publications</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'system' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-lg text-xs font-sans text-red-400 hover:bg-red-500/10 transition-colors ml-1"
            title="Lock Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ======================================================================
          TAB 1: ADVISORY LEADS VAULT
          ====================================================================== */}
      {activeTab === 'leads' && (
        <div className="pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client or handle..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['all', 'new', 'contacted', 'qualified', 'archived'].map((st) => (
                <button
                  key={st}
                  onClick={() => setLeadStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border ${
                    leadStatusFilter === st
                      ? 'bg-cyan-400 text-black border-cyan-400 font-bold'
                      : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
              <button
                onClick={loadLeads}
                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-zinc-300 hover:text-white"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lead List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {leads.filter((l) => {
                const matchesSearch =
                  l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                  l.contact_handle.toLowerCase().includes(leadSearch.toLowerCase());
                const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
                return matchesSearch && matchesStatus;
              }).length === 0 ? (
                <div className="p-12 text-center text-xs font-mono text-zinc-500 border border-white/[0.06] rounded-2xl bg-white/[0.01]">
                  No leads found matching current parameters.
                </div>
              ) : (
                leads
                  .filter((l) => {
                    const matchesSearch =
                      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                      l.contact_handle.toLowerCase().includes(leadSearch.toLowerCase());
                    const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedLead?.id === lead.id
                          ? 'bg-white/[0.05] border-cyan-400/50 shadow-[0_0_20px_rgba(0,216,255,0.1)]'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-sans font-semibold text-white">{lead.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider ${
                            lead.status === 'new'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : lead.status === 'contacted'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : lead.status === 'qualified'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-cyan-400 mb-2">{lead.contact_handle}</div>
                      <p className="text-xs font-sans text-zinc-400 line-clamp-2 leading-relaxed">
                        {lead.project_brief}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-3 border-t border-white/[0.04] mt-2">
                        <span>Mode: {lead.active_mode.toUpperCase()}</span>
                        <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Lead Detail Panel (5 cols) */}
            <div className="lg:col-span-5">
              {selectedLead ? (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6 sticky top-28">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 block mb-1">
                      LEAD BRIEF TELEMETRY
                    </span>
                    <h2 className="text-xl font-display font-medium text-white">{selectedLead.name}</h2>
                    <span className="text-xs font-mono text-zinc-400">{selectedLead.id}</span>
                  </div>

                  <div className="space-y-3 text-xs font-sans">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-1">Contact Handle</span>
                      <span className="text-cyan-400 font-mono select-all text-sm">{selectedLead.contact_handle}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-1">Service Scope</span>
                      <span className="text-white font-medium">{selectedLead.service_scope}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-1">Full Project Scope</span>
                      <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedLead.project_brief}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                      Update Lead Lifecycle Status
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {(['new', 'contacted', 'qualified', 'archived'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateLeadStatus(selectedLead.id, st)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            selectedLead.status === st
                              ? 'bg-cyan-400 text-black border-cyan-400 font-bold'
                              : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:text-white'
                          }`}
                        >
                          {st.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 flex gap-2">
                      <a
                        href={`mailto:${selectedLead.contact_handle}?subject=Flyvane Advisory — Scope Discussion`}
                        className="flex-1 py-2.5 rounded-xl bg-white text-black font-sans font-semibold text-xs text-center hover:bg-zinc-200 transition-colors"
                      >
                        Initiate Email
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-xs font-mono text-zinc-500 border border-white/[0.06] rounded-2xl bg-white/[0.01]">
                  Select a lead from the list to inspect brief telemetry and update lifecycle status.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 2: CONTENT & TEXTS CMS
          ====================================================================== */}
      {activeTab === 'content' && (
        <div className="pt-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['machine', 'mind', 'hybrid'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider border transition-all ${
                    selectedMode === m
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  {m.toUpperCase()} MODE
                </button>
              ))}
            </div>

            <button
              onClick={saveContentChanges}
              disabled={isSavingContent}
              className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg"
            >
              {isSavingContent ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{contentSaveSuccess ? 'Pushed Live!' : 'Save & Publish Live'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tagline & Badge */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 block font-semibold">
                HERO IDENTIFIERS
              </span>
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={contentConfig[selectedMode].tagline}
                  onChange={(e) =>
                    setContentConfig((prev) => ({
                      ...prev,
                      [selectedMode]: { ...prev[selectedMode], tagline: e.target.value },
                    }))
                  }
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Overline Badge</label>
                <input
                  type="text"
                  value={contentConfig[selectedMode].badge}
                  onChange={(e) =>
                    setContentConfig((prev) => ({
                      ...prev,
                      [selectedMode]: { ...prev[selectedMode], badge: e.target.value },
                    }))
                  }
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Hero Description</label>
                <textarea
                  rows={3}
                  value={contentConfig[selectedMode].heroDescription}
                  onChange={(e) =>
                    setContentConfig((prev) => ({
                      ...prev,
                      [selectedMode]: { ...prev[selectedMode], heroDescription: e.target.value },
                    }))
                  }
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>
            </div>

            {/* Headline Architecture */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 block font-semibold">
                HEADLINE TYPOGRAPHY SLICES
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Lead</label>
                  <input
                    type="text"
                    value={contentConfig[selectedMode].heroHeadline.lead}
                    onChange={(e) =>
                      setContentConfig((prev) => ({
                        ...prev,
                        [selectedMode]: {
                          ...prev[selectedMode],
                          heroHeadline: { ...prev[selectedMode].heroHeadline, lead: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Emphasis Word</label>
                  <input
                    type="text"
                    value={contentConfig[selectedMode].heroHeadline.emphasis}
                    onChange={(e) =>
                      setContentConfig((prev) => ({
                        ...prev,
                        [selectedMode]: {
                          ...prev[selectedMode],
                          heroHeadline: { ...prev[selectedMode].heroHeadline, emphasis: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-cyan-400 font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Sub-Lead</label>
                  <input
                    type="text"
                    value={contentConfig[selectedMode].heroHeadline.subLead}
                    onChange={(e) =>
                      setContentConfig((prev) => ({
                        ...prev,
                        [selectedMode]: {
                          ...prev[selectedMode],
                          heroHeadline: { ...prev[selectedMode].heroHeadline, subLead: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Sub-Emphasis</label>
                  <input
                    type="text"
                    value={contentConfig[selectedMode].heroHeadline.subEmphasis}
                    onChange={(e) =>
                      setContentConfig((prev) => ({
                        ...prev,
                        [selectedMode]: {
                          ...prev[selectedMode],
                          heroHeadline: { ...prev[selectedMode].heroHeadline, subEmphasis: e.target.value },
                        },
                      }))
                    }
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">Live Headline Preview:</span>
                <div className="text-xl font-display font-medium text-white leading-tight p-3 rounded-lg bg-black/40 border border-white/[0.05]">
                  {contentConfig[selectedMode].heroHeadline.lead}{' '}
                  <span className="text-cyan-400 italic">{contentConfig[selectedMode].heroHeadline.emphasis}</span>{' '}
                  {contentConfig[selectedMode].heroHeadline.subLead}{' '}
                  <span className="text-amber-400">{contentConfig[selectedMode].heroHeadline.subEmphasis}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          TAB 3: BLOGS & PUBLICATIONS CMS
          ====================================================================== */}
      {activeTab === 'blogs' && (
        <div className="pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Active Publications ({blogs.length})
            </span>
            <button
              onClick={() =>
                setEditingPost({
                  title: '',
                  excerpt: '',
                  content: '',
                  category: 'Engineering',
                  reading_time: '5 min read',
                  status: 'published',
                })
              }
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-sans font-semibold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Compose New Article</span>
            </button>
          </div>

          {editingPost ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <h2 className="text-lg font-display font-medium text-white">
                {editingPost.id ? 'Edit Publication' : 'Draft New Publication'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Article Title</label>
                  <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Enter engaging title..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">Category</label>
                  <select
                    value={editingPost.category || 'Engineering'}
                    onChange={(e) => setEditingPost((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#0a0b10] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Behavioral Psychology">Behavioral Psychology</option>
                    <option value="System Architecture">System Architecture</option>
                    <option value="Case Study">Case Study</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost((p) => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Short brief summarizing the key takeaway..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Content (Markdown)</label>
                <textarea
                  rows={10}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost((p) => ({ ...p, content: e.target.value }))}
                  placeholder="# Article Heading&#10;&#10;Write article body in markdown..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs font-sans text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveBlogPost}
                  disabled={isSavingPost}
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-sans font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  {isSavingPost ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Publish Article</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                        {post.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">{post.reading_time}</span>
                    </div>
                    <h3 className="text-sm font-sans font-semibold text-white">{post.title}</h3>
                    <p className="text-xs font-sans text-zinc-400 line-clamp-1">{post.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBlogPost(post.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================
          TAB 4: TELEMETRY & SYSTEM HEALTH
          ====================================================================== */}
      {activeTab === 'system' && (
        <div className="pt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <Database className="w-5 h-5 text-emerald-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-sans font-semibold text-white">Supabase PostgreSQL</h3>
              <p className="text-xs font-mono text-zinc-400">gvreonnadlmyhozlayjn.supabase.co</p>
              <span className="text-[10px] font-mono text-emerald-400 block">Table: advisory_leads Active</span>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-sans font-semibold text-white">Resend Dispatch</h3>
              <p className="text-xs font-mono text-zinc-400">Target: ransh4859@gmail.com</p>
              <span className="text-[10px] font-mono text-cyan-400 block">Restricted 2FA API Key Connected</span>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-sans font-semibold text-white">Twilio WhatsApp</h3>
              <p className="text-xs font-mono text-zinc-400">Target: +91 9800488177</p>
              <span className="text-[10px] font-mono text-amber-400 block">Sandbox Authenticated (SID: ACb7...)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
