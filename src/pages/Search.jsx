import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Search.css'

const months = [
  { key: 'jan', name: 'January', tamil: 'ஜனவரி' },
  { key: 'feb', name: 'February', tamil: 'பிப்ரவரி' },
  { key: 'mar', name: 'March', tamil: 'மார்ச்' },
  { key: 'apr', name: 'April', tamil: 'ஏப்ரல்' },
  { key: 'may', name: 'May', tamil: 'மே' },
  { key: 'jun', name: 'June', tamil: 'ஜூன்' },
  { key: 'jul', name: 'July', tamil: 'ஜூலை' },
  { key: 'aug', name: 'August', tamil: 'ஆகஸ்ட்' },
  { key: 'sep', name: 'September', tamil: 'செப்டம்பர்' },
  { key: 'oct', name: 'October', tamil: 'அக்டோபர்' },
  { key: 'nov', name: 'November', tamil: 'நவம்பர்' },
  { key: 'dec', name: 'December', tamil: 'டிசம்பர்' }
]

const getMonthName = (key, language = 'en') => {
  const month = months.find(m => m.key === key)
  if (!month) return ''
  return language === 'ta' ? month.tamil : month.name
}

const normalizeText = (value) =>
  (value ?? '').toString().toLowerCase()

const buildImagePath = (item) => {
  const rawPath = item.path || item.src || ''
  if (!rawPath) return ''
  if (rawPath.startsWith('http')) return rawPath
  return `/${rawPath.replace(/^\/+/, '')}`
}

const fieldText = (item, fields) =>
  fields
    .map((field) => item[field])
    .filter(Boolean)
    .join(' ')

