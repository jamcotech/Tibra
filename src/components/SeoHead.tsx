import React, { useEffect } from 'react';
import BRAND_CONFIG from '../config/brandConfig';

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  keywords?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  noindex?: boolean;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = BRAND_CONFIG.meta.defaultTitle,
  description = BRAND_CONFIG.meta.defaultDescription,
  canonicalPath = '/',
  keywords = BRAND_CONFIG.meta.defaultKeywords,
  ogType = 'website',
  ogImage = BRAND_CONFIG.meta.defaultOgImage,
  noindex = false,
  schema
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to safely set meta tag by name or property
    const setMeta = (attribute: 'name' | 'property', attrValue: string, contentValue: string) => {
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    setMeta('name', 'title', title);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical URL
    const canonicalUrl = `${BRAND_CONFIG.canonicalDomain}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', BRAND_CONFIG.brandName);
    setMeta('property', 'og:locale', 'en_PK');

    // 5. Twitter / X Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:url', canonicalUrl);

    // 6. Dynamic JSON-LD Structured Data
    const SCRIPT_ID = 'seo-dynamic-jsonld';
    let scriptEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = SCRIPT_ID;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema, null, 2);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Optional cleanup on unmount
    };
  }, [title, description, canonicalPath, keywords, ogType, ogImage, noindex, schema]);

  return null;
};

export default SeoHead;
