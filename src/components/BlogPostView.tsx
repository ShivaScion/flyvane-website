import { ArrowLeft, Clock, Calendar, Share2, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { BlogPost } from './BlogIndex';
import { HeadSEO } from './HeadSEO';
import { SiteFooter } from './SiteFooter';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate?: (path: string) => void;
}

export function BlogPostView({ post, onBack, onNavigate }: BlogPostViewProps) {
  const [copied, setCopied] = useState(false);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      '@type': 'Person',
      name: 'Ansh Rudra',
      jobTitle: 'Principal Systems Architect',
      url: 'https://crystalsteed.in/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'CrystalSteed',
      url: 'https://crystalsteed.in/'
    },
    mainEntityOfPage: `https://crystalsteed.in/blog/${post.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Studio',
          item: 'https://crystalsteed.in/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Publications',
          item: 'https://crystalsteed.in/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://crystalsteed.in/blog/${post.slug}`
        }
      ]
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cleanTitle = post.title.length > 48 ? `${post.title.slice(0, 47)}…` : post.title;
  const pageTitle = `${cleanTitle} | CrystalSteed`;
  const pageDesc = post.excerpt.length > 150 ? `${post.excerpt.slice(0, 147)}...` : post.excerpt;

  return (
    <article className="min-h-screen bg-transparent text-zinc-200 pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-20">
      <HeadSEO
        title={pageTitle}
        description={pageDesc}
        canonicalPath={`/blog/${post.slug}`}
        schema={articleSchema}
      />
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-8 border-b border-white/[0.08]">
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Publications</span>
        </a>

        <button
          onClick={handleShare}
          className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Article Header */}
      <header className="py-12 space-y-6">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-mono text-[11px] uppercase tracking-wider">
            {post.category}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.reading_time}</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-[1.15] text-balance">
          {post.title}
        </h1>

        <p className="text-lg font-sans text-zinc-300 leading-relaxed italic border-l-2 border-cyan-400/50 pl-4 py-1">
          {post.excerpt}
        </p>

        {/* Author Metadata */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-amber-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-[#07080B] flex items-center justify-center text-xs font-mono font-bold text-white">
              AR
            </div>
          </div>
          <div>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/about');
              }}
              className="text-sm font-sans font-semibold text-white hover:text-cyan-400 transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Ansh Rudra</span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-normal bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">Author Bio</span>
            </a>
            <div className="text-xs font-mono text-zinc-500">Principal Systems Architect &amp; Behavioral Strategist</div>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <div className="prose prose-invert max-w-none pt-8 border-t border-white/[0.08] space-y-6 text-zinc-300 leading-relaxed font-sans text-base">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-display font-medium text-white pt-6 pb-2 tracking-tight">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl sm:text-3xl font-display font-medium text-white pt-8 pb-3 tracking-tight border-b border-white/[0.08]">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('# ')) {
            return (
              <h2 key={idx} className="text-2xl sm:text-3xl font-display font-medium text-white pt-8 pb-3 tracking-tight">
                {paragraph.replace('# ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={idx} className="space-y-2 pl-6 list-disc list-outside marker:text-cyan-400">
                {items.map((it, i) => (
                  <li key={i} className="text-zinc-300">
                    {it.replace(/^[-*]|\d+\.\s*/, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Related Reading & Cross-SubURL Interlinking */}
      <div className="mt-20 pt-10 border-t border-white/[0.08] space-y-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold block">
          COMPANION ARCHITECTURAL READING
        </span>

        {post.slug === 'autonomous-data-pipelines-at-scale' ? (
          <a
            href="/blog/loss-aversion-and-b2b-procurement-psychology"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/blog/loss-aversion-and-b2b-procurement-psychology');
            }}
            className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 group block cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono text-[10px] uppercase tracking-wider">
                BEHAVIORAL STRATEGY
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Next Article →</span>
            </div>
            <h3 className="text-xl font-display font-medium text-white group-hover:text-amber-300 transition-colors">
              B2B Procurement Psychology &amp; Loss Aversion: How C-Suite Buyers Frame Technical Risk
            </h3>
            <p className="text-xs font-sans text-zinc-400 mt-2 leading-relaxed">
              Why enterprise software deals collapse when architects pitch features instead of de-risking commercial balance sheets, and how to structure value narratives that close.
            </p>
          </a>
        ) : (
          <a
            href="/blog/autonomous-data-pipelines-at-scale"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/blog/autonomous-data-pipelines-at-scale');
            }}
            className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 group block cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-mono text-[10px] uppercase tracking-wider">
                SYSTEMS ENGINEERING
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Next Article →</span>
            </div>
            <h3 className="text-xl font-display font-medium text-white group-hover:text-cyan-300 transition-colors">
              Autonomous Data Pipelines at Scale: Eliminating Brittle Cron Jobs with LangGraph
            </h3>
            <p className="text-xs font-sans text-zinc-400 mt-2 leading-relaxed">
              Production architectures for distributed headless browser clusters, checkpoint persistence, and automated dead-letter queues achieving 99.4% extraction schema precision.
            </p>
          </a>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/about');
            }}
            className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] transition-colors group flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">About Practice</span>
              <span className="text-xs font-sans font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Ansh Rudra &amp; Automation Ethics
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/terms');
            }}
            className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] transition-colors group flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Engineering SLAs</span>
              <span className="text-xs font-sans font-semibold text-white group-hover:text-amber-300 transition-colors">
                Terms of Engagement &amp; Governance
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </div>

      {/* Footer Back */}
      <div className="mt-16 pt-8 border-t border-white/[0.08] flex justify-between items-center">
        <a
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-sans font-semibold text-xs transition-transform hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Publications</span>
        </a>
      </div>

      {/* Global Unified Footer */}
      <SiteFooter onNavigate={onNavigate || onBack} />
    </article>
  );
}

export default BlogPostView;
