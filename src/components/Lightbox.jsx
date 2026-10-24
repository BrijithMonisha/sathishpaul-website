import { useEffect } from 'react'
import './Lightbox.css'

const Lightbox = ({ isOpen, src, caption, onClose, onNavigate, hasMultipleImages, currentIndex, totalImages }) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
        onNavigate('prev')
      } else if (e.key === 'ArrowRight' && hasMultipleImages) {
        onNavigate('next')
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow || 'auto'
    }
  }, [isOpen, onClose, onNavigate, hasMultipleImages])

  if (!isOpen) return null

  return (
    <div className="lightbox active" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      
      {/* Previous Arrow */}
      {hasMultipleImages && (
        <button 
          className="lightbox-nav lightbox-prev" 
          onClick={(e) => {
            e.stopPropagation()
            onNavigate('prev')
          }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      )}

      <img 
        src={src} 
        alt={caption} 
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next Arrow */}
      {hasMultipleImages && (
        <button 
          className="lightbox-nav lightbox-next" 
          onClick={(e) => {
            e.stopPropagation()
            onNavigate('next')
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      )}

      <div className="lightbox-caption">
        {caption}
        {hasMultipleImages && (
          <span className="lightbox-counter"> ({currentIndex + 1} / {totalImages})</span>
        )}
      </div>
    </div>
  )
}

export default Lightbox

