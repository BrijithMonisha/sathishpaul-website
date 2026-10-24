import { useState, useEffect, useRef, useCallback } from 'react'
import './GospelToonsSection.css'
import { ThreeDots } from 'react-loader-spinner'

const months = [
  { key: 'jan', name: 'January', tamil: 'ஜனவரி', days: 31 },
  { key: 'feb', name: 'February', tamil: 'பிப்ரவரி', days: 28 },
  { key: 'mar', name: 'March', tamil: 'மார்ச்', days: 31 },
  { key: 'apr', name: 'April', tamil: 'ஏப்ரல்', days: 30 },
  { key: 'may', name: 'May', tamil: 'மே', days: 31 },
  { key: 'jun', name: 'June', tamil: 'ஜூன்', days: 30 },
  { key: 'jul', name: 'July', tamil: 'ஜூலை', days: 31 },
  { key: 'aug', name: 'August', tamil: 'ஆகஸ்ட்', days: 31 },
  { key: 'sep', name: 'September', tamil: 'செப்டம்பர்', days: 30 },
  { key: 'oct', name: 'October', tamil: 'அக்டோபர்', days: 31 },
  { key: 'nov', name: 'November', tamil: 'நவம்பர்', days: 30 },
  { key: 'dec', name: 'December', tamil: 'டிசம்பர்', days: 31 }
]

const colors = ['4A90E2', '667eea', '764ba2', 'D4AF37', '8B7355', '2E5090']

const GospelToonsSection = ({ sectionId, title, language, openLightbox }) => {
  const [activeMonth, setActiveMonth] = useState('jan')
  const [images, setImages] = useState([])
  const [gospelData, setGospelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [monthLoading, setMonthLoading] = useState(false) // ✅ NEW

  const trackRef = useRef(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const fetchGospelData = async () => {
      try {
        const response = await fetch('/gospel-data.json')
        const data = await response.json()
        setGospelData(data)
      } catch (error) {
        console.error('Error loading gospel data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGospelData()
  }, [])

  const languageRef = useRef(language)
  useEffect(() => {
    languageRef.current = language
  }, [language])

  const loadMonth = useCallback((monthKey) => {
    if (!gospelData) return

    setMonthLoading(true) // ✅ Start overlay loader
    setActiveMonth(monthKey)

    setTimeout(() => {
      const month = months.find(m => m.key === monthKey)
      const languageKey = languageRef.current === 'tamil' ? 'tamil' : 'english'
      const monthData = gospelData[languageKey]?.[monthKey] || []

      if (monthData.length === 0) {
        setImages([])
        setMonthLoading(false)
        return
      }

      const newImages = monthData.map((item) => {
        const colorIndex = item.day % colors.length
        return {
          src: item.path,
          fallback: `https://via.placeholder.com/400x500/${colors[colorIndex]}/ffffff?text=Day+${item.day}`,
          alt: `${item.name} - ${month.name} ${item.day}`,
          date: `${month.name.toUpperCase()} ${item.day}, 2025`,
          name: item.name,
          day: item.day
        }
      })

      setImages(newImages)
      setMonthLoading(false) // ✅ Stop loader
    }, 400)
  }, [gospelData])

  useEffect(() => {
    if (gospelData) {
      loadMonth('jan')
    }
  }, [gospelData, loadMonth])

  const scrollTrack = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 200
    const currentScroll = container.scrollLeft
    const newScroll = direction === 'next'
      ? currentScroll + scrollAmount
      : currentScroll - scrollAmount

    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    })
  }

  const isTamil = language === 'tamil'

  return (
    <section className={`gospel-section ${isTamil ? 'gospel-tamil' : ''}`} id={sectionId}>
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">
            <i className={isTamil ? "fas fa-book-open" : "fas fa-bible"}></i>
          </span>
          {title}
          <span className="title-underline"></span>
        </h2>
      </div>

      <div className="month-navigation">
        <button className="month-nav-btn prev" onClick={() => scrollTrack('prev')}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="month-slider" ref={scrollContainerRef}>
          <div className="month-track" ref={trackRef}>
            {months.map((month) => (
              <button
                key={month.key}
                className={`month-btn ${activeMonth === month.key ? 'active' : ''}`}
                onClick={() => loadMonth(month.key)}
              >
                {isTamil ? month.tamil : month.name}
              </button>
            ))}
          </div>
        </div>
        <button className="month-nav-btn next" onClick={() => scrollTrack('next')}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {monthLoading && (
        <div className="month-loader">
          <ThreeDots
            height={60}
            width={60}
            color="#4A90E2"
            secondaryColor="#764ba2"
            visible={true}
            ariaLabel="dots-loading"
          />
        </div>
      )}


      <div className="gallery-container">
        {loading ? (
          <div className="gospel-loader">
            <ThreeDots
              height={60}
              width={60}
              color="#4A90E2"
              secondaryColor="#764ba2"
              visible={true}
              ariaLabel="oval-loading"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        ) : images.length === 0 ? (
          <div className="no-data-message">No images available for this month</div>
        ) : (
          images.map((image, index) => (
            <div
              key={`${image.day}-${index}`}
              className="gallery-item"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openLightbox(image.src, `${image.name} - ${image.date}`, images, index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                onError={(e) => { e.target.src = image.fallback }}
              />
              <div className="gallery-overlay"></div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default GospelToonsSection
