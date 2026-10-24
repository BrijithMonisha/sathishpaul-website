import { useEffect, useRef, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import Lightbox from './Lightbox'
import { getCatholicCategoryImages } from '../utils/staticGallery'

const FALLBACK_PLACEHOLDER = 'https://via.placeholder.com/400x500/8B7355/ffffff?text=Image+Not+Found'

const getPreferredImageUrl = (image) => image?.src || ''

const getImageCaption = (image, index) => image?.name || `Catholic Design ${index + 1}`

const GALLERY_PAGE_SIZE = 28

const CatholicDesignsGallery = ({ category, onImagesLoaded }) => {
  const [galleryImages, setGalleryImages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const contentRef = useRef(null)
  const [lightboxData, setLightboxData] = useState({
    isOpen: false,
    src: '',
    caption: '',
    images: [],
    currentIndex: 0
  })

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError('')
    setGalleryImages([])
    setCurrentPage(1)

    getCatholicCategoryImages(category)
      .then((images) => {
        if (cancelled) return
        setGalleryImages(images)
        setError('')
        if (onImagesLoaded) {
          onImagesLoaded(images)
        }
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Catholic Designs load error:', err)
        setGalleryImages([])
        setError('Catholic Designs images could not be loaded.')
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [category])

  const openLightbox = (image, index) => {
    const lightboxImages = galleryImages.map((item) => ({
      src: getPreferredImageUrl(item) || FALLBACK_PLACEHOLDER,
      title: item?.name || 'Catholic Design'
    }))

    setLightboxData({
      isOpen: true,
      src: getPreferredImageUrl(image) || FALLBACK_PLACEHOLDER,
      caption: getImageCaption(image, index),
      images: lightboxImages,
      currentIndex: index
    })
  }

  const closeLightbox = () => {
    setLightboxData({ isOpen: false, src: '', caption: '', images: [], currentIndex: 0 })
  }

  const navigateLightbox = (direction) => {
    const { images, currentIndex } = lightboxData
    if (!images.length) return

    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length

    const nextImage = images[nextIndex]
    setLightboxData({
      ...lightboxData,
      src: nextImage.src,
      caption: nextImage.title,
      currentIndex: nextIndex
    })
  }

  const isPaginated = galleryImages.length > GALLERY_PAGE_SIZE
  const totalPages = isPaginated
    ? Math.ceil(galleryImages.length / GALLERY_PAGE_SIZE)
    : 1
  const safePage = Math.min(currentPage, totalPages)
  const pageStartIndex = isPaginated ? (safePage - 1) * GALLERY_PAGE_SIZE : 0
  const visibleImages = isPaginated
    ? galleryImages.slice(pageStartIndex, pageStartIndex + GALLERY_PAGE_SIZE)
    : galleryImages

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

  const showingFrom = galleryImages.length ? pageStartIndex + 1 : 0
  const showingTo = pageStartIndex + visibleImages.length

  const paginationNav = isPaginated && !loading && !error && (
    <nav className="gallery-pagination" aria-label="Catholic Designs gallery pages">
      <p className="gallery-pagination-summary">
        Showing <strong>{showingFrom}</strong> to <strong>{showingTo}</strong> of{' '}
        <strong>{galleryImages.length}</strong> results
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

  return (
    <div
      className={`content-area${isPaginated && !loading && !error ? ' content-area--paginated' : ''}`}
      ref={contentRef}
    >
      <div className="gallery-grid">
        {loading ? (
          <div className="gospel-loader">
            <ThreeDots
              height={60}
              width={60}
              color="#ffa72c"
              secondaryColor="#ffa72c"
              visible={true}
              ariaLabel="catholic-gallery-loading"
            />
          </div>
        ) : error ? (
          <div className="no-data-message">{error}</div>
        ) : galleryImages.length === 0 ? (
          <div className="no-data-message">No images available for this category.</div>
        ) : (
          visibleImages.map((image, index) => {
            const globalIndex = pageStartIndex + index

            return (
              <button
                type="button"
                key={image?.id ?? `${category}-${globalIndex}`}
                className="gallery-card"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => openLightbox(image, globalIndex)}
              >
                <img
                  src={getPreferredImageUrl(image) || FALLBACK_PLACEHOLDER}
                  alt={getImageCaption(image, globalIndex)}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </button>
            )
          })
        )}
      </div>

      {paginationNav}

      <Lightbox
        isOpen={lightboxData.isOpen}
        src={lightboxData.src}
        caption={lightboxData.caption}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
        hasMultipleImages={lightboxData.images.length > 1}
        currentIndex={lightboxData.currentIndex}
        totalImages={lightboxData.images.length}
      />
    </div>
  )
}

export default CatholicDesignsGallery
