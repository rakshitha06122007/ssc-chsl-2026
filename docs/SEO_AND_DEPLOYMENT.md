# SEO, Production Deployment & Google Search Console Setup

## 1. Production Visibility Requirements
As emphasized in TrustHire AI's design, merely adding SEO meta tags to an application does **not** guarantee immediate Google ranking. Achieving organic search visibility requires 5 tangible production steps:

1. **Public Deployment**: Deploy frontend to a public CDN/edge platform (e.g. Vercel, Cloudflare Pages, Netlify) and backend to a container host (Render, Fly.io, AWS, GCP).
2. **Production Domain**: Map a custom apex domain (e.g. `https://trusthire.ai`) with SSL/TLS enforcement.
3. **Environment Configuration**: Set `VITE_SITE_URL=https://trusthire.ai` so that canonical links, OpenGraph tags, and sitemaps resolve to the production root.
4. **Google Search Console Verification**:
   - Add domain property in Google Search Console.
   - Verify ownership via DNS TXT record or HTML meta tag.
5. **Sitemap Submission & Indexing**:
   - Submit `https://trusthire.ai/sitemap.xml` in Search Console.
   - Request indexing on the 5 public informational guide pages:
     - `/how-to-verify-a-work-from-home-job`
     - `/how-to-verify-a-company`
     - `/fake-job-offer-warning-signs`
     - `/recruiter-verification-guide`
     - `/work-from-home-safety-checklist`

## 2. Crawler Directives (`robots.txt`)
`public/robots.txt` is configured to grant full crawl permissions to all compliant search engines:
```txt
User-agent: *
Allow: /
Sitemap: https://trusthire.ai/sitemap.xml
```

## 3. Structured Data
Informational guides include schema.org `Article` and `FAQPage` metadata to qualify for Google rich search snippets.
