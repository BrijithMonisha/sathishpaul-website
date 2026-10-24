import { Helmet } from 'react-helmet-async'

/**
 * Component to add structured data (JSON-LD) for images with text content
 * This helps Google extract and index text from images
 * Now uses Helmet for better integration with react-helmet-async
 */
const ImageSEO = ({ images, pageUrl, pageTitle }) => {
  if (!images || images.length === 0) return null

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://www.sathishpaul.net'

  // Create structured data for ImageGallery
  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": pageTitle || "Gospeltoons Gallery",
    "url": pageUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.sathishpaul.net'),
    "description": "Collection of Gospeltoons images with Bible verses and Christian content",
    "image": images.map((img, index) => {
      const fullImageUrl = img.src.startsWith('http') 
        ? img.src 
        : `${baseUrl}${img.src.startsWith('/') ? '' : '/'}${img.src}`
      
      return {
        "@type": "ImageObject",
        "url": fullImageUrl,
        "name": img.name || img.alt || `Gospeltoon ${index + 1}`,
        "description": img.description || img.alt || img.caption || "",
        "text": img.textContent || "", // Text extracted from image
        "datePublished": img.date || "",
        "author": {
          "@type": "Person",
          "name": "Sathish Paul SDB"
        },
        "copyrightHolder": {
          "@type": "Person",
          "name": "Sathish Paul SDB"
        }
      }
    })
  }

  return (
    <Helmet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }} />
    </Helmet>
  )
}

export default ImageSEO

