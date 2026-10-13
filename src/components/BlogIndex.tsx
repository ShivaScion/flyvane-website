import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { InteractiveTiltWrapper } from './InteractiveTiltWrapper';

export interface BlogPost {
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

interface BlogIndexProps {
  onNavigateHome: () => void;
  onSelectPost: (post: BlogPost) => void;
}

export function BlogIndex({ onNavigateHome, onSelectPost }: BlogIndexProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blogs) {
          setPosts(data.blogs);
        }
      })
      .catch((err) => console.error('Error fetching blogs:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];
  const filteredPosts =
    selectedCategory === 'All' ? posts : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-transparent text-zinc-200 pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-12 border-b border-white/[0.08]">
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-sans text-zinc-300 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </button>

        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">
          PUBLICATIONS & ARCHITECTURAL LOGS
        </span>
      </div>

      {/* Hero title */}
      <div className="py-16 space-y-4 max-w-3xl">
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-amber-400 font-semibold block">
          DISPATCHES FROM THE ENGINE ROOM
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight leading-[1.1]">
          Systems engineering, category psychology, and autonomous infrastructure.
        </h1>
        <p className="text-base font-sans text-zinc-400 leading-relaxed text-pretty">
          Technical post-mortems, behavioral economics frameworks, and architecture blueprints authored by Ansh Rudra and the Flyvane team.
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-300 border ${
              selectedCategory === cat
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="py-24 text-center font-mono text-xs text-zinc-500">
          Loading publication registry...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-24 text-center font-mono text-xs text-zinc-500">
          No published briefs found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {filteredPosts.map((post) => (
            <InteractiveTiltWrapper
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="p-8 flex flex-col justify-between group cursor-pointer border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-500"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-mono text-[10px] uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{post.reading_time}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-display font-medium text-white group-hover:text-cyan-300 transition-colors leading-[1.25]">
                  {post.title}
                </h2>

                <p className="text-sm font-sans text-zinc-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-white/[0.06] mt-6">
                <span className="text-[11px] font-mono text-zinc-500">
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-sans font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </InteractiveTiltWrapper>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogIndex;
