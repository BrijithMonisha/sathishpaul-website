import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

/**
 * SEO Component for dynamic meta tags, canonical URLs, and structured data
 * Improves on-page SEO with keyword-optimized titles and descriptions
 * Uses react-helmet-async for better React integration
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  imageAlt,
  imageWidth,
  imageHeight,
  type = 'website',
  schema,
  canonical,
  hreflang,
  robots
}) => {
  const location = useLocation()
  const baseUrl = 'https://www.sathishpaul.net'
  const currentUrl = canonical || `${baseUrl}${location.pathname}`
  const toAbsoluteUrl = (url) => {
    if (!url) return ''
    return url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
  }
  const imageUrl = toAbsoluteUrl(image || '/images/mini.png')
  const resolvedImageAlt = imageAlt || title || 'Sathish Paul SDB'

  return (
    <Helmet>
      {/* Document Title */}
      {title && <title>{title}</title>}

      {/* Meta Tags */}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph Tags */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:alt" content={resolvedImageAlt} />
      {imageWidth && <meta property="og:image:width" content={String(imageWidth)} />}
      {imageHeight && <meta property="og:image:height" content={String(imageHeight)} />}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={resolvedImageAlt} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {robots && <meta name="robots" content={robots} />}

      {/* Hreflang Tags for Multilingual Content */}
      {hreflang && hreflang.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hreflang={lang} href={url} />
      ))}
      {hreflang && (
        <link 
          rel="alternate" 
          hreflang="x-default" 
          href={hreflang.find(h => h.lang === 'en')?.url || currentUrl} 
        />
      )}

      {/* Structured Data (Schema.org) - JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(
            typeof schema === 'object'
              ? schema
              : {
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: 'Sathish Paul SDB - Catholic Gospeltoons',
                  jobTitle: 'Catholic Gospeltoon Artist',
                  url: 'https://www.sathishpaul.net',
                  sameAs: [
                    'https://www.facebook.com/share/1PgmjRSQyd/',
                    'https://www.instagram.com/sathishpaul1',
                    'https://youtube.com/@jsathishpaul'
                  ],
                  worksFor: {
                    '@type': 'Organization',
                    name: 'Salesians of Don Bosco'
                  }
                }
          )}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
