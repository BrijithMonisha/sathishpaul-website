import { useEffect, useRef, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import Lightbox from '../components/Lightbox'
import ImageSEO from '../components/ImageSEO'
import SEO from '../components/SEO'
import { getStrokesImages } from '../utils/staticGallery'
import './Strokes.css'

const STROKES_KEYWORDS =
  'Strokes, Strokes Sathish Paul SDB, Strokes by Sathish Paul SDB, Sathish Paul Strokes, Catholic stroke art, Christian line art, Catholic Art, Christian Art, Creative Artwork, Catholic Creative Resources, Sathish Paul SDB, Free Catholic Art, Christian Illustrations, Art Gallery, Stroke Art'

const STROKES_PRIMARY_IMAGE = '/images/Strokes/str1.jpg'
const STROKES_PRIMARY_IMAGE_URL = `https://www.sathishpaul.net${STROKES_PRIMARY_IMAGE}`
const STROKES_PRIMARY_IMAGE_ALT =
  'Strokes artwork by Sathish Paul SDB with orange and green brush strokes'

const STROKES_SEO_IMAGES = Array.from({ length: 27 }, (_, index) => ({
  src: `/images/Strokes/str${index + 1}.jpg`,
  name: `Strokes ${index + 1}`,
  description: `Strokes creative artwork ${index + 1} by Sathish Paul SDB`,
  textContent: `Strokes ${index + 1} by Sathish Paul SDB`
}))

const GALLERY_PAGE_SIZE = 28

const Strokes = () => {
  const [strokeImages, setStrokeImages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const contentRef = useRef(null)
  const [lightboxData, setLightboxData] = useState({
    isOpen: false,
    src: '',
    caption: '',
    currentIndex: 0
  })

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError('')

    getStrokesImages()
      .then((images) => {
        if (cancelled) return
        setStrokeImages(images)
        setCurrentPage(1)
        setError('')
      })
      .catch(() => {
        if (cancelled) return
        setStrokeImages([])
        setError('Sorry, the Strokes gallery could not be loaded right now.')
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const openLightbox = (index) => {
    const image = strokeImages[index]
    if (!image) return

    setLightboxData({
      isOpen: true,
      src: image.src,
      caption: image.name || `Strokes ${index + 1}`,
      currentIndex: index
    })
  }

  const closeLightbox = () => {
    setLightboxData({ isOpen: false, src: '', caption: '', currentIndex: 0 })
  }

  const navigateLightbox = (direction) => {
    if (!strokeImages.length) return

    const nextIndex =
      direction === 'next'
        ? (lightboxData.currentIndex + 1) % strokeImages.length
        : (lightboxData.currentIndex - 1 + strokeImages.length) % strokeImages.length
    const image = strokeImages[nextIndex]

    setLightboxData({
      isOpen: true,
      src: image.src,
      caption: image.name || `Strokes ${nextIndex + 1}`,
      currentIndex: nextIndex
    })
  }

  const isPaginated = strokeImages.length > GALLERY_PAGE_SIZE
  const totalPages = isPaginated
    ? Math.ceil(strokeImages.length / GALLERY_PAGE_SIZE)
    : 1
  const safePage = Math.min(currentPage, totalPages)
  const pageStartIndex = isPaginated ? (safePage - 1) * GALLERY_PAGE_SIZE : 0
  const visibleImages = isPaginated
    ? strokeImages.slice(pageStartIndex, pageStartIndex + GALLERY_PAGE_SIZE)
    : strokeImages

  const scrollGalleryIntoView = () => {
    const node = contentRef.current
    if (!node) return

    const headerOffset = window.matchMedia('(max-width: 768px)').matches ? 88 : 96
    const top = node.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  const goToPage = (page) => {
    const next = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(next)
    requestAnimationFrame(() => {
      scrollGalleryIntoView()
    })
  }

  const showingFrom = strokeImages.length ? pageStartIndex + 1 : 0
  const showingTo = pageStartIndex + visibleImages.length

  const paginationNav = isPaginated && !isLoading && !error && (
    <nav className="gallery-pagination" aria-label="Strokes gallery pages">
      <p className="gallery-pagination-summary">
        Showing <strong>{showingFrom}</strong> to <strong>{showingTo}</strong> of{' '}
        <strong>{strokeImages.length}</strong> results
      </p>
      <div className="gallery-pagination-controls">
        <button
          type="button"
          className="gallery-pagination-link"
          disabled={safePage <= 1}
          onClick={() => goToPage(safePage - 1)}
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className="gallery-pagination-page" aria-current="page">
          {safePage}
        </span>
        <button
          type="button"
          className="gallery-pagination-link"
          disabled={safePage >= totalPages}
          onClick={() => goToPage(safePage + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  )

  const strokesSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Strokes by Sathish Paul SDB',
    description:
      'Strokes creative artwork and Catholic visual resources by Sathish Paul SDB, featuring Catholic stroke art and Christian line illustrations.',
    url: 'https://www.sathishpaul.net/strokes',
    inLanguage: 'en',
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: STROKES_PRIMARY_IMAGE_URL,
      contentUrl: STROKES_PRIMARY_IMAGE_URL,
      name: 'Strokes by Sathish Paul SDB',
      description: STROKES_PRIMARY_IMAGE_ALT,
      width: 1080,
      height: 1350,
      caption: 'Strokes by Sathish Paul SDB',
      creator: {
        '@type': 'Person',
        name: 'Sathish Paul SDB'
      },
      copyrightHolder: {
        '@type': 'Person',
        name: 'Sathish Paul SDB'
      }
    },
    image: STROKES_PRIMARY_IMAGE_URL,
    creator: {
      '@type': 'Person',
      name: 'Sathish Paul SDB'
    },
    about: {
      '@type': 'Thing',
      name: 'Strokes'
    },
    keywords: STROKES_KEYWORDS
  }

  return (
    <main
      className={`strokes-page${isPaginated && !isLoading && !error ? ' strokes-page--paginated' : ''}`}
    >
      <SEO
        title="Strokes by Sathish Paul SDB | Catholic Stroke Art"
        description="Strokes by Sathish Paul SDB is a Catholic creative art gallery with Christian line art, stroke illustrations, and free visual resources."
        keywords={STROKES_KEYWORDS}
        image={STROKES_PRIMARY_IMAGE}
        imageAlt={STROKES_PRIMARY_IMAGE_ALT}
        imageWidth={1080}
        imageHeight={1350}
        schema={strokesSchema}
        canonical="https://www.sathishpaul.net/strokes"
      />
      <ImageSEO
        images={STROKES_SEO_IMAGES}
        pageUrl={typeof window !== 'undefined' ? window.location.href : 'https://www.sathishpaul.net/strokes'}
        pageTitle="Strokes by Sathish Paul SDB"
      />

      <div className="strokes-gallery-wrap" ref={contentRef}>
        <section className="strokes-gallery" aria-label="Strokes artwork gallery">
          {isLoading && (
            <div className="strokes-loader">
              <ThreeDots
                height={60}
                width={60}
                color="#ffa72c"
                secondaryColor="#ffa72c"
                visible={true}
                ariaLabel="strokes-loading"
              />
            </div>
          )}
          {!isLoading && error && <p className="strokes-message strokes-message-error">{error}</p>}
          {!isLoading && !error && strokeImages.length === 0 && (
            <p className="strokes-message">No Strokes images are available yet.</p>
          )}
          {!isLoading &&
            !error &&
            visibleImages.map((image, index) => {
              const globalIndex = pageStartIndex + index

              return (
                <button
                  type="button"
                  className="strokes-card"
                  key={image.id}
                  onClick={() => openLightbox(globalIndex)}
                >
                  <img
                    src={image.src}
                    alt={image.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </button>
              )
            })}
        </section>

        {paginationNav}
      </div>

      <Lightbox
        isOpen={lightboxData.isOpen}
        src={lightboxData.src}
        caption={lightboxData.caption}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
        hasMultipleImages={strokeImages.length > 1}
        currentIndex={lightboxData.currentIndex}
        totalImages={strokeImages.length}
      />
    </main>
  )
}

export default Strokes
