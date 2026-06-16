import { Helmet } from "react-helmet-async";

const BASE_URL = "https://suchandra369.lovable.app";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article" | "profile";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}


/**
 * Per-route head tags. Title/description/canonical/og:* override the
 * sitewide defaults in index.html for JS-executing crawlers.
 * Emits absolute URLs so social crawlers can resolve canonical and og:image.
 */
export const SEO = ({ title, description, path, ogType = "website", jsonLd, noindex }: SEOProps) => {
  const fullTitle = title.includes("Suchandra") ? title : `${title} — Suchandra Etti`;
  const url = `${BASE_URL}${path}`;
  const image = `${BASE_URL}/og-image.png`;
  const ldArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
