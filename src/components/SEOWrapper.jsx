import React, { useEffect } from 'react';

/**
 * Custom hook to dynamically manage document head metadata (title, description, keywords, favicons, OG/Twitter previews)
 * and restore originals upon unmount.
 * @param {Object} seoConfig 
 */
export function useSEO(seoConfig) {
  useEffect(() => {
    if (!seoConfig) return;

    // Cache original title
    const originalTitle = document.title;
    
    // Save original meta tags
    const originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const originalKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
    const originalOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const originalOgDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const originalOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const originalTwitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    const originalTwitterDesc = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
    const originalTwitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

    // Save original favicons
    const faviconElements = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    const originalFavicons = Array.from(faviconElements).map(el => ({
      rel: el.getAttribute('rel'),
      href: el.getAttribute('href'),
      sizes: el.getAttribute('sizes'),
      type: el.getAttribute('type')
    }));

    // Update Title
    if (seoConfig.title) document.title = seoConfig.title;

    // Helper to insert or update meta tags in document head
    const updateMeta = (selector, attrName, attrVal, contentVal) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    if (seoConfig.description) {
      updateMeta('meta[name="description"]', 'name', 'description', seoConfig.description);
      updateMeta('meta[property="og:description"]', 'property', 'og:description', seoConfig.description);
      updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seoConfig.description);
    }
    if (seoConfig.keywords) {
      updateMeta('meta[name="keywords"]', 'name', 'keywords', seoConfig.keywords);
    }
    if (seoConfig.title) {
      updateMeta('meta[property="og:title"]', 'property', 'og:title', seoConfig.title);
      updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seoConfig.title);
    }
    if (seoConfig.ogImage) {
      updateMeta('meta[property="og:image"]', 'property', 'og:image', seoConfig.ogImage);
      updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', seoConfig.ogImage);
    }

    // Update Favicons
    if (seoConfig.favicon) {
      // Remove all legacy icons from document
      faviconElements.forEach(el => el.remove());

      // Create new favicon matching the tool specific icon
      const newFavicon = document.createElement('link');
      newFavicon.setAttribute('rel', 'icon');
      newFavicon.setAttribute('type', seoConfig.favicon.endsWith('.svg') ? 'image/svg+xml' : 'image/png');
      newFavicon.setAttribute('href', seoConfig.favicon);
      document.head.appendChild(newFavicon);
    }

    // Cleanup: Restore all original meta values on component unmount
    return () => {
      document.title = originalTitle;
      
      if (originalDesc) updateMeta('meta[name="description"]', 'name', 'description', originalDesc);
      if (originalKeywords) updateMeta('meta[name="keywords"]', 'name', 'keywords', originalKeywords);
      if (originalOgTitle) updateMeta('meta[property="og:title"]', 'property', 'og:title', originalOgTitle);
      if (originalOgDesc) updateMeta('meta[property="og:description"]', 'property', 'og:description', originalOgDesc);
      if (originalOgImage) updateMeta('meta[property="og:image"]', 'property', 'og:image', originalOgImage);
      if (originalTwitterTitle) updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', originalTwitterTitle);
      if (originalTwitterDesc) updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', originalTwitterDesc);
      if (originalTwitterImage) updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', originalTwitterImage);

      // Restore all original favicons
      if (seoConfig.favicon) {
        document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(el => el.remove());
        originalFavicons.forEach(({ rel, href, sizes, type }) => {
          const restoreEl = document.createElement('link');
          if (rel) restoreEl.setAttribute('rel', rel);
          if (href) restoreEl.setAttribute('href', href);
          if (sizes) restoreEl.setAttribute('sizes', sizes);
          if (type) restoreEl.setAttribute('type', type);
          document.head.appendChild(restoreEl);
        });
      }
    };
  }, [seoConfig]);
}

export default function SEOWrapper({ seo, children }) {
  useSEO(seo);
  return <>{children}</>;
}
