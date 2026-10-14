import { useEffect } from 'react';

export interface HeadSEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

export function HeadSEO({
  title,
  description,
  canonicalPath = '/',
  robots = 'index, follow',
  schema,
}: HeadSEOProps) {
  useEffect(() => {
    // 1. Enforce Title (< 60 chars)
    document.title = title;

    // Helper to update or create meta tags
    const updateMeta = (selector: string, attr: string, value: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // 2. Enforce Meta Description (< 155 chars)
    updateMeta('meta[name="description"]', 'name', 'description', description);

    // 3. OpenGraph & Twitter Cards
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    const canonicalUrl = `https://crystalsteed.com${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

    // 4. Enforce Self-Referencing Canonical URL
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // 5. Enforce Robots Meta (Strict Indexing or Noindex)
    updateMeta('meta[name="robots"]', 'name', 'robots', robots);

    // 6. Dynamic JSON-LD Structured Data
    const existingSchemaScript = document.getElementById('route-schema-ld');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'route-schema-ld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('route-schema-ld');
      if (s) s.remove();
    };
  }, [title, description, canonicalPath, robots, schema]);

  return null;
}

export default HeadSEO;
