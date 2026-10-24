import { useState, useEffect, useCallback, useRef } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import Lightbox from '../components/Lightbox'
import MonthSidebar from '../components/MonthSidebar'
import ImageSEO from '../components/ImageSEO'
import SEO from '../components/SEO'
import { getMonthlyGalleryImages, toGospelGalleryImages } from '../utils/staticGallery'
import './GospelToonsPage.css'

const months = [
  { key: 'jan', name: 'January', days: 31 },
  { key: 'feb', name: 'February', days: 28 },
  { key: 'mar', name: 'March', days: 31 },
  { key: 'apr', name: 'April', days: 30 },
  { key: 'may', name: 'May', days: 31 },
  { key: 'jun', name: 'June', days: 30 },
  { key: 'jul', name: 'July', days: 31 },
  { key: 'aug', name: 'August', days: 31 },
  { key: 'sep', name: 'September', days: 30 },
  { key: 'oct', name: 'October', days: 31 },
  { key: 'nov', name: 'November', days: 30 },
  { key: 'dec', name: 'December', days: 31 }
]

const getCurrentMonthKey = () => {
  const index = new Date().getMonth()
  return months[index]?.key || 'jan'
}

const GospelToonsEng = () => {
  const [activeMonth, setActiveMonth] = useState(getCurrentMonthKey)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthLoading, setMonthLoading] = useState(false)
  const requestIdRef = useRef(0)
  const [lightboxData, setLightboxData] = useState({ 
    isOpen: false, 
    src: '', 
    caption: '', 
    images: [], 
    currentIndex: 0 
  })

  const loadMonth = useCallback(async (monthKey) => {
    setMonthLoading(true)
    setActiveMonth(monthKey)
    setImages([])

    const requestId = ++requestIdRef.current
    const month = months.find((m) => m.key === monthKey)
    const monthNameEnglish = month?.name || 'January'

    try {
      const items = await getMonthlyGalleryImages('gt-english', monthKey)

      if (requestId !== requestIdRef.current) {
        return
      }

      setImages(
        toGospelGalleryImages(items, {
          labelPrefix: 'Gospeltoon',
          dateLabel: monthNameEnglish.toUpperCase()
        })
      )
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return
      }

      console.error('GT English load error:', error)
      setImages([])
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
        setMonthLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    setLoading(false)
    loadMonth(getCurrentMonthKey())
  }, [loadMonth])

  const openLightbox = (src, caption, images = [], currentIndex = 0) => {
    setLightboxData({ isOpen: true, src, caption, images, currentIndex })
  }

  const closeLightbox = () => {
    setLightboxData({ isOpen: false, src: '', caption: '', images: [], currentIndex: 0 })
  }

  const navigateLightbox = (direction) => {
    const { images, currentIndex } = lightboxData
    if (images.length === 0) return

    let newIndex = currentIndex
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length
    } else if (direction === 'prev') {
      newIndex = (currentIndex - 1 + images.length) % images.length
    }

    const newImage = images[newIndex]
    setLightboxData({
      ...lightboxData,
      src: newImage.successfulSrc || newImage.src,
      caption: `${newImage.name} - ${newImage.date}`,
      currentIndex: newIndex
    })
  }

  const monthName = months.find(m => m.key === activeMonth)?.name || 'January'
  const pageTitle = `Catholic Gospeltoons English - ${monthName} 2025 | Free Downloads by Sathish Paul SDB`
  const pageDescription = `Free Catholic Gospeltoons in English for ${monthName} 2025. Bible verse illustrations, Christian art, and faith-based storytelling visuals. Download high-quality Gospel cartoons by Sathish Paul SDB.`
  
  const baseUrl = 'https://www.sathishpaul.net'
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `Gospeltoons English - ${monthName} 2025`,
    "description": `Catholic Gospeltoons in English for ${monthName} 2025 with Bible verses and Christian content`,
    "url": typeof window !== 'undefined' ? window.location.href : 'https://www.sathishpaul.net/gospeltoons-eng',
    "inLanguage": "en",
    "creator": {
      "@type": "Person",
      "name": "Sathish Paul SDB"
    },
    "about": {
      "@type": "Thing",
      "name": "Catholic Gospeltoons"
    },
    // Include images in schema for better Google indexing
    "image": images.length > 0 ? images.map(img => ({
      "@type": "ImageObject",
      "url": img.src,
      "name": img.name || img.alt,
      "description": img.description || img.alt,
      "datePublished": img.date
    })) : []
  }

  return (
    <div className="gospeltoons-page">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`Gospeltoons English, Catholic Gospeltoons, Christian Art English, Bible Verse Art, Gospel Cartoons English, ${monthName} Gospeltoons, Catholic Art English, Sathish Paul SDB`}
        image="https://www.sathishpaul.net/images/GTEnglish.jpeg"
        schema={pageSchema}
        hreflang={[
          { lang: 'en', url: 'https://www.sathishpaul.net/gospeltoons-eng' },
          { lang: 'ta', url: 'https://www.sathishpaul.net/gospeltoons-tamil' }
        ]}
      />
      <ImageSEO 
        images={images} 
        pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
        pageTitle={`Gospeltoons English - ${monthName} 2025`}
      />
      <div className="page-content">
        <MonthSidebar 
          months={months}
          activeMonth={activeMonth}
          onMonthClick={loadMonth}
          language="english"
        />

        <div className="content-area">
          {monthLoading && (
            <div className="month-loader">
              <ThreeDots
                height={60}
                width={60}
                color="#ffa72c"
                secondaryColor="#ffa72c"
                visible={true}
                ariaLabel="dots-loading"
              />
            </div>
          )}

          <div className="gallery-grid">
            {loading ? (
              <div className="gospel-loader">
                <ThreeDots
                  height={60}
                  width={60}
                  color="#ffa72c"
                  secondaryColor="#ffa72c"
                  visible={true}
                  ariaLabel="oval-loading"
                />
              </div>
            ) : images.length === 0 ? (
              <div className="no-data-message">No images available for this month</div>
            ) : (
              images.map((image, index) => (
                <div
                  key={image.id || `${image.name}-${index}`}
                  className="gallery-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    if (image.failed) return

                    openLightbox(
                      image.successfulSrc || image.src,
                      `${image.name} - ${image.date}`,
                      images,
                      index
                    )
                  }}
                >
                  {image.failed && (
                    <div className="image-load-failed">
                      Image unavailable
                    </div>
                  )}
                  {!image.loaded && !image.failed && (
                    <div className="image-skeleton" />
                  )}
                  {!image.failed && (
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      data-source-index="0"
                      onLoad={(event) => {
                        const successfulUrl =
                          event.currentTarget.currentSrc ||
                          event.currentTarget.src

                        setImages(current =>
                          current.map(item =>
                            item.id === image.id &&
                            (!item.loaded ||
                              item.successfulSrc !== successfulUrl)
                              ? {
                                  ...item,
                                  loaded: true,
                                  failed: false,
                                  src: successfulUrl,
                                  successfulSrc: successfulUrl
                                }
                              : item
                          )
                        )
                      }}
                      onError={(event) => {
                        const img = event.currentTarget

                        const candidates = Array.isArray(image.candidates)
                          ? image.candidates
                          : [image.src].filter(Boolean)

                        const currentIndex =
                          Number(img.dataset.sourceIndex || 0)

                        let nextIndex = currentIndex + 1
                        let nextUrl = candidates[nextIndex]
                        const failedUrl = img.currentSrc || img.src

                        while (nextUrl && nextUrl === failedUrl) {
                          nextIndex += 1
                          nextUrl = candidates[nextIndex]
                        }

                        if (nextUrl) {
                          img.dataset.sourceIndex = String(nextIndex)
                          img.src = nextUrl
                          return
                        }

                        img.onerror = null

                        setImages(current =>
                          current.map(item =>
                            item.id === image.id
                              ? {
                                  ...item,
                                  loaded: false,
                                  failed: true
                                }
                              : item
                          )
                        )
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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

export default GospelToonsEng