const matchesQuery = (text, q) => {
  const haystack = normalizeText(text)
  const parts = normalizeText(q).split(/\s+/).filter(Boolean)
  if (!haystack || parts.length === 0) return false
  return parts.every((part) => haystack.includes(part))
}

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goPrev = useCallback(() => {
    const indices = results.map((r, i) => (r.image ? i : null)).filter((i) => i != null)
    if (indices.length === 0) return
    const pos = indices.indexOf(lightboxIndex)
    const prevPos = pos <= 0 ? indices.length - 1 : pos - 1
    setLightboxIndex(indices[prevPos])
  }, [results, lightboxIndex])

  const goNext = useCallback(() => {
    const indices = results.map((r, i) => (r.image ? i : null)).filter((i) => i != null)
    if (indices.length === 0) return
    const pos = indices.indexOf(lightboxIndex)
    const nextPos = pos >= indices.length - 1 ? 0 : pos + 1
    setLightboxIndex(indices[nextPos])
  }, [results, lightboxIndex])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex == null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, goPrev, goNext])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qParam = (params.get('q') || '').trim()
    setQuery(qParam)

    if (!qParam) {
      setResults([])
      const from = location.state && location.state.from
      if (from && from !== '/search') {
        navigate(from, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
      return
    }

    const fetchJson = async (url) => {
      try {
        const res = await fetch(url)
        if (!res.ok) return null
        return await res.json()
      } catch {
        return null
      }
    }

    const runSearch = async () => {
      setLoading(true)
      const allResults = []

      const [
        english2026,
        tamil2026,
        combined2026,
        galleryImages
      ] = await Promise.all([
        fetchJson('/gospel-data-english.json'),
        fetchJson('/gospel-data-tamil.json'),
        fetchJson('/gospel-data.json'),
        fetchJson('/galleryImages.json')
      ])

      if (english2026?.english) {
        Object.entries(english2026.english).forEach(([monthKey, items]) => {
          (items || []).forEach((item, index) => {
            const fullText = fieldText(item, [
                'name',
                'title',
                'alt',
                'bibleVerse',
                'textContent',
                'description',
                'quote'
              ])
            if (!matchesQuery(fullText, qParam)) return

            allResults.push({
              id: `eng-2026-${monthKey}-${item.day ?? index}`,
              source: 'Gospeltoons English 2026',
              title: item.name || item.title || item.alt || 'Untitled',
              subtitle: `${getMonthName(monthKey)} ${item.day ?? ''}`.trim(),
              image: buildImagePath(item),
              link: '/gospeltoons-eng-new',
              snippet:
                item.description ||
                item.textContent ||
                item.bibleVerse ||
                item.alt ||
                item.title ||
                item.name ||
                ''
            })
          })
        })
      }

      if (tamil2026?.tamil) {
        Object.entries(tamil2026.tamil).forEach(([monthKey, items]) => {
          (items || []).forEach((item, index) => {
            const fullText = fieldText(item, [
                'name',
                'title',
                'altText',
                'textContent',
                'description',
                'seoTags',
                'seoKeywords'
              ])
            if (!matchesQuery(fullText, qParam)) return

            allResults.push({
              id: `tam-2026-${monthKey}-${item.day ?? index}`,
              source: 'Gospeltoons Tamil 2026',
              title: item.name || item.title || item.altText || 'Untitled',
              subtitle: `${getMonthName(monthKey, 'ta')} ${item.day ?? ''}`.trim(),
              image: buildImagePath(item),
              link: '/gospeltoons-tamil-new',
              snippet:
                item.description ||
                item.textContent ||
                item.altText ||
                item.title ||
                item.name ||
                ''
            })
          })
        })
      }

      if (combined2026?.english) {
        Object.entries(combined2026.english).forEach(([monthKey, items]) => {
          (items || []).forEach((item, index) => {
            const fullText = fieldText(item, ['name', 'title'])
            if (!matchesQuery(fullText, qParam)) return

            allResults.push({
              id: `eng-2026-simple-${monthKey}-${item.day ?? index}`,
              source: 'Gospeltoons English (simple)',
              title: item.name || 'Untitled',
              subtitle: `${getMonthName(monthKey)} ${item.day ?? ''}`.trim(),
              image: buildImagePath(item),
              link: '/gospeltoons-eng-new',
              snippet: item.name || ''
            })
          })
        })
      }

      if (combined2026?.tamil) {
        Object.entries(combined2026.tamil).forEach(([monthKey, items]) => {
          (items || []).forEach((item, index) => {
            const fullText = fieldText(item, ['name', 'title'])
            if (!matchesQuery(fullText, qParam)) return

            allResults.push({
              id: `tam-2026-simple-${monthKey}-${item.day ?? index}`,
              source: 'Gospeltoons Tamil (simple)',
              title: item.name || 'Untitled',
              subtitle: `${getMonthName(monthKey, 'ta')} ${item.day ?? ''}`.trim(),
              image: buildImagePath(item),
              link: '/gospeltoons-tamil-new',
              snippet: item.name || ''
            })
          })
        })
      }

      if (galleryImages) {
        Object.entries(galleryImages).forEach(([category, items]) => {
          (items || []).forEach((item, index) => {
            const fullText = [
              category,
              fieldText(item, [
                'title',
                'alt',
                'name',
                'description',
                'caption',
                'keywords',
                'tags',
                'src',
                'path'
              ])
            ].join(' ')
            if (!matchesQuery(fullText, qParam)) return

            allResults.push({
              id: `gallery-${category}-${index}`,
              source: `Catholic Designs – ${category}`,
              title: item.title || item.name || 'Gallery Image',
              subtitle: '',
              image: buildImagePath(item),
              link: '/catholic-designs',
              snippet: item.title || item.name || ''
            })
          })
        })
      }

      Array.from({ length: 27 }, (_, index) => ({
        src: `/images/Strokes/str${index + 1}.jpg`,
        title: `Strokes ${index + 1}`,
        name: `str${index + 1}`
      })).forEach((item, index) => {
        const fullText = fieldText(item, ['title', 'name', 'src'])
        if (!matchesQuery(fullText, qParam)) return

        allResults.push({
          id: `strokes-${index + 1}`,
          source: 'Strokes',
          title: item.title,
          subtitle: '',
          image: item.src,
          link: '/strokes',
          snippet: item.title
        })
      })

      setResults(allResults)
      setLoading(false)
    }

    runSearch()
  }, [location.search])

  return (
    <div className="search-page">
      <div className="search-header">
        {query && (
          <p className="search-subtitle">
            Showing results for <span className="search-query">“{query}”</span>
          </p>
        )}
      </div>

      {loading && (
        <div className="search-status">Searching across Gospeltoons and gallery…</div>
      )}

      {!loading && !query && (
        <div className="search-status">Type a word in the top search bar to find Gospeltoons and designs.</div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="search-empty">
          <img
            src="/images/noimg.avif"
            alt="No images available for this search"
            className="search-empty-image"
          />
          <div className="search-empty-text">No images available for this search.</div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search-grid">
          {results.map((result, index) => (
            <button
              key={result.id}
              type="button"
              className="search-card search-card-button"
              onClick={() => result.image && openLightbox(index)}
            >
              {result.image && (
                <div className="search-card-image-wrapper">
                  <img
                    src={result.image}
                    alt={result.title}
                    loading="lazy"
                    onError={(e) => {
                      const card = e.target.closest('.search-card')
                      if (card) {
                        card.style.display = 'none'
                      }
                    }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {lightboxIndex != null && results[lightboxIndex]?.image && (
        <div
          className="search-lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="search-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
          <button
            type="button"
            className="search-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="search-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={results[lightboxIndex].image}
              alt={results[lightboxIndex].title}
              className="search-lightbox-image"
            />
            <p className="search-lightbox-caption">{results[lightboxIndex].title}</p>
          </div>
          <button
            type="button"
            className="search-lightbox-next"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default Search
