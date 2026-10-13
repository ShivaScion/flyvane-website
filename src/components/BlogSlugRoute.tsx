import { useEffect, useState } from 'react';
import { BlogPost } from './BlogIndex';
import { BlogPostView } from './BlogPostView';
import { NotFoundPage } from './NotFoundPage';

interface BlogSlugRouteProps {
  slug: string;
  cachedPost: BlogPost | null;
  onBack: () => void;
  onNavigateHome: () => void;
}

export function BlogSlugRoute({ slug, cachedPost, onBack, onNavigateHome }: BlogSlugRouteProps) {
  const [post, setPost] = useState<BlogPost | null>(() => {
    if (cachedPost && cachedPost.slug === slug) {
      return cachedPost;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(!post);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (cachedPost && cachedPost.slug === slug) {
      setPost(cachedPost);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch('/api/admin/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs)) {
          const matched = data.blogs.find((b: BlogPost) => b.slug === slug);
          if (matched) {
            setPost(matched);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load blog post:', err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug, cachedPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-zinc-400 flex items-center justify-center font-mono text-xs relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Resolving publication manifest...</span>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return <NotFoundPage onNavigateHome={onNavigateHome} />;
  }

  return <BlogPostView post={post} onBack={onBack} />;
}

export default BlogSlugRoute;
