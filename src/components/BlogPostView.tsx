import { ArrowLeft, Clock, Calendar, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { BlogPost } from './BlogIndex';
import { HeadSEO } from './HeadSEO';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
}

export function BlogPostView({ post, onBack }: BlogPostViewProps) {
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
      url: 'https://flyvane.com/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Flyvane',
      url: 'https://flyvane.com/'
    },
    mainEntityOfPage: `https://flyvane.com/blog/${post.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Studio',
          item: 'https://flyvane.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Publications',
          item: 'https://flyvane.com/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://flyvane.com/blog/${post.slug}`
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
  const pageTitle = `${cleanTitle} | Flyvane`;
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
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Publications</span>
        </button>

        <button
          onClick={handleShare}
          className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2"
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
            <div className="text-sm font-sans font-semibold text-white">Ansh Rudra</div>
            <div className="text-xs font-mono text-zinc-500">Principal Systems Architect & Behavioral Strategist</div>
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

      {/* Footer Back */}
      <div className="mt-16 pt-8 border-t border-white/[0.08] flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-sans font-semibold text-xs transition-transform hover:scale-[1.02] flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Publications</span>
        </button>
      </div>
    </article>
  );
}

export default BlogPostView;
